---
title: フレームワーク構想
date: 2017-2-4
---

## middleman ベースで作りたいと思ってること
- middleman-blog だとソースファイル名に日付をつけることが前提になってるのがイヤ（frontmatterに date: つければいいんだけど）
  - hack してみたけど、あんま美しくならない
- game/kancolle/event/2015-summary.html.md をつくると、自動的に game/index.html, game/kancolle/index.html, game/kancolle/event/index.html にサマリー作ってほしい
  - https://github.com/yterajima/middleman-tansu が近い？
- デザインは http://grabacr.net/ さんとこがいい感じ
- archives は月別があればいい
- 連載記事サポート機能
  - software/middleman/01-ready.html.md, …/02-start.html.md とかすると title に自動的に 第n回とか入ってほしい
- pagination は欲しい
- tag はあんま使わない

ってんで http://atarukodaka.github.io/software/middleman/middleman-akcms.html　 のように動くのを akcms と銘打って https://github.com/atarukodaka/middleman-akcms/ としてみたけど、いろいろごちゃごちゃしてきてどうしようかと。

## 問題、提案など
- resource にインスタンスをつけたいんだけど、Middleman::Sitemap::Resource 直にモンキーパッチあてるのは避けたいし、
  - manipulate_resource_list() で each resource に extend してもいいんだけど、pagination するときに ProxyResource を new すると extend されてないんでモニョ. clone してもパラメータ上書きできないし
  - link template は applyuritemplate するよいか proxy resource へのハッシュを持っておいて link_to() するほうが楽だと思うんがねえ
- 自動サマリー、タグ、アーカイブ、ペジネーションなどをまとめるとごちゃごちゃするので別にするか
  - タグ、アーカイブは、v4 だと collection 機能でサクッとできるっぽいし
