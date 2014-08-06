/**
* Sate blog and featured article aggregator
*/
module.exports = function() {
    var util = require('util');

    var plg = new Sate.Plugin({
        type: 'sate-feature',
        version: '0.1.0',

        featuredArticle: '^',
        introOnly: false,
        permalink: true,
        olderLink: true,

        templates: {'main': 'feature-main.tpl'},
        stylesheets: ['sate-feature.css'],

        dynamicFeatureWithUrlIndex: function(url, idx, page) {
            var index;
            
            if (url == '^') {
                index = page.closestPassingTest(function(page) {
                    return page.type == Sate.PageType.Index;
                });
            }
            else {
                url = url.replace(/\/\^$/m, '');
                index = Sate.currentSite.pageForPath(url);
            }
            
            if (index && util.isArray(index.articles) && index.articles.length > idx) {
                return index.articles[idx];
            }
            else {
                return null;
            }
        },

        featureDescriptor: function(obj, page) {
            if (obj.featuredArticle.indexOf('^') == -1) {
                // simple static reference
                return Sate.pageDescriptor(obj.featuredArticle);
            }
            else {
                return this.dynamicFeatureWithUrlIndex(obj.featuredArticle, 0, page);
            }
        },

        objectToRender: function(config, page) {
            var obj = this.prototype.objectToRender.call(this, config, page);
            if (!obj) {
                return false;
            }
            
            var descriptor = this.featureDescriptor(obj, page);
            if (!descriptor) {
                return false;
            }
            
            var feature = Sate.currentSite.pageForPath(descriptor.url);
            var feature = Sate.chain(feature, obj);

            feature.olderArticle = this.dynamicFeatureWithUrlIndex(obj.featuredArticle, 1, page);

            Sate.chain.inPlace(feature.templates, feature.compiledPartials);
            
            return feature;
        }
    });
    return plg;
};
