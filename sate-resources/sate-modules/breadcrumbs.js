var Sate = {
    PageType: require('../PageType')
};
module.exports = {
    renderer: function(headingTag) {
        if (!headingTag) {
            headingTag = 'h2';
        }
        if (this.type != Sate.PageType.Error && (this.parent && !this.parent.isRoot)) {
            var crumbs = ['<'+headingTag+' class="this-page">' + this.name + '</'+headingTag+'>'];
            var p = this;
            while (p.parent && !p.parent.isRoot) {
                p = p.parent;
                crumbs.unshift('<a href="'+ p.url +'">' + p.name + '</a>');
            }
            var seppa = '<span class="seppa">'+this.breadcrumbSeparator+'</span>';
            return crumbs.join(seppa);
        } else {
            return '<'+headingTag+' class="this-page">' + this.name + '</'+headingTag+'>';
        }
    }
};
