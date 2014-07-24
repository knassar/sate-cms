
@intro:

Sate Markup is a very simple plugin which provides dynamic client-side annotation. This is useful in some cases where Markdown's limitations can get in the way of the markup you would like to present.

@content:

Currently the Sate Markup plugin has a single feature: It automatically detects `<a>` tags whose `href` attribute is a global URL and annotates the links with the class `external` and adds the property `target="_blank"`. Sate Markup is included in the default `html.tpl` template, so you do not need to do anything to gain this functionality. 
    
You can add the class `no-sate-markup` to any tags you want to exclude from annotation by this plugin.


{{{plugin-sate-sequenceNav}}}
    