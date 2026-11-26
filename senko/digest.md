# 窓の状態と、読み印より後の札（センコ用の一枚）

状態：検査中｜件名：仕上げ｜見込み：10分｜セッション 29%｜週 53%｜Fable 6%
受領：最後に受け取った枠 枠 三百五十一（11-26 13:02:44）／まだ受け取っていない枠：枠 三百五十二（鈴 13:29:53）
VAIOの写し：書いた刻 2026-11-26 13:30:32／番地 senko/vaio-snap.md／窓 idle:2026-11-26 13:02:44／今の段 —／落ちた走り 無し／空きメモリ 4130MB

書いた刻：2026-11-26 13:31:16／読み印：2026-11-26 13:00:55／札 3件（パネルの『まとめて写す』の残りと同じ数・読み印より後・新しい順）

## 📷 VAIOの写し｜11-26 13:30

書いた刻：2026-11-26 13:30:32
引き金：センコの頼み（snap-ask）
番地：https://kfsr148-art.github.io/koushu-state/vaio-snap.md（センコ用は senko/vaio-snap.md）

## 📷 VAIOの写し｜11-26 13:26

書いた刻：2026-11-26 13:25:50
引き金：センコの頼み（snap-ask）
番地：https://kfsr148-art.github.io/koushu-state/vaio-snap.md（センコ用は senko/vaio-snap.md）

## ✅ 終わりました（返事不要）｜11-26 13:22

枠 三百五十一（急ぎ）：雲待ちの印に runid が入らず 404 を繰り返し窓が起きない

完了: 枠 三百五十一（急ぎ）の結果。元は、雲待ちの印の workflow が koushu-state の advice-sample.yml だったのに、見張り（kumo-wait.ps1）が koushu-handan の番地だけで走りを訊いて 404 を繰り返していたこと（12:39〜13:02・y1126-1245／1300／1310。runid も空）。①kumo-set.ps1：台帳に置き場（-Repo owner/name・既定は koushu-handan）を足し、waiting を書く前に、置き場・workflow・コミットで絞った走りの一覧を引いて runid を拾えるまで（最大約60秒）待つ。拾えない時は runid を空のまま台帳を書かず、札（🪟 雲待ちに登録できません）を一通出して終了コード3で終わる。窓から直に呼ぶ時に無い Get-MailToken・Run-Quiet も、無い時だけ最小の物を置いた。②kumo-wait.ps1：走りを見る時は台帳の repo を見る（無ければ koushu-handan）。走りを見る例外が続く時は、404 を繰り返すだけで黙らず、同じ待ちで5回目（約15分）に札を一通だけ出す。③今の y1126-1320（panel v268 の配信・check.yml）は kumo-set を打ち直して runid=45752572225 が入った。試した事：拾える時は runid が入る／拾えない時（koushu-state の走りが無い作り値）は約63秒で拾えないと判り、台帳は変わらず札の呼びが一回出る。常駐（inbox-watch.ps1）は kumo-wait.ps1 の更新（13:06）より後の 13:10:28 に起こし直した。
未確認：実際に雲が終わった時に、数分以内に窓が起きること（今の y1126-1320 の終わりで確かめる）／koushu-state の workflow を待つ時は kumo-set に -Repo kfsr148-art/koushu-state を付ける（今の台帳は check.yml）。
ファイル: ~/.claude/kumo-set.ps1・kumo-wait.ps1
実測: 作り値：runid 拾える→入る／拾えない→63秒で台帳を書かず札の呼び一回・構文検査 errors 0・常駐 13:10:28 起こし直し
