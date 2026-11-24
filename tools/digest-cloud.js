// digest-cloud.js — 雲の札を、VAIO を通さずに digest.md へ載せる（2026-11-24・橋の枠 二百六十一 二）
//   ＊今まで：雲の札は notices.json に足されるが、digest.md（センコ用のまとめ）は VAIO の digest-make.js だけが書き、VAIO が止まると雲の仕事が済んでも digest に出なかった。
//   ＊これ：雲の走りの最後（order-in.yml の『走りの控えを札に足し…』の段）で、notices.json の eid が cloud- で始まる最新5件を、digest.md の
//     <!-- 雲の札 ここから --> … <!-- 雲の札 ここまで --> の間へ書く（無ければ末尾に足す）。VAIO の digest-make.js は digest.md を丸ごと書き直すが、
//     VAIO が動いていれば VAIO の notices.json（adopt-cloud.js が雲の札を取り込む）から同じ札を出すので、食い違わない。
//   使い方  node tools/digest-cloud.js [digest.md] [notices.json]   （作業の木＝koushu-state の根で。既定 senko/digest.md と notices.json）
'use strict';
const fs = require('fs');
const BEGIN = '<!-- 雲の札 ここから（雲の走りが VAIO を通さず書く） -->', END = '<!-- 雲の札 ここまで -->';
function hm(t) { const d = new Date(Number(t) * 1000 + 9 * 3600000); const p = n => String(n).padStart(2, '0'); return (d.getUTCMonth() + 1) + '-' + d.getUTCDate() + ' ' + p(d.getUTCHours()) + ':' + p(d.getUTCMinutes()); }
function block(notices) {
  const rows = (Array.isArray(notices) ? notices : []).filter(r => r && typeof r.eid === 'string' && r.eid.indexOf('cloud-') === 0).sort((a, b) => (Number(b.time) || 0) - (Number(a.time) || 0)).slice(0, 5);
  const lines = rows.map(r => '- ' + hm(r.time) + '　' + String(r.eid).replace(/^cloud-/, '') + '　' + String(r.message || '').split('\n')[0].slice(0, 120));
  return BEGIN + '\n## 雲の札（新しい5件・VAIO を通さずに載る）\n' + (lines.length ? lines.join('\n') : '（まだ無い）') + '\n' + END;
}
function apply(digestText, notices) {
  const b = block(notices), i = digestText.indexOf(BEGIN), j = digestText.indexOf(END);
  if (i >= 0 && j > i) { return digestText.slice(0, i) + b + digestText.slice(j + END.length); }
  return digestText.replace(/\s*$/, '') + '\n\n' + b + '\n';
}
module.exports = { block, apply, BEGIN, END };
if (require.main === module) {
  const dp = process.argv[2] || 'senko/digest.md', np = process.argv[3] || 'notices.json';
  let d = ''; try { d = fs.readFileSync(dp, 'utf8'); } catch (e) { d = '# 窓の状態と、読み印より後の札（センコ用の一枚）\n'; }
  let n = []; try { n = JSON.parse(fs.readFileSync(np, 'utf8').replace(/^﻿/, '')); } catch (e) { n = []; }
  const out = apply(d, n);
  if (out !== d) { fs.writeFileSync(dp, out); console.log('digest.md の雲の札の欄を書いた'); } else { console.log('digest.md は変わらない'); }
}
