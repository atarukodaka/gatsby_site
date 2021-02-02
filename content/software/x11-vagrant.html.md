---
title: X11 Forwarding を利用してリモートホストからローカルのXに表示させる
date: 2017-3-1
---

## 概要
大抵開発は vagrant上で出来るけど、ちょいと GUI 立ち上げたり 127.0.0.1:4321 をブラウザで確認したい時もあるので、X11 Forwarding でやってみる。

- ローカル上のターミナル：Cygwin64
- ローカル上のXサーバー：Xming
- リモート先：CentOS6.4 on Vagrant


### ローカル上のXサーバー：Xming

Cygwin/X でもいいんだけど、Xming で。

Xming X Server for Windows 日本語情報トップページ - OSDNから Xming-6-9-0-31-setup.exe と Xming-fonts-7-7-0-1-setup.exe をダウンロードしてインストール。

デフォルトだと文字が小さいので、ショートカットのリンク先に “ -dpi 100"を加えてサーバーを起動する。

### ローカルターミナル

PuTTY で X11 Forwarding をチェックして ssh でつないでもいいんだけど、 ここはローカルターミナルの cygwin から ssh でつなげる。

#### 環境変数 DISPLAY をセット

ローカルでDISPLAYをセットしておかないとうまくいかない模様。

```
$ vi ~/.bash_profile
...
export DISPLAY=localhost:0.0
$ source ~/.bash_profile
```

#### Vagrantfileに forward x11 のフラグを追加

```
$ mkdir -p vagrant/centos64
$ vi Vagrantfile
Vagrant.configure("2") do |config|
  ...
  config.ssh.forward_x11 = true
end
$ vagrant up
```

ssh vagrant@192.168.33.10 でもいけるように ~/.ssh/config にセット。

```
$ vagrant ssh-config --host 192.168.33.10 > ~/.ssh/config
```

### リモート側 centos (vagrant)

Xクライアントやブラウザ(firefox)を入れる

```
$ sudo yum -y groupinstall "X Window System" "Japanese Support" firefox
```

出力先優先度の変更：X11 から試すように：

```
$ sudo sed -i.bak -e "s/id:[0-6]:initdefault:/id:5:initdefault:/" /etc/inittab
$ logout
...
```

入り直して xeyes が ローカルのX の画面にでるか確認：

```
$ xeyes
```

## 参考サイト
- Vagrant の VM で GUI (X11) のアプリケーションを使う | CUBE SUGAR STORAGE



