var KN = {
    siteRelativePath: function() {
        return window.location.pathname.replace(KN.website.root, '').replace(/\/$/, '');
    },
    breadcrumbs: function(headingTag) {
        if (!headingTag) {
            headingTag = 'h2';
        }
        var path = KN.siteRelativePath();
        if (KN.page && KN.page.type != KN.PageType.Error) {
            var crumbs = path.split('/');
            if (crumbs.length > 1) {
                var trail = [];
                for (var i = 0; i < crumbs.length; i++) {
                    if (crumbs[i].length > 0) {
                        trail.push(crumbs[i]);
                        var page = KN.pageForPath(trail.slice(0).join('/'));
                        if (i == crumbs.length - 1) {
                            crumbs[i] = '<'+headingTag+' class="this-page">' + page.name + '</'+headingTag+'>';
                        } else {
                            crumbs[i] = '<a href="'+ KN.website.root + trail.join('/') +'">' + page.name + '</a>';
                        }
                    } else {
                        crumbs.splice(i, 1);
                    }
                }
                var seppa = '<span class="seppa">&rsaquo;</span>';
                return crumbs.join(seppa);
            } else {
                return '<'+headingTag+' class="this-page">' + KN.page.name + '</'+headingTag+'>';
            }
        } else {
            return '<'+headingTag+' class="this-page">' + KN.page.name + '</'+headingTag+'>';
        }
    },
    loadTemplate: function(t, coll) {
        $.ajax({
            url: '/templates/'+coll[t],
            dataType: 'text',
            success: function(data) {
                coll[t] = data;
            }
        });
    },
    temporaryAppend: function($el) {
        $('body').append($el.attr('id', KN.website.temporaryAppender));
    },
    cleanUpTemporaryAppend: function() {
        $('body #'+KN.website.temporaryAppender).remove();
    },
    addArticleIntroToIndexPage: function(indexPage, subPageKey, articleContent) {
        var $articleContent = $('<page>'+articleContent+'</page>');
        var article = {
            intro: $articleContent.find('#pageIntro').html(),
            detailcrumbs: function() {
                return KN.breadcrumbs('span');
            }
        };
        KN.thisPage = {};
        KN.temporaryAppend($articleContent.find('#pageData'));
        indexPage.articles.push(
            $.extend(indexPage.subPages[subPageKey], article, KN.thisPage)
        );
        KN.thisPage = {};
        KN.cleanUpTemporaryAppend();
        indexPage.unLoadedSubPages--;
        indexPage.articleReturned();
    },
    loadArticleIntrosForIndex: function(page, callback) {
        if (page.subPages) {
            page.unLoadedSubPages = 0;
            page.articleReturned = function() {
                if (this.unLoadedSubPages === 0) {
                    this.articles.sort(this.indexSort);
                    callback.apply(KN);
                }
            };
            var articleReturned = function(data, textStatus, jqXHR) {
                KN.addArticleIntroToIndexPage(jqXHR.page, jqXHR.p, data);
            };
            var articleFailedToLoad = function(jqXHR, textStatus, errorThrown) {
                jqXHR.page.unLoadedSubPages--;
                jqXHR.page.articleReturned();
            };
            var packXHR = function(jqXHR, settings) {
                jqXHR.page = page;
                jqXHR.p = settings.p;
                return jqXHR;
            };
            for (var p in page.subPages) {
                if (page.subPages.hasOwnProperty(p)) {
                    page.unLoadedSubPages++;
                    $.ajax({
                        url: KN.website.root + page.subPages[p].contentPath + '?fromSource',
                        p: p,
                        dataType: 'html',
                        beforeSend: packXHR,
                        success: articleReturned,
                        error: articleFailedToLoad
                    });
                }
            }
        }
    },
    flattenAndIndex: function(obj, prefix) {
        for (var p in obj) {
            if (obj.hasOwnProperty(p) && obj[p].isPage) {
                var page = obj[p];
                page.id = p;
                var localPath = p;
                if (prefix) {
                    localPath = prefix + '/' + localPath;
                }
                page.url = localPath;
                if (p == KN.website.rootPageName) {
                    page.contentPath = 'index.html';
                } else if (page.type === KN.PageType.Index) {
                    page.contentPath = localPath + '/index.html';
                    page.articles = [];
                } else {
                    page.contentPath = localPath + '.html';
                }
                if (!page.subtitle && page.name) {
                    page.subtitle = page.name;
                }
                KN.pageByPath[localPath] = page;
                if (page.subPages) {
                    KN.flattenAndIndex(page.subPages, localPath);
                }
                if (page.menu && !page.parent) {
                    if (!page.menu.name) {
                        page.menu.name = page.name;
                    }
                    if (!page.menu.path && p != KN.website.rootPageName) {
                        page.menu.path = localPath;
                    }
                    if (!page.menu.className) {
                        page.menu.className = p;
                    }
                    KN.globalMenu.push(page.menu);
                }
            }
        }
    },
    globalMenu: [],
    menuByPath: function(path) {
        var page = KN.pageForPath(path);
        return KN.menuByPage(page);
    },
    menuByPage: function(page) {
        while (page.menu === null && page.parent !== null) {
            page = page.parent;
        }
        return page.menu;
    },
    pageByPath: {},
    pageForPath: function(path) {
        if (!path || path.length === 0) {
            path = KN.website.rootPageName;
        }
        var page = KN.pageByPath[path];
        if (page) {
            page.menu = KN.menuByPage(page);
        }
        return page;
    },
    generateIndexes: function() {
        var map = KN.website.sitemap;
        KN.flattenAndIndex(map);
        KN.flattenAndIndex(KN.website.errorPages);
    },
    renderPage: function() {
        $('head').empty().append($(Mustache.render(KN.website.partials.head, KN.page, KN.website.partials)));
        var $body = $('body');
        $body.empty().append($(Mustache.render(KN.website.partials.body, KN.page, KN.website.partials)));
        if (KN.page.menu) {
            $body.addClass(KN.page.menu.className);
        } else {
            $body.addClass(KN.page.id);
        }
        $body.attr('id', KN.page.id);
        $.holdReady(false);
    },
    processPageData: function(data) {
        KN.page = $.extend(KN.website, KN.page);
        var $pageData = $('<page>'+data+'</page>');
        KN.thisPage = {};
        $('body').append($pageData.find('#pageData'));
        $('body').append($pageData.find('#pageScripts'));
        $.extend(KN.page, KN.thisPage);
        if (KN.page.literal.length > 0) {
            for (var i=0; i < KN.page.literal.length; i++) {
                KN.page[KN.page.literal[i]] = Mustache.render($pageData.find('#'+KN.page.literal[i]).html(), KN.page, KN.website.partials);
            }
        }
        KN.thisPage = {};
    },
    loadIndexPage: function() {
        $.ajax({
            url: KN.website.root + KN.page.contentPath + '?fromSource',
            dataType: 'html',
            success: function(data) {
                KN.processPageData(data);
                if (!KN.page.pageContent) {

                    KN.loadArticleIntrosForIndex(KN.page, KN.renderPage);
                } else {
                    KN.renderPage();
                }
            },
            error: function() {
                KN.pageNotFound();
            }
        });
    },
    loadArticlePage: function() {
        $.ajax({
            url: KN.website.root + KN.page.contentPath + '?fromSource',
            dataType: 'html',
            success: function(data) {
                KN.processPageData(data);
                KN.renderPage();
            },
            error: function() {
                KN.pageNotFound();
            }
        });
    },
    page: null,
    thisPage: {},
    loadPage: function() {
        var requestedPath = KN.siteRelativePath();
        KN.page = KN.pageForPath(requestedPath);
        if (KN.page) {
            switch (KN.page.type) {
                case KN.PageType.Index:
                    KN.loadIndexPage();
                    break;
                case KN.PageType.Article:
                    KN.loadArticlePage();
                    break;
                case KN.PageType.Error:
                    KN.pageNotFound();
                    break;
            }
        } else {
            KN.pageNotFound();
        }
    },
    pageNotFound: function() {
        KN.page = KN.pageByPath.error404;
        $.ajax({
            url: KN.website.root + 'errors/404.html?fromSource',
            dataType: 'html',
            success: function(data) {
                KN.processPageData(data);
                KN.renderPage();
            }
        });
    },
    abjectFailure: function() {
        KN.page = KN.pageByPath.error500;
        $.ajax({
            url: KN.website.root + 'errors/500.html?fromSource',
            dataType: 'html',
            success: function(data) {
                KN.processPageData(data);
                KN.renderPage();
            }
        });
    },
    
    
    SiteMode: {
        Test: 'test', // does not trap runtime errors, dynamically render all page content continuously
        Live: 'live', // traps runtime errors, dynamically renders content. expects to be run server-side (ie: Node)
        Static: 'static' // render and build a static site
    },
    Site: function(props) {
        KN.website = $.extend({
            root: '/site/',
            rootPageName: "index",
            mode: KN.SiteMode.Test,
            temporaryAppender: '__temporaryAppend__',
            partials: {
                'head': 'main/head.tpl',
                'body': 'main/body.tpl',
                'masthead': 'main/masthead.tpl',
                'indexPageContent': 'content/indexPageContent.tpl',
                'longDate': 'date-time/longDate.tpl'
            },
            literal: [
                'pageContent',
                'pageIntro'
            ],
            breadcrumbs: KN.breadcrumbs,
            errorPages: {
                error404: new KN.Page({
                    name: "error 404:",
                    type: KN.PageType.Error,
                    title: "Ooops... can't find that page..."
                }),
                error500: new KN.Page({
                    name: "error 500:",
                    type: KN.PageType.Error,
                    title: "Ummm..."
                })
            }
        }, props);
        for (var t in KN.website.partials) {
            if (KN.website.partials.hasOwnProperty(t)) {
                KN.loadTemplate(t, KN.website.partials);
            }
        }
        KN.generateIndexes();
        KN.website.globalMenu = KN.globalMenu;
    
        switch (KN.website.mode) {
            case KN.SiteMode.Test:
                KN.loadPage();
                break;
            case KN.SiteMode.Live:
                try {
                    KN.loadPage();
                } catch (e) {
                    KN.website.errorMessage = e.message;
                    KN.abjectFailure();
                }
                break;
            case KN.SiteMode.Static:
                throw new Error('@TODO: Static mode');
                // break;
            default:
                throw new Error('No SiteMode defined.');
        }
    },
    IndexSort: {
        DateDescending: function(a, b) {
            if (a.date && b.date) {
                return b.date.getTime() - a.date.getTime();
            } else if (a.date && !b.date) {
                return 1;
            } else {
                return -1;
            }
        },
        DateAscending: function(a, b) {
            if (a.date && b.date) {
                return a.date.getTime() - b.date.getTime();
            } else if (a.date && !b.date) {
                return -1;
            } else {
                return 1;
            }
        }
    },
    PageType: {
        Home: 'home',
        Index: 'index',
        Article: 'article',
        Error: 'error',
        Empty: 'empty'
    },
    Page: function(props) {
        var page = $.extend({
            name: "untitled page",
            menu: null,
            type: KN.PageType.Empty,
            subPages: null
        }, props);
        page.isPage = true;
        if (page.type == KN.PageType.Index && !page.indexSort) {
            page.indexSort = KN.IndexSort.DateDescending;
        }
        for (var p in page.subPages) {
            if (page.subPages.hasOwnProperty(p)) {
                page.subPages[p].parent = page;
            }
        }
        return page;
    }
};