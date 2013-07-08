var resolvePageType = function(page, Sate) {
    if (!page.type) {
        if (typeof page.subPages == 'object') {
            page.type = Sate.PageType.Index;
        } else {
            page.type = Sate.PageType.Article;
        }
    } else if (typeof page.type == 'string') {
        var parts = page.type.split('.');
        if (parts.length == 3 && parts[0] == 'Sate' && parts[1] == 'PageType') {
            page.type = parts[2].toLowerCase(); 
        }
    }
};

var dateProps = [
    'date',
    'created',
    'modified'
];
var resolveDate = function(dateProp, page) {
    page[dateProp] = new Date(page[dateProp]);
};

function PageDataResolver(Sate) {
    var Sate = Sate;
    var resolver = this;
    resolver.resolve = function(page, Sate) {
        // resolve PageType constant
        resolvePageType(page);
        for (var prop in page) {
            if (dateProps.indexOf(prop) > -1 && typeof page[prop] == 'string') {
                resolveDate(prop, page);
            }
        }
        
    };
    return resolver;
}
module.exports = PageDataResolver;
