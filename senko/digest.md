# 窓の状態と、読み印より後の札（センコ用の一枚）

状態：検査中｜件名：待ち（次の枠を待っている・前の仕事の札は済み）｜見込み：15分｜セッション 46%｜週 55%｜Fable 6%
受領：最後に受け取った枠 枠 三百五十八（11-26 15:03:18）／まだ受け取っていない枠：枠 三百五十九（鈴 15:05:14）
VAIOの写し：書いた刻 2026-11-26 15:06:37／番地 senko/vaio-snap.md／窓 run:2026-11-26 15:03:27／今の段 —／落ちた走り あり／空きメモリ 3987MB

書いた刻：2026-11-26 15:15:46／読み印：2026-11-26 14:59:32／札 3件（パネルの『まとめて写す』の残りと同じ数・読み印より後・新しい順）

## ✅ 終わりました（返事不要）｜11-26 15:15

枠 三百五十八の結果。①押した仕事と元：11-25 の 15650e053（advscan 一回目）と 272e25586（二回目）は、どちらも私（kfsr148-art）が枝 advscan へ押した commit で、main へ運んだのは github-actions[bot] の「雲で回した結果を reports/ へ」の commit（job.yml の押し戻しの段）。元は、その段が「git pull --rebase origin main && git push HEAD:main」で、枝 advscan から job.yml を起こした走りの HEAD（枝の commit の上に結果を載せた物）をそのまま main へ押したので、枝の commit ごと main へ入ったこと（main の履歴：15650e053 → bot 45f0a951a（18:27Z）、272e25586 → bot 463f66cf4（19:18Z））。作りかけの本体・核が main に入って配信が止まり、v1536 へ戻した（a06717772）。job.yml は 20:16Z（ebc80c911・枠 三百二十七）から結果を main に書かず専用の枝 cloud-out へ置く形に替えてあり、その穴は既に塞がっている。②同じ形の穴が残っていた voice-m4a.yml・voice-24k.yml（「git push origin HEAD:main」）を塞いだ：取り出し（checkout）は ref: main を名指しにして、枝から起こしても枝の commit を運ばない／押す前に、足す物が直下の *.m4a だけかを見張り、ほかの物が混じっていれば押さず、ntfy で知らせて止まる（終了 1）。post-publish.yml は元から main を名指しで、reports/post-publish/ だけを押す（戻す時だけ本体と ver.txt を、決めた手順で）。試し：使い捨ての git で、*.m4a だけなら見張りは何も拾わず・本体や reports/ が混じれば拾う事を確かめた。advscan の中身と公開の版は変えていない。
未確認：この二つの workflow の YAML を本物の走りで通していない（手元に YAML の検査器が無く、gh workflow view で読めることだけ確かめた）／次に声を作る走りで、見張りが m4a だけの押しを止めないこと。

## ✅ 終わりました（返事不要）｜11-26 15:10

下見：できる（壁：台帳の未了が 16 行ある（前の枠の済み具合））
枠 三百五十五の結果。①見本の起こし方：VAIO の beats-check.js（2分おき）が公開の版（koushu-handan の ver.txt）と見本の版（senko/advice-sample.md の「版：」）を比べ、食い違いが2分続いたら koushu-state の advice-sample.yml を直に起こす（版ごとに一度だけ）。②GitHub の schedule は控えとして残し、分を 00・15・30・45 からずらして 7・22・37・52 にした。③脈の見方：時刻（最後に動いた刻）でなく、公開の版と見本の版が違うまま30分続いた時だけ脈（beats.json の advice-sync・見込み30分）として赤と ntfy を一度出す。版が同じなら出さない（advice-cron は見込みを持たない形に替えた）。④VAIO の写しの「雲の走りの様子」に koushu-state の走り（直近5本）も足した（次に写しを作る時から載る）。⑤v1539 の見本：手で起こして作った（公開 senko/advice-sample.md の版：1539）。比べ（senko/advice-diff.md）は前の版 1537 と 0／30（1538・1539 はエラーを送る仕掛けだけで、助言の文は変わっていないので正しい）。
直し方の読み替え：センコの案①は post-publish.yml から直に起こすものだったが、koushu-handan の走りには koushu-state の走りを起こせる鍵が無く（鍵を足すのは広い許しになる）、VAIO（gh の権限がある）から起こす形にした。VAIO が止まっていれば schedule の控えが動く。
未確認：次の版が上がった時に、VAIO が2分＋掃除の間で直に起こす見え方（今回は手で起こした一本と VAIO が起こした一本が重なり、後の一本は同じ版を作り直しただけ）／schedule の遅れ・落ちを避けられたか。

## ✅ 終わりました（返事不要）｜11-26 15:10

枠 三百五十七の結果。雲待ちが探す commit の取り違えを直した：koushu-handan の先頭は bot（post-publish-bot の「版 1539・ok」の commit など）が押すことがあり、bot の push からは走りが起きないので、その sha で state-deploy.yml を探すと見つからない（14:50 の雲待ち y1126-1450 がこれだった）。kumo-set.ps1 は、waiting で渡された sha が bot の commit（author 名が -bot で終わる）なら、その手前の bot でない最新の commit（自分の押し）に替えて待ち、台帳の記録（kumo-wait.log）に替えた旨を書く（koushu-handan の置き場の check.yml・job.yml・state-deploy.yml の時だけ）。v272 の公開：公開 panel-ver.txt は 272（panel.html に予定%の元の字）で、公開されていた（その後 v273 が配信中）。次の雲待ちは自分の押し（3bdcb4da1）の sha で登録し、runid が拾えた。公開の仕組みと post-publish の中身は変えていない。
未確認：bot の commit を渡した時に自分の押しへ替わる所を、本物の雲待ちでは通していない（作者名の見分けと、構文検査・手元の git の読み出しだけ確かめた）。
