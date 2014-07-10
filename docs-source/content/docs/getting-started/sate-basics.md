@intro:

Now that you've got a basic site up and running, you'll want to start making changes to make it your own site. 

@content:

The first thing to know is that the development web server started by the `develop` command automatically recompiles the entire site sources on each page request, so you don't need to restart Sate between changes. Just edit a source file and reload the page. To see this in action, lets make a few small changes to the stock Sate boilerplate.

Open the `website.json` file in your favorite editor and take a look at its structure. This file acts as the high-level "manifest" for your Sate website. The `website.json` file contains site-wide configuration like the site Title, and defines the path to the site's root page.

For now, find the value under the key `pageDefaults.title`. You'll see that Sate has tried to set this to a reasonable site name based on the directory you had it create. You'll see this inference pattern used throughout Sate. The logic used to convert filenames and directories into user-facing names is described under [Page Data: `name`](/docs/page-data#name).

If the website title Sate chose isn't to your liking, go ahead and change the value of `pageDefaults.title` to a value you like. Save the file, and reload the browser page. You should see the new page title show up as the page title.

While the `website.json` gives you a convenient place to do site-global configuration, most of the time you will set it up once, then not really touch it again. It primarily acts as a fixed entry point for Sate to find your website content.

## Site Resources Structure

The boilerplate that Sate generates when you use the `create` directive includes several top-level directories. Each of these has a specific purpose. Sate includes facilities to rename several of these directories if you desire, but it is important that the directory `sate-cms` not be renamed, as this will cause Sate to be unable to find critical resources.

### `sate-cms`

This directory contains several key pieces of the Sate website. Under `sate-cms`, you'll find the following directories:

 * `error`: Template file for 404 errors
 * `templates`: The default templates used by Sate. You may modify these or add any site-wide templates to this subdirectory
 * `plugins`: This directory contains all the standard [Sate plugins](/plugins). To install a new plugin for your site, simply copy it into this directory. If you choose not to use a plugin on your site, you can simply delete the folder for that plugin. When new versions of Sate are relased, you can non-destructively update the plugins you've installed or re-install plugins you've removed by using the [Update](/docs/using-sate) directive.
 
 
### `styles` & `scripts`

The `styles` and `scripts` directories are for your stylesheets and javascript files respectively. These are not considered "content" and thus are not contained in the `content` directory. When you generate a Sate website with the `deploy` directive, Sate will merge the contents of these directories with the stylesheets and scripts provided by any Sate plugins your site uses and copy them to the build target.

### `content`

The `content` directory contains the content and structure of your website. Sate considers images to be content, so the `images` directory is contained here. If you wish to change the name of the `content` directory, it is important to tell Sate how to find the new content directory. Do this by setting the `config.contentSources` key in your `website.json` file.

## Editing Content

Next, lets look in the `content` directory that Sate has created for your site. You'll find that the Sate boilerplate includes two files in here, `index.html` and `about.html` to get you started. These files demonstrate an important feature of Sate: Implicit Site-Mapping.

When Sate reads in the `website.json` file, it will start building a site map from the `config.contentSources` path. Based on the file path of a given page, Sate can infer the parser to use (HTML or Markdown), the page type (Index or Article), the URL, and the Page Title.

Sate looks for an `index` page at each directory level. Each index file creates an Index page. Any files which are not named `index` will be used to create an Article page. Sate uses the folder and file names of these content files to construct pretty URLs:

  * `./content/index.*` <span class="arrow r"></span> `/`
  * `./content/sub-directory/index.*` <span class="arrow r"></span> `/sub-directory`
  * `./content/some-page.*` <span class="arrow r"></span> `/some-page`
  * `./content/sub-directory/some-page.*` <span class="arrow r"></span> `/sub-directory/some-page`

Sate also infers as much as it can about each page simply from information it can identify automatically:

 1. Sate infers the content parser based on file extension:
  * `.html` files are treated as HTML
  * `.md` files are parsed as Markdown
 2. Sate infers the page type based on the filename:
  * `index.*` files are considered Index pages
  * any other files are considered Article pages
 3. Sate infers the Page Menu titles from the filename (or directory for Index pages):
  * `./content/my-photos/index.*` <span class="arrow r"></span> "My Photos"
  * `./content/some-page` <span class="arrow r"></span> "Some Page"
  * `./content/extra--special` <span class="arrow r"></span> "Extra-Special"

It's important to note that these automatic inferences can be [overridden for any given page](/docs/page-data).

{{#plugin-sate-sequenceNav}}
{
    "next": "/docs/sate-website"
}
{{/plugin-sate-sequenceNav}}


