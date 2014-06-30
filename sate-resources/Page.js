var pageDataMatcher = /\{\{\#pageData\}\}([\s\S]*?)\{\{\//m;
var partialMatcher = /\{\{<(?!pageData)[^\/]+\}\}[\s\S]*?\{\{<\/[\w\d]+\}\}/mg;
var partialCapturer = /\{\{<([\w\d]+)\}\}([\s\S]*?)\{\{<\//m;

function Page(id, props, parent, website, Sate) {
        var fs = require('fs'),
        path = require('path'),
        util = require('util'),
        crypto = require('crypto'),
        flow = require(Sate.nodeModInstallDir+'flow'),
        extend = require(Sate.nodeModInstallDir+'node.extend'),
        Mustache = require(Sate.nodeModInstallDir+'mustache'),
        markdown = require(Sate.nodeModInstallDir+'marked'),
        PageDataResolver = require(__dirname+'/PageDataResolver'),
        dataResolver = new PageDataResolver(Sate),
        PagePluginsResolver = require(__dirname+'/PagePluginsResolver'),
        pluginsResolver = new PagePluginsResolver(Sate);
        
    var md5 = function(str) {
        var md5sum = crypto.createHash('md5');
        md5sum.update(str);
        return md5sum.digest('hex');
    };

    var loadPartial = function(page, website, t, stepDone) {
        var data = fs.readFileSync(path.join(website.sateSources, 'templates', page.partials[t]), {encoding: website.config.encoding});
        
        if (data) {
            // @TODO: compile the templates for better performance
            page.compiledPartials[t] = data;
            website.compiledPartials[t] = data;
            stepDone(t);
        } else {
            stepDone(t);
        }
    };

    var parsedContent = function(content, page) {
        if (page.parser == Sate.Parser.HTML) {
            return content;
        }
        else if (page.parser == Sate.Parser.Markdown) {
            return markdown(content);
        }
        else {
            return content;
        }
    };

    var processPageContent = function(page, data, success) {
        var pageData = null,
            matches = data.match(pageDataMatcher);
        if (matches && matches.length > 1) {
            pageData = JSON.parse(matches[1].trim());
        }
        page = Sate.chain(page, pageData);
        resolvePage(page);
        var partials = data.match(partialMatcher);
        if (partials && partials.length > 0) {
            for (var m = 0; m < partials.length; m++) {
                var partialCaps = partials[m].match(partialCapturer);
                if (partialCaps.length > 2) {
                    // @TODO: compile the templates for better performance
                    page.compiledPartials[partialCaps[1]] = parsedContent(partialCaps[2], page);
                }
            }
        }
        if (!page.compiledPartials.intro) {
            page.compiledPartials.intro = "";
        }
        if (!page.compiledPartials.content) {
            page.compiledPartials.content = "";
        }
        success.apply();
    };
    
    var composeArticleIntroForIndexPage = function(page, subPage) {
        var articleIntro = Mustache.render(subPage.compiledPartials.intro, subPage, subPage.compiledPartials);
        subPage.articleIntro = articleIntro;
        page.addSubPageResources(subPage)
        page.articles.push(subPage);
    };

    var resolvePage = function(page) {
        dataResolver.resolve(page);
    };

    var initialize = function(page, website, Sate) {
        resolvePage(page);
        
        var extension = (page.contentExtension) ? '.'+page.contentExtension : Sate.Parser.extensionForParser(page.parser);
        
        if (page.isRoot) {
            if (!page.url) {
                page.url = website.config.rootPageUrl;
            }
            page.resolvedContentPath = path.join(website.contentPath, 'index' + extension);
        } else if (page.type == Sate.PageType.Error && page.contentPath) {
            page.url = page.contentPath.replace(/^\.\//, '').replace(/\.html$/, '');
            page.resolvedContentPath = page.contentPath;
        } else {
            if (!page.url) {
                page.url = [page.parentUrl, page.id].join('/').replace(/[\/]+/g, '/');
            }
            if (page.type === Sate.PageType.Index) {
                page.resolvedContentPath = path.join(website.contentPath, page.url + '/index' + extension);
                page.articles = [];
            } else {
                page.resolvedContentPath = path.join(website.contentPath, page.url + extension);
            }
        }

        if (page.name === false) {
            page.name = '';
        } else if (!page.name) {
            page.name = Sate.utils.toTitleCase(page.id);
        }
        if (!page.subtitle && page.name) {
            page.subtitle = page.name;
        }
    };

    var newPage = Sate.chain(
        {
            name: "untitled page",
            indexSort: Sate.IndexSort.DateDescending,
            type: Sate.PageType.Empty,
            subPages: {},
            encoding: website.config.encoding,
            contentPath: website.contentPath,
            classNames: [],
            extraStyles: [],
            extraScripts: [],
            parser: Sate.Parser.HTML,
            plugins: [
                {
                    type: 'sate-breadcrumbs',
                    id: 'mainBreadcrumbs'
                },
                {
                    type: 'sate-breadcrumbs',
                    classes: ['article-intro-breadcrumbs']
                },
                {
                    type: 'sate-sequenceNav'
                }
            ],
            partials: {},
            compiledPartials: {}
        },
        website.pageDefaults,
        props, 
        {
            id: id,
            templates: website.compiledTemplates,
            compiledPartials: website.compiledPartials,
            sitePath: website.sitePath,
            sateSources: website.sateSources,
            parentUrl: (parent) ? parent.url : null,
            compiled: false,
            pluginsById: {},
            styles: [],
            scripts: [],
            styleIds: [],
            scriptIds: [],
            typeOf: 'Sate.Page',
            isRoot: (id == website.config.rootPage)
        });

    newPage.compile = function(withMetrics, complete) {
        var self = this;
        flow.exec(
            function() {
                var multiCount = 0;
                for (var t in self.partials) {
                    if (self.partials.hasOwnProperty(t) && !website.compiledPartials.hasOwnProperty(t)) {
                        multiCount++;
                        Sate.Log.logAction("loading partial "+t, 1);
                        loadPartial(self, website, t, this.MULTI(t));
                    } else {
                        self.compiledPartials[t] = website.compiledPartials[t];
                    }
                }
                if (multiCount === 0) {
                    this.apply();
                }
            },
            function() {
                fs.readFile(self.resolvedContentPath, self.encoding, this);
            },
            function(err, data) {
                if (data) {
                    processPageContent(self, data, this);
                } else {
                    this.apply();
                }
            },
            function() {
                if (self.type == Sate.PageType.Index && !self.compiledPartials.content && self.subPages) {
                    self.compiledPartials.content = self.compiledPartials.indexPageContent;
                    self.articles = [];
                    for (var p in self.subPages) {
                        if (self.subPages.hasOwnProperty(p)) {
                            composeArticleIntroForIndexPage(self, self.subPages[p]);
                        }
                    }
                    if (self.articleSort) {
                        self.articles.sort(self.articleSort);
                    }
                }
                this.apply();
            },
            function() {
                pluginsResolver.resolve(self, this);
            },
            function() {
                self.isCompiling = false;
                complete.apply();
            }
        );
    };
    newPage.eachSubpage = function(method, recurseSubpages) {
        if (this.subPages) {
            for (var p in this.subPages) {
                if (this.subPages.hasOwnProperty(p) && this.subPages[p].typeOf == 'Sate.Page') {
                    method.apply(this.subPages[p], [this.subPages[p]]);
                    if (recurseSubpages) {
                        this.subPages[p].eachSubpage(method, true);
                    }
                }
            }
        }
    };
    newPage.hasSubpages = function() {
        return this.subPages.length > 0;
    };
    newPage.classNamesString = function() {
        if (this.classNames.filter) {
            return this.classNames.filter(function (e, i, arr) {
                return arr.lastIndexOf(e) === i;
            }).join(' ');
        } else if (typeof this.classNames == 'string') {
            return this.classNames;
        }
    };
    newPage.addStylesheet = function(href, options) {
        var style = extend({
            href: href,
            id: md5(href),
            media: 'all'
        }, options);
        if (this.styleIds.indexOf(style.id) === -1) {
            this.styleIds.push(style.id);
            this.styles.push(style);
        }
    };
    newPage.addScript = function(src, options) {
        var script = extend({
            src: src,
            id: md5(src)
        }, options);
        if (this.scriptIds.indexOf(script.id) === -1) {
            this.scriptIds.push(script.id);
            this.scripts.push(script);
        }
    };
    newPage.addSubPageResources = function(subPage) {
        for (var css in subPage.styles) {
            if (subPage.styles.hasOwnProperty(css)) {
                this.addStylesheet(subPage.styles[css].href, subPage.styles[css]);
            }
        }
        for (var scr in subPage.scripts) {
            if (subPage.scripts.hasOwnProperty(scr)) {
                this.addScript(subPage.scripts[scr].src, subPage.scripts[scr]);
            }
        }
    };
    newPage.mergeStyles = function() {
        this.styles = this.styles.concat(this.extraStyles);
    };
    newPage.mergeScripts = function() {
        this.scripts = this.scripts.concat(this.extraScripts);
    };
    newPage.pluginById = function(pluginId) {
        return this.pluginsById[pluginId];
    };
    newPage.pluginFirstByType = function(pluginType) {
        for (var i=0; i < this.plugins.length; i++) {
            if (this.plugins[i].type == pluginType) return this.plugins[i];
        }
        return null;
    };
    newPage.pluginsByType = function(pluginType) {
        var plugs = [];
        for (var i=0; i < this.plugins.length; i++) {
            if (this.plugins[i].type == pluginType) plugs.push(this.plugins[i]);
        }
        return plugs;
    },
    newPage.pluginByTypeAndClassName = function(type, className) {
        var plgs = this.pluginsByType(type);
        for (var i=0; i < plgs.length; i++) {
            if (plgs[i].classes && plgs[i].classes.indexOf(className) > -1) {
                return plgs[i];
            }
        }
        return null;
    };
    newPage.pageAscent = function() {
        var p = {
            isRoot: this.isRoot,
            url: this.url,
            name: this.name
        };
        var cur = p;
            par = this.parent;
        while (par) {
            cur.parent = {
                isRoot: par.isRoot,
                url: par.url,
                name: par.name
            };
            par = par.parent;
            cur = cur.parent;
        }
        return p;
    };
    newPage.rootPage = function() {
        var p = this;
        while (!p.isRoot && p.parent) {
            p = p.parent;
        }
        return p;
    };
    newPage.render = function() {
        this.mergeStyles();
        this.mergeScripts();
        this.classNames = this.classNamesString();
        var html = Mustache.render(this.templates[this.template], this, this.compiledPartials);
        return html;
    };
    
    initialize(newPage, website, Sate);
    return newPage;
}

Page.dataFromFile = function(directory, encoding) {
    var fs = require('fs'),
        path = require('path');

    var filepath = path.normalize(directory);
    var data = fs.readFileSync(filepath, {encoding: encoding});
    
    var pageData = null,
        matches = data.match(pageDataMatcher);
    
    if (matches && matches.length > 1) {
        pageData = JSON.parse(matches[1].trim());
    }
    
    return pageData;
};

module.exports = Page;
