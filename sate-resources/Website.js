function Website(args, Sate) {
    var fs = require('fs'),
        path = require('path'),
        extend = require('node.extend'),
        Compiler = require(__dirname+'/Compiler');

    var website = {};
    var defaults = {
        config: {
            rootPage: 'home',
            rootPageUrl: '/',
            encoding: 'utf-8'
        },
        pageDefaults: {
            title: "Sate",
            subtitle: "Just Enough CMS",
            name: "untitled page",
            menu: null,
            indexSort: "Sate.IndexSort.DateDescending",
            type: "Sate.PageType.Article",
            classNames: [],
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
                    type: "sate-sequenceNav"
                }
            ]//,
            // partials: {
            //     masthead: "main/masthead.tpl",
            //     indexPageContent: "content/indexPageContent.tpl",
            //     longDate: "date-time/longDate.tpl"
            // }
        },
        templates: {
            // rss: "main/rss.tpl",
            html: "main/html.tpl"
        },
        errorPages: {
            error404: {
                name: "error 404:",
                type: "Sate.PageType.Error",
                contentPath: "./sate-cms/error/404.html",
                subtitle: "Page Not Found"
            }
        },
        partials: {
            'html': 'main/html.tpl',
            'masthead': 'main/masthead.tpl',
            'indexPageContent': 'content/indexPageContent.tpl',
            'longDate': 'date-time/longDate.tpl'
        }
    };

    var setupMenu = function(page, website) {
        page.menu = new Sate.MenuItem(page, page.menu, website);
        if (page.isRoot || page.parent.isRoot) {
            website.siteMenu.push(page.menu);
        }
        page.eachSubpage(function(p) {
            setupMenu(p, website);
        });
        page.siteMenu = website.siteMenu;
    };

    var generateMenus = function(website) {
        setupMenu(website.pageByPath[website.config.rootPageUrl], website);
    };

    var indexPage = function(id, pageData, website, parent) {
        var page = new Sate.Page(id, pageData, parent, website, Sate);
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

    var generateIndexes = function(website, success, error) {
        try {
            website.siteMap[website.config.rootPage] = indexPage(website.config.rootPage, website.siteMap[website.config.rootPage], website);
            generateMenus(website);
            for (var id in website.errorPages) {
                if (website.errorPages.hasOwnProperty(id)) {
                    website.errorPages[id] = indexPage(id, website.errorPages[id], website);
                    website.errorPages[id].siteMenu = website.siteMenu;
                }
            }
            success();
        } catch (err) {
            console.log( err );
            error(err);
        }
    };
    // @TODO: Move to Page.js
    var loadPartial = function(website, t, coll, success, error) {
        fs.readFile(path.join(website.sateSources, 'templates', coll[t]), {encoding: website.config.encoding}, function(err, data) {
            if (!err) {
                // @TODO: compile the templates for better performance
                website.compiledPartials[t] = data;
                success();
            } else {
                console.log( err );
                error(err);
            }
        });
    };
    // @TODO: Move to Page.js
    var compilePartial = function(website, partialName, compiler) {
        var step = 'partial-'+partialName;
        compiler.stepStart(step);
        loadPartial(website, partialName, website.partials, function() {
            compiler.stepComplete(step);
        }, function(err) {
            compiler.stepError(step, err);
        });
    };

    var loadTemplate = function(website, t, coll, success, error) {
        fs.readFile(path.join(website.sateSources, 'templates', coll[t]), {encoding: website.config.encoding}, function(err, data) {
            if (!err) {
                // @TODO: compile the templates for better performance
                website.compiledTemplates[t] = data;
                success();
            } else {
                console.log( err );
                error(err);
            }
        });
    };
    var compileTemplate = function(website, templateName, compiler) {
        var step = 'template-'+templateName;
        compiler.stepStart(step);
        loadTemplate(website, templateName, website.templates, function() {
            compiler.stepComplete(step);
        }, function(err) {
            compiler.stepError(step, err);
        });
    };
    var compilePage = function(compiler, page, withMetrics) {
        var step = 'compile-page-'+page.url;
        compiler.stepStart(step);
        page.compile(function() {
            compiler.stepComplete(step);
        }, function(err) {
            compiler.stepError(step, err);
        }, withMetrics);
    };
    var compilePages = function(compiler, website, withMetrics) {
        for (var path in website.pageByPath) {
            if (website.pageByPath.hasOwnProperty(path)) {
                compilePage(compiler, website.pageByPath[path], withMetrics);
            }
        }
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
    };
    
    var loadWebsiteJSON = function(sitePath, complete, error) {
        websitePath = path.normalize(path.join(sitePath, 'website.json'));
        fs.readFile(websitePath, {encoding: defaults.config.encoding}, function(err, data) {
            if (err) {
                console.log( err );
                error(err);
            } else {
                website.json = JSON.parse(data);
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
            siteMenu: [],
            isCompiling: false,
            pendingRequests: [],
            performAfterCompile: function(action) {
                if (this.isCompiling) {
                    this.pendingRequests.push(action);
                } else {
                    process.nextTick(action);
                }
            },
            compile: function(success, error, withMetrics) {
                this.isCompiling = true;
                var self = this;
                var complete = function() {
                    self.isCompiling = false;
                    success();
                    for (var i=0; i < self.pendingRequests.length; i++) {
                        process.nextTick(self.pendingRequests[i]);
                    }
                };
                var compiler = new Compiler(this, complete, error);
                if (withMetrics) {
                    compiler.recordMetrics();
                }
                // first:
                loadWebsiteJSON(this.sitePath, function() {
                    // then in parallel
                    for (var t in website.partials) {
                        if (website.partials.hasOwnProperty(t)) {
                            compilePartial(this, t, compiler);
                        }
                    }
                    for (var t in website.templates) {
                        if (website.templates.hasOwnProperty(t)) {
                            compileTemplate(this, t, compiler);
                        }
                    }
                    
                    // also in parallel
                    compiler.stepStart('generateIndexes');
                    var self = this;
                    generateIndexes(this, function() {
                        compiler.stepComplete('generateIndexes');

                        // then:
                        process.nextTick(function() {
                            compilePages(compiler, self, withMetrics);
                        });
                    }, function(err) {
                        compiler.stepError('generateIndexes', err);
                    });

                }, function(err) {
                    console.log( err );
                });
            },
            recompile: function(success, error) {
                // clear compiled data
                cleanObject(this.compiledPartials);
                cleanObject(this.pageByPath);
                this.siteMenu.length = 0;
                this.json = null;
                this.compiled = false;

                // compile again:
                this.compile(success, error);

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
                    page = website.pageByPath['sate-cms/error/404'];
                    console.log( page );
                }
                return page;
            },
            resourceForPath: function(filePath) {
                return fs.readFileSync(path.join(this.sitePath, filePath));
            },
            menuByPage: function(page) {
                // walk up the page graph until we get to a page with a menu defined
                var menuPage = page;
                while (menuPage.menu === null && menuPage.parent !== null) {
                    if (menuPage.parent) {
                        menuPage = menuPage.parent;
                    } else {
                        break;
                    }
                }
                return menuPage.menu;
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
    return website;
}

module.exports = Website;