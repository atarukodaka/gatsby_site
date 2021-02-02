---
title: さくらVPS開発環境設定
date: 2017-4-19

---

## 基本設定
まず update しとく。

```
$ yum update
```

ユーザアカウントを作り wheel に加える

```
$ useradd guest
$ passwd guest
password: xxxx
$ usermod -G wheel guest
$ visudo
...
 ## Allows people in group wheel to run all commands
%wheel  ALL=(ALL)       ALL   （コメントアウト）
```

### 秘密鍵・公開鍵

```
$ exit
% mkdir ~/.ssh
```

ローカル：

```
% ssh guest@x.x.x.x
% ssh-keygen -t rsa -v
% cd .ssh
% chmod 600 id_rsa.pub
% scp id_rsa.pub guest@x.x.x.x:~/.ssh/authorized_keys
```

## SSH
ポート番号変更、ルートログインの禁止、パスワードログインの禁止：

```
$ vi /etc/ssh/sshd_config
Port xxxx    (22 以外に変える）
PermitRootLogin no
...
PasswordAuthentication no
...
PermitRootLogin no
...
ClientAlive... 60      （切断防止）
ClientAliveCount 3
$ service sshd restart
```

## Firewall
```
$ cd /etc/sysconfig
$ vp iptables iptables.orig
$ vi iptables
*filter
:INPUT    DROP    [0:0]
:FORWARD  DROP    [0:0]
:OUTPUT   ACCEPT  [0:0]
:SERVICES -       [0:0]
-A INPUT -i lo -j ACCEPT
-A INPUT -p icmp --icmp-type echo-request -m limit --limit 1/s --limit-burst 4  -j ACCEPT
-A INPUT -p tcp -m state --state ESTABLISHED,RELATED -j ACCEPT
-A INPUT -p tcp -m state --state NEW -j SERVICES
-A INPUT -p udp --sport 53 -j ACCEPT
-A INPUT -p udp --sport 123 --dport 123 -j ACCEPT
-A SERVICES -p tcp --dport xxxx -j ACCEPT  （SSH のPort番号）
-A SERVICES -p tcp --dport 80 -j ACCEPT
-A SERVICES -p tcp --dport 443 -j ACCEPT
COMMIT
$ service iptables restart
...[OK]
$ iptables -L
```

## インストール等
あとは 開発環境のセットアップ - Ataru Kodaka Site とほぼ同じ。

## Git repository
foo.git というレポジトリを作る。

```
% pwd
/home/guest
% mkdir -p git/foo.git
% cd git/foo.git
% git --bare init --share
```

ローカルから ssh で接続

```
% pwd
/home/you/foo
% git remote add sakura ssh://guest@xxxx.vs.sakura.ne.jp:22/home/guest/git/foo.git
% git remote -v
sakura  ssh://guest@xxxx.vs.sakura.ne.jp:22/home/guest/git/foo.git (fetch)
sakura  ssh://guest@xxxx.vs.sakura.ne.jp:22/home/guest/git/foo.git (push)
% git push sakura master
....
```

## 参考サイト
- さくらのVPS入門 (全21回) - プログラミングならドットインストール
