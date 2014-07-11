@intro:

The Breadcrumbs plugin generates standard breadcrumb navigation and includes the page name.


@content:

The default behavior for the plugin is to ascend the sitemap from the current page to the site root (home page), generating a breadcrumb trail from which it renders the appropriate navigational links. The specific behavior of the breadcrumbs plugin is determined by its configuration.

A basic configuration of Sate Breadcrumbs is provided by default in the `html.tpl` template:

{{=<% %>=}}

    {{#plugin-sate-breadcrumbs}}
    {
        "id": "mainBreadcrumbs"
    }
    {{/plugin-sate-breadcrumbs}}

<%={{ }}=%>

Because it is included in the root template, it is uneccesary to include it in your content pages, unless you want to override it's configuration on a given page.

### Properties

The following properties can be used to adjust the default behavior of the Breadcrumbs plugin:

#### `headingTag` <span class="type string">String</span>

The `HTML` tag name to use for the Page Name when `includePageName` is `true`. Defaults to `h2`.


#### `separator` <span class="type string">String</span>

A string to use as the crumb separator. Defaults to ":".


#### `minCrumbs` <span class="type number">Number</span>

Minimum crumbs before rendering the breadcrumbs trail. This count excludes the current page and the website root page. Defaults to `1`.


#### `includePageName` <span class="type boolean">Boolean</span>

Whether or not to display the current page name in the breadcrumbs trail. Set this to `false` if you do not want to display the name of the page (for example, "Home"), or if you wish to handle the page name display in another fashion. Defaults to `true`.



{{{plugin-sate-sequenceNav}}}

