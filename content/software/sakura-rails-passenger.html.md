---
title: さくらVPSで rails-passenger を動かす
date: 2017-5-13
---

## rails production
アセットのプリコンパイルと secret_key_base の設定をやっておく。

```
% export RACK_ENV=production
% be rails assets:precompile
% be rake secret
xxxx
% export SECRET_KEY_BASE=xxxx
% be rails -b 0.0.0.0 -p 3000
```

### passenger
必要なパッケージをインストール：

```
% sudo yum install libcurl-devel httpd-devel
```

Gemfile に追加し bundle

```
% vi
group :production do
  gem 'passenger'
end
% bundle
```

passenger をインストールし、出てきた表示を /etc/httpd/conf.d/passenger.confに追加し、VirtualHostの設定を追加。

```
% passenger-install-apache2-module
% sudo vim /etc/httpd/conf.d/passenger.conf
LoadModule passenger_module /home/guest/.rbenv/versions/2.2.6/lib/ruby/gems/2.2.0/gems/passenger-5.1.4/buildout/apache2/mod_passenger.so
<IfModule mod_passenger.c>
  PassengerRoot /home/guest/.rbenv/versions/2.2.6/lib/ruby/gems/2.2.0/gems/passenger-5.1.4
  PassengerDefaultRuby /home/guest/.rbenv/versions/2.2.6/bin/ruby
</IfModule>

<VirtualHost *:80>
  ServerName xxxx.vs.sakura.ne.jp
  RailsEnv production
  PassengerEnabled on
  DocumentRoot /var/www/html
  RailsBaseURI /railsApp
  SetEnv SECRET_KEY_BASE _your_secret_key_base_

  <Directory /var/www/html>
    AllowOverride all
    Options -MultiViews
  </Directory>
</VirtualHost>

PassengerResolveSymlinksInDocumentRoot on
```

/var/www/html 以下に railsApp/public からシンボリックリンクを張る

```
% sudo ln -s /home/guest/railsApp/public /var/www/html/railsApp
```

ユーザのホームに +x パーミッションを与えないと permission denied になる

```
% sudo chmod 0755 /home/guest
```

チェックして再起動

```
% sudo service httpd configtest
Syntax OK
$ sudo service httpd restart
Stopping httpd:                                            [  OK  ]
Starting httpd:                                            [  OK  ]
```

で、サイトにアクセスして確認

```
% curl xxx.vs.sakura.ne.jp/railsApp
```
