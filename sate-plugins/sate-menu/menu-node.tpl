<li class="{{{classes}}} {{#deep}}deep-link{{/deep}} {{#subtitle}}subtitle{{/subtitle}} {{#active}}active{{/active}} {{#activeDescendant}}active-descendant{{/activeDescendant}}">
    {{#url}}
    <a href="{{{url}}}">
    {{/url}}
        {{name}}
    {{#url}}
    </a>
    {{/url}}

    {{#hasSubItems}}
    <ul>
    {{#items}}
        {{>menu-node}}
    {{/items}}
    </ul>
    {{/hasSubItems}}
</li>
