// order-finish.js — 雲で走らせた枠の後始末（枠 二百二十三・2026-11-23）。order-in.yml の「札を押す」段から呼ぶ。
//   使い方：node tools/order-finish.js <claude の stream-json の出力> <札のファイル> [--apply]
//   --apply なし（札の控えだけ）：stream-json から『走りの控え』（前後の5時間枠・週の割合・リセットの刻・トークン・費用・手数）を組み、札の末尾に足す。ファイルは札だけ書く。
//   --apply あり：state.json の rl（{s:5時間枠%, sr:そのリセット epoch, w:週%, wr:そのリセット epoch, rlAt:刻}）を、取れた時だけ・VAIO の書き込みより新しい時だけ更新し（ほかの欄は触らない）、
//                 札を notices.json（パネルの札の一覧）へ窓の札と同じ形（title・time・message）で一行足す（同じ札は二度足さない）。取れなかった時は札にそう書く。
//   ＊rate_limit_event は Claude Code 2.1.283 以降で出る（古い版は警告時だけ）。形は unifiedWindows.five_hour／seven_day の utilization・resetsAt を再帰で探す（形が少し違っても拾えるように）。
//   ＊鍵・トークンは出力に出さない（stream-json の中に鍵は入らないが、念のため sk-ant- は伏せる）。
//   作り値：OF_NOW（今の epoch 秒）
'use strict';
const fs = require('fs');
const args = process.argv.slice(2).filter(a => a.indexOf('--') !== 0), APPLY = process.argv.indexOf('--apply') >= 0;
const [runFile, cardFile] = args;
const NOW = Number(process.env.OF_NOW) || Math.floor(Date.now() / 1000);
const rdj = f => { try { return JSON.parse(fs.readFileSync(f, 'utf8').replace(/^﻿/, '')); } catch (e) { return null; } };
const mask = s => String(s).replace(/sk-ant-[A-Za-z0-9_-]+/g, '【伏せ】');
// ---- stream-json を読む ----
const evs = []; let raw = '';
try { raw = fs.readFileSync(runFile, 'utf8'); } catch (e) { raw = ''; }
raw.split(/\r?\n/).forEach(l => { const t = l.trim(); if (t[0] !== '{') { return; } try { evs.push(JSON.parse(t)); } catch (e) { } });
function findWin(o, key, depth) {   // key（five_hour／seven_day）という名の下の {utilization, resetsAt} を探す
  if (!o || typeof o !== 'object' || depth > 8) { return null; }
  if (o[key] && typeof o[key] === 'object' && ('utilization' in o[key] || 'resetsAt' in o[key] || 'resets_at' in o[key])) { return o[key]; }
  for (const k of Object.keys(o)) { const r = findWin(o[k], key, depth + 1); if (r) { return r; } }
  return null;
}
const rle = evs.filter(e => e && (e.type === 'rate_limit_event' || e.event === 'rate_limit_event' || JSON.stringify(e).indexOf('rate_limit_event') >= 0));
let five = null, seven = null, rleStatus = '';
for (let i = rle.length - 1; i >= 0 && (!five || !seven); i--) {
  five = five || findWin(rle[i], 'five_hour', 0); seven = seven || findWin(rle[i], 'seven_day', 0);
}
if (!rle.length) { rleStatus = 'rate_limit_event が一つも出なかった（CLI が古いか、この走りでは出ない）'; }
else if (!five && !seven) { rleStatus = 'rate_limit_event は ' + rle.length + ' 件あったが five_hour／seven_day の割合が見つからなかった（形：' + mask(JSON.stringify(rle[rle.length - 1])).slice(0, 220) + '）'; }
const pct = w => { if (!w) { return null; } const u = Number(w.utilization); if (!isFinite(u)) { return null; } return Math.round((u <= 1 ? u * 100 : u) * 10) / 10; };
const epoch = w => { if (!w) { return null; } let r = w.resetsAt !== undefined ? w.resetsAt : w.resets_at; if (typeof r === 'string' && /[T-]/.test(r)) { const p = Date.parse(r); r = isFinite(p) ? p / 1000 : null; } r = Number(r); if (!isFinite(r) || r <= 0) { return null; } return Math.floor(r > 1e12 ? r / 1000 : r); };
const s1 = pct(five), w1 = pct(seven), sr = epoch(five), wr = epoch(seven);
const resEv = evs.filter(e => e && e.type === 'result').pop() || {};
const u = resEv.usage || {};
const cost = resEv.total_cost_usd !== undefined ? resEv.total_cost_usd : resEv.cost_usd;
const hm = t => { const d = new Date(t * 1000 + 9 * 3600000); return (d.getUTCMonth() + 1) + '-' + d.getUTCDate() + ' ' + String(d.getUTCHours()).padStart(2, '0') + ':' + String(d.getUTCMinutes()).padStart(2, '0'); };
// ---- 前の値（走る前の state.json の rl）----
const st = rdj('state.json'), rl0 = (st && st.rl) || {};
const lines = ['', '走りの控え（雲・claude -p）：'];
lines.push('・5時間枠：前 ' + (typeof rl0.s === 'number' ? rl0.s + '%' : '不明') + ' → 後 ' + (s1 !== null ? s1 + '%' : '取れず') + (sr ? '（リセット ' + hm(sr) + '）' : ''));
lines.push('・週：前 ' + (typeof rl0.w === 'number' ? rl0.w + '%' : '不明') + ' → 後 ' + (w1 !== null ? w1 + '%' : '取れず') + (wr ? '（リセット ' + hm(wr) + '）' : ''));
if (rleStatus) { lines.push('・割合：' + rleStatus); }
const tok = ['input_tokens', 'output_tokens', 'cache_creation_input_tokens', 'cache_read_input_tokens'].map(k => (u[k] !== undefined ? k.replace('_input', '').replace('_tokens', '') + ' ' + u[k] : '')).filter(Boolean);
lines.push('・トークン：' + (tok.length ? tok.join('・') : '取れず（result に usage が無い）') + '／費用 ' + (cost !== undefined ? '$' + Number(cost).toFixed(4) : '取れず') + '／手数 ' + (resEv.num_turns !== undefined ? resEv.num_turns : '不明') + '／所要 ' + (resEv.duration_ms ? Math.round(resEv.duration_ms / 1000) + '秒' : '不明'));
lines.push('・窓で回した時との比べ：同じ枠を窓で回した記録が無い間は比べられない（この走りの値を次の比べの元にする）。headless は同じ仕事で5時間枠を多く食うという報告あり（本家 issue #97074・未確認）。');
let card = ''; try { card = fs.readFileSync(cardFile, 'utf8'); } catch (e) { card = ''; }
if (card.indexOf('走りの控え（雲・claude -p）') < 0) { card = card.replace(/\s+$/, '') + '\n' + lines.join('\n') + '\n'; fs.writeFileSync(cardFile, card); }
console.log(mask(lines.join('\n')));
if (!APPLY) { process.exit(0); }
// ---- state.json の rl（取れた時だけ・VAIO の書き込みより新しい時だけ）----
if (st && (s1 !== null || w1 !== null)) {
  const rlAt0 = Number(rl0.rlAt) || 0;
  if (NOW > rlAt0) {
    const rl = Object.assign({}, rl0);
    if (s1 !== null) { rl.s = s1; if (sr) { rl.sr = sr; } }
    if (w1 !== null) { rl.w = w1; if (wr) { rl.wr = wr; } }
    rl.rlAt = NOW; st.rl = rl;
    fs.writeFileSync('state.json', JSON.stringify(st));
    console.log('state.json の rl を更新：s=' + rl.s + ' w=' + rl.w + ' rlAt=' + rl.rlAt);
  } else { console.log('rl は VAIO の書き込みの方が新しいので更新しない（rlAt ' + rlAt0 + ' ≥ ' + NOW + '）'); }
} else { console.log('rl は取れなかったので state.json は触らない'); }
// ---- 走りの実測を控える（枠 二百三十）：senko/cloud-history.tsv ＝ 刻／札の名／見込み（週%・書いてなければ空）／増えた週%（整数の差・取れなければ空）／費用USD／トークン合計 ----
//   ＊次の見込みの直しに使う（cloud-queue.js の fallback ＝ 増えた週%の中央値）。週は整数でしか取れないので、費用・トークンも並べて控える（換算は後で）。
try {
  const ordTxt = (() => { try { return fs.readFileSync(process.env.OF_ORDER || 'senko/order-in.md', 'utf8'); } catch (e) { return ''; } })();
  const mm = ordTxt.match(/見込み[：:][ \u3000]*週[ \u3000]*([0-9]+(?:\.[0-9]+)?)[ \u3000]*%/);
  const dW = (typeof rl0.w === 'number' && w1 !== null) ? Math.round((w1 - rl0.w) * 10) / 10 : '';
  const dS = (typeof rl0.s === 'number' && s1 !== null) ? Math.round((s1 - rl0.s) * 10) / 10 : '';   // 枠 二百四十八：セッション（5時間枠）の増え（整数の差・取れなければ空）
  const sBefore = (typeof rl0.s === 'number') ? rl0.s : '', sAfter = (s1 !== null) ? s1 : '', wBefore = (typeof rl0.w === 'number') ? rl0.w : '', wAfter = (w1 !== null) ? w1 : '';
  const tokSum = ['input_tokens', 'output_tokens', 'cache_creation_input_tokens', 'cache_read_input_tokens'].reduce((t, k) => t + (Number(u[k]) || 0), 0);
  const stem = (cardFile.split('/').pop() || '').replace(/\.md$/, ''), TAB = String.fromCharCode(9);
  const histF = 'senko/cloud-history.tsv'; let hist = ''; try { hist = fs.readFileSync(histF, 'utf8'); } catch (e) { hist = '# 刻 TAB 札の名 TAB 見込み週% TAB 増えた週% TAB 費用USD TAB トークン合計 TAB 前セッション% TAB 後セッション% TAB 増えたセッション% TAB 前週% TAB 後週%（枠 二百四十八で足した列・古い行は空）\n'; }
  if (hist.indexOf(TAB + stem + TAB) < 0) { fs.writeFileSync(histF, hist + [NOW, stem, mm ? mm[1] : '', dW, cost !== undefined ? Number(cost).toFixed(4) : '', tokSum, sBefore, sAfter, dS, wBefore, wAfter].join(TAB) + '\n'); console.log('cloud-history.tsv に一行足した（' + stem + '）'); }
} catch (e) { console.log('cloud-history.tsv は足せなかった'); }
// ---- notices.json（パネルの札）へ ----
const nt = rdj('notices.json');
if (Array.isArray(nt)) {
  const text = card.replace(/^﻿/, '').trim(), first = text.split('\n')[0] || '枠の札';
  const eid = 'cloud-' + (cardFile.split('/').pop() || '').replace(/\.md$/, '');
  if (!nt.some(r => r && r.eid === eid)) {
    nt.push({ title: '✅ 終わりました（返事不要）', time: NOW, message: first + '\n' + text.split('\n').slice(1).join('\n'), eid: eid, pushedAt: 0 });
    fs.writeFileSync('notices.json', JSON.stringify(nt));
    console.log('notices.json に札を一行足した（' + eid + '）');
  } else { console.log('notices.json に同じ札があるので足さない'); }
} else { console.log('notices.json が読めないので札は足さない'); }
