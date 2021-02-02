---
title: middlemanページの目次を作る
date: 2015-3-23

---

## 設定
markdown エンジンとして redcarpet を使い、:with_toc_data を true にセットします。

```
% vi config.rb
set :markdown_engine, :redcarpet
set :markdown, :fenced_code_blocks => true, :autolink => true, :smartypants => true, :tables => true, :with_toc_data => true
```

## ヘルパー関数
ヘルパー関数を加えます。上記設定がされてる必要があります。

```ruby
% vi config.rb
helpers do
  def render_toc(page)
    if config.markdown_engine == :redcarpet && config.markdown[:with_toc_data]
      toc = Redcarpet::Markdown.new(Redcarpet::Render::HTML_TOC)
      text = File.read(page.source_file)
      toc.render(text)
    end
  end
end
```

## partial template
パーシャルテンプレートを作ります。bootstrap を使ってることを想定してます。 ページのfrontmatter に “show_toc: true” としておくと、最初から目次を表示します。 そうでなければボタンを押したら表示。

後はお好みのテンプレートで partial(“partials/toc”) してください。

```erb
% vi source/partials/_toc.html
<% page ||= current_page %>
    <!-- toc -->
    <% toc_class = (page.data.show_toc) ? "collapse in" : "collapse" %>

    <aside class="toc">
      <button type="button" class="btn btn-default collapsed btn-sm" data-toggle="collapse" data-target="#toc_content">ToC</button>

      <div id="toc_content" class="<%= toc_class %>">
      <% if toc = render_toc(current_article) %>
        <%= toc %>
      <% else %>
        <div>
redcarpet :with_toc_data needs to be available. add into config.rb as below
<pre class="highlight syntax ruby"><code>set :markdown_engine, <strong>:redcarpet</strong>
set :markdown, :fenced_code_blocks => true, :autolink => true, :smartypants => true, :tables => true, <strong>:with_toc_data => true</strong>
</code></pre>
         </div>
      <% end %>
    </div>
    </aside>
```
