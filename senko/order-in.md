枠: v1522 を本体へ戻す（雲から本体を変えて押す本番の一本目）
この枠は main へ押してよい（本人の決め・枠 二百二十四。この枠だけ）。
元：koushu-handan の main は今 commit 095579111 で、v1522（守りの対子の種・国士10種の助言・声206本）を棚へ戻した（枝 shelf-4-v1522 に残っている・先頭 72aa4bf）。
やる事：
一、./handan で、main の commit 095579111 を revert して v1522 を戻す（git revert --no-edit 095579111）。衝突したら枝 shelf-4-v1522（git fetch origin shelf-4-v1522）の内容に合わせる。
二、版の三箇所（koushu-handan.html の data-ver・verTag の div・ver.txt）が 1522 で揃っているか確かめる。
三、検査：①koushu-handan.html の <script> 塊を一時 .js に切り出して node --check ②node serifu-extract.js --check ③node pack-site.js --verify ④headless のブラウザ（google-chrome・chromium など）が使えるなら node check-all --fast（使えない・長すぎる時は、飛ばした物を札に書く）。通る物だけ main へ押す。通らなければ押さずに札に理由を書く。
四、案の物（reports/y1123-2155-shape-aite-result.md の助言の文案）が、画面に出る物（koushu-handan.html・serifu.txt・serifu-adv.txt・panel.html）に入っていないかを grep で確かめる（入っていたら押さない）。
五、押したら、押した commit の sha・版（三箇所）・検査ごとの結果を札に書く。鍵は札にもログにも出さない。
