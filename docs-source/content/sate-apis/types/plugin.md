{
    "classes": ["api-doc"]
}

@intro:

The Sate.Plugin is the primary mechanism by which you can extend Sate's features. 


@content:

A Sate plugin must follow a simple, but strict file naming convension. Each plugin is contained in a directory whose name must match exactly the value of the plugin's [`type`](#type) property. The plugin source file must be named `plugin.js`. The plugin directory may contain any other resources necessary. For example, the `sate-gallery` plugin looks like this:

    ./sate-gallery          // the plugin directory    *required*
        plugin.js           // the plugin source file  *required*
        gallery.tpl         // the main template
        sate-gallery.css    // stylesheet for the gallery thumbnails and viewer
        sate-gallery.js     // the gallery viewer client-side code

The plugin source file itself must export a function that serves as an anonymous constructor for your plugin, and the object returned by that function must be of prototype `Sate.Plugin`.

The following pattern meets these criteria:

    module.exports = function() {
        var plugin = new Sate.Plugin({
            type: 'my-plugin',
            version: '1.0.0',
            compile: function(props, page, complete) {
                // ... do compile-time stuff
                complete();
            },
            templates: {
                'main': 'my-plugin.tpl'
            },
            stylesheets: [
                'my-plugin.css'
            ],
            objectToRender: function(config, page) {
                var obj = this.prototype.objectToRender(config, page);
                // ... do render-time stuff
                return obj;
            }
        });

        return plugin;
    };

## Extending Sate.Plugin

The `Sate.Plugin()` constructor is used to create your own Plugin sub-type:

### <a name="constructor"></a>`Sate.Plugin(implementation)` <span class="arrow r"></span> <span class="type sate">Sate.Plugin</span>

| Arguments | |
|:-|-|
|`implementation`| <span class="type object">Object</span>|

Sate expects your `plugin.js` module to export a function that will return an object whose prototype is `Sate.Plugin.prototype`. The `Sate.Plugin()` constructor guarantees that your plugin conforms to this expectation. To use the constructor, invoke it with `new` and pass an object which implements your plugin functionality. The return value will be your plugin object with its prototype properly configured.

## Properties to Define

The following properties are defined by you in your plugin sub-type. They are not configurable by the user. 

### `type`  <span class="type string">String</span>

A string name identifying the plugin's directory. The `type` property must match the source directory of the plugin.

### `templates`  <span class="type object">Object</span>

An dictionary of templates and partials used by the plugin. The object key is the partial name, and the value is the template filepath relative to the plugin directory. These will be loaded by Sate at compile-time, and the `main` template will be passed as the template to the render function, with any other templates available at render-time in the `partials` object.

If the plugin will be rendered, it **must** have at least one template with the reserved key of `main`.

### `stylesheets`  <span class="type array">Array</span>

An array of `CSS` resources to be linked to by the page in which the plugin is rendered. Filepaths must be relative to the plugin directory.

### `scripts`  <span class="type array">Array</span>

An array of Script client-side resources to be imported by the page in which the plugin is rendered. Filepaths must be relative to the plugin directory



## Methods to Override

### <a name="compile"></a> `compile(props, page, complete)`

| Arguments | |
|:-|-|
|`props`| <span class="type object">Object</span>|
|`page`| <span class="type sate">Sate.Page</span>|
|`complete`| <span class="type function">Function</span>|

In the `compile` method, the plugin should perform all actions and processing it needs to perform during the `compile` Sate lifecycle phase. 

The `props` argument is the compile-time configuration of the plugin instance provided by the user. The `page` argument is the [Sate.Page](/sate-apis/types/page) on which the plugin was instantiated. The `complete` argument is a callback to tell Sate that your plugin is done compiling.

This method is called on each plugin instance as the last phase of the website compile process, after all pages have been compiled. When compile is invoked on a plugin, all website and page assets *except* other plugins are guaranteed to have been compiled and prepared for render.

The Sate.Plugin prototype provides a default noop implementation, so if your plugin has nothing to do at `compile` time, you can omit this method in your implementation.

### <a name="objectToRender"></a> `objectToRender(config, page)`<span class="arrow r"></span> <span class="type sate">Sate.Plugin</span> | <span class="type boolean">Boolean</span>

| Arguments | |
|:-|-|
|`config`| <span class="type object">Object</span>|
|`page`| <span class="type sate">Sate.Page</span>|

This method is called at render time, during the render pipeline of `page`. The `config` object contains any render-time configuration provided by the user for the plugin. Your implementation should return a single instance of your plugin, which will be injected directly into the render pipeline.

This is also your final opportunity to customize or configure the plugin object prior to rendering.

The Sate.Plugin prototype provides a default implementation which uses the `config` and attempts to match a plugin instance by `id`, then by `classes` and `type`, and finally locates the first instance by `type`. If it is able to locate an instance, it uses Sate.chain to merge in the `config` properties. If your plugin has no special render-time configuration needs you can omit this method in your implementation.

If you do wish to do render-time configuration, or provide special handling for plugin instances pre-render, you can still take advantage of the prototype implementation by calling:

    var obj = this.prototype.objectToRender.call(this, config, page);
    
at the top of your own implementation of `objectToRender`.

If you choose to implement this method without calling the prototype implementation, you should remember to merge the `config` properties into your instance:

    if (!obj || obj == null) {
        obj = Sate.chain.inPlace(this, config);
    } else {
        obj = Sate.chain(obj, config);
    }
    
If you wish to cancel the render of the plugin instance, return `false` from this method.


{{{plugin-sate-sequenceNav}}}

