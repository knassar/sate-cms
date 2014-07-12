{
    "classes": ["api-doc"]
}

@intro:

<p class="todo">This page is incomplete</p>

The Sate.Plugin is the primary mechanism by which you can extend Sate's features. 


@content:

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

### `version`  <span class="type string">String</span>

A numeric version string in the format of `1.0.0`. This version is used by the `sate update` command to determine whether or not a plugin needs updating.

### `templates`  <span class="type object">Object</span>

An dictionary of templates and partials used by the plugin. The object key is the partial name, and the value is the template filepath relative to the plugin directory.

### `stylesheets`  <span class="type array">Array</span>

An array of `CSS` resources used by the plugin when rendered in the client. Filepaths must be relative to the plugin directory.

### `scripts`  <span class="type array">Array</span>

An array of Script client-side resources used by the plugin. Filepaths must be relative to the plugin directory



## Methods to Override

### <a name="compile"></a> `compile(props, page, complete)`

| Arguments | |
|:-|-|
|`props`| <span class="type object">Object</span>|
|`page`| <span class="type sate">Sate.Page</span>|
|`complete`| <span class="type function">Function</span>|

In the `compile` method, the plugin should perform all actions and processing it needs to perform during the `compile` Sate lifecycle phase. 

The `props` argument is the compile-time configuration of the plugin instance provided by the user.

The `page` argument is the Sate.Page on which the plugin was instantiated.

The `complete` argument is a callback to tell Sate that your plugin is done compiling.

This method is called on each plugin instance as the last phase of the website compile process, after all pages have been compiled. When compile is invoked on a plugin, all website and page assets *except* other plugins are guaranteed to have been compiled and prepared for render.

The Sate.Plugin prototype provides a default noop implementation, so if your plugin has nothing to do at `compile` time, you can omit this method in your implementation.

### <a name="objectToRender"></a> `objectToRender(config, page)`<span class="arrow r"></span> <span class="type sate">Sate.Plugin</span> | <span class="type boolean">Boolean</span>

| Arguments | |
|:-|-|
|`config`| <span class="type object">Object</span>|
|`page`| <span class="type sate">Sate.Page</span>|

This method is called at render time, during the render pipeline of `page`. The `config` object contains any render-time configuration provided by the user for the plugin. Your implementation should return a single instance of your plugin, which will be injected directly into the render pipeline.

This is your final opportunity to customize or configure the plugin object prior to rendering.

The Sate.Plugin prototype provides a default implementation which uses the `config` and attempts to match a plugin instance by `id`, then by `classes` and `type`, and finally locates the first instance by `type`. If it is able to locate an instance, it uses Sate.chain to merge in the `config` properties. If your plugin has no special render-time configuration needs you can omit this method in your implementation.

If you do wish to do render-time configuration, or provide special handling for plugin instances pre-render, you can still take advantage of the prototype implementation by calling:

    var obj = Sate.Plugin.prototype.objectToRender.call(this, config, page);
    
at the top of your own implementation of `objectToRender`.

If you choose to implement this method without calling the prototype implementation, you should remember to merge the `config` properties into your instance:

    if (!obj || obj == null) {
        obj = Sate.chain.inPlace(this, config);
    } else {
        obj = Sate.chain(obj, config);
    }
    
If you wish to cancel the render of the plugin instance, return `false` from this method.


{{{plugin-sate-sequenceNav}}}

