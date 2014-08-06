function Website(args) {
        var fs = require('fs'),
        path = require('path'),
        extend = require(Sate.nodeModInstallDir+'node.extend'),
        _JSON = require(Sate.nodeModInstallDir+'greatjson'),
        flow = require(Sate.nodeModInstallDir+'flow');

    var website = {};
    var defaults = {
        config: {
            buildDirName: 'website',
            rootPage: 'home',
            rootPageUrl: '/',
            contentSources: './content',
            encoding: 'utf-8'
        },
        pageDefaults: {
            title: "Untitled Website",
            subtitle: "",
            name: "untitled page",
            indexSort: "Sate.IndexSort.DateDescending",
            type: Sate.PageType.Article,
            parser: Sate.Parser.HTML,
            classes: [],
            extraStyles: [],
            extraScripts: [],
            template: 'html',
            plugins: [
                {
                    type: "sate-breadcrumbs",
                    id: "mainBreadcrumbs"
                },
                {
                    type: "sate-breadcrumbs",
                    id: "article-intro-breadcrumbs"
                },
                {
                    type: "sate-menu"
                },
                {
                    type: "sate-sequenceNav"
                },
                {
                    type: "sate-powered"
                }
            ],
            partials: {
                masthead: "main/masthead.tpl",
                indexPageContent: "content/indexPageContent.tpl",
                longDate: "date-time/longDate.tpl"
            }
        },
        templates: {
            // rss: "main/rss.tpl",
            html: "main/html.tpl"
        },
        errorPages: {
            error404: {
                name: "error 404:",
                type: Sate.PageType.Error,
                contentPath: "./sate-cms/error/404.html",
                subtitle: "Page Not Found"
            }
        }
    };

    var indexPage = function(id, pageData, website, parent) {
        var page = new Sate.Page(id, pageData, parent);
        website.pageByPath[page.url] = page;
        if (page.subPages) {
            for (var p in page.subPages) {
                if (page.subPages.hasOwnProperty(p)) {
                    page.subPages[p] = indexPage(p, page.subPages[p], website, page);
                }
            }
        }
        return page;
    };

    var mapParentGraph = function(rootPage, website) {
        rootPage.eachSubpage(function(page) {
            page.parent = website.pageByPath[page.parentUrl];
        }, true);
    };

    var generateIndexes = function(website, success, error) {
        website.siteMap[website.config.rootPage] = indexPage(website.config.rootPage, website.siteMap[website.config.rootPage], website);
        mapParentGraph(website.siteMap[website.config.rootPage], website);
        website.siteMap[website.config.rootPage].website = website;
        for (var id in website.errorPages) {
            if (website.errorPages.hasOwnProperty(id) && !website.errorPages[id].compile) {
                var errPage = indexPage(id, website.errorPages[id], website);
                errPage.website = website;
                errPage.parent = website.siteMap[website.config.rootPage];
                website.errorPages[id] = errPage;
            }
        }
        website.rootPage = website.siteMap[website.config.rootPage];
        success();
    };

    var loadTemplate = function(website, t, coll, stepDone) {
        fs.readFile(path.join(website.sateSources, 'templates', coll[t]), {encoding: website.config.encoding}, function(err, data) {
            if (!err) {
                // @TODO: compile the templates for better performance
                website.compiledTemplates[t] = data;
                stepDone(t);
            } else {
                console.log( err );
                stepDone(t, err);
            }
        });
    };

    var compilePage = function(compiler, page) {
        var step = 'compile-page-'+page.url;
        compiler.stepStart(step);
        page.compile(function() {
            compiler.stepComplete(step);
        }, function(err) {
            compiler.stepError(step, err);
        });
    };
    
    var mergeConfig = function() {
        website.config = extend(true, 
            defaults.config, 
            website.json.config
            );
        website.pageDefaults = extend(true, 
            defaults.pageDefaults, 
            website.json.pageDefaults
            );
        website.siteMap = extend(true, 
            defaults.siteMap, 
            website.json.siteMap
            );
        website.errorPages = extend(true, 
            defaults.errorPages, 
            website.json.errorPages
            );
        website.partials = extend(true, 
            defaults.partials, 
            website.json.partials
            );
        website.templates = extend(true, 
            defaults.templates, 
            website.json.templates
            );
        website.contentPath = path.join(website.sitePath, website.config.contentSources);
    };
    
    var loadWebsiteJSON = function(sitePath, complete, error) {
        websitePath = path.normalize(path.join(sitePath, 'website.json'));
        fs.readFile(websitePath, {encoding: defaults.config.encoding}, function(err, data) {
            if (err) {
                console.log( err );
                error(err);
            } else {
                var json = _JSON.parse(data);
                if (json instanceof Error) {
                    Sate.Log.failWith("Could Not Parse website.json", json);
                }
                else {
                    website.json = json;
                }
                mergeConfig();
                complete.apply(website);
            }
        });
    };
    
    var cleanObject = function(obj) {
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                delete obj[prop];
            }
        }
    };
    
    website = extend(true,
        {
            json: null,
            args: args,
            sitePath: args.sitePath,
            sateSources: path.join(args.sitePath, 'sate-cms'),
            compiled: false,
            compiledPartials: {},
            compiledTemplates: {},
            pageByPath: {},
            isCompiling: false,
            pendingRequests: [],
            performAfterCompile: function(action) {
                if (this.isCompiling) {
                    this.pendingRequests.push(action);
                } else {
                    setTimeout(action, 25);
                }
            },
            rootPage: null,
            parseJSON: function(complete) {
                Sate.Log.logAction("reading website.json", 0);
                loadWebsiteJSON(this.sitePath, complete);
            },
            compile: function(complete) {
                this.isCompiling = true;
                var self = this;
                flow.exec(
                    function() {
                        self.parseJSON(this);
                    },
                    function() {
                        Sate.Log.logAction("loading templates", 0);
                        var count = 0;
                        for (var t in self.templates) {
                            if (self.templates.hasOwnProperty(t)) {
                                Sate.Log.logAction(t, 1);
                                loadTemplate(self, t, self.templates, this.MULTI(t));
                                count++;
                            }
                        }
                        if (count == 0) {
                            this.apply();
                        }
                    },
                    function() {
                        for (var p in self.siteMap) {
                            if (self.siteMap.hasOwnProperty(p)) {
                                this.apply();
                                return;
                            }
                        }

                        self.siteMap = {};
                        var generator = Sate.SiteMapGenerator();
                        generator.crawlWebsite(self, this);
                    },
                    function() {
                        Sate.Log.logAction("generating page data", 0);
                        generateIndexes(self, this);
                    },
                    function() {
                        Sate.Log.logAction("compiling error pages", 0);
                        var count = 0;
                        for (var id in self.errorPages) {
                            if (self.errorPages.hasOwnProperty(id)) {
                                Sate.Log.logAction(id, 1);
                                self.errorPages[id].compile(this.MULTI(id));
                                count++;
                            }
                        }
                        if (count == 0) {
                            this.apply();
                        }
                    },
                    function() {
                        Sate.Log.logAction("compiling pages", 0);
                        var count = 0;
                        for (var path in self.pageByPath) {
                            if (self.pageByPath.hasOwnProperty(path)) {
                                Sate.Log.logAction(path, 1);
                                self.pageByPath[path].compile(this.MULTI(path));
                                count++;
                            }
                        }
                        if (count == 0) {
                            this.apply();
                        }
                    },
                    function() {
                        Sate.Log.logAction("resolving plugins", 0);
                        var count = 0;
                        for (var path in self.pageByPath) {
                            if (self.pageByPath.hasOwnProperty(path)) {
                                Sate.Log.logAction(path, 1);
                                self.pageByPath[path].resolvePlugins(this.MULTI(path));
                                count++;
                            }
                        }
                        if (count == 0) {
                            this.apply();
                        }
                    },
                    function() {
                        self.isCompiling = false;
                        // HACK HACK... this avoids a race condition with the end of complile.
                        // Not sure why yet
                        setTimeout(function() {
                            complete();
                            if (self.pendingRequests.length > 0) {
                                for (var i = 0; i < self.pendingRequests.length; i++) {
                                    self.pendingRequests[i].apply();
                                }
                            }
                        }, 10);
                    }
                );
            },
            recompile: function(complete) {
                // clear compiled data
                cleanObject(this.compiledPartials);
                cleanObject(this.pageByPath);
                this.json = null;
                this.compiled = false;

                // compile again:
                this.compile(complete);

            },
            pageForPath: function(filePath) {
                if (filePath.length > 1) {
                    // ignore trailing '/' in url
                    filePath = filePath.replace(/\/$/, '');
                }
                if (!filePath || filePath.length === 0) {
                    // if we somehow got here without a path, show the root page
                    filePath = website.config.rootPage;
                }
                var page = website.pageByPath[filePath];
                if (!page) {
                    page = website.errorPages.error404;
                }
                return page;
            },
            hasPageForPath: function(filePath) {
                if (filePath.length > 1) {
                    // ignore trailing '/' in url
                    filePath = filePath.replace(/\/$/, '');
                }
                return website.pageByPath.hasOwnProperty(filePath);
            },
            resourceForPath: function(filePath) {
                try {
                    return fs.readFileSync(path.join(this.sitePath, filePath));
                }
                catch (err) {
                    return null;
                }
            },
            hasResourceForPath: function(filePath) {
                try {
                    var stats = fs.statSync(path.join(this.sitePath, filePath));
                    return stats.isFile();
                }
                catch (err) {
                    return false;
                }
            },
            typeOf: 'Sate.Website',
            eachPage: function(method, recurseSubpages) {
                var siteMap = this.siteMap;
                for (var p in siteMap) {
                    if (siteMap.hasOwnProperty(p) && siteMap[p].typeOf == 'Sate.Page') {
                        method.apply(siteMap[p], [siteMap[p]]);
                        if (recurseSubpages) {
                            siteMap[p].eachSubpage(method, true);
                        }
                    }
                }
            }
        }
    );
    Sate.currentSite = website;
    return website;
}

module.exports = Website;