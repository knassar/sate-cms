{
    "classes": ["api-doc"]
}

@intro:

The PageDescriptor is a light-weight JavaScript object that conforms to a minimum spec. 

@content:

PageDescriptors are typically used by a user to specify a page to Sate code. See [Documentation: PageDescriptors](/docs/page-descriptors) for more on how users can declare page descriptors.

PageDescriptors coming from user configuration should always be normalized through the [Sate.pageDescriptor](/sate-apis/types/sate#pageDescriptor) method to ensure it is valid and properly materialized.

When normalized through `Sate.pageDescriptor()` or retrieved from `somePage.descriptor()` a PageDescriptor will always have the following properties at minimum:

### `url` <span class="type string">String</span>

The URL for the page.

### `name` <span class="type string">String</span>

The page name.


{{{plugin-sate-sequenceNav}}}

