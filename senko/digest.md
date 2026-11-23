# 窓の状態と、読み印より後の札（センコ用の一枚）

状態：待ち｜件名：枠 二百二十四：v1522 を雲から main へ戻す（本番の一本目）｜見込み：60分｜セッション 60%｜週 7%｜Fable 0%
受領：最後に受け取った枠 枠 二百二十四（11-23 23:58:23）／まだ受け取っていない枠：なし

書いた刻：2026-11-24 00:17:26／読み印：2026-11-23 23:56:17／札 1件（読み印より後・新しい順）

## ✅ 終わりました（返事不要）｜11-24 00:10

枠 v1522 を本体へ戻すの結果

./handan で 095579111 を revert し（衝突なし・手元の commit 3571e3fd）、版と検査を回したが、check-all の④が落ちたので main へは押していない。

触ったファイル：handan 内の手元 revert commit のみ（v1522 の本体・声・scratchpad などが戻った）。push はしていない（main も枝も無変更）。

確かめた事：
- 版の三箇所（data-ver・verTag・ver.txt）：1522 で一致（PASS）
- ① <script> 4塊を切り出して node --check：OK
- ② serifu-extract.js --check：serifu.txt・serifu-adv.txt とも本体と一致
- ③ pack-site.js --verify：台帳 21436本／直下に無い 0本（OK）
- ④ check-all --fast（google-chrome あり）：FAIL 1件。check.js の④「本体が使う声が公開の荷の台帳に無い（公開で鳴らない）: 18本」例 advx-butler-advd-w-chi-n / -chi-t / -chi-f。他の項目（版・404・構文・溢れ・adv-check 等）は PASS、㉓は速い版で SKIP。
- 案の物の grep：koushu-handan.html・serifu.txt・serifu-adv.txt・panel.html に "shape-aite" の字は無し（ファイル名での確認のみ）。

残り：
未了：main への push（検査④の失敗のため押さず）。原因は advx-butler-advd-w-chi-* 系 18本が公開の荷の台帳に未登録な事。声の台帳／荷の作り直しは枠に無いので手を付けていない。本人の判断待ち。
未了：四の「助言の文案が画面に出る物へ入っていないか」は、reports/y1123-2155-shape-aite-result.md の文案そのものでの照合までは行っていない（押さないので影響なし）。

走りの控え（雲・claude -p）：
・5時間枠：前 59% → 後 59%（リセット 11-24 01:20）
・週：前 7% → 後 7%（リセット 11-30 20:00）
・トークン：input 44・output 4619・cache_creation 19442・cache_read 541907／費用 $0.1782／手数 27／所要 491秒
・窓で回した時との比べ：同じ枠を窓で回した記録が無い間は比べられない（この走りの値を次の比べの元にする）。headless は同じ仕事で5時間枠を多く食うという報告あり（本家 issue #97074・未確認）。
