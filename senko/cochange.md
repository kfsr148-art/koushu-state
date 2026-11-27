# 一緒に変わる組（センコ用・数えて知らせるだけ）

書いた刻：2026-11-28 01:45（日本時間）
見る範囲：直近90日の commit 404 件・ファイル 16 本
読み方：「A を直した commit の何割で B も直されたか」。5回以上直された A で7割以上の組だけ並べる。

## いつも一緒に変わる組（A→B・割合・A の直しの数）

- panel-ver.txt → panel.html｜100%（200／200）
- serifu-adv.txt → serifu.txt｜100%（101／101）
- serifu.txt → serifu-adv.txt｜100%（101／101）
- panel-core.js → panel-ver.txt｜100%（75／75）
- panel-core.js → panel.html｜100%（75／75）
- ver.txt → koushu-handan.html｜98%（126／128）
- serifu-adv.txt → koushu-handan.html｜98%（99／101）
- serifu.txt → koushu-handan.html｜98%（99／101）
- serifu-adv.txt → ver.txt｜97%（98／101）
- serifu.txt → ver.txt｜97%（98／101）
- koushu-handan.html → ver.txt｜96%（126／131）
- panel.html → panel-ver.txt｜96%（200／209）
- panel-view.js → panel-check.js｜94%（32／34）
- panel-view.js → panel-ver.txt｜94%（32／34）
- panel-view.js → panel.html｜94%（32／34）
- advice-tone-core.js → koushu-handan.html｜87%（40／46）
- panel-check.js → panel.html｜86%（118／137）
- panel-check.js → panel-ver.txt｜85%（116／137）
- voice-used.txt → voice-advice-dial.json｜82%（18／22）
- panel-core.js → panel-check.js｜81%（61／75）
- advice-tone-core.js → serifu-adv.txt｜80%（37／46）
- advice-tone-core.js → serifu.txt｜80%（37／46）
- advice-tone-core.js → ver.txt｜78%（36／46）
- ver.txt → serifu-adv.txt｜77%（98／128）
- ver.txt → serifu.txt｜77%（98／128）
- koushu-handan.html → serifu-adv.txt｜76%（99／131）
- koushu-handan.html → serifu.txt｜76%（99／131）
- panel-view.js → panel-core.js｜74%（25／34）

## 直近3日の直しで、片方だけ変わった物（A→B が8割以上の組で、A だけ変わった commit）

- 11/27 17:41 37e7bc74c v1552：核と本体の写しを一致させる（commit していなかった lastConn の4行を v1552 に混ぜていたので、公開の本体と同じ形へ戻す・枠 四百四）｜advice-tone-core.js は変わったが koushu-handan.html は変わっていない（いつもは 87% で一緒）
- 11/27 17:41 37e7bc74c v1552：核と本体の写しを一致させる（commit していなかった lastConn の4行を v1552 に混ぜていたので、公開の本体と同じ形へ戻す・枠 四百四）｜advice-tone-core.js は変わったが serifu-adv.txt は変わっていない（いつもは 80% で一緒）
- 11/27 17:41 37e7bc74c v1552：核と本体の写しを一致させる（commit していなかった lastConn の4行を v1552 に混ぜていたので、公開の本体と同じ形へ戻す・枠 四百四）｜advice-tone-core.js は変わったが serifu.txt は変わっていない（いつもは 80% で一緒）
- 11/27 05:59 3800ff2e5 panel v278：題の行の高さを150pxに固定して下の釦が動かないようにした（雲の ⑤の二十六の二）｜panel.html は変わったが panel-ver.txt は変わっていない（いつもは 96% で一緒）
- 11/27 05:59 3800ff2e5 panel v278：題の行の高さを150pxに固定して下の釦が動かないようにした（雲の ⑤の二十六の二）｜panel-check.js は変わったが panel-ver.txt は変わっていない（いつもは 85% で一緒）
- 11/26 23:08 d0c1c5bad panel-check：v277 の置き場の検査を改行が LF でも合う形に（雲の取り出しは LF・枠 三百七十五）｜panel-check.js は変わったが panel.html は変わっていない（いつもは 86% で一緒）
- 11/26 23:08 d0c1c5bad panel-check：v277 の置き場の検査を改行が LF でも合う形に（雲の取り出しは LF・枠 三百七十五）｜panel-check.js は変わったが panel-ver.txt は変わっていない（いつもは 85% で一緒）
- 11/26 15:28 ab63d98d0 panel-check.js：脈の赤い行・鳴った！釦（v268）と拾われなかったエラーの送り（v269）の検査を足す（項目 195→197）（枠 三百五十九）｜panel-check.js は変わったが panel.html は変わっていない（いつもは 86% で一緒）
- 11/26 15:28 ab63d98d0 panel-check.js：脈の赤い行・鳴った！釦（v268）と拾われなかったエラーの送り（v269）の検査を足す（項目 195→197）（枠 三百五十九）｜panel-check.js は変わったが panel-ver.txt は変わっていない（いつもは 85% で一緒）
- 11/26 14:17 9becd4b48 v1539・panel v271：エラーを送る仕掛けは https の公開ページだけで送る（file:// の検査・手元の確かめからは送らない）・パネルの版の字を verTag か｜panel-core.js は変わったが panel-check.js は変わっていない（いつもは 81% で一緒）
- 11/26 14:10 4a4ef107f panel v270：橋の札の数とまとめて写すの数が合わない時、赤い行に一言出す（beats.json の relay・枠 三百五十三）｜panel-core.js は変わったが panel-check.js は変わっていない（いつもは 81% で一緒）
- 11/26 13:49 4d999f6ad v1538・panel v269：拾われなかったエラー（error・unhandledrejection・読み込み失敗）を版・画面の名・文と場所だけ、センコ用の別の話題へ send｜panel-core.js は変わったが panel-check.js は変わっていない（いつもは 81% で一緒）
- 11/26 13:01 59fe6690a panel v268：脈（senko/beats.json）が遅れた仕組みを赤い一行で出す・月一の知らせの試しの『鳴った！（試し）』釦（押すと beat-ack を ntfy へ）｜panel-core.js は変わったが panel-check.js は変わっていない（いつもは 81% で一緒）
- 11/26 04:48 a06717772 本体と助言の核を v1536 に戻す（雲の数え上げの枝の押し戻しで作りかけが main に入ったため・検査 ADV_TEXT の食い違いで配信が止まっていた）｜koushu-handan.html は変わったが ver.txt は変わっていない（いつもは 96% で一緒）
- 11/26 04:48 a06717772 本体と助言の核を v1536 に戻す（雲の数え上げの枝の押し戻しで作りかけが main に入ったため・検査 ADV_TEXT の食い違いで配信が止まっていた）｜advice-tone-core.js は変わったが serifu-adv.txt は変わっていない（いつもは 80% で一緒）
- 11/26 04:48 a06717772 本体と助言の核を v1536 に戻す（雲の数え上げの枝の押し戻しで作りかけが main に入ったため・検査 ADV_TEXT の食い違いで配信が止まっていた）｜advice-tone-core.js は変わったが serifu.txt は変わっていない（いつもは 80% で一緒）
- 11/26 04:18 272e25586 advscan: 通し読みの数え上げ 2回目（前の切れ端を除く・枝）｜koushu-handan.html は変わったが ver.txt は変わっていない（いつもは 96% で一緒）
- 11/26 04:18 272e25586 advscan: 通し読みの数え上げ 2回目（前の切れ端を除く・枝）｜advice-tone-core.js は変わったが serifu-adv.txt は変わっていない（いつもは 80% で一緒）
- 11/26 04:18 272e25586 advscan: 通し読みの数え上げ 2回目（前の切れ端を除く・枝）｜advice-tone-core.js は変わったが serifu.txt は変わっていない（いつもは 80% で一緒）
- 11/26 03:14 15650e053 advscan: 助言の通し読みの数え上げ（枝・本流に入れない）｜koushu-handan.html は変わったが ver.txt は変わっていない（いつもは 96% で一緒）
- 11/26 03:14 15650e053 advscan: 助言の通し読みの数え上げ（枝・本流に入れない）｜advice-tone-core.js は変わったが serifu-adv.txt は変わっていない（いつもは 80% で一緒）
- 11/26 03:14 15650e053 advscan: 助言の通し読みの数え上げ（枝・本流に入れない）｜advice-tone-core.js は変わったが serifu.txt は変わっていない（いつもは 80% で一緒）
- 11/25 22:33 ec9c2c983 panel v262：全部終わった待ちの猫は立っている現場猫でなく寝ている猫（cat-sleep）に替える・字は休憩中（枠 三百十五）｜panel-core.js は変わったが panel-check.js は変わっていない（いつもは 81% で一緒）
- 11/25 18:12 c8bdf7789 panel v260：ヨシ待ちの札の推しの釦を太枠・直しなら言葉を入れ欄へ（枠 三百六）｜panel-core.js は変わったが panel-check.js は変わっていない（いつもは 81% で一緒）
- 11/25 13:10 06d6302a2 panel v258：まとめて写すの数は state.json の panelView.left だけを出す（枠 二百九十八）｜panel-core.js は変わったが panel-check.js は変わっていない（いつもは 81% で一緒）
- 11/25 04:38 2ae1daaa2 panel v257：遠隔の下の行を詰めて決め打ちの高さに収める（検査の直し・枠 二百八十八）｜panel.html は変わったが panel-ver.txt は変わっていない（いつもは 96% で一緒）
