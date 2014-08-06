<h2>
    {{name}}
</h2>

{{#showStats}}
    {{#date}}
        <div class="date">{{>longDate}}</div>
    {{/date}}
    {{#author}}
        <div class="author">by {{author}}</div>
    {{/author}}
{{/showStats}}

{{#permalink}}
    <div class="permalink"><a href={{url}}>permalink</a></div>
{{/permalink}}


<div class="intro">
{{>intro}}
</div>

<div class="content">
{{>content}}
</div>

{{#olderLink}}
    {{#olderArticle}}
        <a href="{{olderArticle.url}}">Older ›</a>
    {{/olderArticle}}
{{/olderLink}}