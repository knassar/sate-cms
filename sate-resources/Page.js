function Page(id, props, parent, website, Sate) {
        var fs = require('fs'),
        path = require('path'),
        util = require('util'),
        crypto = require('crypto'),
        flow = require(Sate.nodeModInstallDir+'flow'),
        extend = require(Sate.nodeModInstallDir+'node.extend'),
        Mustache = require(Sate.nodeModInstallDir+'mustache'),
        PageContentParser = require(__dirname+'/PageContentParser'),
        contentParser = new PageContentParser(Sate),
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

    var processPageContent = function(page, data, success) {
        
        contentParser.parse(page, data);
        
        resolvePage(page);

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
                if (!data) {
                    data = "";
                }
                processPageContent(self, data, this);
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
    newPage.hasContent = function() {
        return (this.compiledPartials.content && this.compiledPartials.content.length > 0);
    };
    newPage.hasIntro = function() {
        return (this.compiledPartials.intro && this.compiledPartials.intro.length > 0);
    };
    newPage.composeArticleDigest = function(withMetrics, complete) {
        if (this.type == Sate.PageType.Index && this.compiledPartials.content == "" && this.subPages) {
            this.compiledPartials.content = this.compiledPartials.indexPageContent;
            this.articles = [];
            for (var p in this.subPages) {
                if (this.subPages.hasOwnProperty(p)) {
                    composeArticleIntroForIndexPage(this, this.subPages[p]);
                    for (var i = 0; i < this.subPages[p].plugins.length; i++) {
                        var plugin = this.subPages[p].plugins[i];
                        this.plugins.push(plugin);
                    }
                }
            }
            if (this.articleSort) {
                this.articles.sort(this.articleSort);
            }
        }
        complete.apply();
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
        for (var css in subPage.extraStyles) {
            if (subPage.extraStyles.hasOwnProperty(css)) {
                var style = subPage.extraStyles[css];
                if (typeof style == 'string') {
                    this.addStylesheet(style, {});
                }
                else if (typeof style == 'object') {
                    this.addStylesheet(style.href, style);
                }
            }
        }
        for (var scr in subPage.extraScripts) {
            if (subPage.extraScripts.hasOwnProperty(scr)) {
                var script = subPage.extraScripts[scr];
                if (typeof script == 'string') {
                    this.addScript(script, {});
                }
                else if (typeof script == 'object') {
                    this.addScript(script.src, script);
                }
            }
        }
    };
    newPage.mergeStyles = function() {
        for (var s in this.extraStyles) {
            if (this.extraStyles.hasOwnProperty(s)) {
                var style = this.extraStyles[s];
                if (typeof style == 'string') {
                    this.addStylesheet(style, {});
                }
                else if (typeof style == 'object') {
                    this.addStylesheet(style.href, style);
                }
            }
        }
    };
    newPage.mergeScripts = function() {
        for (var s in this.extraScripts) {
            if (this.extraScripts.hasOwnProperty(s)) {
                var script = this.extraScripts[s];
                if (typeof script == 'string') {
                    this.addScript(script, {});
                }
                else if (typeof style == 'object') {
                    this.addScript(script.src, script);
                }
            }
        }
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

Page.dataFromFile = function(Sate, directory, encoding) {
    var fs = require('fs'),
        path = require('path');
        PageContentParser = require(__dirname+'/PageContentParser'),
        contentParser = new PageContentParser(Sate);

    var filepath = path.normalize(directory);
    var data = fs.readFileSync(filepath, {encoding: encoding});
    
    return contentParser.extractDataBlock(data);
};

module.exports = Page;
