function MenuItem(page, props, website, Sate) {
    var extend = require('node.extend');

    var closestMenu = function(page) {
        var p = page;
        while (!p.menu && p.parent) {
            p = p.parent;
        }
        return p.menu;
    };
    

    var createMenuItem = function(page, props, website) {
        var menuItem = extend(true, 
            {
                name: "untitled menu item",
                url: null,
                attr: {},
                sub: []
            },
            closestMenu(page),
            { // derrived values
                name: page.name,
                url: page.url,
                attr: {
                    classNames: [page.id]
                }
            }, 
            props, 
            {
                typeOf: 'Sate.MenuItem',
                active: function() {
                    return (this.isActive) ? 'active' : '';
                },
                hasSubItems: function() {
                    return this.sub && this.sub.length > 0;
                }
            }
        );
        return menuItem;
    };

    var menuItem = createMenuItem(page, props, website);
    
    if (menuItem.sub && menuItem.sub.length > 0) {
        for (var i=0; i < menuItem.sub.length; i++) {
            var target = website.pageForPath(menuItem.sub[i].url);
            menuItem.sub[i] = createMenuItem(target, menuItem.sub[i], website);
        }
    }
    
    return menuItem;
}
module.exports = MenuItem;
