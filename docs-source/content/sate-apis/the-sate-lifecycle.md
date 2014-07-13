
@intro: 

<p class="todo">This Page is Incomplete</p>

While the process by which Sate builds web pages differs in various ways between the different Sate commands, in all cases there are two distinct phases in its process for generating a page: Compile and Render. We refer to these two phases, the processes around them, and the details of each phase as the Sate Lifecycle.

@content:

The most important distinction between the two phases is that while Render occurs on a single page (or in the case of `deploy` a single page at a time), Compile involves the compilation of the entire website, and thus resolves dependencies across all pages. This means that Plugin code that you write for compile-time has access to not just the page the plugin has been invoked from, but through the [`Sate.currentSite`](/sate-apis/types/sate#currentSite) property, the entire website, and every page within it. Sate leverages this in its various dynamic navigation plugins. 

## Compile

 1. Load & Parse `website.json`
 1. Load Base Templates
 1. Crawl Content Directory & Create Page Graph
 1. Compile Pages

   1. Load Page-Specific Partials
   1. Load Content File
   1. Parse Page Data
   1. Parse Content Section Blocks

 1. Compile Index Page Digests

   1. Identify Articles for Digest
   1. Resolve Plugins for Article Intros
   1. Render Article Intro Snippet

 1. Resolve Plugins
 
   1. Import Constructor for Plugin Type
   1. Instantiate New Instance of Plugin
   1. Load Plugin Templates
   1. Compile Plugin
   1. Add Plugin Renderer to Page
   1. Add Plugin Stylesheets to Page
   1. Add Plugin Scripts to Page
   1. Index Plugin Instance on Page by `id`
    
## Render

 1. Accumulate Style Dependencies
 1. Accumulate Script Dependencies
 1. Concat Page `classes` Property
 1. Apply Page Renderer
 1. Send Rendered Response




{{{plugin-sate-sequenceNav}}}
