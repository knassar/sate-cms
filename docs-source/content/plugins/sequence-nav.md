@intro:

The Sequence Nav plugin provides an easy way to inject navigational elements for ordered sequential pages, such as the documentation pages on this site.

@content:

The primary way to use `plugin-sequence-nav` is to simply include the following:

{{=<% %>=}}

    {{{plugin-sate-sequenceNav}}}

<%={{ }}=%>

The default behavior for the plugin is to ascend the sitemap until it finds the first parent of the current page that is of type `Sate.PageType.Index`. Once it has located this page, it finds the current page in the index's set of articles, and constructs the "previous" and "next" page links based on the current page's position within the article list.

In most cases this is sufficient. However, you can also manually control the "previous" or "next" links, or even specify a sequence which is unrelated to the parent index page, by using the more verbose configuration instance syntax:

{{=<% %>=}}

    {{#plugin-sate-sequenceNav}}
    {
        ...
    }
    {{/plugin-sate-sequenceNav}}

<%={{ }}=%>


### Optional Properties

The following properties can be used to adjust the default behavior of the Sequence Nav plugin:

#### `sequence` <span class="type array">Array</span>

An Array of [Page descriptors](/docs/page-data#pageDescriptors) to use as the sequence. Note that if the current page does not appear in the provided `sequence` then the plugin will not appear.


#### `classes` <span class="type array">Array</span>

Specifies an array of Strings to use as the `class` attribute on the outer `HTML` tag of the Sequence Nav instance.


#### `previousPrompt` <span class="type string">String</span>

A string to use as the prompt when rendering the previous page link. Defaults to "previous:"


#### `nextPrompt` <span class="type string">String</span>

A string to use as the prompt when rendering the previous next link. Defaults to "next:"


#### `prev` & `next` <a href="/docs/page-data#pageDescriptors" class="type page-descriptor">Page Descriptor</a>

`prev` and `next` properties allow you to override the sequence on a given page. This can be especially useful on the first or last page of a sequence to specify a jump to another unrelated sequence.



{{{plugin-sate-sequenceNav}}}

