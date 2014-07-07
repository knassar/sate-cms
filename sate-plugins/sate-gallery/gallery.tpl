<ul class="sate-gallery {{composedClasses}}">
    {{#images}}
    <li class="thumbnail">
        <img data-hero-src="{{heroSrc}}" src="{{thumbSrc}}" alt="{{heroSrc}}"/>
    </li>
    {{/images}}
    {{^images}}
    <li class="no-images">
        Gallery Images <br> Not Found
    </li>
    {{/images}}
</ul>