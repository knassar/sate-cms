/**
* Sate Page Menu plugin
* Use like: {{plugin-sate-pageMenu}}
*/
module.exports = function(Sate) {
    var Plugin = require(__dirname+'/../Plugin'),
        util = require('util');

    var plg = new Plugin(Sate, {
        type: 'sate-pageMenu',
        version: '0.2.0',
        mainTag: 'ul',
        items: [],
        classes: [],
        hasSubItems: false,
        includeSublevel: false,
        compile: function(props, page, Sate, complete) {
            this.page = page.pageAscent();
            this.thisPageName = page.name;
            this.extendWithProperties(props);
            complete.apply();
        },
        templates: {
            'menu-node': __dirname+'/menu-node.tpl',
            'main': __dirname+'/pageMenu.tpl'
        },
        stylesheets: [
            '/sate-cms/plugins/sate-pageMenu/pageMenu.css',
            '/sate-cms/plugins/sate-pageMenu/top-menu.css',
            '/sate-cms/plugins/sate-pageMenu/side-menu.css'
        ],
        setItemActiveState: function(item, page) {
            item.active = (item.url == page.url);
            item.activeDescendant = (page.url.indexOf(item.url + "/") == 0);
        },
        populateMenu: function(obj, page, website, sub) {
            for (var u in obj.items) {
                if (obj.items.hasOwnProperty(u)) {
                    if (!obj.items[u].classes) {
                        obj.items[u].classes = [];
                    }
                    
                    if (!obj.items[u].name && obj.items[u].url) {
                        var thisPage = website.pageForPath(obj.items[u].url);
                        if (!thisPage) {
                        }
                        obj.items[u].name = website.pageForPath(obj.items[u].url).name;
                    }
                    else if (obj.items[u].name && !obj.items[u].url) {
                        obj.items[u].subtitle = true;
                    }
                    
                    if (obj.items[u].url) {
                        var menuPage = website.pageForPath(obj.items[u].url);
                    }
                    
                    if (obj.items[u].items) {
                        this.populateMenu(obj.items[u], page, website, true);
                        obj.items[u].hasSubItems = obj.items[u].items.length > 0;
                    }
                    else if (obj.items[u].includeSublevel) {
                        var thisPage = website.pageForPath(obj.items[u].url);
                        if (thisPage && thisPage.type == Sate.PageType.Index) {
                            var base = "/";
                            if (!thisPage.isRoot) {
                                base = thisPage.url + "/";
                            }
                            obj.items[u].items = [];
                            for (var i = 0; i < thisPage.articles.length; i++) {
                                obj.items[u].items.push({"url": base + thisPage.articles[i].id});
                            }
                        }
                        else if (menuPage.subPages) {
                            var items = [];
                            for (p in menuPage.subPages) {
                                if (menuPage.subPages.hasOwnProperty(p)) {
                                    items.push({
                                        "url": menuPage.subPages[p].url
                                    });
                                }
                            }
                            obj.items[u].items = items;
                        }
                        this.populateMenu(obj.items[u], page, website);
                        obj.items[u].hasSubItems = obj.items[u].items.length > 0;
                    }
                    else {
                        obj.items[u].hasSubItems = false;
                    }

                    if (!sub) {
                        this.setItemActiveState(obj.items[u], page);
                    }
                    else {
                        obj.items[u].active = false;
                        obj.items[u].activeDescendant = false;
                    }
                }
            }
        },
        pluginDataFromPage: function(page, config) {
            var obj;
            if (config.id) {
                obj = page.pluginById(config.id);
            } 
            else if (config.forClass) {
                obj = page.pluginByTypeAndClassName(this.type, config.forClass);
            } 
            else {
                obj = page.pluginFirstByType(this.type);
            }
            if (!obj && !page.isRoot) {
                obj = this.pluginDataFromPage(page.parent, config);
                if (!obj.inherited) {
                    obj.items = [];
                }
            }
            if (!obj && page.type == Sate.PageType.Index) {
                obj = this;
            }            
            return obj;
        },
        findRelatedMenuItems: function(obj, page, config) {
            if (page.type == Sate.PageType.Index) {
                var base = "/";
                if (!page.isRoot) {
                    base = page.url + "/";
                }
                for (var i = 0; i < page.articles.length; i++) {
                    obj.items.push({"url":base + page.articles[i].id});
                }
            }
            else if (!page.isRoot) {
                page = page.parent;
                var parentObj = this.pluginDataFromPage(page, config);
                if (parentObj.items && parentObj.items.length > 0) {
                    obj.items = parentObj.items;
                    obj.parentLink = parentObj.parentLink;
                }
                else {
                    this.findRelatedMenuItems(obj, page, config);
                }
            }
        },
        objectToRender: function(config, page) {
            var obj = this.pluginDataFromPage(page, config);
            
            if (!obj || obj == null) {
                obj = this;
            } else {
                obj.extendWithProperties(config);
            }

            if (obj.items && obj.items.length == 0) {
                this.findRelatedMenuItems(obj, page, config);
            }

            if (typeof obj.classes == 'string') {
                obj.classes = [obj.classes];
            }
            else if (typeof obj.classes == 'object' && !util.isArray(obj.classes)) {
                var classes = [];
                for (var c in obj.classes) {
                    if (obj.classes.hasOwnProperty(c)) {
                        classes.push(obj.classes[c]);
                    }
                }
                obj.classes = classes;
            }
            else if (!obj.classes.push) {
                obj.classes = [];
            }
            obj.classes.push('plugin-sate-pageMenu');
            obj.classes = obj.classes.join(' ');
            
            var website = page.rootPage().website;
            if (obj.parentLink && page.parent) {
                obj.parent = {
                    "url": page.parent.url,
                    "name": website.pageForPath(page.parent.url).name
                };
            }
            this.populateMenu(obj, page, website);
            if (util.isArray(obj.items) && obj.items.length > 0) {

            }
            return obj;
        }
    });
    return plg;
};
