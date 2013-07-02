<header id="masthead">
    <h1>KarimNassar.com</h1>
    <ul id="mainMenu">
        {{# siteMenu}}
        <li class="{{className}}"><a href="{{path}}">{{name}}</a>
            <ul class="sub-menu">
            {{# sub}}
                <li class="{{className}} {{#deep}}deep{{/deep}} {{#subtitle}}subtitle{{/subtitle}}">
                    {{# path}}
                    <a href="{{path}}">
                    {{/path}}
                        {{name}}
                    {{# path}}
                    </a>
                    {{/path}}
                </li>
            {{/sub}}
            </ul>
            </li>
        {{/siteMenu}}
    </ul>
</header>