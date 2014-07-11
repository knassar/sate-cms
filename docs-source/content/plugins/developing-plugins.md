
@content:

## The `Plugin.js` Base Class

### Methods to Implement

    compile(props, page, Sate, complete)
    objectToRender(config, page)





### Readonly Plugin Properties

The following properties are defined in the plugin implementation code and are not configurable by the user. These are overridden in your plugin code.

#### `type`  <span class="type string">String</span>

A string name identifying the plugin's directory. The `type` property must match the source directory of the plugin.

#### `version`  <span class="type string">String</span>

A numeric version string in the format of `1.0.0`. This version is used by the `sate update` command to determine whether or not a plugin needs updating.

#### `templates`  <span class="type object">Object</span>

An dictionary of template partials used by the plugin. The object key is the partial name, and the value is the template filepath relative to the plugin directory.

#### `stylesheets`  <span class="type array">Array</span>

An array of `CSS` resources used by the plugin when rendered in the client. Filepaths must be relative to the plugin directory.

#### `scripts`  <span class="type array">Array</span>

An array of Script client-side resources used by the plugin. Filepaths must be relative to the plugin directory





{{{plugin-sate-sequenceNav}}}
