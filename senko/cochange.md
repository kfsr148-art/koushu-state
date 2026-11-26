# 一緒に変わる組（センコ用・数えて知らせるだけ）

書いた刻：2026-11-27 02:00（日本時間）
見る範囲：直近90日の commit 397 件・ファイル 16 本
読み方：「A を直した commit の何割で B も直されたか」。5回以上直された A で7割以上の組だけ並べる。

## いつも一緒に変わる組（A→B・割合・A の直しの数）

- panel-ver.txt → panel.html｜100%（202／202）
- serifu-adv.txt → serifu.txt｜100%（92／92）
- serifu.txt → serifu-adv.txt｜100%（92／92）
- panel-core.js → panel-ver.txt｜100%（68／68）
- panel-core.js → panel.html｜100%（68／68）
- ver.txt → koushu-handan.html｜98%（117／119）
- serifu-adv.txt → koushu-handan.html｜98%（90／92）
- serifu.txt → koushu-handan.html｜98%（90／92）
- serifu-adv.txt → ver.txt｜97%（89／92）
- serifu.txt → ver.txt｜97%（89／92）
- panel.html → panel-ver.txt｜96%（202／210）
- koushu-handan.html → ver.txt｜96%（117／122）
- panel-view.js → panel-check.js｜94%（31／33）
- panel-view.js → panel-ver.txt｜94%（31／33）
- panel-view.js → panel.html｜94%（31／33）
- advice-tone-core.js → koushu-handan.html｜88%（35／40）
- panel-check.js → panel.html｜85%（110／129）
- panel-check.js → panel-ver.txt｜84%（109／129）
- voice-used.txt → voice-advice-dial.json｜81%（17／21）
- advice-tone-core.js → serifu-adv.txt｜80%（32／40）
- advice-tone-core.js → serifu.txt｜80%（32／40）
- panel-core.js → panel-check.js｜79%（54／68）
- advice-tone-core.js → ver.txt｜78%（31／40）
- ver.txt → serifu-adv.txt｜75%（89／119）
- ver.txt → serifu.txt｜75%（89／119）
- koushu-handan.html → serifu-adv.txt｜74%（90／122）
- koushu-handan.html → serifu.txt｜74%（90／122）
- panel-view.js → panel-core.js｜73%（24／33）

## 直近3日の直しで、片方だけ変わった物（A→B が8割以上の組で、A だけ変わった commit）

- 11/26 23:08 d0c1c5bad panel-check：v277 の置き場の検査を改行が LF でも合う形に（雲の取り出しは LF・枠 三百七十五）｜panel-check.js は変わったが panel.html は変わっていない（いつもは 85% で一緒）
- 11/26 23:08 d0c1c5bad panel-check：v277 の置き場の検査を改行が LF でも合う形に（雲の取り出しは LF・枠 三百七十五）｜panel-check.js は変わったが panel-ver.txt は変わっていない（いつもは 84% で一緒）
- 11/26 15:28 ab63d98d0 panel-check.js：脈の赤い行・鳴った！釦（v268）と拾われなかったエラーの送り（v269）の検査を足す（項目 195→197）（枠 三百五十九）｜panel-check.js は変わったが panel.html は変わっていない（いつもは 85% で一緒）
- 11/26 15:28 ab63d98d0 panel-check.js：脈の赤い行・鳴った！釦（v268）と拾われなかったエラーの送り（v269）の検査を足す（項目 195→197）（枠 三百五十九）｜panel-check.js は変わったが panel-ver.txt は変わっていない（いつもは 84% で一緒）
- 11/26 04:48 a06717772 本体と助言の核を v1536 に戻す（雲の数え上げの枝の押し戻しで作りかけが main に入ったため・検査 ADV_TEXT の食い違いで配信が止まっていた）｜koushu-handan.html は変わったが ver.txt は変わっていない（いつもは 96% で一緒）
- 11/26 04:48 a06717772 本体と助言の核を v1536 に戻す（雲の数え上げの枝の押し戻しで作りかけが main に入ったため・検査 ADV_TEXT の食い違いで配信が止まっていた）｜advice-tone-core.js は変わったが serifu-adv.txt は変わっていない（いつもは 80% で一緒）
- 11/26 04:48 a06717772 本体と助言の核を v1536 に戻す（雲の数え上げの枝の押し戻しで作りかけが main に入ったため・検査 ADV_TEXT の食い違いで配信が止まっていた）｜advice-tone-core.js は変わったが serifu.txt は変わっていない（いつもは 80% で一緒）
- 11/26 04:18 272e25586 advscan: 通し読みの数え上げ 2回目（前の切れ端を除く・枝）｜koushu-handan.html は変わったが ver.txt は変わっていない（いつもは 96% で一緒）
- 11/26 04:18 272e25586 advscan: 通し読みの数え上げ 2回目（前の切れ端を除く・枝）｜advice-tone-core.js は変わったが serifu-adv.txt は変わっていない（いつもは 80% で一緒）
- 11/26 04:18 272e25586 advscan: 通し読みの数え上げ 2回目（前の切れ端を除く・枝）｜advice-tone-core.js は変わったが serifu.txt は変わっていない（いつもは 80% で一緒）
- 11/26 03:14 15650e053 advscan: 助言の通し読みの数え上げ（枝・本流に入れない）｜koushu-handan.html は変わったが ver.txt は変わっていない（いつもは 96% で一緒）
- 11/26 03:14 15650e053 advscan: 助言の通し読みの数え上げ（枝・本流に入れない）｜advice-tone-core.js は変わったが serifu-adv.txt は変わっていない（いつもは 80% で一緒）
- 11/26 03:14 15650e053 advscan: 助言の通し読みの数え上げ（枝・本流に入れない）｜advice-tone-core.js は変わったが serifu.txt は変わっていない（いつもは 80% で一緒）
- 11/25 04:38 2ae1daaa2 panel v257：遠隔の下の行を詰めて決め打ちの高さに収める（検査の直し・枠 二百八十八）｜panel.html は変わったが panel-ver.txt は変わっていない（いつもは 96% で一緒）
- 11/25 00:24 944d0d07f panel-check：題の字を消した後の測り直し（猫で見る）・⑯の二の記録を新しく（公開が止まっていた分・枠 二百八十二）｜panel-check.js は変わったが panel.html は変わっていない（いつもは 85% で一緒）
- 11/25 00:24 944d0d07f panel-check：題の字を消した後の測り直し（猫で見る）・⑯の二の記録を新しく（公開が止まっていた分・枠 二百八十二）｜panel-check.js は変わったが panel-ver.txt は変わっていない（いつもは 84% で一緒）
- 11/24 22:52 2cee0d681 panel-check：時刻（Date.now）から作る「あと N分」「見込みを過ぎた N分」の窓を広げて、時刻のずれで落ちないようにする（枠 二百六十三）｜panel-check.js は変わったが panel.html は変わっていない（いつもは 85% で一緒）
- 11/24 22:52 2cee0d681 panel-check：時刻（Date.now）から作る「あと N分」「見込みを過ぎた N分」の窓を広げて、時刻のずれで落ちないようにする（枠 二百六十三）｜panel-check.js は変わったが panel-ver.txt は変わっていない（いつもは 84% で一緒）
- 11/24 15:19 58e45565f panel v246：棚の各件を似た仕事の実測で（0.1%・手書きには印）・1セッション≒棚は窓・雲・棚の実測の組から（枠 二百四十八・二百四十九）｜panel-view.js は変わったが panel-check.js は変わっていない（いつもは 94% で一緒）
