function Page(id, props, parent) {
    var fs = require('fs'),
        path = require('path'),
        util = require('util'),
        flow = require(Sate.nodeModInstallDir+'flow'),
        extend = require(Sate.nodeModInstallDir+'node.extend'),
        Mustache = require(Sate.nodeModInstallDir+'mustache'),
        PageContentParser = require(__dirname+'/PageContentParser'),
        contentParser = new PageContentParser(Sate),
        PageDataResolver = require(__dirname+'/PageDataResolver'),
        dataResolver = new PageDataResolver(Sate),
        PagePluginsResolver = require(__dirname+'/PagePluginsResolver'),
        pluginsResolver = new PagePluginsResolver(Sate);
        
    var loadPartial = function(page, t, stepDone) {
        var data = fs.readFileSync(path.join(Sate.currentSite.sateSources, 'templates', page.partials[t]), {encoding: Sate.currentSite.config.encoding});
        
        if (data) {
            // @TODO: compile the templates for better performance
            page.compiledPartials[t] = data;
            Sate.currentSite.compiledPartials[t] = data;
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
        page.addSubPageResources(subPage, true);
    };

    var resolvePage = function(page) {
        dataResolver.resolve(page);
    };

    var initialize = function(page) {
        resolvePage(page);
        
        var extension = (page.contentExtension) ? '.'+page.contentExtension : Sate.Parser.extensionForParser(page.parser);
        
        if (page.isRoot) {
            if (!page.url) {
                page.url = Sate.currentSite.config.rootPageUrl;
            }
            page.resolvedContentPath = path.join(Sate.currentSite.contentPath, 'index' + extension);
        } else if (page.type == Sate.PageType.Error && page.contentPath) {
            page.url = page.contentPath.replace(/^\.\//, '').replace(/\.html$/, '');
            page.resolvedContentPath = page.contentPath;
        } else {
            if (!page.url) {
                page.url = [page.parentUrl, page.id].join('/').replace(/[\/]+/g, '/');
            }
            if (page.type === Sate.PageType.Index) {
                page.resolvedContentPath = path.join(Sate.currentSite.contentPath, page.url + '/index' + extension);
            } else {
                page.resolvedContentPath = path.join(Sate.currentSite.contentPath, page.url + extension);
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
            articleSort: Sate.IndexSort.DateDescending,
            type: Sate.PageType.Empty,
            encoding: Sate.currentSite.config.encoding,
            contentPath: Sate.currentSite.contentPath,
            classes: [],
            extraStyles: [],
            extraScripts: [],
            parser: Sate.Parser.HTML,
            date: null,
            created: null,
            modified: null,
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
                },
                {
                    type: 'sate-markup'
                },
                {
                    type: 'sate-mailto'
                }
            ],
            partials: {},
            compiledPartials: {}
        },
        Sate.currentSite.pageDefaults,
        props, 
        {
            id: id,
            subPages: {},
            templates: Sate.currentSite.compiledTemplates,
            compiledPartials: Sate.currentSite.compiledPartials,
            sitePath: Sate.currentSite.sitePath,
            sateSources: Sate.currentSite.sateSources,
            parentUrl: (parent) ? parent.url : null,
            compiled: false,
            pluginsById: {},
            styles: [],
            scripts: [],
            styleIds: [],
            scriptIds: [],
            typeOf: 'Sate.Page',
            isRoot: (id == Sate.currentSite.config.rootPage)
        });

    newPage.compile = function(withMetrics, complete) {
        var self = this;
        flow.exec(
            function() {
                var count = 0;
                for (var t in self.partials) {
                    if (self.partials.hasOwnProperty(t) && !Sate.currentSite.compiledPartials.hasOwnProperty(t)) {
                        count++;
                        Sate.Log.logAction("loading partial "+t, 1);
                        loadPartial(self, t, this.MULTI(t));
                    } else {
                        self.compiledPartials[t] = Sate.currentSite.compiledPartials[t];
                    }
                }
                if (count === 0) {
                    this.apply();
                }
            },
            function() {
                fs.stat(self.resolvedContentPath, this);
            },
            function(err, stats) {
                if (stats) {
                    self.date = stats.mtime;
                    self.modified = stats.mtime;
                    self.created = stats.ctime;
                }
                this.apply();
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
        var self = this;
        
        flow.exec(
            function() {
                if (self.type == Sate.PageType.Index && self.compiledPartials.content == "" && self.subPages) {
                    self.compiledPartials.content = self.compiledPartials.indexPageContent;
                    if (!self.articles) {
                        self.articles = [];
                        for (var p in self.subPages) {
                            if (self.subPages.hasOwnProperty(p)) {
                                self.articles.push(self.subPages[p].url);
                            }
                        }
                    }
                    this.apply();
                }
                else {
                    complete();
                }
            },
            function() {
                var count = 0;
                for (var p in self.articles) {
                    if (self.articles.hasOwnProperty(p)) {
                        var subPage = Sate.currentSite.pageForPath(self.articles[p]);
                        subPage.resolvePlugins(withMetrics, this.MULTI(p));
                        count++;
                    }
                }
                if (count == 0) {
                    this.apply();
                }
            },
            function() {
                var composedArticles = [];
                for (var p in self.articles) {
                    if (self.articles.hasOwnProperty(p)) {
                        var subPage = Sate.currentSite.pageForPath(self.articles[p]);
                        composeArticleIntroForIndexPage(self, subPage);
                        composedArticles.push(subPage);
                    }
                }
                self.articles = composedArticles;
                if (self.articleSort) {
                    self.articles.sort(self.articleSort);
                }
                this.apply();
            },
            function() {
                complete();
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
    newPage.classesString = function() {
        if (this.classes.filter) {
            return this.classes.filter(function (e, i, arr) {
                return arr.lastIndexOf(e) === i;
            }).join(' ');
        } else if (typeof this.classes == 'string') {
            return this.classes;
        }
    };
    newPage.addStylesheet = function(href, options) {
        var style = extend({
            href: href,
            id: Sate.utils.md5(href),
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
            id: Sate.utils.md5(src)
        }, options);
        if (this.scriptIds.indexOf(script.id) === -1) {
            this.scriptIds.push(script.id);
            this.scripts.push(script);
        }
    };
    newPage.addSubPageResources = function(subPage, includePlugins) {
        if (includePlugins === true) {
            this.mergePluginsFromSubPage(subPage);
        }
        for (var css in subPage.styles) {
            if (subPage.styles.hasOwnProperty(css)) {
                var style = subPage.styles[css];
                if (typeof style == 'string') {
                    this.addStylesheet(style, {});
                }
                else if (typeof style == 'object') {
                    this.addStylesheet(style.href, style);
                }
            }
        }
        for (var scr in subPage.scripts) {
            if (subPage.scripts.hasOwnProperty(scr)) {
                var script = subPage.scripts[scr];
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
    newPage.mergePluginsFromSubPage = function(subPage) {
        var pluginSig = function(plugin) {
            return plugin.type + '+' + plugin.id;
        };
        var ownPlugins = this.plugins.map(pluginSig);
        var self = this;
        subPage.plugins.forEach(function(plugin) {
            if (ownPlugins.indexOf(pluginSig(plugin)) == -1) {
                self.plugins.push(plugin);
            }
        });
    };
    newPage.resolvePlugins = function(withMetrics, complete) {
        pluginsResolver.resolve(this, complete);
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
    newPage.descriptor = function() {
        return {
            url: this.url,
            name: this.name
        };
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
        this.classes = this.classesString();
        if (Sate.executingCommand == 'deploy') {
            this.deployRevision = '?v='+ new Date().getTime();
        }
        var html = Mustache.render(this.templates[this.template], this, this.compiledPartials);
        return html;
    };
    
    initialize(newPage);

    Sate.pageDescriptor = function(descr) {
        var descriptor;
        if (typeof descr == 'string') {
            descriptor = {url: descr};
        }
        else if (typeof descr == 'object') {
            descriptor = Sate.chain({}, descr);
        }
        if (descriptor && descriptor.url && !descriptor.name) {
            descriptor.name = Sate.currentSite.pageForPath(descriptor.url).name;
        }
        return descriptor;
    };

    return newPage;
}

Page.dataFromFile = function(directory, encoding) {
    var fs = require('fs'),
        path = require('path');
        PageContentParser = require(__dirname+'/PageContentParser'),
        contentParser = new PageContentParser();

    var filepath = path.normalize(directory);
    var data = fs.readFileSync(filepath, {encoding: encoding});
    
    return contentParser.extractDataBlock(data);
};

module.exports = Page;
