{{#articleSort}}
<ol class="articles">
{{/articleSort}}
{{^articleSort}}
<ul class="articles">
{{/articleSort}}

    {{# articles}}
    <li class="article-intro">
        <h3><a href="{{url}}">{{{name}}}</a></h3>
        <div class="details">
            {{#plugin-sate-breadcrumbs}}
            {
                "forClass": "article-intro-breadcrumbs",
                "headingTag": "h3",
                "minCrumbs": 3
            }
            {{/plugin-sate-breadcrumbs}}
            {{# date}}
            <span class="date">{{>longDate}}</span>
            {{/date}}
        </div>
        <div class="intro">
            {{{articleIntro}}}
        </div>
        <a href="{{root}}{{url}}" class="read-more">read more...</a>
    </li>
    {{/articles}}
    
{{#articleSort}}
</ol>
{{/articleSort}}
{{^articleSort}}
</ul>
{{/articleSort}}
