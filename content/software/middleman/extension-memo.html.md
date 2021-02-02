---
title: extension覚書
date: 2015-4-5

---

## extension が new されるのは
Middleman::CoreExtensions::Extensions::ClassMethods::register

```
bin/middleman
Middleman::Cli::Base.start
  super (Thor)
  Middleman::Cli::Console.console
    require 'middleman-core'
      autoload :Application 'middleman-core/application'
        register Middleman::CoreExtensions::Request
          register.....Middleman::Extensions::register defined in 'middleman-core/extensions'
            registered[name.to_sym] = namespace

      require 'middleman-core/extensions'




    @app = Middleman::Application.server.inst

    intract_with(@app)
      IRB.irb nil, context
```

## hook
defined at Middleman::CoreExtensions::Extensions::registered(app)

https://github.com/middleman/middleman/blob/v3-stable/middleman-core/lib/middleman-core/core_extensions/extensions.rb

- :initialized
- :instance_available
- :after_configuration
- :before_configuration
- :build_config
- :development_config

run at Middleman::CoreExtensions::Extensions::InstanceMethods::initialize

InstanceMethods は Application に include されるので、 結局 app.initialize の時に呼ばれることになる。

- run :initialized
- (activate :sprocket)
- run :before_configuration
- (load ‘config.rb’)
- run :build_config if build?
- run :development_config if specified
- run :instance_available
- (reload I18n)
- run :after_configuration

### Application

defined at Middleman::Application

https://github.com/middleman/middleman/blob/v3-stable/middleman-core/lib/middleman-core/application.rb

- :before # Before request hook
- :ready # Ready (all loading and parsing of extensions complete) hook
- :before_build # Runs before the build is started
- :after_build # Runs after the build is finished

ready

https://github.com/middleman/middleman/blob/5b39a33ab68a4022bbc49375c0e0d4740702b1ef/middleman-core/lib/middleman-core/core_extensions/request.rb#L53

Middleman::CoreExtensions::Request::ClassMethods::inst()

before

Middleman::CoreExtensions::Request::InstanceMethods::process_start(env, req, res)
