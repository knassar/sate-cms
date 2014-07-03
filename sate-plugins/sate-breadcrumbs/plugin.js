/**
* Sate Breadcrumb navigation plugin
* Use like: {{plugin-sate-breadcrumbs}}
*/
module.exports = function(Sate) {
    var Plugin = require(__dirname+'/../Plugin'),
        util = require('util');

    var plg = new Plugin(Sate, {
        type: 'sate-breadcrumbs',
        version: '0.4.0',
        headingTag: 'h2',
        separator: ':',
        minCrumbs: 1,
        includePageName: true,
        compile: function(props, page, Sate, complete) {
            this.page = page.pageAscent();
            this.thisPageName = page.name;
            this.extendWithProperties(props);
            complete.apply();
        },
        templates: {'main': __dirname+'/breadcrumbs.tpl'},
        stylesheets: ['/sate-cms/plugins/sate-breadcrumbs/breadcrumbs.css'],
        objectToRender: function(config, page) {
            var obj = this.super.objectToRender(config, page);
            if (!obj) {
                obj = {};
            }
            if (util.isArray(obj.classes)) {
                obj.classes.push('plugin-sate-breadcrumbs');
                obj.classes = obj.classes.join(' ');
            }
            obj.crumbs = [];
            var p = page;
            while (p.parent && !p.parent.isRoot) {
                p = p.parent;
                obj.crumbs.unshift({url: p.url, name: p.name});
            }
            if (page.name && obj.crumbs.length >= obj.minCrumbs) {
                return obj;
            } else if (page.name && obj.includePageName) {
                obj.crumbs = [];
                return obj;
            } else {
                return false;
            }
        }
    });
    return plg;
};
