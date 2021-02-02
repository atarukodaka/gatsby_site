---
title: 開発環境のセットアップ
category: software
date: 2014/11/01
---

## 仮想OSのインストール

http://dotinstall.com/lessons/basic_local_development_v2/24803 を参考に。

### VirtualBox, Vigrant

VirtualBox と Vigrant をwindows上にインストール。

- virtualbox: https://www.virtualbox.org/wiki/Downloads
- vigrant: http://www.vagrantup.com/downloads.html

box を持ってきて加える：

centos6.4:

```
% vagrant box add centos64box http://developer.nrel.gov/downloads/vagrant-boxes/CentOS-6.4-x86_64-v20131103.box
% vagrant init centos64box
```

centos6.5:


```
% vagrant box add centos65box https://github.com/2creatives/vagrant-centos/releases/download/v6.5.3/centos65-x86_64-20140116.box
% vagrant init centos65box
```

vi Vagrantfile で private_network 部分のコメントアウトを外す

``` 
  # Create a private network, which allows host-only access to the machine
  # using a specific IP.
   config.vm.network "private_network", ip: "192.168.33.10"
```

そして up, ssh

``` 
% vagrant up （時間かかる）
% vagrant ssh
```

ホスト側から % ssh vagrant@193.168.33.10 を確かめる

## 開発環境
*** 最新にアップデート

```
% sudo yum update -y （時間かかる）
...
% suco echo "options single-request-reopen" >> /etc/resolv.conf
% sudo service iptables stop
% sudo chkconfig iptables off
```

### ssh
``` 
% ssh-keygen -t rsa
% eval `ssh-agent`
% ssh-add ~/.ssh/id_rsa
```

### init files

``` 
git init
git remote add origin git@github.com:atarukodaka/dotfiles.git
git fetch origin
git merge origin/master
```

### ruby のインストール
rbenv でruby のヴァージョンを切り替える

先にopenssl を入れておく。

``` 
% sudo yum -y install openssl-devel
```


https://github.com/sstephenson/rbenv にあるとおりやる。


``` 
% git clone https://github.com/sstephenson/rbenv.git ~/.rbenv
% echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bash_profile
% echo 'eval "$(rbenv init -)"' >> ~/.bash_profile
open new terminal
% rbenv

% git clone https://github.com/sstephenson/ruby-build.git ~/.rbenv/plugins/ruby-build
% rbenv install 2.1.4
% rbenv rehash
% rbenv global 2.1.4
% rbenv versions
```

% sudo yum install ruby-devel もしておく。

## その他開発環境のセットアップ

### yum install 

- git
- tree
- wget
- curl
- ruby-devel

### gems

gem install bundle

### heroku

https://toolbelt.heroku.com/ より "standalone"でインストール。
'readline' がないとか言われた場合は、
gem install rb-readline
する。

### timezone の設定
``` 
sudo cp -p  /usr/share/zoneinfo/Japan /etc/localtime
```

## 共有フォルダ

hostで Vagrantfile があるディレクトリ（~/vagrant/centos64とする）が仮想側の /vagrant と共有されるので、
元ソースを host:~/vagrant/centos64/source におき、guest:~/ で

``` 
% cd ~/; ln -s /vagrant/source .
```

とすると、host 側の ~/vagrant/centos64/source/*を emacs で編集しつつ guest 側の ~/source で参照することができる。



