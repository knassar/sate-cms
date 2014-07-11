{
    "name": "The website.json File",
    "extraStyles": [
        "/styles/sate-chain.css"
    ]
}

@intro:




@content:

Here's an example of a typical Site website.json file:


    {
        "config": {
            "rootPage": "home",
            "rootPageUrl": "/",
            "contentSources": "./content",
            "encoding": "utf-8"
        },
        "pageDefaults": {
            "title": "Sate",
            "classes": "sate-docs",
            "subtitle": "Just Enough CMS"
        }
    }
    
Like you would expect, there is no need to specify most of the possible properties of the `website.json` file. The defaults values are suitable for most cases. However, it is helpful to know how the file is structured so that you can choose when to override. 

The `website.json` has four main sections, each of which has different functions:

 * `config`
 * `pageDefaults`
 * `templates`
 * `errorPages`

## `config`

### Config Properties

### <a name="buildDirName"></a>`buildDirName` <span class="type string">String</span>


### <a name="rootPage"></a>`rootPage` <span class="type string">String</span>


### <a name="rootPageUrl"></a>`rootPageUrl` <span class="type string">String</span>


### <a name="contentSources"></a>`contentSources` <span class="type string">String</span>


### <a name="encoding"></a>`encoding` <span class="type string">String</span>



### The Config Chain

<ol class="the-chain-diagram">
    <li><span>Sate Defaults</span></li>
    <li><span>`config` in `website.json`</span></li>
    <li><span>Sate command-line flags</span></li>
</ol>

## `pageDefaults`



## `templates`

templates: {
    html: "main/html.tpl"
},


## `errorPages`

error404: {
    name: "error 404:",
    type: Sate.PageType.Error,
    contentPath: "./sate-cms/error/404.html",
    subtitle: "Page Not Found"
}


{{{plugin-sate-sequenceNav}}}
