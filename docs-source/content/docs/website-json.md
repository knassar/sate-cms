{
    "name": "The website.json File",
    "extraStyles": [
        "/styles/sate-chain.css"
    ]
}

@intro:

Like you would expect, there is no need to specify most of the possible properties of the `website.json` file. The defaults values are suitable for most cases. However, it is helpful to know how the file is structured so that you can choose when to override. 


@content:
    
The `website.json` has three main sections, each of which has different functions:

 * `config`
 * `pageDefaults`
 * `templates`

Here's an example of a typical Site website.json file where all three sections have been specified:

    {
        "config": {
            "rootPage": "home",
            "rootPageUrl": "/",
            "contentSources": "./content",
            "encoding": "utf-8"
        },
        "pageDefaults": {
            "title": "My Website",
            "subtitle": "Really Cool"
        },
        "templates": {
            rss: "main/rss.tpl",
            html: "main/html.tpl"
        }    
    }
    

## `config`

The `config` section contains basic website configuration properties that Sate uses to compile and build the website.

### Config Properties

The following properties are defined in the `config` section.

### <a name="buildDirName"></a>`buildDirName` <span class="type string">String</span>

If defined, this property is used as the name of the target directory for the `sate deploy` command.

### <a name="rootPage"></a>`rootPage` <span class="type string">String</span>

The `id` of the website's root page, used internally by Sate during the compile phase. Defaults to "home".

### <a name="rootPageUrl"></a>`rootPageUrl` <span class="type string">String</span>

The `url` of the website's root page, used internally by Sate during the compile phase. Defaults to "/".

### <a name="contentSources"></a>`contentSources` <span class="type string">String</span>

The filepath relative to the website directory in which the page content files are located. The `index` page content file for the `rootPage` should be located at this directory, and all other pages' content files should be within this directory.

Defaults to "./content".

### <a name="encoding"></a>`encoding` <span class="type string">String</span>

The encoding value to pass to all `node.js` file system calls. Defauts to 'utf-8'.


### The Config Chain

The properties declared in the `config` section fit into a specialized Chain sequence between Sate defaults and flags given to Sate commands on the command-line.

<ol class="the-chain-diagram">
    <li><span>Sate Defaults</span></li>
    <li><span>`config` in `website.json`</span></li>
    <li><span>Sate command-line flags</span></li>
</ol>

## `pageDefaults`

This section describes any Sate Page default values that you wish to override site-wide. Any valid [Page Data](/docs/page-data) properies are valid in this section.

## `templates`

The `templates` section defines the ids and filepaths of all root-level templates that are available to individual pages' [`template`](/docs/page-data#template) property.

The keys of this dictionary are the template ids to be assigned to the `template` property.

The values are the filepaths of the templates relative to the website's `sate-cms/templates` directory.



{{{plugin-sate-sequenceNav}}}
