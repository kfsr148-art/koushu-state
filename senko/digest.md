# 窓の状態と、読み印より後の札（センコ用の一枚）

状態：待ち｜件名：枠 二百二十四：v1522 を雲から main へ戻す（本番の一本目）｜見込み：60分｜セッション 60%｜週 7%｜Fable 0%
受領：最後に受け取った枠 枠 二百二十四（11-23 23:58:23）／まだ受け取っていない枠：枠 二百二十五（鈴 00:23:54）

書いた刻：2026-11-24 00:23:59／読み印：2026-11-24 00:19:01／札 1件（読み印より後・新しい順）

## ✅ 終わりました（返事不要）｜11-24 00:20

枠 v1522 を本体へ戻す（二回目）の結果

095579111 を revert して v1522 を戻し（77bde324）、voice-advice.txt を voice-advice-catalog.js から作り直して manifest と voice-used.txt も更新し、検査が全部通ったので main へ押した。押した commit は 079683ad8433672a66bc335c93ee1089f3124dfb（main・枝の指定なし）。

触ったファイル：revert で戻った v1522 一式（koushu-handan.html ほか）、voice-advice.txt、voice-used.txt（本体 koushu-handan.html は revert の分だけで、追加の手入れなし）

確かめた事：
- 版の三箇所（data-ver・verTag・ver.txt）：すべて 1522 で一致
- ① <script> 塊を一時 .js に切り出して node --check：通った（一時ファイルはリポジトリ外）
- ② node serifu-extract.js --check：serifu.txt・serifu-adv.txt とも本体と一致
- ③ node pack-site.js --verify：台帳 21454本／直下に無い 0本
- ④ node check-all --fast：check.js 全項目PASS（㉓のみ速い版のため SKIP）・adv-check 全PASS・前回落ちた④（本体が使う助言の声が voice-used.txt に在る）も通った
- 五 案の物の照合：助言の文案の字（染め・七対子・対々の「…には寄せない」ほか案A/Cの句）は koushu-handan.html・serifu.txt・serifu-adv.txt・panel.html のどれにも 0件
- 鍵は札にもログにも出していない

残り0件

走りの控え（雲・claude -p）：
・5時間枠：前 60% → 後 60%（リセット 11-24 01:20）
・週：前 7% → 後 7%（リセット 11-30 20:00）
・トークン：input 46・output 4713・cache_creation 37695・cache_read 956841／費用 $0.2937／手数 30／所要 178秒
・窓で回した時との比べ：同じ枠を窓で回した記録が無い間は比べられない（この走りの値を次の比べの元にする）。headless は同じ仕事で5時間枠を多く食うという報告あり（本家 issue #97074・未確認）。
