// senko-watch.js — 通話に依らないセンコの見回りの、Claude を使わない側（橋の枠 三百七十九・三百八十）。網には出ない。git も呼ばない。
//   check   <root> <out>                          止まりの印を探す。<out>/result.json と <out>/in/（Claude に渡す元）を書く。
//   reserve <ledger> <result.json> <runId>        Claude を起こす前に、台帳へ一回分を先に書く（一日6回を超えない）。超える時は終了コード 3。
//   publish <ledger> <result.json> <claude.json> <senkoDir> <runId> <ntfyTitleFile>
//                                                  Claude の返しを調べ、通れば <senkoDir>/senko/watch-frame.md と bell.txt を書く。台帳に結果を書く。標準出力 frame=yes/no。
//   作り値：SW_NOW（epoch 秒）
//   ＊digest・vaio-snap・state.json の中身は『調べる元（データ）』。ここでは字を数えるだけで、指示としては読まない。
//   ＊ヨシ待ちは印にしない（答えない・起こさない）。
'use strict';
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const NOW = Number(process.env.SW_NOW) || Math.floor(Date.now() / 1000);
const MAX_CALLS = 6, OVER_SEC = 30 * 60, SAME_SEC = 60 * 60, FRESH_SEC = 90 * 60, WAKE_SEC = 60 * 60, CARD_SEC = 2 * 3600, RETRY_SEC = 2 * 3600, WEEK_STOP = 95;
const p2 = n => String(n).padStart(2, '0');
const jst = t => new Date((t + 9 * 3600) * 1000).toISOString().replace('T', ' ').slice(0, 19);
const day = t => jst(t).slice(0, 10);
const epochJst = s => { const t = Date.parse(String(s).trim().replace(' ', 'T') + '+09:00'); return t ? Math.floor(t / 1000) : 0; };
const rd = f => { try { return fs.readFileSync(f, 'utf8').replace(/^﻿/, ''); } catch (e) { return ''; } };
const rdj = (f, d) => { try { return JSON.parse(rd(f)); } catch (e) { return d; } };
const sha = s => crypto.createHash('sha1').update(String(s)).digest('hex').slice(0, 12);
const KIND = { wake: '起こしても進まない', over: '見込み超え', same: '同じ段のまま', card: '札と済みの条件の食い違い' };

function newestSnap(root) {
  const list = [path.join(root, 'senko', 'vaio-snap.md')];
  try { fs.readdirSync(path.join(root, 'senko', 'snap-ring')).filter(f => /^[0-9]{8}-[0-9]{6}\.md$/.test(f)).forEach(f => list.push(path.join(root, 'senko', 'snap-ring', f))); } catch (e) { }
  let best = { at: 0, txt: '' };
  list.forEach(f => { const txt = rd(f); const m = /^書いた刻：([0-9-]{10} [0-9:]{8})/m.exec(txt); const at = m ? epochJst(m[1]) : 0; if (at > best.at) { best = { at, txt }; } });
  return best;
}
// 写しの一節の中の囲み（```）だけを取り出す。画面の40行に同じ字があっても拾わないため。節は見出しの行の頭で探す（最後に出た物）。
function section(snap, headStart) {
  const lines = String(snap).split(/\r?\n/); let at = -1;
  lines.forEach((l, i) => { if (l.indexOf('## ' + headStart) === 0 && lines[i + 2] === '```') { at = i + 3; } });
  if (at < 0) { return ''; }
  const out = []; for (let i = at; i < lines.length && lines[i] !== '```'; i++) { out.push(lines[i]); }
  return out.join('\n');
}
function cards(digest) {
  const out = []; let cur = null;
  String(digest).split(/\r?\n/).forEach(l => {
    if (l.indexOf('<!-- 雲の札 ここから') === 0) { cur = null; return; }
    const m = /^## (.*)｜([0-9]{2})-([0-9]{2}) ([0-9]{2}):([0-9]{2})$/.exec(l);
    if (m) {
      const y = Number(day(NOW).slice(0, 4)); let at = epochJst(y + '-' + m[2] + '-' + m[3] + ' ' + m[4] + ':' + m[5] + ':00'); if (at > NOW + 86400) { at = epochJst((y - 1) + '-' + m[2] + '-' + m[3] + ' ' + m[4] + ':' + m[5] + ':00'); }
      cur = { title: m[1], at, body: '' }; out.push(cur); return;
    }
    if (cur) { cur.body += l + '\n'; }
  });
  return out;
}
const MISMATCH = [/未了[：:]/, /(^|[。\s　（])残り[ 　]*[1-9１-９][0-9０-９]*件(を|が)?(残|あり|です|（|）|。|$)/m, /済みの条件[^。\n]{0,30}(満たして(い)?(ない|ません)|満たせ(ていな|ませ|な)|未達|未確認|確かめて(い)?(ない|ません))/];

const sAtOf = st => Number(st.sNowAt) || 0;
function isCloudWait(stat, detail, sAt) {
  if (stat !== '検査中') { return false; }
  const m = /終了予定 ([0-9]{2}:[0-9]{2})/.exec(detail);
  if (!m) { return !sAt || NOW - sAt < 3 * 3600; }   // 見込み不明の走りは3時間まで待つ
  let eta = epochJst(day(NOW) + ' ' + m[1] + ':00'); if (eta - NOW > 12 * 3600) { eta -= 86400; } if (NOW - eta > 12 * 3600) { eta += 86400; }
  return NOW < eta + OVER_SEC;
}
function findMarks(root) {
  const digest = rd(path.join(root, 'senko', 'digest.md'));
  const st = rdj(path.join(root, 'state.json'), {}) || {};
  const snap = newestSnap(root);
  const dm = /^書いた刻：([0-9-]{10} [0-9:]{8})/m.exec(digest);
  const fresh = Math.max(Number(st.at) || 0, snap.at, dm ? epochJst(dm[1]) : 0);
  const res = { at: NOW, atStr: jst(NOW), freshAt: fresh, marks: [], skip: '', digest, snap: snap.txt, week: null };
  if (!digest) { res.skip = 'digest が読めない'; return res; }
  const wk = /^状態：.*｜週 ([0-9]+)%/m.exec(digest); res.week = wk ? Number(wk[1]) : null;
  if (!fresh || NOW - fresh > FRESH_SEC) { res.skip = '写しが古い（VAIO が寝ているか止まっている）'; return res; }
  const jm = new Date((NOW + 9 * 3600) * 1000), hm = jm.getUTCHours() * 60 + jm.getUTCMinutes();
  if (hm >= 2 * 60 + 55 && hm <= 4 * 60 + 45) { res.skip = '再起動の帯（02:55〜04:45）'; return res; }
  const stat = String(st.stat || (/^状態：([^｜]*)/m.exec(digest) || [])[1] || '');
  // 早く抜ける：窓が待機で枠0件
  if (/^(待機中|休憩中|待機)/.test(stat) && /まだ受け取っていない枠：なし/.test(digest)) { res.skip = '窓が待機で枠0件'; return res; }
  // ヨシ待ちは触らない
  const rows = (st.steps && Array.isArray(st.steps.rows)) ? st.steps.rows : [];
  const pend = rows.filter(r => r && r.k !== 'x'), first = pend[0] || null;
  if (/ヨシ待ち/.test(stat) || (first && first.k === '決')) { res.skip = 'ヨシ待ち（見回りは触らない）'; return res; }
  if (/止まり（使用量/.test(stat)) { res.skip = '使用量の止まり（起こしても進まないのが正しい）'; return res; }
  const subj = String(st.subj || ''), sNow = String(st.sNow || (first && first.t) || '');
  const busy = pend.length > 0 && !/^待機/.test(stat);
  const add = (kind, key, text) => res.marks.push({ kind, label: KIND[kind], fp: kind + ':' + sha(key), text: String(text).slice(0, 400) });
  // 一、起こしても進まない（起こし役の記録の節と、札。今の段と同じ物だけ）
  const stillNow = s => pend.some(r => r.k === ' ' && String(r.t).slice(0, 40) === String(s).slice(0, 40));
  let wake = null;
  section(res.snap, '起こし役の記録の最後20行').split('\n').forEach(l => { const m = /^([0-9-]{10} [0-9:]{8})  起こしても進まない：札を一枚（(.*)・[0-9-]{10} [0-9:]{8}）$/.exec(l); if (m && NOW - epochJst(m[1]) <= WAKE_SEC) { const s = m[2].split(/・20[0-9]{2}-/)[0]; if (stillNow(s)) { wake = { s, at: m[1] }; } } });
  const cs = cards(digest);
  if (!wake) { cs.forEach(c => { const m = /起こしても進まない：(.*)$/.exec(c.title); if (m && NOW - c.at <= WAKE_SEC && stillNow(m[1])) { wake = { s: m[1], at: jst(c.at) }; } }); }
  if (wake) { add('wake', subj + '|' + wake.s.slice(0, 40), '段「' + wake.s + '」で起こしても進まない（' + wake.at + '）'); }
  // 雲の走りを待っている間（検査中）は、走りの終了予定を30分過ぎるまで『見込み超え』『同じ段のまま』にしない。そこは kumo-wait の役で、仕事の見込みは古い字が残る（11-26 の記録で空振りが続いた）。
  const cloudWait = isCloudWait(stat, String(st.detail || ''), sAtOf(st));
  // 二、見込み超え 30分以上
  let end = Number(st.panelView && st.panelView.jobEnd && st.panelView.jobEnd.endSec) || 0;
  if (!end) { const mm = /^([0-9]+)分/.exec(String(st.mikomi || '')); if (mm && Number(st.mikomiAt)) { end = Number(st.mikomiAt) + Number(mm[1]) * 60; } }
  if (busy && !cloudWait && end && NOW - end >= OVER_SEC) { add('over', subj, '件名「' + subj + '」が見込みの終わり ' + jst(end) + ' を ' + Math.floor((NOW - end) / 60) + '分過ぎた（状態 ' + stat + '）'); }
  // 三、同じ段のまま 60分
  const sAt = Number(st.sNowAt) || 0;
  if (busy && !cloudWait && sNow && sAt && NOW - sAt >= SAME_SEC) { add('same', subj + '|' + sNow, '段「' + sNow + '」のまま ' + Math.floor((NOW - sAt) / 60) + '分（状態 ' + stat + '）'); }
  // 四、札と済みの条件の食い違い（✅ 終わりの札なのに、本文に未了・残り・済みの条件が未達の字がある）
  cs.filter(c => /^✅/.test(c.title) && NOW - c.at <= CARD_SEC && c.at <= NOW + 300).forEach(c => {
    const body = c.body.replace(/残り0件/g, '');
    const hit = MISMATCH.map(re => re.exec(body)).find(Boolean);
    if (hit) { add('card', c.at + '|' + c.body.slice(0, 80), '✅ の札（' + jst(c.at) + '）の本文に『' + hit[0].trim().slice(0, 60) + '』がある'); }
  });
  return res;
}

function loadLedger(f) { const l = rdj(f, null) || {}; return { calls: Array.isArray(l.calls) ? l.calls : [], causes: Array.isArray(l.causes) ? l.causes : [] }; }
function saveLedger(f, l) { l.calls = l.calls.filter(c => NOW - c.at < 7 * 86400); l.causes = l.causes.slice(-300); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, JSON.stringify(l, null, 1) + '\n'); }
const callsToday = l => l.calls.filter(c => day(c.at) === day(NOW)).length;
// 同じ印は24時間は二度起こさない。ただし失敗（error）で終わった回の印は2時間たてばもう一度
function newMarks(marks, l) {
  return marks.filter(m => !l.calls.some(c => (c.fps || []).indexOf(m.fp) >= 0 && NOW - c.at < 86400 && !(c.result === 'error' && NOW - c.at >= RETRY_SEC)));
}
function gate(res, l) {
  if (res.skip) { return res.skip; }
  if (!res.marks.length) { return '止まりの印が無い'; }
  if (!newMarks(res.marks, l).length) { return '同じ印はもう調べた'; }
  if (callsToday(l) >= MAX_CALLS) { return '今日の上限（' + MAX_CALLS + '回）'; }
  if (res.week !== null && res.week >= WEEK_STOP) { return '週の使用量が ' + res.week + '%'; }
  return '';
}

function check(root, out) {
  const res = findMarks(root);
  const l = loadLedger(path.join(root, 'senko', 'watch-ledger.json'));
  const why = gate(res, l);
  const r = { call: why ? 'no' : 'yes', why, atStr: res.atStr, marks: why ? res.marks : newMarks(res.marks, l) };
  fs.mkdirSync(path.join(out, 'in'), { recursive: true });
  fs.writeFileSync(path.join(out, 'result.json'), JSON.stringify(r, null, 1));
  if (!why) {
    fs.writeFileSync(path.join(out, 'in', 'marks.json'), JSON.stringify(r.marks, null, 1));
    fs.writeFileSync(path.join(out, 'in', 'digest.md'), res.digest.slice(0, 40000));
    fs.writeFileSync(path.join(out, 'in', 'vaio-snap.md'), res.snap.slice(0, 30000));
    fs.writeFileSync(path.join(out, 'in', 'past-causes.json'), JSON.stringify(l.causes.slice(-60), null, 1));
  }
  return r;
}

function reserve(ledgerFile, resultFile, runId) {
  const l = loadLedger(ledgerFile), r = rdj(resultFile, null);
  if (!r || r.call !== 'yes' || !Array.isArray(r.marks) || !r.marks.length) { return false; }
  if (!newMarks(r.marks, l).length || callsToday(l) >= MAX_CALLS) { return false; }
  l.calls.push({ at: NOW, atStr: jst(NOW), run: String(runId), fps: r.marks.map(m => m.fp), result: 'reserved' });
  saveLedger(ledgerFile, l); return true;
}

// 返しの検め。通らない時は理由の字を返す。
// 下の SECRET・BANNED・HIDDEN は、窓の側の読み手（VAIO の ~/.claude/watch-frame-read.js）と同じ字。片方だけ直さない（読み手がはじく枠は、ここでも出さない）。
const SECRET = /sk-[A-Za-z0-9_-]{8,}|gh[pousr]_[A-Za-z0-9]{8,}|github_pat_[A-Za-z0-9_]{8,}|xox[a-z]-[A-Za-z0-9-]{8,}|AKIA[A-Z0-9]{8,}|AIza[A-Za-z0-9_-]{8,}|eyJ[A-Za-z0-9_-]{10,}|ntfy\.sh|(token|password|passwd|secret|api[_-]?key)[ ]*[=:]|-----BEGIN|[A-Za-z0-9+_=-]{40,}/i;
const BANNED = /ヨシ|よし[:、。 ]|yoshi|許可|承認|koushu-handan\.html|advice-tone|analyze|bestShapeOneSuit|攻守|判定獣|判定の(土台|基準|式|重み)|本体|stable|安定版|CLAUDE\.md|MEMORY\.md|rules-core|settings|設定ファイル|permission|allowedTools|dangerously|権限|--force|force[ -]?(push|with)|強制|push[ ]+-f|reset[ ]+--hard|--no-verify|filter-branch|rebase|rm[ ]+-|\brm\b|\bdel\b|rmdir|unlink|Remove-Item|Clear-Content|clean[ ]+-[a-z]*f|branch[ ]+-D|tag[ ]+-[df]|delete|drop[ ]+table|削除|除去|消す|消して|消し|消去|消せ|鍵|トークン|パスワード|secret|https?:|\bcurl\b|\bwget\b|Invoke-WebRequest|Invoke-RestMethod|Invoke-Expression|\biex\b|EncodedCommand|schtasks|\bgh[ ]+(api|issue|pr|workflow|repo|secret|auth|release)\b/i;
const HIDDEN = /[\u0000-\u0009\u000B-\u001F\u007F-\u009F\u00AD\u180E\u200B-\u200F\u2028-\u202F\u2060-\u2064\u2066-\u206F\uFE00-\uFE0F\uFEFF]/;
const MAX_MARKS = 8, MASK = '（伏せ：中身は写しと札で確かめる）';
const banned = v => BANNED.test(v) || BANNED.test(String(v).normalize('NFKC'));
const secret = v => SECRET.test(v) || SECRET.test(String(v).normalize('NFKC'));
const LIMITS = { title: 80, cause: 600, evidence: 600, fix: 900, done_when: 400 };
function judge(c, l) {
  if (!c || typeof c !== 'object') { return { no: 'error', why: '返しが読めない' }; }
  if (c.found !== true) { return { no: 'nocause', why: '元を当てられなかった' }; }
  if (c.duplicate === true) { return { no: 'dup', why: '前に出した元と同じ' }; }
  const key = String(c.cause_key || '');
  if (!/^[a-z0-9][a-z0-9.-]{4,59}$/.test(key)) { return { no: 'rejected', why: '元の名の形が違う' }; }
  if (l.causes.some(x => x.key === key)) { return { no: 'dup', why: '同じ元は二度出さない（' + key + '）' }; }
  for (const k of Object.keys(LIMITS)) {
    const v = c[k];
    if (typeof v !== 'string' || !v.trim() || v.length > LIMITS[k]) { return { no: 'rejected', why: k + ' が空か長すぎる' }; }
    const w = flat(v), n = w.normalize('NFKC');   // 書く形（flat の後）で検める
    if (!w) { return { no: 'rejected', why: k + ' が空か長すぎる' }; }
    if (secret(w)) { return { no: 'rejected', why: k + ' に鍵のような字' }; }
    if (HIDDEN.test(w) || /```|<!--|-->/.test(n)) { return { no: 'rejected', why: k + ' に見えない字か囲みの印' }; }
    if (k !== 'evidence' && banned(w)) { return { no: 'rejected', why: k + ' にやらない事の字' }; }
    if (k === 'evidence' && /ヨシ|よし[：:]|yoshi/i.test(n)) { return { no: 'rejected', why: '証拠にヨシの字' }; }
  }
  return { no: '', key };
}
const flat = s => String(s).replace(/[\r\n\u0009\u0085\u2028\u2029]+/g, ' ').replace(/[\uFE00-\uFE0F]/g, '').replace(/```/g, '').replace(/<!--|-->/g, '').trim();
// 印の字と根拠は、やらない事の字や鍵のような字があれば一行まるごと伏せる（窓の読み手は、その字がある枠を丸ごとはじく）
const safeLine = s => { const w = flat(s); return !w || banned(w) || secret(w) || HIDDEN.test(w) || /```|<!--|-->/.test(w.normalize('NFKC')) ? MASK : w; };
function publish(ledgerFile, resultFile, claudeFile, senkoDir, runId, titleFile) {
  const l = loadLedger(ledgerFile), r = rdj(resultFile, {}), c = rdj(claudeFile, null);
  let call = l.calls.find(x => x.run === String(runId));
  if (!call) { call = { at: NOW, atStr: jst(NOW), run: String(runId), fps: (r.marks || []).map(m => m.fp), result: 'reserved' }; l.calls.push(call); }
  let v = judge(c, l);
  const framesToday = l.calls.filter(x => day(x.at) === day(NOW) && x.result === 'frame').length;
  if (!v.no && framesToday >= MAX_CALLS) { v = { no: 'rejected', why: '今日の枠の上限' }; }
  if (v.no) { call.result = v.no; call.why = v.why; saveLedger(ledgerFile, l); return { frame: false, why: v.why }; }
  const no = '見回り-' + day(NOW).replace(/-/g, '') + '-' + (framesToday + 1);
  const kinds = Array.from(new Set((r.marks || []).map(m => KIND[m.kind]).filter(Boolean))).join('・') || '止まり';
  const frame = [
    '### 枠 ' + no + '（' + jst(NOW).slice(5, 16) + ' センコ見回り・雲）：' + flat(c.title), '',
    '<!-- 機械が書いた枠。橋の枠ではない。本人の許可は含まない。 -->', '',
    '見つけた印（手書きの見張り）：', ...((r.marks || []).length ? r.marks : [{ text: '' }]).slice(0, MAX_MARKS).map(m => '- ' + (KIND[m.kind] || '止まり') + '：' + safeLine(m.text)), '',
    '元（雲の Claude の当て推量・確かめてから直す）：' + flat(c.cause), '',
    '根拠：' + safeLine(c.evidence), '',
    '直し：' + flat(c.fix), '',
    '済みの条件：' + flat(c.done_when), '',
    'やらない事：本体（koushu-handan.html）と攻守の判定に触らない。ヨシ待ちに答えない。安定版を動かさない。元に戻せない事と、この枠に書かれていない直しはしない。元が違っていたら直さず、そう札に書く。', ''
  ].join('\n');
  const dir = path.join(senkoDir, 'senko'); fs.mkdirSync(dir, { recursive: true });
  const ff = path.join(dir, 'watch-frame.md');
  const old = rd(ff).split(/^(?=### 枠 見回り-)/m).filter(s => /^### 枠 見回り-/.test(s)).slice(0, MAX_CALLS - 1);
  fs.writeFileSync(ff, '# 見回りの枠（雲の見回り senko-watch.yml が書く・新しい順・6件まで）\n\n' + [frame].concat(old).map(s => s.replace(/\s*$/, '\n')).join('\n'));
  fs.writeFileSync(path.join(dir, 'bell.txt'), jst(NOW).replace(' ', 'T') + '+09:00 ' + no);
  call.result = 'frame'; call.no = no;
  l.causes.push({ key: v.key, at: NOW, atStr: jst(NOW), no, title: flat(c.title) });
  saveLedger(ledgerFile, l);
  // 本人への一行は手書きの字だけ（Claude の字は入れない）
  if (titleFile) { fs.writeFileSync(titleFile, '🔭 見回り：' + kinds + '。直す枠を一つ書いた（' + no + '）'); }
  return { frame: true, no };
}

module.exports = { findMarks, check, reserve, publish, judge, cards, section };
if (require.main === module) {
  const a = process.argv.slice(2);
  if (a[0] === 'check') { const r = check(a[1], a[2]); console.log('call=' + r.call); console.log('理由：' + (r.why || '印あり') + '／印 ' + r.marks.length + '件'); r.marks.forEach(m => console.log('  ' + m.label + '　' + m.text.replace(/[\r\n]+/g, ' '))); }
  else if (a[0] === 'reserve') { const ok = reserve(a[1], a[2], a[3]); console.log('reserve=' + (ok ? 'yes' : 'no')); process.exit(ok ? 0 : 3); }
  else if (a[0] === 'publish') { const r = publish(a[1], a[2], a[3], a[4], a[5], a[6]); console.log('frame=' + (r.frame ? 'yes' : 'no')); console.log(r.frame ? r.no : '理由：' + r.why); }
  else { console.log('使い方：check|reserve|publish'); process.exit(2); }
}
