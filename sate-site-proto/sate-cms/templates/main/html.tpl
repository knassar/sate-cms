<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-type" content="text/html; charset=utf-8">
        <title>{{title}}{{#subtitle}} &rsaquo; {{/subtitle}}{{subtitle}}</title>

        <link rel="stylesheet" href="/styles/main.css" type="text/css" media="screen" charset="utf-8">

        {{#styles}}
        <!-- {{id}} -->
        <link rel="stylesheet" href="{{{href}}}" type="text/css" media="{{media}}" charset="utf-8">
        {{/styles}}
    </head>
    <body id="{{id}}" class="{{classNames}} {{#menu}}{{#hasSubItems}}with-menu{{/hasSubItems}}{{/menu}}">
        {{>masthead}}

        {{#menu}}
            {{#hasSubItems}}
            <ul id="pageMenu">
                {{#hasParent}}
                <li class="parent-page">
                {{#menu.parent}}
                    {{#url}}
                    <a href="{{url}}">
                    {{/url}}
                        {{name}}
                    {{#url}}
                    </a>
                    {{/url}}
                {{/menu.parent}}
                </li>
                {{/hasParent}}
                {{#menu.sub}}
                <li class="{{className}} {{#deep}}deep{{/deep}} {{#subtitle}}subtitle{{/subtitle}}">
                    {{#url}}
                    <a href="{{url}}">
                    {{/url}}
                        {{name}}
                    {{#url}}
                    </a>
                    {{/url}}
                </li>
                {{/menu.sub}}
            </ul>
            {{/hasSubItems}}
        {{/menu}}

        {{#plugin-sate-breadcrumbs}}
        {
            "id": "breadcrumbs"
        }
        {{/plugin-sate-breadcrumbs}}
        
        <div id="pageBody" class="{{type}}">
            {{#date}}
                <div class="date">{{>longDate}}</div>
            {{/date}}
            <div class="intro">
            {{>intro}}
            </div>
            <div class="content">
            {{>content}}
            </div>
        </div>
        <div id="copyright">Copyright <span class="copyright-symbol">&copy;</span>2013</div>
        <script type="text/javascript" charset="utf-8" src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
        {{#scripts}}
        <!-- {{id}} -->
        <script type="text/javascript" charset="utf-8" src="{{{src}}}"></script>
        {{/scripts}}
    </body>
</html>