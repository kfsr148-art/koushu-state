枠: v1522 を本体へ戻す（雲から本体を変えて押す本番の一本目・二回目）
この枠は main へ押してよい（本人の決め・枠 二百二十四。この枠だけ）。
前回（走り 45200436783）は、検査④（check-all --fast の check.js ④『本体が使う声が公開の荷の台帳に無い』18本＝advx-<人格>-advd-w-chi-n／-t／-f）が落ちて、押さずに止まった。原因：voice-advice.txt（部品の声の台本）が、v1522 で足した部品の名（advd-w-chi-n／-t／-f と advx-<人格>-…）を持っていなかった＝voice-advice-catalog.js から作り直していない。
元：koushu-handan の main は今 commit 095579111 で、v1522 を棚へ戻した（枝 shelf-4-v1522 に残っている・先頭 72aa4bf）。
やる事：
一、./handan で、main の commit 095579111 を revert して v1522 を戻す（git revert --no-edit 095579111）。
二、voice-advice.txt を作り直す：./handan で `node voice-advice-catalog.js > /dev/null`（voice-advice.txt を書き直す。標準出力の表は本体へ入れない＝捨てる）。続けて `node pack-site.js --make-manifest`、`node pack-site.js --verify`。voice-advice.txt と voice-used.txt が変わった分を commit に含める（koushu-handan.html など本体は触らない）。
三、版の三箇所（koushu-handan.html の data-ver・verTag の div・ver.txt）が 1522 で揃っているか確かめる。
四、検査：①koushu-handan.html の <script> 塊を一時 .js に切り出して node --check ②node serifu-extract.js --check ③node pack-site.js --verify ④node check-all --fast（google-chrome が使える。落ちたら原因を札に書き、押さない）。全部通った時だけ main へ押す。
五、案の物の照合：reports/y1123-2155-shape-aite-result.md の助言の文案の字（例：『同じ色が7枚あっても、染めには寄せない』『対子が増えても、七対子には寄せない』『刻子と対子が多くても、対々には寄せない』）が、koushu-handan.html・serifu.txt・serifu-adv.txt・panel.html に入っていないかを grep で確かめる（入っていたら押さない）。
六、押したら、押した commit の sha・版（三箇所）・検査ごとの結果を札に書く。鍵は札にもログにも出さない。
