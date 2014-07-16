/**
* Sate Page Menu plugin
* Use like: {{plugin-sate-menu}}
*/
module.exports = function() {
    var util = require('util');

    var plg = new Sate.Plugin({
        type: 'sate-menu',
        version: '0.6.0',
        mainTag: 'ul',
        items: [],
        classes: [],
        hasItems: function() {
            return this.items.length > 0;
        },
        hasSubItems: false,
        includeSublevel: false,
        compile: function(props, page, complete) {
            this.page = page.pageAscent();
            this.thisPageName = page.name;
            Sate.chain.inPlace(this, props);
            complete.apply();
        },
        templates: {
            'menu-node': 'menu-node.tpl',
            'main': 'main.tpl'
        },
        stylesheets: [
            'menu.css',
            'top-menu.css',
            'side-menu.css'
        ],
        setItemActiveState: function(item, page) {
            item.active = (item.url == page.url);
            item.activeDescendant = (page.url.indexOf(item.url + "/") == 0);
        },
        populateMenu: function(obj, page, sub) {
            var website = Sate.currentSite;
            if (util.isArray(obj.items)) {
                obj.items = obj.items.map(function(item) {
                    return Sate.pageDescriptor(item);
                })

                obj.items.forEach(function(item) {
                    if (!item.classes) {
                        item.classes = [];
                    }
                
                    if (item.name && !item.url) {
                        item.subtitle = true;
                    }
                
                    if (item.url) {
                        var menuPage = website.pageForPath(item.url);
                    }
                
                    if (item.items) {
                        this.populateMenu(item, page, true);
                        item.hasSubItems = item.items.length > 0;
                    }
                    else if (item.includeSublevel) {
                        var thisPage = website.pageForPath(item.url);
                        if (thisPage && thisPage.type == Sate.PageType.Index) {
                            var base = "/";
                            if (!thisPage.isRoot) {
                                base = thisPage.url + "/";
                            }
                            item.items = [];
                            if (thisPage.articles) {
                                thisPage.articles.forEach(function(article) {
                                    item.items.push({"url": base + article.id});
                                });
                            }
                        }
                        else if (menuPage.subPages) {
                            var items = [];
                            for (p in menuPage.subPages) {
                                if (menuPage.subPages.hasOwnProperty(p)) {
                                    items.push(menuPage.subPages[p].descriptor);
                                }
                            }
                            item.items = items;
                        }
                        this.populateMenu(item, page);
                        item.hasSubItems = item.items.length > 0;
                    }
                    else {
                        item.hasSubItems = false;
                    }

                    if (!sub) {
                        this.setItemActiveState(item, page);
                    }
                    else {
                        item.active = false;
                        item.activeDescendant = false;
                    }
                }, this);
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
            if (page.type == Sate.PageType.Index && util.isArray(page.articles)) {
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
            } 
            obj = Sate.chain(obj, config);

            if (obj.items && obj.items.length == 0) {
                this.findRelatedMenuItems(obj, page, config);
            }

            if (obj.parentLink && page.parent) {
                obj.parent = page.parent.descriptor();
            }
            this.populateMenu(obj, page);
            if (util.isArray(obj.items) && obj.items.length > 0) {

            }
            return obj;
        }
    });
    return plg;
};
