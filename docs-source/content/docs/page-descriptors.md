
@intro:

In various places within Sate, it is useful to make references to other pages within the Sate website. For example, several Sate Plugins generate references to other pages in your website. Sate has a standard representation of a page which is used in these cases, the Page Descriptor.

@content:

Either of the following are valid Page Descriptors:

### String Page Descriptor <span class="type string">String</span>

When the Page Descriptor is a string, it must be the root-relative final URL of the target page:

    "page": "/my/path/to/page"
    

### Object Page Descriptor <span class="type object">Object</span>

There are cases where you may want to provide additional information to the page reference in the descriptor. For example, for a descriptor for a Menu plugin link, you may want the menu link to use a shortened version of the Page Name in the menu for brevity. In these cases, you can pass an object as the page descriptor:

    "page": {
        "url": "/my/path/to/page",
        "name": "The Page"
    }

When using an object, you **must** provide the `url` key at a minimum, which must conform to the String Page Descriptor pattern above. Additional properties are valid, and will be passed along to the referencing object. 



{{#plugin-sate-sequenceNav}}
{
    "next": "/plugins"
}
{{/plugin-sate-sequenceNav}}

