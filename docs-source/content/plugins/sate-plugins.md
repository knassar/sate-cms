

@intro:

The Sate Plugin architecture is designed to enable extension of core Sate features. Plugins in Sate are encapsulated bundles of logic, templates, and styles with an API designed to be as flexible as possible, while keeping the code tightly focused on the specific features provided by each plugin.

@content:

## Installing Plugins

Sate comes pre-installed with several useful plugins. When you use the [`sate create`](/docs/using-sate#create) command, Sate will install all current plugins in your new website. If you wish to install custom or third-party plugins, simply copy the plugin's directory (or `npm install` it) into your website's `sate-cms/plugins` directory.


### Uninstalling Plugins

To uninstall a plugin, simply delete it from your website's `sate-cms/plugins` directory.

### Updating Sate Plugins

To update Sate plugins, use the [`sate update`](/docs/using-sate#update) command.


## Declaring Plugins

You can include an installed plugin's declaration anywhere in the [Page Data chain](/docs/page-data#chain). Plugins are declared by adding them to the page's `plugins` array. Some basic plugins are included as Sate defaults. Some will be declared in your website's root page, and others will be declared on a page-by-page basis. A typical example of plugin declaration is:

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

Once a plugin is declared, it is instantiated using either the simple syntax:

{{=<% %>=}}

    {{{plugin-pluginName}}}

Or in cases where you wish to further configure or override a particular instance, the more complex syntax:

    {{#plugin-pluginName}}
    {
        ... configuration JSON goes here ...
    }
    {{/plugin-pluginName}}

<%={{ }}=%>

### Common Plugin Properties

Each plugin will have its own particular configuration options depending on its function. The following properties are available and configurable on all Sate plugins. See individual plugin documentation for more options. 


#### `id` <span class="type string">String</span>

A unique identifier by which to reference an individual configuration of the plugin type. While the `id` property is provided by the Plugin infrastructure, it is not required. 


#### `classes` <span class="type array">Array</span>

Specifies an array of Strings to use as the `class` attribute on the plugin's outermost `HTML` tag.





{{#plugin-sate-sequenceNav}}
{
    "prev": "/docs/page-descriptors"
}
{{/plugin-sate-sequenceNav}}
