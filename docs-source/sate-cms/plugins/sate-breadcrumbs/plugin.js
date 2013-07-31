/**
* Sate Breadcrumb navigation plugin
* Use like: {{plugin-sate-breadcrumbs}}
*/
module.exports = function(Sate) {
    var Plugin = require(__dirname+'/../Plugin'),
        util = require('util');

    var plg = new Plugin(Sate, {
        type: 'sate-breadcrumbs',
        version: '0.1.0',
        headingTag: 'h2',
        separator: ':',
        minCrumbs: 1,
        compile: function(props, page, Sate) {
            this.page = page.pageAscent();
            this.thisPageName = page.name;
            this.extendWithProperties(props);
        },
        templates: {'main': __dirname+'/breadcrumbs.tpl'},
        stylesheets: ['/sate-cms/plugins/sate-breadcrumbs/breadcrumbs.css'],
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
                obj.classes.push('plugin-sate-breadcrumbs');
                obj.classes = obj.classes.join(' ');
            }
            if (!obj.id) {
                obj.id = '';
            } else {
                obj.id = ' id="'+obj.id+'"';
            }
            obj.crumbs = [];
            var p = this.page;
            while (p.parent && !p.parent.isRoot) {
                p = p.parent;
                obj.crumbs.unshift({url: p.url, name: p.name});
            }
            if (this.page.name && obj.crumbs.length >= obj.minCrumbs) {
                return obj;
            } else {
                return false;
            }
        }
    });
    return plg;
};
