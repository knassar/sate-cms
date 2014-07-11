{
    "type": "Sate.PageType.Index",
    "plugins": [
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
                    "url": "/getting-started"
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
                    "includeSublevel": true,
                    "url": "/sate-apis"
                },
                "/about-sate"
            ]
        },
        {
            "type": "sate-menu",
            "id": "pageMenu",
            "items": false
        },
        {
            "type": "sate-breadcrumbs",
            "id": "mainBreadcrumbs",
            "includePageName": false
        }
    ]
}

@content:

## What? *Another* Static Site Generator??

OK. Yes. Another one. Why? You can read more about it under [About Sate](/about-sate). But in case you just want to know what's cool about Sate, read on:


## Basic principles

Sate is a minimum set of features built on top of a lightweight framework. Sate provides a developer-friendly CMS to generate a website. By using Javascript & Node.js, it is highly portable, and features a plugin-based architecture for extensibility.

## Key Philosophies

Design decisions in Sate have been driven by the following underlying philosophies:
    
 * Convention before Configuration - Unless something is genuinely unusual, there's no sense in having to configure it.
 * Override instead of Declare - If a value at one level is the same as one level up, don't re-declare it.
 * Don't be repetitive - Be as concise as possible with everything that is not actual content.

## Key features

 * Directly edit markup, styles, and scripts as if you were hand-coding a site.
 * Automatic metadata inference lets you explicitly declare as little as possible about your website and pages.
 * Implicit Site-mapping allows you to focus on your content, instead of what the sitemap looks like.
 * "Template Inversion" approach means individual pages have no repetitive "ceremony" necessary.
 * Automatic modern CMS facilities such as:
   * Breadcrumb navigation
   * Digest pages
   * Image galleries
   * Plugin-based Extension
 * Content is stored on the filesystem in individual files, prime for SCM management. Sate is backing agnostic.
 * A Developer-friendly workflow:
   * Command-Line Interface
   * Edit & Refresh "develop" server for rapid iteration of site content
   * Deploy the entire site as static pages for high-performance

