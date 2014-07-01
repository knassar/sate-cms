{{<intro}}

Now that you've got a basic site up and running, you'll want to start making changes to make it your own site. 

{{</intro}}
{{<content}}

The first thing to know is that the development web server started by the `develop` command automatically recompiles the entire site sources on each page request, so you don't need to restart Sate between changes. Just edit a source file and reload the page. To see this in action, lets make a few small changes to the stock Sate boilerplate.

Open the `website.json` file in your favorite editor and take a look at it's structure. This file acts as the high-level "manifest" for your Sate website. The `website.json` file contains site-wide configuration like the site Title, and defines the path to the site's root page.

For now, find the value under the key `pageDefaults.title` and change the string "Your New Sate Site" to the name of your own website. Save the file, and reload the browser page. You should see the new page title show up as the page title.

While the `website.json` gives you a convenient place to do site-global configuration, most of the time you will set it up once, then not really touch it again. It primarily acts as a fixed entry point for Sate to find your website content.

## Editing Content

Next, lets look in the `content` directory that Sate has created for your site. You'll find that the Sate boilerplate includes two files in here, `index.html` and `about.html` to get you started. These files demonstrate an important feature of Sate: Implicit Site-Mapping.

When Sate reads in the `website.json` file, it will start building a site map from the `config.contentSources` path. Based on the file path of a given page, Sate can infer the parser to use (HTML or Markdown), the page type (Index or Article), the URL, and the Page Title.

Sate looks for an `index` page at each directory level. Each index file creates an Index page. Any files which are not named `index` will be used to create an Article page. Sate uses the folder and file names of these content files to construct SEO-friendly URLs:

  * `./content/index.*` <span class="arrow r"></span> `/`
  * `./content/sub-directory/index.*` <span class="arrow r"></span> `/sub-directory`
  * `./content/some-page` <span class="arrow r"></span> `/some-page`
  * `./content/sub-directory/some-page` <span class="arrow r"></span> `/sub-directory/some-page`

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

It's important to note that these automatic inferences can be overridden for any given page. More on page-level overrides later.

{{{plugin-sate-sequenceNav}}}
{{</content}}