---
title: cucumber で middleman extension の開発とテスト
date: 2015-3-27

---

## 概要
テストのフレームワーク。自然言語っぽく書けるのがいいらしい。 middleman extension の開発で使うことを想定。

参考：

- https://github.com/cucumber/cucumber
- Middleman カスタム拡張チュートリアル - Qiita

## インストールと使い方

ただ使うなら gem i cucumber だが、 extension なので middleman-hello.gemspec に入れておく。

```
% vi middleman-hello.gemspec
...
Gem::Specification.new do |spec|
  ...
  spec.add_runtime_dependency "middleman", "~> 3.3"
  spec.add_development_dependency "bundler", "~> 1.7"
  spec.add_development_dependency "rake", "~> 10.0"
  spec.add_development_dependency "cucumber", "~> 1.3"
  spec.add_development_dependency "aruba", "~> 0.6"
  spec.add_development_dependency "therubyracer"
  spec.add_development_dependency "pry-byebug"
  spec.add_development_dependency "rb-readline"
```

debug 用に pry なども入れておくとよい。

```
% cucumber features/xxx.feature
```

### features/xxx.feature

どうテストするかの規定書

```
features
├── activate.feature
├── archives.feature
├── support
│   └── env.rb
```

詳しくは後述。

### fixtures/xxx-app/：テストするための道具や箱

テストするために使うconfig.rb や source/* などを入れておく。

```
fixtures/
├── archives-app
│   ├── config.rb
│   └── source
│       ├── archives_template_month.html.erb
│       ├── archives_template_year.html.erb
│       ├── game
│       │   └── kancolle
│       │       ├── memo.html.md
│       │       └── memo.html.md~
│       └── index.html.md
├── empty-app
│   ├── config.rb
│   └── source
```

## feature の書き方
### features/support/env.rb

使うのを require しとく。middleman/step_definitions を使えば大抵どうにかなる。

```ruby
PROJECT_ROOT_PATH = File.dirname(File.dirname(File.dirname(__FILE__)))
require 'middleman-core'
require 'middleman-core/step_definitions'
require File.join(PROJECT_ROOT_PATH, 'lib', 'middleman-hello')
```

### xxx.feature の文法

```
Feature: 機能、つうかやることのの説明。namespace みたいなもんか

  Scenario: シナリオ。これやるとこうなるはずえす
    Given a fixture app "empty-app"
    And a file named "config.rb" with:
      """
      activate :hello
      """
    When I run `middleman build --verbose`
    Then the exit status should be 0
    And the output should not contain "Unknown Extension: hello"
```

- Given: 前提条件
- When：こうすると
- Then：こうなるはず

And は、直前の 上記3つのどれかと同じ。続き。

大抵、以下のひな形でどうにかなる

```
% vi hello.feature
Feature: hello

  Scenario: hello
    Given the Server is running at "hello-app"
    When I go to "/hello.html"
    Then I should see "Hello, World"
```

### step definitions

…

## fixtureの用意

## テストする

add cucumber into gemspec or Gemfiles

```
% export CUCUMBER_COLORS=failed=white:failed_param=white
% bundle exec cucumber features/activate.feature
```

failed で黒字に赤いのは見にくいので、白くしてある。.bashrc などに加えておくと吉。
