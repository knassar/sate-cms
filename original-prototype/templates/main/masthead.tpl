<header id="masthead">
    <h1>KarimNassar.com</h1>
    <ul id="mainMenu">
        {{#siteMenu}}
        <li class="{{attr.classNames}}"><a href="{{url}}">{{name}}</a>
            <ul class="sub-menu">
            {{#sub}}
                <li class="{{className}} {{#deep}}deep{{/deep}} {{#subtitle}}subtitle{{/subtitle}}">
                    {{# url}}
                    <a href="{{url}}">
                    {{/url}}
                        {{name}}
                    {{# url}}
                    </a>
                    {{/url}}
                </li>
            {{/sub}}
            </ul>
            </li>
        {{/siteMenu}}
    </ul>
</header>