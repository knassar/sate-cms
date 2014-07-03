{
    "plugins": [
        {
            "type": "sate-gallery",
            "id": "demo-gallery",
            "imagesPath": "./images/gallery",
            "precompiled": true
        }
    ]
}

@intro:

The Gallery plugin does two things to make your life easier. It provides a light-weight "lightbox" image viewer, but more importantly, it auto-thumbnails your whole collection of hero images.


@content:

All you have to do is point the plugin at your directory of images, and then include the plugin in your page.

Here's an example gallery containing two images:

{{#plugin-sate-gallery}}
    {
        "id": "demo-gallery"
    }
{{/plugin-sate-gallery}}
    
### Configuring the Gallery Plugin

To configure this gallery, we've included the following JSON in this page's <code>plugins</code> array:

    "plugins": [
        {
            "type": "sate-gallery",
            "id": "demo-gallery",
            "imagesPath": "./images/gallery"
        }
    ]


### Including the Gallery Plugin

Having told Sate about this gallery, we can reference the gallery in the page <code>content</code> block by either its <code>id</code>:

<pre>
&#123&#123#plugin-sate-gallery&#125&#125
{
    &quot;id&quot;: &quot;demo-gallery&quot;
}
&#123&#123/plugin-sate-gallery&#125&#125
</pre>

...or by referencing the gallery's images path:


<pre>
&#123&#123#plugin-sate-gallery&#125&#125
{
    &quot;imagesPath&quot;: &quot;./images/gallery&quot;
}
&#123&#123/plugin-sate-gallery&#125&#125
</pre>

{{{plugin-sate-sequenceNav}}}
    
