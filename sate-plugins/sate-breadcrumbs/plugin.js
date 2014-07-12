/**
* Sate Breadcrumb navigation plugin
* Use like: {{plugin-sate-breadcrumbs}}
*/
module.exports = function() {
    var util = require('util');

    var plg = new Sate.Plugin({
        type: 'sate-breadcrumbs',
        version: '0.6.0',
        headingTag: 'h2',
        separator: ':',
        minCrumbs: 1,
        includePageName: true,
        compile: function(props, page, complete) {
            this.page = page.pageAscent();
            this.thisPageName = page.name;
            Sate.chain.inPlace(this, props);
            complete.apply();
        },
        templates: {'main': 'breadcrumbs.tpl'},
        stylesheets: ['breadcrumbs.css'],
        objectToRender: function(config, page) {
            var obj = Sate.Plugin.prototype.objectToRender.call(this, config, page);
            if (!obj) {
                obj = {};
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
