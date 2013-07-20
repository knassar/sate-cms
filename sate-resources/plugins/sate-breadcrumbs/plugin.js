/**
* Sate Breadcrumb navigation plugin
* Use like: {{plugin-sate-breadcrumbs}}
*/
module.exports = function(Sate) {
    return {
        renderer: function() {
            return function(config, render) {
                try { 
                    config = JSON.parse(config);
                } catch (err) {
                    config = {};
                }
                if (!config.headingTag) {
                    config.headingTag = 'h2';
                }
                if (!config.minCrumbs) {
                    config.minCrumbs = 1;
                }
                if (!config.classes) {
                    config.classes = [];
                }
                config.classes.push('plugin-sate-breadcrumbs');
                if (!config.id) {
                    config.id = '';
                } else {
                    config.id = ' id="'+config.id+'"';
                }
                var crumbs = ['<'+config.headingTag+' class="this-page">' + this.name + '</'+config.headingTag+'>'];
                var p = this;
                while (p.parent && !p.parent.isRoot) {
                    p = p.parent;
                    crumbs.unshift('<a href="'+ p.url +'">' + p.name + '</a>');
                }
                if (this.name && crumbs.length >= config.minCrumbs) {
                    var seppa = '<span class="seppa">'+this.breadcrumbSeparator+'</span>';
                    return '<div'+config.id+' class="'+config.classes.join(' ')+'">' + crumbs.join(seppa) + '</div>';
                } else {
                    return '';
                }
            };
        }
    };
};
