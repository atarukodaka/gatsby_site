---
title: WSL - Windows Subsytem Linux 開発環境
category: software
date: 2019/2/25
---

## WSL を有効化する
（省略）


## アップデート、必要ツールのインストール
```
% sudo apt update
% sudo apt upgrade
% sudo apt install make tree wget curl python emacs
```

python, emacs は使わなければ不要。

### ssh
```
ssh-keygen -t rsa
eval `ssh-agent`
ssh-add ~/.ssh/id_rsa
```

github のサイトで id_rsa.pub を登録。

### init files
```
git clone git@github.com:atarukodaka/dotfiles.git
cd dotfiles
make
```

### ruby のインストール
```
sudo apt install autoconf bison build-essential libssl-dev libyaml-dev libreadline6-dev zlib1g-dev libncurses5-dev libffi-dev libgdbm5 libgdbm-dev
git clone https://github.com/sstephenson/rbenv.git ~/.rbenv
git clone https://github.com/sstephenson/ruby-build.git ~/.rbenv/plugins/ruby-build
rbenv install 2.4.5
rbenv rehash
rbenv global 2.4.5
rbenv versions
gem install bundle
```

## 共有フォルダ
```
mkdir /mnt/c/Users/foo/shared
ln -s /mnt/c/Users/foo/shared ~/
cd ~/shared
git clone git@github.com:atarukodaka/ak-site.git
git clone git@github.com:atarukodaka/fisk8_result_viewer.git
git config --global core.filemode false
(see https://www.clear-code.com/blog/2017/11/8.html)
```

## atom
### 真ん中の罫線を消す
File - Config - Package: Wrap Guide - disabled

### emacs風キーバインド
File - Config - Install:

- https://atom.io/packages/atomic-emacs
- https://atom.io/packages/emacs-plus

## DB

### postgresql
```
sudo apt install postgresql libpq-dev
```

### sqlite
```
sudo apt install sqlite libsqlite3-dev
```
