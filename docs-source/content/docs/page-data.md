{
    "extraStyles": [
        "/styles/sate-chain.css"
    ]
}
@intro:

Sate infers a great deal about individual pages from metadata that it can gather automatically, including filename, extension, file-system metadata (ie: creation/modification date), etc. However, sometimes the inferred values are not exactly what you want. In these cases, you can always override individual page properties using Page Data.


@content:

## Declaring Page Data

You can declare page-level overrides of inferred values at two different levels: In the `website.json` and at the top of a page's content file. These declarations are collapsed into a single configuration for each Page using the Page Data Chain:

### The Page Data Chain

<ol class="the-chain-diagram">
    <li><span>Sate Defaults</span></li>
    <li><span>`pageDefaults` in `website.json`</span></li>
    <li><span>Automatic Inference</span></li>
    <li><span>Page data block in content file</span></li>
</ol>

The page data block defined at the top of the page content file must contain valid JSON.

When using Sate types (such as Sate.PageType.Index), wrap the value in quotes:

    {
        "type": "Sate.PageType.Index"
    }

## Page Data Properties

You can set any data you wish in the page data block for use in page-level templates. However, there are several properties which have special meaning to Sate, and you should avoid any naming collisions. The following properties hold special meaning to Sate at the page level:

### <a name="parser"></a>`parser` <span class="type sate">Sate.Parser</span>

A supported `Sate.Parser` type with which to parse the page content. Supported values are:

 * `Sate.Parser.HTML`
 * `Sate.Parser.Markdown`

In the absence of an explicit declaration, Sate attempts to infer the parser from the file extension, then defaults to HTML if necessary.

### <a name="type"></a>`type` <span class="type sate">Sate.PageType</span>

A supported `Sate.PageType` to use for page content inference. Supported values are:

 * `Sate.PageType.Index`
 * `Sate.PageType.Article`

In the absence of an explicit declaration, Sate attempts to infer the type from the file name, inferring files named `index.*` as Sate.PageType.Index, and all others as Sate.PageType.Article.

The `type` property is used primarily to differentiate Index pages from Articles pages for the purpose of auto-generating Index page digests. When a page is typed as Sate.PageType.Index but defines its content block explicitly, the page type currently has no effect.


### <a name="indexSort"></a>`indexSort` <span class="type sate">Sate.IndexSort</span> | <span class="type array">Array</span>

A supported `Sate.IndexSort` or an Array of URLs to use for sorting auto-digest article headings in Index pages. Supported values are:

 * `Sate.IndexSort.DateDescending`
 * `Sate.IndexSort.DateAscending`

In the absence of an explicit declaration, the default `Sate.IndexSort.DateDescending` is used. 

To specify an explicit order manually, assign an Array of the page URLs in the desired order.


### <a name="template"></a>`template` <span class="type string">String</span>

The name of the root template to use for the page. Defaults to `html`


### <a name="classNames"></a>`classNames` <span class="type array">Array</span> | <span class="type string">String</span>

A String or Array of Strings which will be concatenated to the `class` HTML attribute of the page body.


### <a name="title"></a>`title` <span class="type string">String</span>

A String to use as the content for the `title` tag in the HTML head.

### <a name="subtitle"></a>`subtitle` <span class="type string">String</span>

A String to append to the content for the `title` tag in the HTML head.

### <a name="name"></a>`name` <span class="type string">String</span>

A String to use as the Page name in Menus, navigation, and as the primary heading of the page. In the absence of an explicit declaration, Sate will infer the page name in the following way:

 1. If the page's content filename is:
    * `index.*` use the containing directory name
    * not `index.*` use file name without extension
 2. Replace all `-` in the filename with a single space and all `--` with `-`
 3. Capitalize the first word and all subsequent words except `the`, `of`, `and`, `in`, and `from`


### <a name="date"></a>`date` <span class="type date">Date</span>

A String representing a date to be passed to the JavaScript Date() constructor. In the absence of an explicit declaration, Sate will use the filesystem `modified` date.

This date is used for the sorting of Index page article digests.


### <a name="created"></a>`created` <span class="type date">Date</span>

A String representing a date to be passed to the JavaScript Date() constructor. In the absence of an explicit declaration, Sate will use the filesystem `created` date.


### <a name="modified"></a>`modified` <span class="type date">Date</span>

A String representing a date to be passed to the JavaScript Date() constructor. In the absence of an explicit declaration, Sate will use the filesystem `modified` date.


### <a name="extraStyles"></a>`extraStyles` <span class="type array">Array</span>

An Array of additional stylesheets to include in the page header.

Each entry in the Array must uniquely identify a Stylesheet. Valid entries in the `extraStyles` Array are:

 * A String representing the root-relative URL of the stylesheet
 * An Object containing the key `href` whose value is the above URL, and optionally a `media` key whose value is the media attribute for the `link` tag


### <a name="extraScripts"></a>`extraScripts` <span class="type array">Array</span>

An Array of additional script files to include in the page.

Each entry in the Array must be a String representing the root-relative URL of the Script file.


### <a name="plugins"></a>`plugins` <span class="type array">Array</span>

An Array of plugin config objects to be compiled and used for the page. Each object must at minimum contain a `type` key identifying the Sate.Plugin-conforming plugin. Additional plugin configuration options are defined by the individual plugins.

{{#plugin-sate-sequenceNav}}
{
    "next": "/plugins"
}
{{/plugin-sate-sequenceNav}}

