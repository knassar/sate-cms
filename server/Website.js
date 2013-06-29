function Website(props, Sate) {
    var fs = require('fs'),
        path = require('path'),
        extend = require('node.extend'),
        Mustache = require('mustache'),
        Compiler = require('./Compiler');

    var website = {};

    var flattenAndIndex = function(obj, config, prefix) {
        for (var p in obj) {
            if (obj.hasOwnProperty(p)) {
                var page = new Sate.Page(obj[p], website, Sate);
                page.id = p;
                var urlParts = [];
                if (prefix) {
                    urlParts.push(prefix);
                }
                urlParts.push(p);
                page.url = urlParts.join('/');
                if (p == config.rootPage) {
                    page.contentPath = path.join(website.siteConfig.content, 'index.html');
                } else if (page.type === Sate.PageType.Index) {
                    page.contentPath = path.join(website.siteConfig.content, page.url + '/index.html');
                    page.articles = [];
                } else {
                    page.contentPath = path.join(website.siteConfig.content, page.url + '.html');
                }
                if (!page.subtitle && page.name) {
                    page.subtitle = page.name;
                }
                website.pageByPath[page.url] = page;
                if (page.subPages) {
                    flattenAndIndex(page.subPages, config, page.url);
                }
                if (page.menu && !page.parent) {
                    if (!page.menu.name) {
                        page.menu.name = page.name;
                    }
                    if (!page.menu.path && p != website.rootPageName) {
                        page.menu.path = page.url;
                    }
                    if (!page.menu.className) {
                        page.menu.className = p;
                    }
                    website.globalMenu.push(page.menu);
                }
                obj[p] = page;
            }
        }
    };

    var menuByPath = function(path) {
        var page = website.pageForPath(path);
        return website.menuByPage(page);
    };

    var menuByPage = function(page) {
        while (page.menu === null && page.parent !== null) {
            page = page.parent;
        }
        return page.menu;
    };

    var pageForPath = function(path) {
        if (!path || path.length === 0) {
            path = website.rootPageName;
        }
        var page = website.pageByPath[path];
        if (page) {
            page.menu = website.menuByPage(page);
        }
        return page;
    };

    var generateIndexes = function(website, success, error) {
        try {
            flattenAndIndex(website.siteMap, website.siteConfig);
            flattenAndIndex(website.errorPages, website.siteConfig);
            success();
        } catch (err) {
            error(err);
        }
    };

    var siteRelativePath = function() {
        return window.location.pathname.replace(website.root, '').replace(/\/$/, '');
    };

    var loadTemplate = function(t, coll, success, error) {
        fs.readFile(path.join('./templates/', coll[t]), {encoding: website.encoding}, function(err, data) {
            if (!err) {
                coll[t] = Mustache.compile(data);
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

    website = extend(true,
        {
            siteConfig: {
                content: './',
                rootPage: "index"
            },
            partials: {
                'head': 'main/head.tpl',
                'body': 'main/body.tpl',
                'masthead': 'main/masthead.tpl',
                'indexPageContent': 'content/indexPageContent.tpl',
                'longDate': 'date-time/longDate.tpl'
            },
            globalMenu: [],
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
        },
        props,
        {
            compiled: false,
            compiler: null,
            pageByPath: {},
            breadcrumbs: require('./sate-modules/breadcrumbs'),
            compile: function(success, error) {
                var compiler = new Compiler(this, success, error);
                // in parallel
                for (var t in website.partials) {
                    if (website.partials.hasOwnProperty(t)) {
                        compilePartial(compiler, t);
                    }
                }
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
};

module.exports = Website;