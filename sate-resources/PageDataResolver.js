var fs = require('fs'),
    path = require('path'),
    util = require('util');

var resolveArticleSort = function(page, Sate) {
    if (typeof page.articleSort == 'string') {
        var parts = page.articleSort.split('.');
        if (parts.length == 3 && parts[0] == 'Sate' && parts[1] == 'IndexSort') {
            page.articleSort = Sate.IndexSort[parts[2]]; 
        }
    }
};

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
    if (page.type == Sate.PageType.Index) {
       resolveArticleSort(page, Sate);
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
    var resolver = this;
    resolver.resolve = function(page) {
        // resolve PageType constant
        resolvePageType(page, Sate);
        for (var prop in page) {
            if (dateProps.indexOf(prop) > -1 && typeof page[prop] == 'string') {
                resolveDate(prop, page);
            }
        }
        
    };
    return resolver;
}
module.exports = PageDataResolver;
