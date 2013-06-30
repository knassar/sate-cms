<ol class="articles">
    {{# articles}}
    <li class="article-intro">
        <h3><a href="{{root}}{{url}}">{{{name}}}</a></h3>
        <div class="details">
            <span class="crumbs">{{{detailcrumbs}}}</span>
            {{# date}}
            <span class="date">{{>longDate}}</span>
            {{/date}}
        </div>
        <div class="intro">
            {{{intro}}}
        </div>
        <a href="{{root}}{{url}}" class="read-more">read more...</a>
    </li>
    {{/articles}}
</ol>