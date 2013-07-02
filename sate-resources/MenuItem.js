function MenuItem(page, props, website, Sate) {
    var extend = require('node.extend');

    var createMenuItem = function(page, props, website) {
        var menuItem = extend(true, 
            {
                name: "untitled menu item",
                url: null,
                attr: {},
                sub: []
            },
            { // derrived values
                name: page.name,
                url: page.url,
                attr: {
                    classNames: [page.id]
                }
            }, 
            props, 
            {
                // page: page,
                typeOf: 'Sate.MenuItem'
            }
        );
        return menuItem;
    }

    var menuItem = createMenuItem(page, props, website);
    
    if (menuItem.sub.length > 0) {
        for (var i=0; i < menuItem.sub.length; i++) {
            var target = website.pageForPath(menuItem.sub[i].url);
            menuItem.sub[i] = createMenuItem(target, menuItem.sub[i], website);
        }
    }

    return menuItem;
}
module.exports = MenuItem;
