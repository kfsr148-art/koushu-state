枠: 試し（雲から koushu-handan へ押せるか・使い捨ての枝）
本人の決め（枠 二百二十二）：雲の走りが koushu-handan へ押せるかの試しです。main には触りません。
一、./handan で、枝 cloud-push-test-<日付と時刻> を作り、reports/cloud-push-test.txt（中身は日時とこの枠の名を一行）を一つ足して commit し、その枝だけを origin へ push する。
二、push が成功したら、その枝を origin から消す（git push origin --delete <枝>）。
三、札に、押せたか・消せたか、枝の名、押した commit の sha、消した結果を書く。main には触らない。鍵は札にもログにも出さない。
