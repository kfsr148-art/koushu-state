// card-rescue-cloud.js — 雲の走り（claude -p）が札を書かずに終わった時、走りの記録（stream-json）から『控えから起こした札』を書く（2026-11-24・橋の枠 二百六十二）
//   ＊order-in.yml の『札が書けたかを確かめる』の段が、札が空なら呼ぶ（今までは『札が書かれなかった』の一文だけだった）。
//   ＊拾う物：触ったファイル（Write・Edit の file_path）／last の言葉（assistant の最後の text）／走りの結果（result の subtype・手数・費用・断られた操作）。
//   使い方  node tools/card-rescue-cloud.js <run.jsonl> [<card 出力先>]   … 札の本文を標準出力（出力先があれば書く）。秘密は載せない（鍵らしい字は伏せる）。
'use strict';
const fs = require('fs');
const src = process.argv[2], out = process.argv[3];
let evs = []; try { evs = fs.readFileSync(src, 'utf8').split(String.fromCharCode(10)).filter(Boolean).map(l => { try { return JSON.parse(l); } catch (e) { return null; } }).filter(Boolean); } catch (e) { evs = []; }
const files = {}; let last = '', runs = 0;
evs.forEach(e => {
  const c = e && e.message && Array.isArray(e.message.content) ? e.message.content : [];
  c.forEach(x => {
    if (x.type === 'tool_use' && x.input) { runs++; const fp = x.input.file_path; if (fp && /^(Write|Edit)$/.test(x.name)) { files[String(fp).replace(/\\/g, '/')] = 1; } }
    else if (x.type === 'text' && e.type === 'assistant' && String(x.text || '').trim()) { last = String(x.text).trim(); }
  });
});
const res = evs.filter(e => e.type === 'result').pop() || {};
const den = (Array.isArray(res.permission_denials) ? res.permission_denials : []).map(d => String((d && d.tool_name) || '?') + '：' + String((d && d.tool_input && (d.tool_input.command || d.tool_input.file_path)) || '').replace(/\s+/g, ' ').slice(0, 80));
const mask = t => String(t).replace(/(sk-[A-Za-z0-9_-]{8,}|ghp_[A-Za-z0-9]{8,}|github_pat_[A-Za-z0-9_]{8,}|xox[a-z]-[A-Za-z0-9-]{8,}|AKIA[A-Z0-9]{8,}|eyJ[A-Za-z0-9_-]{10,})/g, '【伏せ】');
const body = [
  '枠の結果：札が書かれなかった（控えから起こした札）', '',
  '（この札は、走りが札を書かずに終わったので、走りの記録から自動で起こした物です）',
  '走りの結果：' + (res.subtype || '不明') + '／手数 ' + (res.num_turns || runs) + '／費用 ' + (res.total_cost_usd !== undefined ? Number(res.total_cost_usd).toFixed(4) + ' USD' : '不明'),
  '触ったファイル（' + Object.keys(files).length + '）：' + (Object.keys(files).slice(0, 10).join('・') || '（記録に無い）'),
  '最後の言葉：' + (last ? mask(last.replace(/\s+/g, ' ').slice(0, 400)) : '（記録に無い）'),
  den.length ? '許しが断られた操作 ' + den.length + '件：' + den.slice(0, 5).join(' ／ ') : ''
].filter(x => x !== '').join(String.fromCharCode(10)) + String.fromCharCode(10);
if (out) { fs.mkdirSync(require('path').dirname(out), { recursive: true }); fs.writeFileSync(out, body); }
process.stdout.write(body);
