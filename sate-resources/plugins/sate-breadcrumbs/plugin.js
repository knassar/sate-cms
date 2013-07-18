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
                if (this.type != Sate.PageType.Error && (this.parent && !this.parent.isRoot)) {
                    var crumbs = ['<'+config.headingTag+' class="this-page">' + this.name + '</'+config.headingTag+'>'];
                    var p = this;
                    while (p.parent && !p.parent.isRoot) {
                        p = p.parent;
                        crumbs.unshift('<a href="'+ p.url +'">' + p.name + '</a>');
                    }
                    var seppa = '<span class="seppa">'+this.breadcrumbSeparator+'</span>';
                    return crumbs.join(seppa);
                } else {
                    return '<'+config.headingTag+' class="this-page">' + this.name + '</'+config.headingTag+'>';
                }
            };
        }
    };
};
