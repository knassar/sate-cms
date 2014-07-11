{
    "classes": ["api-doc"]
}

@intro:

The Website object is an unenforced singleton available from the `Sate.currentSite` property to all code in the running application. Use of the Website instance is primarily as a gateway to individual pages, or to site-global configuration.

The Website object should be treated as a read-only object. Unless otherwise specified in these docs, modifying any properties of the Website object directly can result in unpredictable behavior.


@content:

## Properties

### <a name="json"></a>`json` <span class="type object">Object</span>

The parsed JSON object as loaded directly from the `website.json` file. 

### <a name="sitePath"></a>`sitePath` <span class="type string">String</span>

The fully-realized path to the website directory on the filesystem. 

### <a name="sateSources"></a>`sateSources` <span class="type string">String</span>

The fully-realized path to the `sate-cms` sub-directory within the website on the filesystem. 

### <a name="rootPage"></a>`rootPage` <a class="type sate" href="/sate-apis/types/page">Sate.Page</a>

A reference to the root [Sate.Page][page]. This is equivalent to calling `pageForPath('/')`.

## Methods

### <a name="pageForPath"></a>`pageForPath(url) `<span class="arrow r"></span>  <a class="type sate" href="/sate-apis/types/page">Sate.Page</a>

| Arguments | |
|:-|-|
|`url`| <span class="type string">String</span>|

Returns the [Sate.Page][page] instance referenced by `url`, if it exists. Otherwise, returns the Sate.Page instance representing `HTTP 404`.

### <a name="hasPageForPath"></a>`hasPageForPath(url) `<span class="arrow r"></span>  <span class="type boolean">Boolean</span>

| Arguments | |
|:-|-|
|`url`| <span class="type string">String</span>|

Returns `true` if the `url` argument resolves to a valid page, `false` if not.

[page]:/sate-apis/types/page


{{{plugin-sate-sequenceNav}}}

