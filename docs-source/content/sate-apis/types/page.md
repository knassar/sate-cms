{
    "classes": ["api-doc"]
}

@intro:

The Page object represents any given page in the website. Pages are structured in a rooted graph, with each page (except the root page) having one parent, and 0–n sub-pages.

@content:

## Properties

All properties on the Page object should be treated as read-only. Modifying any properties of the Page object directly can result in unpredictable behavior. Properties which can safely be mutated have associated mutating methods, which should be used.

The following properties are available on a Page instance.

### <a name="name"></a>`name` <span class="type string">String</span>

The resolved page name.

### <a name="articleSort"></a>`articleSort` <a class="type sate" href="/sate-apis/types/sate#indexSort">Sate.IndexSort</a>

The resolved sorting rule for Index page article intros.

### <a name="type"></a>`type` <a class="type sate" href="/sate-apis/types/sate#pageType">Sate.PageType</a>

The resolved page type.

### <a name="subPages"></a>`subPages` <span class="type object">Object</span>

An object containing instances of Sate.Page keyed by each isntance's `id` property.

### <a name="date"></a>`date` <span class="type date">Date</span>

The modfied date of the page content.

### <a name="created"></a>`created` <span class="type date">Date</span>

The creation date of the page content.

### <a name="modified"></a>`modified` <span class="type date">Date</span>

The modfied date of the page content.

### <a name="encoding"></a>`encoding` <span class="type string">String</span>

The encoding of the page content file. Defaults to `utf-8`.

### <a name="parser"></a>`parser` <a class="type sate" href="/sate-apis/types/sate#parser">Sate.Parser</a>

The content parser identified by Sate (either by inference or set explicitly) for the page's content.

### <a name="id"></a>`id` <span class="type string">String</span>

The key used internally to identify the page within it's parent's subPages object.

### <a name="parent"></a>`parent` <span class="type sate">Sate.Page</span>

A reference to the page's parent Sate.Page.

### <a name="isRoot"></a>`isRoot` <span class="type boolean">Boolean</span>

`true` if the page instance is the website root page. Otherwise `false`.

### <a name="classes"></a>`classes` <span class="type array">Array</span>

An array of strings which are concatenated with `[SPACE]` and applied to the page's `body` HTML tag `class` attribute. Plugins may add classes to this array using the [addClass](#addClass) method.

## Methods

### `hasContent()` <span class="arrow r"></span>  <span class="type boolean">Boolean</span>

Returns `true` if the page has a **`@content:`** section defined. Otherwise returns `false`.

### `hasIntro()` <span class="arrow r"></span>  <span class="type boolean">Boolean</span>

Returns `true` if the page has an **`@intro:`** section. Otherwise returns `false`.

### `hasSubpages()` <span class="arrow r"></span>  <span class="type boolean">Boolean</span>

Returns `true` if the page has sub-pages. Otherwise returns `false`.

### <a name="addClass"></a>`addClass(className)`

| Arguments | |
|:-|-|
|`className`| <span class="type string">String</span>|

Adds `className` to the page's `classes` array. This method is only available during the compile phase. Attempts to modify the `classes` array during render will cause an error.

### <a name="eachSubpage"></a>`eachSubpage(method, recurseSubpages)`

| Arguments | |
|:-|-|
|`method`| <span class="type function">Function</span>|
|`recurseSubpages`| <span class="type boolean">Boolean</span>|

Performs `method` on each sub-page of the receiver. If `recurseSubpages` is `true` and the sub-page itself has sub-pages, the method will be invoked recursively.

The `method` function is passed the Sate.Page instance it is operating on. 


### <a name="pluginById"></a>`pluginById(pluginId)` <span class="arrow r"></span>  <a class="type sate" href="/sate-apis/types/plugin">Sate.Plugin</a> | <span class="type null">NULL</span>

| Arguments | |
|:-|-|
|`pluginId`| <span class="type string">String</span>|

This method returns the [Sate.Plugin][plugin] instance which matches the provided `id`, or `null` if none can be found.

### <a name="pluginFirstByType"></a>`pluginFirstByType(pluginType)` <span class="arrow r"></span>  <a class="type sate" href="/sate-apis/types/plugin">Sate.Plugin</a> | <span class="type null">NULL</span>

| Arguments | |
|:-|-|
|`pluginType`| <span class="type string">String</span>|

This method returns the first [Sate.Plugin][plugin] instance which matches the provided `pluginType`, or `null` if none can be found.

### <a name="pluginsByType"></a>`pluginsByType(pluginType)` <span class="arrow r"></span>  <span class="type array">Array</span>

| Arguments | |
|:-|-|
|`pluginType`| <span class="type string">String</span>|

This method returns an array of [Sate.Plugin][plugin] instances which match the provided `pluginType`. If none are found, returns an empty array.

### <a name="pluginByTypeAndClassName"></a>`pluginByTypeAndClassName(type, className)` <span class="arrow r"></span>   <a class="type sate" href="/sate-apis/types/plugin">Sate.Plugin</a> | <span class="type null">NULL</span>

| Arguments | |
|:-|-|
|`type`| <span class="type string">String</span>|
|`className`| <span class="type string">String</span>|

This method returns the [Sate.Plugin][plugin] instance which matches the provided plugin `type` and whose `classes` array contains the `className`, or `null` if none can be found.


### <a name="pageAscent"></a>`pageAscent()` <span class="arrow r"></span> <a class="type sate" href="/sate-apis/types/page-descriptor">Page Descriptor</a>

Returns an enhanced [Page Descriptor][pagedescr] reprsenting the lineage of the current page. The descriptor includes two additional properties: 
 
 * `isRoot` which is equal to the descriptor target's `isRoot` property.
 * `parent` which is a similarly structured Page Descriptor representing the target's parent page, or `null` if `isRoot` is `true`.

### <a name="descriptor"></a>`descriptor()` <span class="arrow r"></span> <a class="type sate" href="/sate-apis/types/page-descriptor">Page Descriptor</a>

Returns the page's [Page Descriptor][pagedescr].

### <a name="rootPage"></a>`rootPage()` <span class="arrow r"></span> <span class="type sate">Sate.Page</span>

Returns the first ancestor page for which `isRoot` is `true`. 



[page]:/sate-apis/types/page
[plugin]:/sate-apis/types/plugin
[pagedescr]: /sate-apis/types/page-descriptor


{{{plugin-sate-sequenceNav}}}

