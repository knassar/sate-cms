{
    "extraStyles": [
        "/styles/sate-chain.css"
    ]
}


@intro:

The Sate Plugin architecture is designed to enable extension of core Sate features. Plugins in Sate are encapsulated bundles of logic, templates, and styles with an API designed to be as flexible as possible, while keeping the code tightly focused on the specific features provided by each plugin.

@content:

## Installing Plugins

Sate comes pre-installed with several useful plugins. When you use the [`sate create`](/docs/using-sate#create) command, Sate will install all current plugins in your new website. If you wish to install custom or third-party plugins, simply copy the plugin's directory (or `npm install` it) into your website's `sate-cms/plugins` directory.


### Uninstalling Plugins

To uninstall a plugin, simply delete it from your website's `sate-cms/plugins` directory.

### Updating Sate Plugins

To update Sate plugins, use the [`sate update`](/docs/using-sate#update) command.


## Instantiating Plugins

You can include an installed plugin's instantiation anywhere in the [Page Data chain][1]. Plugins are instantiated by adding them to the page's `plugins` array. Some basic plugins are included as Sate defaults. Some will be instantiated in your website's root page, and others on a page-by-page basis. A typical example of plugin instantiation is:

    {
        "plugins": [
            {
                "type": "sate-breadcrumbs",
                "id": "mainBreadcrumbs"
            },
            {
                "type": "sate-breadcrumbs",
                "classes": ["article-intro-breadcrumbs"]
            },
            {
                "type": "sate-sequenceNav"
            }
        ]
    }

This is actually the Sate Page default plugins declaration. It declares three plugins available to every page: two instances of sate-breadcrumbs, and one instance of sate-sequenceNav. 

Once a plugin is instantiated, it is included in a page using either the simple syntax:

{{=<% %>=}}

    {{{plugin-pluginName}}}

Or in cases where you wish to further configure or override a particular instance, the more complex Render-time Configuration syntax:

    {{#plugin-pluginName}}
    {
        ... configuration JSON goes here ...
    }
    {{/plugin-pluginName}}

<%={{ }}=%>

## The Plugin Configuration Chain

Plugin instances in Sate utilize a specific chain sequence to derrive their configuration:

<ol class="the-chain-diagram">
    <li><span>Sate defaults</span></li>
    <li><span>The [Page Data chain][1]</span></li>
    <li><span>Render-time plugin configuration</span></li>
</ol>

### Render- vs Compile-time Configuration

The plugin lifecycle has two distinct phases: Compile and Render. Compile takes place during the website and page compilation process, and configuration applied in Sate defaults or the [Page Data chain][1] occur during compile. This means that unless overridden at render-time, this plugin configuration is essentially global to all renderings of the plugin instance.

Plugin configuration provided by Render-time Configuration applies only to the single rendering of that plugin instance, even if the plugin is rendered more than once on the same page.

## Common Plugin Properties

Each plugin will have its own particular configuration options depending on its function. The following properties are available and configurable on all Sate plugins. See individual plugin documentation for more options. 


#### `id` <span class="type string">String</span>

An identifier that is unique by plugin type by which to reference an individual configuration of the plugin type. While the `id` property is provided by the Plugin infrastructure, it is not required, but failure to declare an `id` can result in unpredictable results, as Sate cannot guarrantee which plugin instance will be rendered.


#### `classes` <span class="type array">Array</span>

Specifies an array of Strings to use as the `class` attribute on the plugin's outermost `HTML` tag.


[1]: /docs/page-data#chain


{{#plugin-sate-sequenceNav}}
{
    "prev": "/docs/page-descriptors"
}
{{/plugin-sate-sequenceNav}}
