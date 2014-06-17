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
        parentMark: '&lasquo;',
        leafMark: '&rasquo;',
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
        populateMenu: function(obj, website) {
            obj.hasParent = obj.parent && !!obj.parent.url;
            if (obj.hasParent && !obj.parent.name) {
                obj.parent.name =  website.pageForPath(obj.parent.url).name;
            }
            for (var u in obj.items) {
                if (obj.items.hasOwnProperty(u)) {
                    if (!obj.items[u].name && obj.items[u].url) {
                        obj.items[u].name = website.pageForPath(obj.items[u].url).name;
                    }
                    else if (obj.items[u].name && !obj.items[u].url) {
                        obj.items[u].subtitle = true;
                    }
                    if (obj.items[u].items) {
                        obj.items[u].hasSubItems = true;
                        this.populateMenu(obj.items[u], website);
                    }
                }
            }
        },
        objectToRender: function(config, page) {
            var obj;
            if (config.id) {
                obj = page.pluginById(config.id);
            } else if (config.forClass) {
                obj = page.pluginByTypeAndClassName(this.type, config.forClass);
            }
            if (!obj) {
                obj = page.pluginFirstByType(this.type);
            }
            if (!obj) {
                obj = {};
            } else {
                obj.extendWithProperties(config);
            }
            if (util.isArray(obj.classes)) {
                obj.classes.push('plugin-sate-pageMenu');
                obj.classes = obj.classes.join(' ');
            }
            obj.headingTag = this.headingTag;
            obj.parentMark = this.parentMark;
            obj.leafMark = this.leafMark;
            obj.maxLevels = this.maxLevels;
            obj.maxItems = this.maxItems;
            if (page.type == Sate.PageType.Index && obj.items && obj.items.length == 0) {
                console.log("FODSFODJFOJ");
                for (var p in page.subPages) {
                    console.log(p);
                    if (page.subPages.hasOwnProperty(p)) {
                        obj.items.push({"url": page.url + "/" + p});
                    }
                }
            }
            
            var website = page.rootPage().website;
            this.populateMenu(obj, website);
            console.log(page.type, obj.items);
            return obj;
        }
    });
    return plg;
};
