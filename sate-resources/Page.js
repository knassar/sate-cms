function Page(id, props, parent, website, Sate) {
    var fs = require('fs'),
        path = require('path'),
        util = require('util'),
        crypto = require('crypto'),
        extend = require('node.extend'),
        flow = require('flow'),
        Mustache = require('mustache'),
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
        fs.readFile(path.join(website.sateSources, 'templates', page.partials[t]), {encoding: website.config.encoding}, function(err, data) {
            if (!err) {
                // @TODO: compile the templates for better performance
                page.compiledPartials[t] = data;
                website.compiledPartials[t] = data;
                stepDone(t);
            } else {
                console.log( err );
                stepDone(t, err);
            }
        });
    };

    var pageDataMatcher = /\{\{\#pageData\}\}([\s\S]*?)\{\{\//m;
    var partialMatcher = /\{\{<(?!pageData)[^\/]+\}\}[\s\S]*?\{\{<\/[\w\d]+\}\}/mg;
    var partialCapturer = /\{\{<([\w\d]+)\}\}([\s\S]*?)\{\{<\//m;
    var processPageContent = function(page, data, success) {
        var pageData = null,
            matches = data.match(pageDataMatcher);
        
        if (matches && matches.length > 1) {
            pageData = JSON.parse(matches[1].trim());
        }
        for (var d in pageData) {
            if (pageData.hasOwnProperty(d)) {
                if (util.isArray(pageData[d])) {
                    if (util.isArray(page[d])) {
                        page[d] = page[d].concat(pageData[d]);
                    } else {
                        page[d] = pageData[d];
                    }
                } else if (typeof pageData[d] == 'object') {
                    page[d] = extend(true, page[d], pageData[d]);
                } else {
                    page[d] = pageData[d];
                }
            }
        }
        resolvePage(page);
        var partials = data.match(partialMatcher);
        // page.partials = extend({}, website.compiledPartials, page.partials);
        if (partials && partials.length > 0) {
            for (var m = 0; m < partials.length; m++) {
                var partialCaps = partials[m].match(partialCapturer);
                if (partialCaps.length > 2) {
                    // @TODO: compile the templates for better performance
                    page.compiledPartials[partialCaps[1]] = partialCaps[2];
                }
            }
        }
        if (!page.compiledPartials.intro) {
            page.compiledPartials.intro = null;
        }
        if (!page.compiledPartials.content) {
            page.compiledPartials.content = null;
        }
        success.apply();
    };
    
    var composeArticleIntroForIndexPage = function(page, subPage) {
        subPage.articleIntro = Mustache.render(subPage.compiledPartials.intro, subPage, subPage.compiledPartials);
        page.articles.push(subPage);
    };

    var resolvePage = function(page) {
        dataResolver.resolve(page);
    };

    var initialize = function(page, website, Sate) {
        resolvePage(page);
        
        if (page.isRoot) {
            if (!page.url) {
                page.url = website.config.rootPageUrl;
            }
            page.resolvedContentPath = path.join(website.sitePath, 'index.html');
        } else if (page.type == Sate.PageType.Error && page.contentPath) {
            page.url = page.contentPath.replace(/^\.\//, '').replace(/\.html$/, '');
            page.resolvedContentPath = path.join(website.sitePath, page.contentPath);
        } else {
            if (!page.url) {
                page.url = [page.parentUrl, page.id].join('/').replace(/[\/]+/g, '/');
            }
            if (page.type === Sate.PageType.Index) {
                page.resolvedContentPath = path.join(website.sitePath, page.url + '/index.html');
                page.articles = [];
            } else {
                page.resolvedContentPath = path.join(website.sitePath, page.url + '.html');
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

    var newPage = extend(true,
        {
            name: "untitled page",
            menu: null,
            indexSort: Sate.IndexSort.DateDescending,
            type: Sate.PageType.Empty,
            subPages: null,
            encoding: website.config.encoding,
            classNames: [],
            extraStyles: [],
            extraScripts: [],
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
            partials: {}
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
            siteMenu: website.siteMenu,
            compiled: false,
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
                if (err) {
                    console.log( 'ERROR ' + err );
                }
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
    newPage.resolveSiteMenu = function() {
        var p = this;
        while (!p.isRoot && p.parent && !p.parent.isRoot) {
            p = p.parent;
        }
        var rootUrl = p.url;
        for (var i=0; i < this.siteMenu.length; i++) {
            this.siteMenu[i].isActive = (this.siteMenu[i].url == rootUrl);
        }
    };
    newPage.addStylesheet = function(href, options) {
        var style = extend({
            href: href,
            id: md5(href),
            media: 'all'
        }, options);
        if (this.styles.indexOf(style.id) === -1) {
            this.styleIds.push(style.id);
            this.styles.push(style);
        }
    };
    newPage.addScript = function(src, options) {
        var script = extend({
            src: src,
            id: md5(src)
        }, options);
        if (this.scripts.indexOf(script.id) === -1) {
            this.scriptIds.push(script.id);
            this.scripts.push(script);
        }
    };
    newPage.mergeStyles = function() {
        this.styles = this.styles.concat(this.extraStyles);
    };
    newPage.mergeScripts = function() {
        this.scripts = this.scripts.concat(this.extraScripts);
    };
    newPage.pluginById = function(pluginId) {
        return this.plugins[pluginId];
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
        this.resolveSiteMenu();
        this.mergeStyles();
        this.mergeScripts();
        this.classNames = this.classNamesString();
        var html = Mustache.render(this.templates[this.template], this, this.compiledPartials);
        return html;
    };
    
    initialize(newPage, website, Sate);
    return newPage;
}
module.exports = Page;
