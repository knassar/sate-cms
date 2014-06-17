<li class="{{{className}}} {{#deep}}deep-link{{/deep}} {{#subtitle}}subtitle{{/subtitle}}">
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
