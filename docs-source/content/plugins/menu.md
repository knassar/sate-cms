{
    "extraStyles": [
        "/styles/sate-chain.css"
    ]
}

@intro:

The Menu plugin is highly flexible and configurable. It is responsible for generating top-level website navigation, as well as page-level sub-menus.

@content:

With the Sate Menu plugin, care has been taken to make specifying a menu as clear and light-weight as possible. Additionally, the default behaviors have been designed to ensure that they serve the most commonly used cases, and require overriding only in a handful of special circumstances.

As an example, the plugin configuration for this Sate documentation site's Main Menu is below. Note that because we have set the `inherited` property to `true`, we only need to specify this plugin once in the root `index` page:

    {
        "type": "sate-menu",
        "id": "siteMenu",
        "inherited": true,
        "items": [
            {
                "name": "Home",
                "url": "/"
            },
            {
                "includeSublevel": true,
                "url": "/docs"
            },
            {
                "includeSublevel": true,
                "url": "/plugins"
            },
            "/about-sate"
        ]
    }

In contrast, the page-specific menu on the left-hand side of this page is configured like so:

    {
        "type": "sate-menu",
        "id": "pageMenu",
        "inherited": true,
        "parentLink": true
    }

You can see that while both of these are of type `sate-menu`, and both are `inherited`, they otherwise differ quite dramatically.

The `siteMenu` config above specifies a list of `items` using [Page Descriptors][pagedescr], while the `pageMenu` config doesn't even include an `items` property. That's because in the `pageMenu` case, we are happy to let Sate infer the menu items and their ordering, which we have already specified for the related `/plugins` index page.

The Menu plugin will automatically mark any menu items which correspond to the current page URL with the CSS class `active`.

### Menu Properties 

The following properties are available for configuring the `sate-menu` plugin.

#### `mainTag` <span class="type string">String</span>

The `HTML` tag name to use for the list element. Defaults to `ul`.


#### `inherited`  <span class="type boolean">Boolean</span>

If `true`, sub-pages of the page on which the menu is specified will automatically inherit this config for the `id`. Inheritance descends recursively except when overridden by a sub-page on the given `id`. Defaults to `false`.


#### `parentLink`  <span class="type boolean">Boolean</span>

If `true`, adds an "up" link to the nearest Index page. Defaults to `false`.


#### `items` <span class="type array">Array</span> |  <span class="type boolean">Boolean</span>

Specifies an array of [Page Descriptors][pagedescr] forming the menu items. When not specified, Sate will use Chain behavior to infer an intelligent default set of items:

<ol class="the-chain-diagram">
    <li><span>nearest Index's articles</span></li>
    <li><span>`items` array</span></li>
</ol>

To suppress a menu inherited from a sub-page, override the `items` property to `false`


### `items` Page Descriptor Properties 

In addition to the standard [Page Descriptors][pagedescr] behavior, the following additional properties are supported on individual Page Descriptor objects within the `items` array:

#### `classes` <span class="type array">Array</span>

Specifies an array of Strings to use as the `class` attribute on the Menu Item.


#### `items` <span class="type array">Array</span>

Specifies an array of [Page Descriptors][pagedescr] representing items for a sub-menu. This can recurse as deep as you like.


#### `includeSublevel` <span class="type boolean">Boolean</span>

If the descriptor resolves to a page which has sub-pages, then include a sub-level menu for those items. If an `items` array has been specified for the current item, this property has no effect.


### Menu Separator Labels

The Menu plugin supports an additional feature for breaking up a long list of items. When the `items` array includes an object with a `name` but no `url`, instead of treating this as an error (an invalid [Page Descriptor][pagedescr]), the Menu plugin will include the `name` string, and add the class attribute `subtitle` to the menu item. This turns the item into a semantic break, labeling items below it.



[pagedescr]: /docs/page-data#pageDescriptors


{{{plugin-sate-sequenceNav}}}

