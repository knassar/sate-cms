{{#pageData}}
{
    "name": "Anatomy of a Sate website"
}
{{/pageData}}
{{<intro}}

A website using Sate is structured in two parts: 

 * A JSON file containing the site configuration and an object map of all the website's pages
 * A file structure in which each "page" in the site is represented by an HTML or Markdown file
 
{{</intro}}
{{<content}}
## The Sate website.json

This file contains the site-level configuration. Here's an example of a Site website.json file:

<pre class="json">
{
    "config": {
        "rootPage": "home",
        "rootPageUrl": "/",
        "contentSources": "./content",
        "encoding": "utf-8"
    },
    "pageDefaults": {
        "title": "Sate",
        "classNames": "sate-docs",
        "subtitle": "Just Enough CMS"
    }
}
</pre>

## The Sate site files

Given the website.json above, Sate will scan the current directory for the `content` directory. Lets assume the content looks like this:

<pre>
    ./content
        index.html
        about.html
        /docs
            index.html
            sate-website.html
            using-sate.html
</pre>

When serving these pages as a website, Sate maps the above file structure into URLs like so:

<table>
    <tr><th>URL</th><th>Content file path</th></tr>
    <tr><td>[domain]/</td><td>./index.html</td></tr>
    <tr><td>[domain]/about</td><td>./about.html</td></tr>
    <tr><td>[domain]/docs</td><td>./docs/index.html</td></tr>
    <tr><td>[domain]/docs/sate-website</td><td>./docs/sate-website.html</td></tr>
    <tr><td>[domain]/docs/using-sate</td><td>./docs/using-sate.html</td></tr>
</table>

Each of these files is an HTML fragment file which contains "Just Enough" content to render the page when combined with the data from website.json and information Sate infers from the structure.

Sate is built on the concept of "template inversion", which means that in the file for each page, you write & declare only the details that are different for that page. There's no need to include common headers, footers, includes, etc, unless those elements differ from the rest of the site. And when any element does differ on a given page, [the chain][/docs/sate-chain] lets you override previously established properties at the individual page level.

There are currently 3 special blocks that Sate will look for in a content file. Any of these blocks may be omitted, and Sate will generally do the right thing:

<table>  
    <tr><th>Block       </th><th>Type           </th><th>Purpose</th></tr>
    <tr><td>pageData    </td><td>JSON           </td><td>a JSON object to override properies for this page</td></tr>
    <tr><td>intro       </td><td>inline-partial </td><td>the Intro section markup for this page</td></tr>
    <tr><td>content     </td><td>inline-partial </td><td>the Content section markup for this page</td></tr>
</table>

The `pageData` block is a standard Mustache section which Sate expects to include JSON.

Inline-partial blocks are represented by using Mustache.js brackets in a "reverse partial" notation surrounding HTML-style tag opens/closes:

<pre>
&#123&#123&lt;blockName&#125&#125
    block content
&#123&#123&lt;/blockName&#125&#125
</pre>

You should think of this notation as an inline declaration of a Mustache partial, whose partial name is given in the brackets (because that's in-fact what it is). All inline-partials (not just the ones described above) declared in a page's HTML file will be parsed and injected into the partials dictionary before the page is rendered. You can leverage this process to help keep your `intro` and `content` blocks DRY by declaring one-off inline partials and then referencing them from the same file.

Here's an example of a content file using all 3 blocks:

<pre>
&#123&#123#pageData&#125&#125
    {
        "date": '2013-06-13',
        "title": "Some Good Title"
    }
&#123&#123/pageData&#125&#125
&#123&#123&lt;intro&#125&#125
    &lt;p&gt;
        Here&#x27;s some arbitrary intro text, which appears at 
        the top of the page, but is also extracted and displayed 
        in Index pages.
    &lt;/p&gt;
    &lt;p class=&quot;cool&quot;&gt;
        Notice that there&#x27;s no repetition of the page name in this content
    &lt;/p&gt;
&#123&#123&lt;/intro&#125&#125
&#123&#123&lt;content&#125&#125
    &lt;p&gt;
        Here&#x27;s where the meat of the page goes
            ... 
        this is just Plain-ole HTML
    &lt;/p&gt;
    &lt;script type="text/javascript"&gt;
        $(function() {
            // Here&#x27;s where I can hook up any page-level scripts I want to run.
        });
    &lt;/script&gt;
&#123&#123&lt;/content&#125&#125
</pre>

{{{plugin-sate-sequenceNav}}}
{{</content}}