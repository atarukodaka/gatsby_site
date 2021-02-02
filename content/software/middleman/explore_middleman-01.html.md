---
title: middleman を読む
date: 2015-3-19

---

## middleman を読む手順
結構複雑で、難しいです。

- rack / middleware
- module, extend など ruby の詳細
- hook の動き

などについての知識が必要になります。

根幹となる機能も “core-extensions” と拡張機能扱いで実装されているので、 追っていくのがなかなか大変です。

手順として、

- まず console で触る
- サンプルスクリプトを書き、簡単な拡張機能を書いてみる
- middlemanのソース一式を手元に落とし、pry や printf デバッグなどでひとつずつ追っていく

という方法を取ります。

## console で中身を見る
まずは middleman console で中身を見ながら追っていきます。

## インストールと下準備

シンプルなシステム構成で init します。pry はソースを追うのに必要なのでいれておきます。

```
% middleman init mm-tets & cd mm-test
% vi Gemfile
gem 'pry-byebug'
gem 'middleman-pry'
gem 'rb-readline'
gem 'therubyracer'
% bundle
```

### app (Middleman::Application)

console を起動し、self を見ます。

```
% bundle exec middleman console --verbose
[1] pry(#<Middleman::Application::MiddlemanApplication1>)> self
=> #<Middleman::Application:0x70265526584800>
[2] pry(#<Middleman::Application::MiddlemanApplication1>)> self.class
=> Middleman::Application::MiddlemanApplication1
```

Middleman::Application というのがアプリケーション用のクラス。箱。 これに後述の拡張機能を登録しフックを仕込み、順次駆動させていく形になります。 このクラスにextend バリバリつかって module を組み込んでいくため、 他のリクエスト、プロセスとの混乱しないよう、 リクエストごとに Middleman::Application::MiddlemanApplication1というように番号を振った派生クラスを作り、 それを利用していくことになります。

### sitemap (Middleman::Sitemap::Store), resources

次に sitemap と sitemap.resources を見ます：

```
[3] pry(#<Middleman::Application::MiddlemanApplication1>)> sitemap
=> #<Middleman::Sitemap::Store:0x007fcfef180878
 @_cached_metadata={},
 @_lookup_by_destination_path=
  {"images/background.png"=>
    #<Middleman::Sitemap::Resource:0x007fcff0db7410
     @app=#<Middleman::Application:0x70265526584800>,
     @destination_path="images/background.png",
     @local_metadata={:options=>{}, :locals=>{}, :page=>{}, :blocks=>[]},
     @path="images/background.png",
     @source_file="/vagrant/source/mm-test/source/images/background.png",
     @store=#<Middleman::Sitemap::Store:0x007fcfef180878 ...>>,
   "images/middleman.png"=>
    #<Middleman::Sitemap::Resource:0x007fcff0db6bf0
     @app=#<Middleman::Application:0x70265526584800>,
     ...
[4] pry(#<Middleman::Application::MiddlemanApplication1>)> sitempap.resources
=> [#<Middleman::Sitemap::Resource:0x007fcff0db7410
  @app=#<Middleman::Application:0x70265526584800>,
  @destination_path="images/background.png",
  @local_metadata={:options=>{}, :locals=>{}, :page=>{}, :blocks=>[]},
  @path="images/background.png",
  @source_file="/vagrant/source/mm-test/source/images/background.png",
  @store=
   #<Middleman::Sitemap::Store:0x007fcfef180878
    @_cached_metadata={},
    @_lookup_by_destination_path=
     {"images/background.png"=>
       #<Middleman::Sitemap::Resource:0x007fcff0db7410 ...>,
      "images/middleman.png"=>
```

- Middleman::Sitemap::Store：source/ 以下のデータを管理するコンテナクラス、
- Middleman::Sitemap::Resource：それぞれのファイルなどのリソースのコンポーネントクラス。
この2つがキモとなります。

特定のリソースを取り出すには、sitemap.find_resource_by_path() を使います：

```
[5] pry(#<Middleman::Application::MiddlemanApplication1>)> page = sitemap.find_resource_by_path("index.html")
=> #<Middleman::Sitemap::Resource:0x007f2bd08ecda0
 @app=#<Middleman::Application:0x69913064777960>,
 @destination_path="index.html",
 @local_metadata={:options=>{}, :locals=>{}, :page=>{}, :blocks=>[]},
 @path="index.html",
 @source_file="/vagrant/source/mm-test/source/index.html.erb",
 @store=
  #<Middleman::Sitemap::Store:0x007f2bceda42c8
   @_cached_metadata={},
   @_lookup_by_destination_path=
   ...
```

これで page で特定のリソース(“/index.html”)のデータやパスなどの情報にアクセスできます。また render でテンプレートに従い加工されたテキストが返ります。

```
[6] pry(#<Middleman::Application::MiddlemanApplication1>)> page.data
=> {"title"=>"Welcome to Middleman"}
[7] pry(#<Middleman::Application::MiddlemanApplication1>)> page.path
=> "index.html"
[8] pry(#<Middleman::Application::MiddlemanApplication1>)> page.source_file
=> "/vagrant/source/mm-test/source/index.html.erb"
[17] pry(#<Middleman::Application::MiddlemanApplication1>)> page.render
=> "<!doctype html>\n<html>\n  <head>\n    <meta charset=\"utf-8\">\n    \n    <!-- Always force latest IE rendering engine or request Chrome Frame -->\n...
```

## Middleman::Application クラス
Middleman::Application クラスを見てみます。

### define hooks

37行目あたり にhook の定義がされています。

```
    # Before request hook
    define_hook :before

    # Ready (all loading and parsing of extensions complete) hook
    define_hook :ready

    # Runs before the build is started
    define_hook :before_build

    # Runs after the build is finished
    define_hook :after_build
```

ここでは４つのみですが、後ほどもっと出てきます。

### core-extensions の register

142行目あたり から、いよいよ extensions の register が行われていきます。

まず、"include Middleman::CoreExtensions::Extensions" してますが、このモジュールには register()関数が定義されてて、これを使うことにより拡張機能(extension)を登録(register)することができます。詳しくは後述します。

このregister 関数を使って Middleman::CoreExtensions::Request, ShowException, FileWatcher… などの「コアな」extension をどんどん登録してきます。

## 拡張機能の仕組み
主な機能としては、

- ヘルパー関数の提供
- フックの仕込み

があります。

簡単な拡張機能を作りながら、動きを追っていきます。

### ヘルパー関数

#### helpers/hello.rb

簡単なのは、helpers/ 以下のファイルに規則にそって定義することです：

```
% vi helpers/hello_helpers.rb
module HelloHelpers
  def hello
    "hello world"
  end
end
```

こうすると、Middleman::CoreExtensions::ExternalHelpers で require され Middleman::Extensionのhelpers を使って module し app 内に組み込まれます(app.class.send(:include, m))。

#### 簡単な extension

次に extension でやってみます。

```ruby
% vi extensions/hello/middleman-hello.rb
module Middleman
  module Hello
    module Helpers
      def hello
        "hello world"
      end
    end
    class Extension < Middleman::Extension
      helpers do 
        include Helpers
      end
    end
  end
end

Middleman::Extensions.register(:hello) do
  Middleman::Hello::Extension
end

% vi config.rb
require 'extensions/middleman-hello'
activate :hello
```

Middleman::Extension から派生させたクラスを作り、同様に helper 関数を組み込みます。

config.rb でそれを require し activate （後述）させれば、hello() 関数が使えるようになります。

#### 手を加える
```ruby
module Middleman
  module Hello
    class << self
      def registered(app)
        $stderr.puts("- middleman-hello registered")
        app.send :include, InstanceMethods
      end
    end
    module InstanceMethods
      def hello
        "hello world"
      end
    end
  end
end

Middleman::Extensions.register(:hello) do
  Middleman::Hello
end
```
