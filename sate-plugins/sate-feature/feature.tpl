<li class="article-intro">
    <h3><a href="{{url}}">{{{name}}}</a></h3>
    <div class="details">
        {{#plugin-sate-breadcrumbs}}
        {
            "includePageName": false,
            "minCrumbs": 2
        }
        {{/plugin-sate-breadcrumbs}}
        {{#date}}
        <span class="date">{{>longDate}}</span>
        {{/date}}
    </div>
    <div class="intro">
        {{{articleIntro}}}
    </div>
    <a href="{{url}}" class="read-more">read more...</a>
</li>
