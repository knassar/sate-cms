return function(headingTag) {
    if (!headingTag) {
        headingTag = 'h2';
    }
    var path = site.siteRelativePath();
    if (site.page && site.page.type != site.PageType.Error) {
        var crumbs = path.split('/');
        if (crumbs.length > 1) {
            var trail = [];
            for (var i = 0; i < crumbs.length; i++) {
                if (crumbs[i].length > 0) {
                    trail.push(crumbs[i]);
                    var page = site.pageForPath(trail.slice(0).join('/'));
                    if (i == crumbs.length - 1) {
                        crumbs[i] = '<'+headingTag+' class="this-page">' + page.name + '</'+headingTag+'>';
                    } else {
                        crumbs[i] = '<a href="'+ site.website.root + trail.join('/') +'">' + page.name + '</a>';
                    }
                } else {
                    crumbs.splice(i, 1);
                }
            }
            var seppa = '<span class="seppa">&rsaquo;</span>';
            return crumbs.join(seppa);
        } else {
            return '<'+headingTag+' class="this-page">' + site.page.name + '</'+headingTag+'>';
        }
    } else {
        return '<'+headingTag+' class="this-page">' + site.page.name + '</'+headingTag+'>';
    }
};
