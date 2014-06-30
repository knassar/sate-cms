{{#pageData}}
{
    "name": "Anatomy of a Sate website"
}
{{/pageData}}
{{<intro}}
    <p>
        A website using Sate is structured in two parts: 
    </p>
    <ol>
        <li>A JSON file containing the site configuration and an object map of all the website's pages</li>
        <li>A file structure in which each "page" in the site is represented by an HTML file</li>
    </ol>
{{</intro}}
{{<content}}
    <h3>The Sate website.json</h3>
    <p>
        This file Contains two major areas, the site-level configuration, and the map of pages to be served. Here's an example of a Site website.json file:
    </p>
<pre class="json">
    {
        "siteConfig": {
            "title": "Sate",
            "subtitle": "Just Enough CMS",
            "breadcrumbSeparator": ":"
        },
        "siteMap": {
            "home": {
                "type": "Sate.PageType.Index",
                "name": " ",
                "subPages": {
                    "docs": {
                        "type": "Sate.PageType.Index",
                        "name": "Documentation",
                        "subPages": {
                            "sate-website": {
                                "name": "Anatomy of a Sate website"
                            },
                            "using-sate": {
                                "name": "Using Sate"
                            }
                        },
                        "menu": {
                            "sub": [
                                {
                                    "url": "/docs/sate-website"
                                },
                                {
                                    "url": "/docs/using-sate"
                                }
                            ]
                        }
                    },
                    "about": {
                        "type": "Sate.PageType.Article",
                        "name": "About Sate"
                    }
                },
                "menu": {
                    "name": "Home"
                }
            }
        }
    }
</pre>

<h3>The Sate site files</h3>
<p>
Given the website.json above, Sate will assume a file structure exists that looks like this:
</p>
<pre>
    ./
        index.html
        about.html
        /docs
            index.html
            sate-website.html
            using-sate.html
</pre>

<p>
When serving pages, Sate maps the above structure to URLs like so:
</p>

<table>
    <tr><th>URL</th><th>Content file path</th></tr>
    <tr><td>[domain]/</td><td>./index.html</td></tr>
    <tr><td>[domain]/about</td><td>./about.html</td></tr>
    <tr><td>[domain]/docs</td><td>./docs/index.html</td></tr>
    <tr><td>[domain]/docs/sate-website</td><td>./docs/sate-website.html</td></tr>
    <tr><td>[domain]/docs/using-sate</td><td>./docs/using-sate.html</td></tr>
</table>

<p>
    Each of these files is an HTML Fragment file which contains "Just Enough" content to render the page when combined with the data from website.json.
</p>
<p>
    Sate is built on the concept of "template inversion", which means that in the file for each page, you write &amp; declare only the details that are different for that page. There's no need to include common headers, footers, includes, etc, unless those elements differ from the rest of the site. And when any element does differ on a given page, <a href="/docs/sate-chain">the chain</a> lets you override previously established properties at the individual page level.
</p>
<p>
There are currently 3 special blocks that Sate will look for in a content file. Any of these blocks may be omitted, and Sate will generally do the right thing:
</p>
<table>  
    <tr><th>Block       </th><th>Type           </th><th>Purpose</th></tr>
    <tr><td>pageData    </td><td>JSON           </td><td>a JSON object to override website.json properies for this page</td></tr>
    <tr><td>intro       </td><td>inline-partial </td><td>the Intro section markup for this page</td></tr>
    <tr><td>content     </td><td>inline-partial </td><td>the Content section markup for this page</td></tr>
</table>
<p>
The <code>pageData</code> block is a standard Mustache section which Sate expects to include JSON.
</p>
<p>
Inline-partial blocks are represented by using Mustache.js brackets in a "reverse partial" notation surrounding HTML-style tag opens/closes:
</p>

<pre>
&#123&#123&lt;blockName&#125&#125
    block content
&#123&#123&lt;/blockName&#125&#125
</pre>

<p>
    You should think of this notation as an inline declaration of a Mustache partial, whose partial name is given in the brackets (because that's in-fact what it is). All inline-partials (not just the ones described above) declared in a page's HTML file will be parsed and injected into the partials dictionary before the page is rendered. You can leverage this process to help keep your <code>intro</code> and <code>content</code> blocks DRY by declaring one-off inline partials and then referencing them from the same file.
</p>
<p>
    Here's an example of a content file using all 3 blocks:
</p>

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