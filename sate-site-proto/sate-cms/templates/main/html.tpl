<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-type" content="text/html; charset=utf-8">
        <title>{{title}}{{#subtitle}} &rsaquo; {{/subtitle}}{{subtitle}}</title>

        <link rel="shortcut icon" href="/favicon.ico{{deployRevision}}" type="image/x-icon">

        <link rel="stylesheet" href="/styles/main.css{{deployRevision}}" type="text/css" media="screen" charset="utf-8">

        {{#styles}}
        <!-- {{id}} -->
        <link rel="stylesheet" href="{{{href}}}{{deployRevision}}" type="text/css" media="{{media}}" charset="utf-8">
        {{/styles}}
    </head>
    <body id="{{id}}" class="{{classes}}">
        {{>masthead}}

        {{#plugin-sate-menu}}
        {
            "id": "siteMenu",
            "inherited": true,
            "classes": ["top-menu"]
        }
        {{/plugin-sate-menu}}

        {{#plugin-sate-menu}}
        {
            "id": "pageMenu",
            "classes": ["side-menu"]
        }
        {{/plugin-sate-menu}}

        <div id="pageBody" class="{{type}}">
            {{#plugin-sate-breadcrumbs}}
            {
                "id": "mainBreadcrumbs"
            }
            {{/plugin-sate-breadcrumbs}}
        
            {{#showStats}}
                {{#date}}
                    <div class="date">{{>longDate}}</div>
                {{/date}}
            {{/showStats}}

            {{#hasIntro}}
                <div class="intro">
                {{>intro}}
                </div>
            {{/hasIntro}}

            {{#hasContent}}
                <div class="content">
                {{>content}}
                </div>
            {{/hasContent}}
            
         </div>
        <div id="footer">
            <div id="copyright">Copyright <span class="copyright-symbol">&copy;</span>2013</div>
            {{{plugin-sate-powered}}}
        </div>
               
        <script type="text/javascript" charset="utf-8" src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
        {{#scripts}}
        <!-- {{id}} -->
        <script type="text/javascript" charset="utf-8" src="{{{src}}}{{deployRevision}}"></script>
        {{/scripts}}
    </body>
</html>