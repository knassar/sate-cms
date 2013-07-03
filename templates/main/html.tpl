<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-type" content="text/html; charset=utf-8">
        <title>{{title}}{{#subtitle}} &rsaquo; {{/subtitle}}{{subtitle}}</title>

        <link rel="stylesheet" href="/styles/main.css" type="text/css" media="screen" title="no title" charset="utf-8">

        {{#extraStyles}}
        <link rel="stylesheet" href="{{root}}{{href}}" type="text/css" media="{{media}}" title="no title" charset="utf-8">
        {{/extraStyles}}
    </head>
    <body id="{{id}}" class="{{classNames}} {{#menu}}{{#hasSubItems}}with-menu{{/hasSubItems}}{{/menu}}">
        {{>masthead}}

        {{#menu}}
            {{#hasSubItems}}
            <ul id="pageMenu">
                {{#menu.sub}}
                <li class="{{className}} {{#deep}}deep{{/deep}} {{#subtitle}}subtitle{{/subtitle}}">
                    {{# url}}
                    <a href="{{url}}">
                    {{/url}}
                        {{name}}
                    {{# url}}
                    </a>
                    {{/url}}
                </li>
                {{/menu.sub}}
            </ul>
            {{/hasSubItems}}
        {{/menu}}

        {{#hasBreadcrumbs}}
        <div id="breadcrumbs">{{{breadcrumbs}}}</div>
        {{/hasBreadcrumbs}}
        {{# date}}
            <div class="date">{{>longDate}}</div>
        {{/date}}
        
        <div id="pageBody">
            {{>intro}}
            {{>content}}
        </div>
        <div id="copyright">Copyright <span class="copyright-symbol">&copy;</span>2013</div>
    </body>
</html>