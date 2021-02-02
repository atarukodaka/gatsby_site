---
title: TimeWithZone
date: 2015-12-9

---

とりあえず ActiveSupport の TimeWithZone 使っとけ。

```
require 'active_support/core_ext/time/zones'

Time.zone = "Tokyo"
t = Time.zone.parse("2011/1/1 0:0:0")
puts t.in_time_zone(7).strftime("%Y/%M/%D")
```

- Time.zone = “Tokyo” などと、parse 対象の tz を指定
- “GMT+9” はダメなので、9 と直接指定
