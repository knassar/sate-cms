function Page(props, website, Sate) {
    var fs = require('fs'),
        path = require('path'),
        extend = require('node.extend'),
        Mustache = require('mustache'),
        Compiler = require('./Compiler'),
        site = this;

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
        if (partials && partials.length > 0) {
            var pagePartials = {};
            for (var m = 0; m < partials.length; m++) {
                var partialCaps = partials[m].match(partialCapturer);
                if (partialCaps.length > 2) {
                    // @TODO: compile the templates for better performance
                    pagePartials[partialCaps[1]] = partialCaps[2];
                }
            }
            page.partials = extend(true, website.compiledPartials, page.partials, pagePartials);
        }
        success();
    };
    var loadIndexPage = function(page, success, error) {
        success();
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
                // loadIndexPage(page, success, error);
                // break;
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

    var page = extend(true, 
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
        // website,
        props, 
        {
            compiled: false,
            typeOf: 'Sate.Page',
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
            render: function() {
                this.classNames = this.classNames.join(' ');
                var html = Mustache.render(this.partials.html, this, this.partials);
                return html;
            }
        }
    );

    resolveType(page);
    page.eachSubpage(function(p) {
        p.parent = page;
        resolveType(p);
    })

    return page;
}
module.exports = Page;