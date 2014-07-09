{
    "plugins": [
        {
            "type": "sate-gallery",
            "id": "demo-gallery",
            "imagesPath": "/images/gallery"
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
    "id": "demo-gallery",
    "title": "A Sample Sate Gallery"
}
{{/plugin-sate-gallery}}

### Gallery Behaviors

When you include a `sate-gallery` in your page data, Sate will locate the referenced images at compile time, traversing all sub-directories from the specified `imagesPath`. The images will be thumbnailed automatically according to the properties declared in the gallery. When Sate is invoked with `deploy`, all thumbnails are generated as part of the deploy process. In all other modes, thumbnails are generated lazily at render time.

It is important to note that all images are thumbnailed on a per-gallery-id basis. So each time you use a new gallery id, you are specifying a new instance of image thumbnails, even if the specified images are already included in a different gallery. This allows you to create different sized thumbnails for different areas of your site.

### Gallery Viewer

The Sate Gallery viewer is a light-weight, responsive image viewer. It is not tied to a particular gallery, so any instances of `plugin-sate-gallery` on a given page will share the same viewer. This allows your users to cycle through all gallery images on a page.

### Configuring the Gallery Plugin

To configure this gallery, we've included the following JSON in this page's `plugins` array:

    "plugins": [
        {
            "type": "sate-gallery",
            "id": "demo-gallery",
            "imagesPath": "/images/gallery"
        }
    ]


### Including the Gallery Plugin
{{=<% %>=}}

Having given Sate enough information to identify this gallery, we reference the gallery images in the page `content` block by its `id`:

    {{plugin-sate-gallery}}
    {
        "id": "demo-gallery"
    }
    {{/plugin-sate-gallery}}

We can provide additional information in the `plugin-sate-gallery` tag to specialize the galleries:

#### `imagesPath` <span class="type string">String</span>

Because Sate will traverse all sub-directories of the originally specified `imagesPath`, you can use a single `sate-gallery` plugin instance to catalog multiple on-page image sets. To restrict the gallery instance to a sub-directory of its images, you can provide that sub-directory using the `imagesPath` property on the gallery instance.

#### `image` <span class="type string">String</span>

You can also restrict the gallery instance to a single image within the original gallery `imagesPath`.

#### `title` <span class="type string">String</span>

If you give a gallery a title, it will be displayed in the viewer for a moment any time the user opens the viewer on an image within the gallery instance, or any time the user navigates in the viewer to one of the images within the gallery instance.

#### `classes` <span class="type array">Array</span>

Specifies an array of Strings to use as the `class` attribute on the outer `HTML` tag of the gallery instance.






<%={{ }}=%>

{{{plugin-sate-sequenceNav}}}
    
