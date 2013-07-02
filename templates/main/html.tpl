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
    <body id="{{id}}" class="{{classNames}}">
        {{>masthead}}

        <div id="pageBody">
            <div id="breadcrumbs">{{{breadcrumbs}}}</div>
            {{# date}}
                <div class="date">{{>longDate}}</div>
            {{/date}}
            {{>intro}}
            {{>content}}
            <div id="copyright">Copyright <span class="copyright-symbol">&copy;</span>2013</div>
        </div>
    </body>
</html>