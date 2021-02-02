---
title: Sinatra tips
category: software
date: 2014/11/03
---

## sinatra を外部から叩く

development だと local しか listen しないので、production にする：
http://qiita.com/u1_fukui/items/b86b21f6ed39f4c10d5d

set :environment, :production

か

set :bind, '0.0.0.0'

をコードに入れる。

## ウェブサーバーの立ち上げ
```
% sudo yum install httpd -y
% sudo yum service httpd start
% sud yum chkconfig httpd on
```

ホスト側から http://193.168.33.10/ を確認

