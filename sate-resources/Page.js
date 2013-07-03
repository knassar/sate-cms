function Page(id, props, parent, website, Sate) {
    var fs = require('fs'),
        path = require('path'),
        extend = require('node.extend'),
        Mustache = require('mustache'),
        Compiler = require('./Compiler'),
        util = require("util");

    // var addArticleIntroToIndexPage = function(indexPage, subPageKey, articleContent) {
    //     var $articleContent = $('<page>'+articleContent+'</page>');
    //     var article = {
    //         intro: $articleContent.find('#pageIntro').html(),
    //         detailcrumbs: function() {
    //             return site.breadcrumbs('span');
    //         }
    //     };
    //     site.thisPage = {};
    //     site.temporaryAppend($articleContent.find('#pageData'));
    //     indexPage.articles.push(
    //         extend(true, indexPage.subPages[subPageKey], article, site.thisPage)
    //     );
    //     site.thisPage = {};
    //     site.cleanUpTemporaryAppend();
    //     indexPage.unLoadedSubPages--;
    //     indexPage.articleReturned();
    // };
    // 
    // var loadArticleIntrosForIndex = function(page, callback) {
    //     if (page.subPages) {
    //         page.unLoadedSubPages = 0;
    //         page.articleReturned = function() {
    //             if (this.unLoadedSubPages === 0) {
    //                 this.articles.sort(this.indexSort);
    //                 callback.apply(site);
    //             }
    //         };
    //         var articleReturned = function(data, textStatus, jqXHR) {
    //             site.addArticleIntroToIndexPage(jqXHR.page, jqXHR.p, data);
    //         };
    //         var articleFailedToLoad = function(jqXHR, textStatus, errorThrown) {
    //             jqXHR.page.unLoadedSubPages--;
    //             jqXHR.page.articleReturned();
    //         };
    //         var packXHR = function(jqXHR, settings) {
    //             jqXHR.page = page;
    //             jqXHR.p = settings.p;
    //             return jqXHR;
    //         };
    //         for (var p in page.subPages) {
    //             if (page.subPages.hasOwnProperty(p)) {
    //                 page.unLoadedSubPages++;
    //                 $.ajax({
    //                     url: site.website.root + page.subPages[p].contentPath + '?fromSource',
    //                     p: p,
    //                     dataType: 'html',
    //                     beforeSend: packXHR,
    //                     success: articleReturned,
    //                     error: articleFailedToLoad
    //                 });
    //             }
    //         }
    //     }
    // };

    var pageDataMatcher = /\{\{\!pageData\}\}([\s\S]*?)\{\{\!\//m;
    var partialMatcher = /\{\{\!(?!pageData)[^\/]+\}\}[\s\S]*?\{\{\!\/[\w\d]+\}\}/mg;
    var partialCapturer = /\{\{\!([\w\d]+)\}\}([\s\S]*?)\{\{\!\//m;
    var processPageContent = function(page, data, success) {
        var pageData = null,
            intro = null,
            content = null;
        var matches = data.match(pageDataMatcher);
        
        if (matches && matches.length > 1) {
            pageData = JSON.parse(matches[1].trim());
        }
        page = extend(true, page, pageData);
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
        success();
    };
    
    var loadIndexPage = function(page, success, error) {
        // util.log("Rendering index page at " + page.url);
        success();
        /**
         * Psuedo code
         */
        // Determine if there are subpages
        // If subpages exist, loop through each subpage
            // get just the intro
            // if intro empty or maybe not defined, parse some of the content
            // add resulting text block to a data structure (matching the layout of the indexPageContent.tpl)
        // end loop
        // render the resulting data structure
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
                loadIndexPage(page, success, error);
                //break;
            case Sate.PageType.Article:
            default:
                loadArticlePage(page, success, error);
                break;
        }
    };

    var resolveType = function(page) {
        if (!page.type) {
            if (typeof page.subPages == 'object') {
                page.type = Sate.PageType.Index;
            } else {
                page.type = Sate.PageType.Article;
            }
        } else if (typeof page.type == 'string') {
            var parts = page.type.split('.');
            if (parts.length == 3 && parts[0] == 'Sate' && parts[1] == 'PageType') {
                page.type = parts[2].toLowerCase(); 
            }
        }
    };

    var initialize = function(page, website, Sate) {
        resolveType(page);

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
            classNames: []
        },
        website.siteConfig,
        props, 
        {
            id: id,
            parent: parent,
            siteMenu: website.siteMenu,
            compiled: false,
            typeOf: 'Sate.Page',
            isRoot: (id == website.siteConfig.rootPage),
            compile: function(success, error) {
                var compiler = new Compiler(this, success, error);
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
            breadcrumbs: require('./sate-modules/breadcrumbs'),
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

/* Old loadIndexPage method
// $.ajax({
//     url: KN.website.root + KN.page.contentPath + '?fromSource',
//     dataType: 'html',
//     success: function(data) {
//         KN.processPageData(data);
//         if (!KN.page.pageContent) {
//     
//             KN.loadArticleIntrosForIndex(KN.page, KN.renderPage);
//         } else {
//             KN.renderPage();
//         }
//     },
//     error: function() {
//         KN.pageNotFound();
//     }
// });
*/