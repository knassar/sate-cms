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
            if (item.url == page.url) {
                item.active = true;
            }
            if (page.url.indexOf(item.url + "/") == 0) {
                item.activeDescendant = true;
            }
        },
        populateMenu: function(obj, page, website) {
            for (var u in obj.items) {
                if (obj.items.hasOwnProperty(u)) {
                    if (!obj.items[u].name && obj.items[u].url) {
                        obj.items[u].name = website.pageForPath(obj.items[u].url).name;
                    }
                    else if (obj.items[u].name && !obj.items[u].url) {
                        obj.items[u].subtitle = true;
                    }
                    if (obj.items[u].url) {
                        var menuPage = website.pageForPath(obj.items[u].url);
                    }
                    if (obj.items[u].items) {
                        this.populateMenu(obj.items[u], page, website);
                        obj.items[u].hasSubItems = true;
                    }
                    else if (obj.items[u].includeSublevel && menuPage.subPages) {
                        var items = [];
                        for (p in menuPage.subPages) {
                            if (menuPage.subPages.hasOwnProperty(p)) {
                                items.push({
                                    "url": menuPage.subPages[p].url
                                });
                            }
                        }
                        obj.items[u].items = items;
                        this.populateMenu(obj.items[u], page, website);
                        obj.items[u].hasSubItems = true;
                    }
                    this.setItemActiveState(obj.items[u], page);
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
                for (var p in page.subPages) {
                    if (page.subPages.hasOwnProperty(p)) {
                        var base = "/";
                        if (!page.isRoot) {
                            base = page.url + "/";
                        }
                        obj.items.push({"url": base + p});
                    }
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

            if (!util.isArray(obj.classes)) {
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
            return obj;
        }
    });
    return plg;
};
