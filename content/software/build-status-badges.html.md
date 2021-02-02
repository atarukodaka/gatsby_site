---
title: build status バッジをつける
date: 2015-4-12

---

## バッジ
github 見てるとよく張ってありますね。

##travis - build: pass

テストが通ってるか調べてくれるの。各ruby のバージョンで rake test 回してくれて便利。

.travis.yml に

```yaml
rvm:
  - 2.2
  - 2.1.0
  - 2.0.0

script: "bundle exec rake test"

env: TEST=true
```

と書いて add, commit して git push。

```ruby
Rakefile に

require "bundler/gem_tasks"
require 'rake/clean'

require 'cucumber/rake/task'
require 'middleman-core'

Cucumber::Rake::Task.new(:cucumber, 'Run features that should pass') do |t|
  ENV["TEST"] = "true"

  exempt_tags = ""
  exempt_tags << "--tags ~@nojava " if RUBY_PLATFORM == "java"
  exempt_tags << "--tags ~@three_one " unless ::Middleman::VERSION.match(/^3\.1\./)

  t.cucumber_opts = "--color --tags ~@wip #{exempt_tags} --strict --format #{ENV['CUCUMBER_FORMAT'] || 'pretty'}"
end

require 'rake/clean'

desc "Run tests, both RSpec and Cucumber"
task :test => [:spec, :cucumber]

require 'rspec/core/rake_task'
desc "Run RSpec"
RSpec::Core::RakeTask.new do |spec|
  spec.pattern = 'spec/**/*_spec.rb'
  spec.rspec_opts = ['--color', '--format nested']
end
```

としとくと cucumber と rspec を回してくれる（middleman-blog のから）。

んで、https://travis-ci.org にいって github 垢でログインして 当該レポをチェック。


## coverall - coverage: 95%

テストがどこまでコードをカバーしてるか調べてくれるらしい。

github 垢でログインして対象のレポをチェックするだけ。

## code climate - code climate: 3.4

コードの品質をチェックしてくれるらしい。 4点満点。一文が長すぎたり複雑すると点数が落ちるっぽ。

同じくgithub 垢でログインして対象のレポをチェックするだけ。
