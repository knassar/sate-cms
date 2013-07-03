<header id="masthead">
    <h1>
        <span id="sateLogo">
            <span id="sateLogoNameplate">s<span id="sateLogoA">a</span>te</span>:<span class="tagline">Just Enough CMS</span>
        </span>
    </h1>
    <ul id="mainMenu">
        {{# siteMenu}}
        <li class="{{attr.classNames}} {{active}}"><a href="{{url}}">{{name}}</a>
            {{#hasSubItems}}
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
            {{/hasSubItems}}
            </li>
        {{/siteMenu}}
    </ul>
</header>