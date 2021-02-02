---
title: jekyll bootstrap + github pages でブログ運用
category: software
date: 2014/11/02
---

## 概要
ローカルで markdown ガリガリ書いてローカルで確認、サーバーへアップロードまで CUI でサクサクできるのでよいです。軽いし。

jekyll 単体だといろいろ面倒なので、ブログ作成支援や bootstrap を使ったレイアウトなどがついてる jekyll bootstrap を使います。
動作を理解するためには、まず jekyll 単体を触ってみたほうがいいかもですが。


## セットアップ
基本的には [Jekyll Quick Start | ruhoh universal static blog generator](http://jekyllbootstrap.com/usage/jekyll-quick-start.html)
に従えばいいのですが、一応ステップバイステップで。ローカルで動かす→サーバーで動かす、という順でいきます。

### ローカルにjeklly-bootstrap のインストール
まず jekyll を入れます：

~~~
% sudo gem install jekyll
~~~

次に jekyll-bootstrap。git clone でローカルに持ってきます。_username_ は自分のユーザ名に変えてください。

~~~
% git clone https://github.com/plusjade/jekyll-bootstrap.git _username_.github.io

~~~
そして、サーバー稼働：

~~~
% cd _username_.github.io
% jekyll serve
...
    Server address: http://0.0.0.0:4000/
  Server running... press ctrl-c to stop.
~~~
と出てくれば、 http://localhost:4000/ で動作が確認できます。そしたらgithub.io 上に持って行きましょう。

また、--port 3000　などとすればポートを指定できます。

### github.io 上へインストール
まず、https://github.com/new から "_username_.github.io" というレポジトリを作成します。"Initialize this repository with a README" はチェックしなくてもよい。

そうしたら、remote repository として github.io を指定し、push します。パスワードを聞かれるので入力すること。url として https://username:password@github.com.... とすると省略できますが、非推奨。

~~~
% git remote set-url origin  https://_username_@github.com/_username_/_username_.github.io.git
% git push origin master
Password:
~~~

http://_username_.github.io で動作確認します。


## 設定

_config.ymlで、author: 以下の name, email などを適宜設定。

markdown は redcarpet にしとくと吉

~~~yaml
title : A Sample Blog
author :
  name : Your Name
  email : your@mail.address.com
  github : username
  twitter : account_name

markdown: redcarpet
redcarpet:
  extensions: ["autolink"]
~~~

## 運用
運用形態としては、ローカルで *.md を編集→ ローカル上で確認→ サーバーへ push、という形になります。

## ページの編集
あまり変更のない固定ページ。直下にabout.md などを作ると、about.html に変換してくれます。


~~~
% rake page name="about"
~~~

name=以下を省略すると "new-page" となります。

YAMLヘッダで group: navigation と追加すると、ナビゲーションバーに入れてくれます。


~~~yaml
---
layout: page
title: "About"
description: ""
group: navigation
---
this is an about page.
~~~

### ポスト
ブログの記事を編集、追加します。

~~~
rake post title="test"
~~~
とすると "_posts/2014-11-01-test.md" が作られるので、これを編集します。
title=以下を省略すると "new-post" になります。

### ローカルで確認
 --watch オプションをつけると、ファイルを変更すると自動的に再生成してくれます。
また、vagrant などで外で編集すると変更を検知してくれないので、--force_polling をつけます。
ラグがあるときは、明示的に "jekyll build" してしまってもよい。

~~~
% jekyll serve --watch --force_polling
~~~

### サーバーへ push
ふつーに add, commit, push します：

~~~
% git add .
% git commit -m blog -a
% git push origin master
~~~

### makefile で簡略化
いろいろタイプするのが面倒なので、makefile を作っておくと楽です：

~~~makefile
build:
	jekyll build

cmt:
	git status
	git commit -m msg -a

push:
	git push origin master

serve:
	jekyll serve --watch --force_polling
~~~

serve --watch すると通知表示がうざいので、>/dev/null にしてもいいかも。


## カスタマイズ
### レイアウトの変更

{% raw %} 

_layouts/default.html をいじくります。が、jekyll bootstrap だと 
_includes/themes/bootstrap-3/default.html を使うようになっているので、
これを直接いじくるか、コピーしてそっちをいじくります。

サイドメニューをつけたいので、default.html の {{ content }} あたりのを以下のように変更。xs, sm では表示しないように。


~~~html
...
      <div class="container">
	<div class="raw">
	 <div class="col-md-3 hidden-xs hidden-sm">
	   {% include sidebar %}
	 </div>
	 <div class="col-md-9">
	   {{ content }}
	 </div>
	</div>
      </div>
    </div>
~~~

sidebar を _includes/ 以下に作ってそれを include してます。

sidebar ではカテゴリと最新記事を表示するようにしてます。category.html あたりからパクりました。

~~~html
<h2>Category</h2>

<ul>
{% for category in site.categories %} 
  <li id="\{\{ category[0] \}\}-ref">{{ category[0] | join: "/" }}</h2>
  <ul>
    {% assign pages_list = category[1] %}  
    {% include JB/pages_list %}
  </ul>
{% endfor %}
</ul>

<h2>Recent Updated</h2>

<ul class="posts">
  {% for post in site.posts %}
    <li><span>{{ post.date | date_to_string }}</span> &raquo; <a href="{{ BASE_PATH }}{{ post.url }}">{{ post.title }}</a></li>
  {% endfor %}
</ul>
~~~

### Pygments
コードの色分けはしたいですね。bootstrap3 には pygments が入っていないようなので、
ぐぐって出てきたのを assets/themes/bootstrap-3/css/pygment_trac.css に保存し、default.html に link を加えます。

~~~html
...
    <link href="{{ ASSET_PATH }}/css/pygment_trac.css" rel="stylesheet" type="text/css" media="all">
~~~

### ウェブ上での編集
ローカルでの編集を想定してるので、ウェブ上での編集は想定されていないので、
prose.io を使う。あらかじめ登録しておく（authenticate するだけ）。

post.html にprose.io の編集画面へのリンクをはると便利。日付の隣につける：

~~~html
    <div class="date">
      <span>{{ page.date | date_to_long_string }}</span>
      <span><a href="http://prose.io/#{{site.author.github}}/{{site.author.github}}.github.io/edit/master/{{ page.path }}"  target="_blank"><i class="glyphicon glyphicon-edit"></i></a></span>
    </div>
~~~

### 見出し番号
~~~css
body {
 counter-reset:h1;
}
.content > h1{counter-increment:h1;counter-reset:h2;}
.content > h2{counter-increment:h2;counter-reset:h3;}
.content > h3{counter-increment:h3;counter-reset:h4;}
.content > h4{counter-increment:h4;counter-reset:h5;}
.content > h1:before{content: counter(h1) ". ";}
.content > h2:before{content: counter(h1) ". " counter(h2) ". ";}
.content > h3:before{content: counter(h1) ". " counter(h2) "." counter(h3) " "; }
.content > h4:before{content: counter(h1) ". " counter(h2) "." counter(h3) "." counter(h4) " "; }
~~~

### トップで最新記事を表示
[paco.jp » jekyllでトップページにsite.postsの最新記事を表示する] (http://paco.jp/blog/jekyll/ruby/2013/01/01/jekyll%E3%81%A6%E3%82%99%E3%83%88%E3%83%83%E3%83%95%E3%82%9A%E3%83%98%E3%82%9A%E3%83%BC%E3%82%B7%E3%82%99%E3%81%ABsite.posts%E3%81%AE%E6%9C%80%E6%96%B0%E8%A8%98%E4%BA%8B%E3%82%92%E8%A1%A8%E7%A4%BA%E3%81%99%E3%82%8B/)
を参考に：

~~~
% vi index.md
---
layout: default
---
{% include JB/setup %}

{% assign page = site.posts.first %}
{% assign content = page.content %}


{% include themes/bootstrap-3/post.html %}
~~~

~~~
% vi _layout/default.html
{% if page.url == '/index.html' %}
{% assign page = site.posts.first %}
{% endif %}
...
<link rel='canonical' href='{{site.root_url}}{{page.url}}' />
...
~~~

### プラグイン

- amazon_tag: https://github.com/nitoyon/tech.nitoyon.com/blob/master/_plugins/tags/amazon.rb

## Tips
### .emacs
iso-2022-jp だとエラーになるので、utf-8 に。

~~~
(set-language-environment "Japanese")
(set-default-coding-systems 'utf-8-unix)
(prefer-coding-system 'utf-8-unix)
~~~

## 参考文献

- [paco.jp » jekyllでトップページにsite.postsの最新記事を表示する] (http://paco.jp/blog/jekyll/ruby/2013/01/01/jekyll%E3%81%A6%E3%82%99%E3%83%88%E3%83%83%E3%83%95%E3%82%9A%E3%83%98%E3%82%9A%E3%83%BC%E3%82%B7%E3%82%99%E3%81%ABsite.posts%E3%81%AE%E6%9C%80%E6%96%B0%E8%A8%98%E4%BA%8B%E3%82%92%E8%A1%A8%E7%A4%BA%E3%81%99%E3%82%8B/)


{% endraw %}
