<div class="{{{classes}}}">
    {{#crumbs}}
        <a href="{{{url}}}">{{name}}</a>
        <span class="seppa">{{separator}}</span>
    {{/crumbs}}
    {{#includePageName}}
    <{{headingTag}} class="this-page">{{thisPageName}}</{{headingTag}}>
    {{/includePageName}}
</div>
