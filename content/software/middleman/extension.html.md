---
title: Middleman の extensionを書くための覚書
date: 2015-3-27

---

## 基本
Middleman::Extension　から派生させたクラスを作り（Middleman::Hello::Extension）、 そこに helper 関数の追加、 resource の manipulate、hook の追加などする。 そしてMiddleman::Extension.register(:hello, Middleman::Hello::Extension) した上で、 config.rb で activate :hello させれば有効になる。

### 参考

- Middleman カスタム拡張チュートリアル - Qiita
- Building Middleman Extensions | Blank Page Tech

## gem
% bundle gem middleman-hello とし gem のひな形を作る。 ファイル構成はいじる。

```
├── Gemfile
├── lib
│   ├── middleman-hello
│   │   ├── extension.rb
│   │   └── version.rb
│   ├── middleman-hello.rb
│   └── middleman_extension.rb
├── LICENSE.txt
├── middleman-hello.gemspec
├── README.md
```

### lib/middleman-hello.rb

version情報と extension 本体を読み込み、register する。

```ruby
require "middleman-hello/version"


::Middleman::Extensions.register(:hello) do
  require 'middleman-hello/extension'
  ::Middleman::Hello::Extension
end
```

### lib/middleman_extension.rb

middleman 本体に自拡張を読み込ませるために必要。 Middleman::Extensions.loadextensionsinpath() で読まれる。 これ忘れると template が動かないので注意。 なお ‘-’ ではなく ‘’ なのでより注意。

```
require "middleman-hello"
```


### lib/middleman-hello/version.rb

```ruby
version 情報書くだけ。

module Middleman
  module Hello
    VERSION = "0.0.1"
  end
end
```

### lib/middleman-hello/extension.rb

extension 本体。ヘルパー関数書くなり resource に module 追加するなり proxy追加するなり。

```ruby
module Middleman
  module Hello
    class Extension < Middleman::Extension
      ...
    end
  end
end
```

### config.rb

ここまで準備したら activate :hello とすると、 拡張機能が有効になる。

## helper関数
簡単なものから

config.rb:helpers do

### config.rb に書き下す：

```ruby
% vi config.rb
helpers do
  def hello
    "Hello, World"
  end
end
```


### extension.defined_helpers=[]

Middleman::Extension.defined_helpers を使う：

```ruby
module Middleman
  module Hello
    module Helpers
      def hello
        "Hello, World"
      end
    end
    class Extension < Middleman::Extension
      self.defined_helpers = [Helpers]
    end
  end
end
```

## option
```ruby
class Extension
option

def init
  app.set :hello_settings, options
  ..
```

## 独自テンプレート
middleman init PROJ –tempate hello で source/ などを含めて プロジェクトを作れるテンプレートを作る。

### テンプレートファイル群

lib/middleman-hello/template/ 以下にテンプレートで使うファイルを置く。 Middleman::Template::Base から派生させ、テンプレート作成を行う。 主に build_scaffold()。

```
lib/middleman-hello/template/
├── config.tt
├── shared
│   └── Gemfile
└── source
    └── index.html.md
```

Thor, invoke などを使ってるもよう。

### 作成設定

Middleman::Templates::Base から派生させて build_scaffold() で実体をコピーなどする。 Middleman::Templates.register() で登録する。

```
% vi lib/middleman-aks/template.rb
require 'middleman-core/templates'

module Middleman
  module Hello
    class Template < Middleman::Templates::Base
     class_option "css_dir",
        default: "stylesheets",
        desc: 'The path to the css files'
      class_option "js_dir",
        default: "javascripts",
        desc: 'The path to the javascript files'
      class_option "images_dir",
        default: "images",
        desc: 'The path to the image files'

      def self.source_root
        File.join(File.dirname(__FILE__), 'template')
      end

      def build_scaffold
        template "config.tt", File.join(location, "config.rb")

        source = File.join(location, "source")
        directory "source", source

        [:css_dir, :js_dir, :images_dir].each do |dir|
          empty_directory File.join(source, options[dir])
        end
      end
    end
  end
end


Middleman::Templates.register(:aks, Middleman::Aks::Template)
```

### デバッグ時

~/.middleman/hello に template.rb を置くと Middleman::Templates::Local がそれを見る。

```sh
% mkdir -p  ~/.middleman/hello && cd ~/.middleman/hello
% ln -s <extdevdir>/lib/middleman-hello/template.rb .
% ln -s <extdevdir>/lib/middleman-hello/template .
```
