<ul class="sate-gallery" {{#id}}id="{{id}}"{{/id}}>
    {{#images}}
    <li class="thumbnail">
        <img data-hero-src="{{heroSrc}}" src="{{thumbSrc}}" alt="{{heroSrc}}"/>
    </li>
    {{/images}}
</ul>