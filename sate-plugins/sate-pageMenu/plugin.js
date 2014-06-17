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
        headingTag: 'ul',
        items: [],
        maxLevels: 5,
        maxItems: 30,
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
        stylesheets: ['/sate-cms/plugins/sate-pageMenu/pageMenu.css'],
        populateMenu: function(obj, page, website) {
            for (var u in obj.items) {
                if (obj.items.hasOwnProperty(u)) {
                    if (obj.items[u].url == page.url) {
                        obj.items[u].active = true;
                    }
                    if (!obj.items[u].name && obj.items[u].url) {
                        obj.items[u].name = website.pageForPath(obj.items[u].url).name;
                    }
                    else if (obj.items[u].name && !obj.items[u].url) {
                        obj.items[u].subtitle = true;
                    }
                    if (obj.items[u].items) {
                        obj.items[u].hasSubItems = true;
                        this.populateMenu(obj.items[u], page, website);
                    }
                }
            }
        },
        pluginDataFromPage: function(page, config) {
            var obj;
            if (config.id) {
                obj = page.pluginById(config.id);
            } else if (config.forClass) {
                obj = page.pluginByTypeAndClassName(this.type, config.forClass);
            } else {
                obj = page.pluginFirstByType(this.type);
            }
            if (!obj && !page.isRoot) {
                obj = this.pluginDataFromPage(page.parent, config);
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
            
            if (!obj) {
                obj = {};
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
