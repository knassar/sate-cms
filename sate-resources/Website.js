function Website(jsonPath, flags, Sate) {
    var fs = require('fs'),
        path = require('path'),
        extend = require('node.extend'),
        Mustache = require('mustache'),
        Compiler = require('./Compiler');

    var website = {};
    var defaults = {
        siteConfig: {
            content: './',
            rootPage: 'home',
            rootPageUrl: '/',
            encoding: 'utf-8'
        },
        partials: {
            'html': 'main/html.tpl',
            'masthead': 'main/masthead.tpl',
            'indexPageContent': 'content/indexPageContent.tpl',
            'longDate': 'date-time/longDate.tpl'
        }
    };
    
    var setupMenu = function(page, website) {
        if (page.isRoot || page.parent.isRoot) {
            if (page.menu) {
                if (!page.menu.name) {
                    page.menu.name = page.name;
                }
                if (!page.menu.path) {
                    page.menu.path = page.url;
                }
                if (!page.menu.className) {
                    page.menu.className = page.id;
                }
            }
            website.siteMenu.push(page.menu);
        } else if (page.menu) {
            // @TODO: what to do here? Not sure
            // if (!page.menu.name) {
            //     page.menu.name = page.name;
            // }
            // if (!page.menu.path) {
            //     page.menu.path = page.url;
            // }
            // if (!page.menu.className) {
            //     page.menu.className = page.id;
            // }
        }
        page.siteMenu = website.siteMenu;
    };

    var indexPage = function(id, pageData, website, parent) {
        var page = new Sate.Page(id, pageData, parent, website, Sate);
        setupMenu(page, website);
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
            website.siteMap[website.siteConfig.rootPage] = indexPage(website.siteConfig.rootPage, website.siteMap[website.siteConfig.rootPage], website);
            // @TODO: 
            // for (var id in website.errorPages) {
            // website.errorPages[id] = indexPage(id, errorPage, website);
            success();
        } catch (err) {
            error(err);
        }
    };

    var siteRelativePath = function() {
        return window.location.pathname.replace(website.root, '').replace(/\/$/, '');
    };

    var loadTemplate = function(t, coll, success, error) {
        fs.readFile(path.join('./templates/', coll[t]), {encoding: website.siteConfig.encoding}, function(err, data) {
            if (!err) {
                // @TODO: compile the templates for better performance
                website.compiledPartials[t] = data;
                success();
            } else {
                error(err);
            }
        });
    };
    
    //     pageNotFound: function() {
    //         KN.page = KN.pageByPath.error404;
    //         $.ajax({
    //             url: KN.website.root + 'errors/404.html?fromSource',
    //             dataType: 'html',
    //             success: function(data) {
    //                 KN.processPageData(data);
    //                 KN.renderPage();
    //             }
    //         });
    //     },
    //     abjectFailure: function() {
    //         KN.page = KN.pageByPath.error500;
    //         $.ajax({
    //             url: KN.website.root + 'errors/500.html?fromSource',
    //             dataType: 'html',
    //             success: function(data) {
    //                 KN.processPageData(data);
    //                 KN.renderPage();
    //             }
    //         });
    //     }
    // };

    var compilePartial = function(compiler, partialName) {
        var step = 'partial-'+partialName;
        compiler.stepStart(step);
        loadTemplate(partialName, website.partials, function() {
            compiler.stepComplete(step);
        }, function(err) {
            compiler.stepError(step, err);
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
        website.siteConfig = extend(true, 
            defaults.siteConfig, 
            website.json.siteConfig,
            website.cliFlags
            );
        website.siteMap = extend(true, 
            defaults.siteMap, 
            website.json.siteMap
            );
        website.partials = extend(true, 
            defaults.partials, 
            website.json.partials
            );
    };
    
    var loadWebsiteJSON = function(jsonPath, complete, error) {
        websitePath = path.normalize(jsonPath);
        fs.readFile(websitePath, {encoding: defaults.siteConfig.encoding}, function(err, data) {
            if (err) {
                error(err);
            } else {
                website.json = JSON.parse(data);
                mergeConfig();
                complete.apply(website);
            }
        });
    };
    
    website = extend(true,
        {
            // errorPages: {
            //     error404: new Sate.Page({
            //         name: "error 404:",
            //         type: Sate.PageType.Error,
            //         subtitle: "Page Not Found"
            //     }, website, Sate),
            //     error500: new Sate.Page({
            //         name: "error 500:",
            //         type: Sate.PageType.Error,
            //         subtitle: "Server Error"
            //     }, website, Sate)
            // }
            json: null,
            jsonPath: jsonPath,
            cliFlags: flags,
            compiled: false,
            compiledPartials: {},
            pageByPath: {},
            siteMenu: [],
            breadcrumbs: require('./sate-modules/breadcrumbs'),
            compile: function(success, error) {
                var compiler = new Compiler(this, success, error);
                
                // first:
                loadWebsiteJSON(this.jsonPath, function() {                    
                    // then in parallel
                    for (var t in website.partials) {
                        if (website.partials.hasOwnProperty(t)) {
                            compilePartial(compiler, t);
                        }
                    }
                    // console.log( this );

                    // also in parallel
                    compiler.stepStart('generateIndexes');
                    generateIndexes(this, function() {
                        compiler.stepComplete('generateIndexes');
                    }, function(err) {
                        compiler.stepError('generateIndexes', err);
                    });
        
                    // then:
                    for (var path in this.pageByPath) {
                        if (this.pageByPath.hasOwnProperty(path)) {
                            compilePage(compiler, this.pageByPath[path]);
                        }
                    }
                }, function(err) {
                    console.log( err );
                });
            },
            recompile: function(success, error) {
                // clear compiled data
                this.compiledPartials = {};
                this.pageByPath = {};
                this.siteMenu = [];
                this.json = null;
                this.compiled = false;
                
                // compile again:
                this.compile(success, error);

            },
            pageForPath: function(path) {
                if (path.length > 1) {
                    // ignore trailing '/' in url
                    path = path.replace(/\/$/, '');
                }
                if (!path || path.length === 0) {
                    // if we somehow got here without a path, show the root page
                    path = website.siteConfig.rootPage;
                }
                var page = website.pageByPath[path];
                if (page) {
                    // if we have a page, make sure we have menu
                    page.menu = website.menuByPage(page);
                } else {
                    // @TODO: return the 404 page here
                }
                return page;
            },
            menuByPage: function(page) {
                // walk up the page graph until we get to a page with a menu defined
                while (page.menu === null && page.parent !== null) {
                    if (page.parent) {
                        page = page.parent;
                    } else {
                        break;
                    }
                }
                return page.menu;
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