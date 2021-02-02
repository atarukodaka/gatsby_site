---
title: vagrant で Ubuntu/GNOME
date: 2017-10-09

---

## Vagrant ファイルの設定
```sh
vagrant init ubuntu/trusty64
vi Vagrant
_comment out edit vb.guitrue, vb.memory=10240_
vagrant up
vagrant ssh
```

## GNOME のインストール
```sh
sudo apt-get install ubuntu-gnome-desktop
```
### UI をクラシックに戻す
Ubuntu 12.04のUIをGNOME Classicへ変更する: 黄昏てなんかいられない http://kronus9.sblo.jp/article/60175944.html

```sh
sudo apt-get install gnome-panel
sudo apt-get install gnome-tweak-tool
```

再起動して System Tools - Tweek Tools からホーム、ゴミ箱などをチェック


### ロックをかけない
設定-Brightness & Lock

## dotfiles
github にSSH公開鍵登録

```sh
sudo apt-get install git
git init
git remote add origin git@github.com:atarukodaka/vagrant_dotfiles.git
git fetch origin
git merge origin/master
```


## emacs/mozc のインストール
Ubuntu Gnome 15.04の日本語入力設定(mozc) - Desktop Linux のススメ http://desktop-linux.namakemono345.com/mozc-ubuntu-gnome-15-04/

```sh
sudo apt-get install emacs
sudo apt-get install emacs-mozc
```

```elisp
vi ~/.emacs.d/init.el
(require 'mozc)
(set-language-environment "japanese")
(setq default-input-method "japanese-mozc")

(global-set-key (kbd "<zenkaku-hankaku>") 'toggle-input-method)

(add-hook 'mozc-mode-hook
(lambda()
(define-key mozc-mode-map (kbd "<zenkaku-hankaku>") 'toggle-input-method)))
```

## チューンアップ
Vagrant + VirtualBox で CPU コアを2つ以上割り当てると遅い - Qiita https://qiita.com/d_nishiyama85/items/c50c95795865ae7f714b
