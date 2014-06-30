{{#pageData}}
{
    "plugins": [
        {
            "type": "sate-pageMenu",
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
                {
                    "url": "/about-sate"
                }
            ]
        },
        {
            "type": "sate-pageMenu",
            "id": "pageMenu",
            "items": false
        }
    ]
}
{{/pageData}}
{{<content}}

## Basic principles

Sate is a minimum set of features built on top of a lightweight framework. Sate provides a developer-friendly CMS to drive a website. By using Javascript & Node.js, it is highly portable, and features a plugin-based architecture for extensibility.

## Key Philosophies

Design decisions in Sate have been driven by the following underlying philosophies:

<div class="todo">Make this make more sense!</div>
    
 * Convention before Configuration - Unless something is genuinely unusual, there's no sense in making someone configure it... ship with intelligent defaults.
 * Override instead of Declare - If a value at one level is the same as one level up, don't make me declare it again.
 * Don't make me repeat myself - Default where possible, Template where necessary

## Key features

 * Directly edit markup, styles, and scripts as if you were hand-coding a site
 * "Template inversion" approach means individual pages have no "ceremony" necessary
 * Automatic modern CMS facilities such as:
   * breadcrumb navigation
   * digest pages
   * image galleries
 * Content is stored on the filesystem in individual files, prime for SCM management
 * Developer-friendly workflow:
   * Edit & Refresh "develop" server for rapid iteration of site content
   * deploy the entire site as static pages for high-performance

{{</content}}