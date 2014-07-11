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

OK. Yes. Another one. Why? Because I had an idea for a minimalist system that could replace my previous website tools, I wanted to do something fairly complicated in [node](nodejs.org) to keep my JavaScript chops up, and I needed a new way to set up and update my various websites.

Along the way, Sate has gotten more capable as I've accomodated additional features, but I'm very pleased with how little effort (and how little markup/code beyond the actual content) it takes to build quite a large and content-heavy website in Sate.

I'm sure that the sentence "But *`x`* can do that..." will be tossed about. My simple response is that I'd rather know a system inside and out because I built it and have it reflect my personal vision, than to spend a lot of time learning a system that reflects someone else's.

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
 * Content is stored on the filesystem in individual files, prime for SCM management. Sate is backing agnostic.
 * A Developer-friendly workflow:
   * Command-Line Interface
   * Edit & Refresh "develop" server for rapid iteration of site content
   * Deploy the entire site as static pages for high-performance

