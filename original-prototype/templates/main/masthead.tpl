<header id="masthead">
    <h1>KarimNassar.com</h1>
    <ul id="mainMenu">
        {{# globalMenu}}
        <li class="{{className}}"><a href="{{root}}{{path}}">{{name}}</a>
            <ul class="sub-menu">
            {{# sub}}
                <li class="{{className}} {{#deep}}deep{{/deep}} {{#subtitle}}subtitle{{/subtitle}}">
                    {{# path}}
                    <a href="{{root}}{{path}}">
                    {{/path}}
                        {{name}}
                    {{# path}}
                    </a>
                    {{/path}}
                </li>
            {{/sub}}
            </ul>
            </li>
        {{/globalMenu}}
    </ul>
</header>