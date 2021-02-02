---
title: HEXO を vagrant 上で使ってみる
date: 2017-2-27
---

## HEXO

今まで middleman に手を加えてサイトを作ってたのですが、 ビルドが遅かったりなんで HEXO を試してみたら速いしよさげ。

## インストール

###環境

- CentOS6.4 on Vagrant

### nvmを入れる

```
$ curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.1/install.sh | bash
$ ~/.nvm/nvm.sh
$ nvm --version
0.33.1
```

### node.js を入れる

```
$ nvm install stable
```

### hexo を入れる

```
$ npm install hexo-cli -g
```

## プロジェクト
### 作成

共有フォルダ上で作業してる場合、 ふつーに作成するとinstallのとこでシンボリックリンクを貼ろうとしてエラーが出るので、 とりあぜずインストールをスキップしてプロジェクトを作成し、改めてシンボリックリンクを使わずにインストールする：

```
% hexo init proj --no-install
...
% cd proj
% npm install --no-bin-links
```

### 設定

```
$ vi _config.yml
title: サイトのタイトル
url: サイトのurl
title: :title.html  # 日付をつけないで、タイトル（フォルダ名含む）.html にする
```

##ポストの編集
```
% hexo new foo.md
```

で source/_posts/foo.md にフロントマターまで作ってくれる。あとは、

```
% hexo gen でビルド
% hexo server でサーバー起動
```

### github へデプロイ

user master にあげる場合：

```
$ vi _config.yml
deploy:
  type: github
  repo: git@github.com:<username>/<username>.github.io.git
  branch: master
```
project page github ブランチにあげる場合：

```
deploy:
  type: github
  repo: git@github.com:<username>/<projctname>.git
  branch: gh-pages
```

## カスタマイズ
### テーマ

https://hexo.io/themes/ で探してよさげなのを見つつ入れる。

### プラグイン

いろいろプラグインがあるみたい。

tag-twitter twitter のつぶやきを取り込む

Middleman からの移行

middleman の source/ 以下必要な記事ファイルを hexo の proj/source/_posts 以下にコピーしてきて、拡張子を .html.md から .mdに変える


```
$find . -type f -name "*.html.md" -print0 | while read -r -d '' file; do mv "$file" "${file%%.html.md}.md"; done
```

## 参考サイト
- Vagrant, nvm と Node.js をインストールする – Supertrue