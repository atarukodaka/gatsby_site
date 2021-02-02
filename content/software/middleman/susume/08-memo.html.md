---
title: middleman を読む
date: 2015-3-19

---

## サンプルスクリプトを書く

path: “/index.html” リクエストで source/index.html.md を HTML に変換するスクリプトを書いてみます：

```ruby
% vi m.rb
require 'middleman'
require 'middleman-core/logger'
require 'pry-byebug'

logger = Middleman::Logger.singleton(Logger::DEBUG)

logger.debug '- define MyApp'

class MyApp < Middleman::Application
end

logger.debug '- create app: MyApp'
app = MyApp.new

logger.debug '- run_hook :ready'
app.run_hook :ready

logger.debug '- find index.html'
path = "/index.html"
page = app.sitemap.find_resource_by_path(path)

logger.debug '- render'
puts page.render

logger.debug '- all done.'
```

実行します：

```ruby
% bundle exec ruby m.rb
- define MyApp
- create app: MyApp
== Activating: sprockets
== Reading:  Local config
Loaded extensions:
== Extension: sprockets
== Extension: frontmatter
- run_hook :ready
== File Change: config.rb
== File Change: m.rb
== File Change: m.txt
== File Change: source/images/background.png
== File Change: source/images/middleman.png
== File Change: source/index.html.erb
== File Change: source/javascripts/all.js
== File Change: source/layouts/layout.erb
== File Change: source/stylesheets/all.css
== File Change: source/stylesheets/normalize.css
== Rebuilding resource list
- find index.html
- render
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
....
- all done.
```

ポイントは、

- Middleman::Application の派生クラスのインスタンスを生成すると、extensions の読み込み、activate や local config の読み込みが行われる
- :ready フックを run することで実際の resources の読み込みが行われる
このフックを起動しないとリソースの読み込みは完全に行われない

extensions の仕組みや、resources の読み込みの過程を洗ってみます。

## 参考サイト
- https://github.com/yterajima/middleman-tansu Wiki-like automatic linking in Middleman

- MiddlemanのExtensionやTemplateを色々と試しました Middlemanでwikiっぽいことができたら便利だなと思ったからmiddleman-tansu v0.1.0をリリースした | e2esound.com業務日誌

## gem

middleman-pry

カスタマイズ
CSS: style.css

## template-aks の構成と説明
- layout
- helpers
- extentions

## middlelamn-core を読み解く
- Middleman::Application
  - definehook する：:before, :ready, :beforebuild, :after_build
  - include Middleman::Coreextensions::Extensions
  - => register() が使えるように成る
  - register Middleman::CoreExtensions::Request, FileWacher,Data., Middleman::Sitemap
  - => class なら extension.new、module などなら extension.registered(self) を呼ぶ
- Middleman::Application.new
  - build cmd なら Middleman::BuildAction.new() で base.class.shared_instance で new される
  - リクエスト毎に Middleman::Application から派生されたクラスを作り、そこから new する
  - register したときに、Middleman::CoreExtensions::*:registered で InstanceMethod module 内の関数（initialize()含む）を app に include するよう send してるため、それぞれの initialize が呼ばれる
  - initialized() を持ってるのはData, Extensions のみ
  - 各種 extensions で hook などを設定
  - Extensions.new
    - initialized, before_configuration hook を呼ぶ
	- “config.rb” を実行する
	- activate する
	  - extensions に登録
    - after_configuration hook を呼ぶ
  - require middleman
  - require middleman-core
  - application.rb

conf.rb

core-extensions/data InstanseMethod initialize: load config.rb

register initialize activate after_configulation

## sitemap を読み解く
build https://github.com/middleman/middleman/blob/v3-stable/middleman-core/lib/middleman-core/cli/build.rb Thor

## middleman-blog を読み解く
- BlogData
- BlogArticle
