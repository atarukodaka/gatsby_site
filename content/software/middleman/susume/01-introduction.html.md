---
title: イントロダクション
date: 2015-3-17

---

## middleman とは
Middleman: 作業を効率化するフロントエンド開発ツール

静的サイトを構築するフレームワーク。静的ファイルファイルジェネレーターやブログツールとしても使える。

markdown や erb で元ファイルをつらつら書いてコマンド一発で html 郡が出力でき、 お手軽にサイトやブログを運営することができる。

似たようなのに Jekyll があるが、後述のとおり自由度的には middleman が上回る。

参考サイト：

- 静的サイト開発にmiddlemanを使う - ワシはワシが育てる
- middleman-blogをgithubでホストする

### いいところ

ruby で完結

すべて本体、エクステンション・ヘルパー（プラグインみたいなもん）はすべて ruby で書かれてるため、 いろいろなんでも出来る。 helper でお手軽によく使う関数を作れたり、 extension で結構込み入ったこともできるし、 その気になれば本体から fork すればいい。 ベースとなるフレームワークもsintra/padrino なので、理解しやすい。
同じようなツールとしてjekyll があるが、 これは本体は ruby だけど、プラグインは Liquid なので自由度が欠ける。 github 上で jekyll が動くとはいえ自作プラグインはダメだし。

慣れたエディタとコンソールで完結

emacsで書いてmake一発でファイル生成とアップロードが完了。ウェブでせこせこやらんでもいい。
データの保持
基本手元に元データファイルはあるが、 html 郡をアップロードするついでに、元ファイルも github に上げておくとバックアップにもなる。 世のブログサービスのように移管するときに困らずによい。

### 悪いところ

名前、初期デザインがイマイチ

middleman って中間男？ 初期ファイルでのデザインがいまいち。アニメロゴなどいらん。 これで一体何ができるのかイメージがわかない。

情報が少ない

ググってもあまりない。まだ Jekyll のほうが多いかな。

知識が必要

unix系、rubyの知識がある程度は必要。 ruby でいじくれるといっても使えなきゃ意味がない。 敷居は高め。

## インストールと起動
とりあえず準備から外部サーバーに公開するまで。 作法に則って、–template で作りやり方でいきます。

### インストール

まず middleman 自体のインストールをし、あたし作のテンプレートを落としてきます：

```sh
% gem install middleman
% git clone git@github.com:atarukodaka/middleman-template-aks.git ~/.middleman/template-aks
```

その後、「プロジェクト」、つまり開設するサイトなりブログなり用の一式ファイル群を作ります。 ここでは “site” としておきます：

```sh
% pwd
/home/foo
% middleman init site --template template-aks && cd site
```

これで site/ 以下に一式作られました。

### ファイル群の作成

middleman の build コマンドを使います。

```
% bundle exec middleman build
```

そうすると、source/* のファイルがいろいろと加工されて build/ 以下に出力されます。 build/index.html などを覗いてみるといいかもしれません。

ちなみに “bundle exec middleman” はよく使うので、alias に加えておくと便利です。

```sh
alias ru="rackup"
alias be="bundle exec"
alias mm="bundle exec middleman"
```

### ローカルサーバーの立ち上げ

とはいえ生 html は読みにくいので、 middleman server コマンドを使ってローカルサーバーを立ち上げます。

```
% bundle exec middleman server
```

すると http://localhost:4567 にこんな感じで：

Sample image

テンプレートではlivereload を入れているので、サーバーを background で立ち上げたままにしておいても、元ファイルを変更すればサーバー上で生成しなおしてくれます。

ただし vagrant では middleman server に –force-polling オプションを付けてあげないと うまく変更を検知してくれないことがあるので、つけたほうがよいでしょう。

ちなみにローカルサーバーで稼働させるだけなら build する必要はありません（データはサーバーが保持）。

### 外部サーバーへのアップロード

build/ 以下のファイル群をftp で geocities （死語）に上げるなりしてもいいのですが、 ここは github にあげます。

まず、github のアカウントを取得し、サイト公開用のレポジトリを作成してください（ここでは “site” とする）。

```sh
% pwd
/home/foo/site
% git remote set-url origin git@github.com:your-github-acct/site.git
% ASSET_HOST=/site bundle exec middleman deploy -b
（github のパスワードを聞かれたら入力）
```

上述の Makefile では make deploy 一発でできるようにしてあります。 毎回パスワードを打ち込むのが面倒なら、 あらかじめ

```
% eval `ssh-agent`; ssh-add ~/.ssh/id_rsa
```

としてパスワードを入れておけばよいかと。

これで、"http://your-github-acct.github.io//site" で参照できます。
