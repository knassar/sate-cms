/**
* Sate Feature plugin
* Use like: {{plugin-sate-feature}}
*/
module.exports = function(Sate) {
    var Plugin = require(__dirname+'/../Plugin'),
        util = require('util');

    var plg = new Plugin(Sate, {
        type: 'sate-feature',
        version: '0.4.0',
        includePageName: true,
        compile: function(props, page, Sate, complete) {
            this.page = page.pageAscent();
            this.thisPageName = page.name;
            this.extendWithProperties(props);
            complete.apply();
        },
        featureURL: false,
        templates: {'main': __dirname+'/feature.tpl'},
        stylesheets: ['/sate-cms/plugins/sate-feature/feature.css'],
        objectToRender: function(config, page) {
            var obj = this.super.objectToRender(config, page);
            if (!obj) {
                obj = {};
            }
            if (util.isArray(obj.classes)) {
                obj.classes.push('plugin-sate-feature');
                obj.classes = obj.classes.join(' ');
            }
            if (obj.featureURL) {
                obj.featuredPage = page.website.pageForPath(obj.featureURL);
            }
            if (obj.featuredPage) {
                return obj.featuredPage;
            } else {
                return false;
            }
        }
    });
    return plg;
};
