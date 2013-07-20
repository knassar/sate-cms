function Page(id, props, parent, website, Sate) {
    var fs = require('fs'),
        path = require('path'),
        extend = require('node.extend'),
        Mustache = require('mustache'),
        Compiler = require('./Compiler'),
        PageDataResolver = require('./PageDataResolver'),
        resolver = new PageDataResolver(Sate),
        util = require("util");

    var pageDataMatcher = /\{\{\#pageData\}\}([\s\S]*?)\{\{\//m;
    var partialMatcher = /\{\{\<(?!pageData)[^\/]+\}\}[\s\S]*?\{\{\<\/[\w\d]+\}\}/mg;
    var partialCapturer = /\{\{\<([\w\d]+)\}\}([\s\S]*?)\{\{\<\//m;
    var processPageContent = function(page, data, success) {
        var pageData = null,
            matches = data.match(pageDataMatcher);
        
        if (matches && matches.length > 1) {
            pageData = JSON.parse(matches[1].trim());
        }
        page = extend(true, page, pageData);
        resolvePage(page);
        var partials = data.match(partialMatcher);
        page.partials = extend({}, website.compiledPartials, page.partials);
        if (partials && partials.length > 0) {
            for (var m = 0; m < partials.length; m++) {
                var partialCaps = partials[m].match(partialCapturer);
                if (partialCaps.length > 2) {
                    // @TODO: compile the templates for better performance
                    page.partials[partialCaps[1]] = partialCaps[2];
                }
            }
        }
        if (!page.partials.intro) {
            page.partials.intro = null;
        }
        if (!page.partials.content) {
            page.partials.content = null;
        }
        success();
    };
    
    var composeArticleIntroForIndexPage = function(page, subPage) {
        var article = {
                url: subPage.url,
                name: subPage.name,
                detailcrumbs: subPage.breadcrumbs,
                date: subPage.date,
                intro: Mustache.render(subPage.partials.intro, subPage, subPage.partials)
        };
        page.articles.push(article);
    };
    
    var loadIndexPage = function(page, success, error) {
        if (!page.partials.content && page.subPages) {
            page.articles = [];
            for (var p in page.subPages) {
                if (page.subPages.hasOwnProperty(p)) {
                    composeArticleIntroForIndexPage(page, page.subPages[p]);
                }
            }
            if (page.articleSort) {
                page.article.sort(page.articleSort);
            }
            page.partials.content = page.partials.indexPageContent;
            success();
        } else {
            success();
        }
    };
    
    var loadArticlePage = function(page, success, error) {
        fs.readFile(page.contentPath, page.encoding, function(err, data) {
            if (err) {
                console.log( err );
                error(err);
            } else {
                processPageContent(page, data, success);
            }
        });
    };

    var loadPageContent = function(page, success, error) {
        switch (page.type) {
            case Sate.PageType.Index:
                var indexLoadCallback = function() {
                    loadIndexPage(page, success, error);
                };
                process.nextTick(function() {
                    loadArticlePage(page, indexLoadCallback, error);
                });
                break;
            case Sate.PageType.Article:
            default:
                loadArticlePage(page, success, error);
                break;
        }
    };

    var resolvePage = function(page) {
        resolver.resolve(page);
    }

    var initialize = function(page, website, Sate) {
        resolvePage(page);
        
        if (page.isRoot) {
            page.url = website.siteConfig.rootPageUrl;
            page.contentPath = path.join(website.siteConfig.content, 'index.html');
        } else {
            page.url = [page.parent.url, page.id].join('/').replace(/[\/]+/g, '/');
            if (page.type === Sate.PageType.Index) {
                page.contentPath = path.join(website.siteConfig.content, page.url + '/index.html');
                page.articles = [];
            } else {
                page.contentPath = path.join(website.siteConfig.content, page.url + '.html');
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
    }

    var newPage = extend(true, 
        {
            name: "untitled page",
            menu: null,
            indexSort: Sate.IndexSort.DateDescending,
            type: Sate.PageType.Empty,
            subPages: null,
            encoding: website.siteConfig.encoding,
            classNames: [],
            plugins: [
                {type: 'sate-breadcrumbs'},
                {type: 'sate-sequenceNav'}
            ]
        },
        website.siteConfig,
        props, 
        {
            id: id,
            parent: (parent) ? website.pageForPath(parent.url) : null,
            siteMenu: website.siteMenu,
            compiled: false,
            typeOf: 'Sate.Page',
            isRoot: (id == website.siteConfig.rootPage),
            compile: function(success, error, withMetrics) {
                var compiler = new Compiler(this, success, error);
                if (withMetrics) {
                    compiler.recordMetrics();
                }
                compiler.stepStart('load-content');
                loadPageContent(this, function() {
                    compiler.stepComplete('load-content');
                }, function(err) {
                    compiler.stepError('load-content', err);
                });
            },
            eachSubpage: function(method, recurseSubpages) {
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
            },
            hasSubpages: function() {
                return this.subPages.length > 0;
            },
            classNamesString: function() {
                if (this.classNames.filter) {
                    return this.classNames.filter(function (e, i, arr) {
                        return arr.lastIndexOf(e) === i;
                    }).join(' ');
                } else if (typeof this.classNames == 'string') {
                    return this.classNames;
                }
            },
            resolveSiteMenu: function() {
                var p = this;
                while (!p.isRoot && p.parent && !p.parent.isRoot) {
                    p = p.parent;
                }
                var rootUrl = p.url;
                for (var i=0; i < this.siteMenu.length; i++) {
                    this.siteMenu[i].isActive = (this.siteMenu[i].url == rootUrl);
                };
            },
            hasBreadcrumbs: function() {
                return this.name || (!this.isRoot && !this.parent.isRoot);
            },
            render: function() {
                this.resolveSiteMenu();
                this.classNames = this.classNamesString();
                var html = Mustache.render(this.partials.html, this, this.partials);
                return html;
            }
        }
    );
    
    initialize(newPage, website, Sate);
    return newPage;
}
module.exports = Page;
