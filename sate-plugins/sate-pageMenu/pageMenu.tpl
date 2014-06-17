<ul class="{{{classes}}}">
    {{#parent}}
    <li class="parent-page">
        {{#parent.url}}
        <a href="{{url}}">
        {{/parent.url}}
            {{parent.name}}
        {{#parent.url}}
        </a>
        {{/parent.url}}
    </li>
    {{/parent}}

    {{#items}}
        {{>menu-node}}
    {{/items}}
</ul>