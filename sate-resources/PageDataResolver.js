var fs = require('fs'),
    path = require('path'),
    util = require('util');

var resolveArticleSort = function(page) {
    if (typeof page.articleSort == 'string') {
        var parts = page.articleSort.split('.');
        if (parts.length == 3 && parts[0] == 'Sate' && parts[1] == 'IndexSort') {
            page.articleSort = Sate.IndexSort[parts[2]]; 
        }
    }
    else if (util.isArray(page.articleSort)) {
        page.articleSort = Sate.IndexSort.ManualOrder(page.articleSort);
    }
};

var resolvePageType = function(page) {
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
       resolveArticleSort(page);
    }
};

var resolveParser = function(page) {
    if (!page.parser) {
        page.parser = Sate.Parser.HTML;
    } else if (typeof page.parser == 'string') {
        var parts = page.parser.split('.');
        if (parts.length == 3 && parts[0] == 'Sate' && parts[1] == 'Parser') {
            page.parser = parts[2].toLowerCase(); 
        }
    }
};

var dateProps = [
    'date',
    'created',
    'modified'
];
var resolveDate = function(dateProp, page) {
    if (page[dateProp]) {
        page[dateProp] = Sate.utils.dateFromDateString(page[dateProp]);
    }
};

function PageDataResolver() {
    var resolver = this;
    resolver.resolve = function(page) {
        // resolve PageType constant
        resolvePageType(page);
        // resolve Parser constant
        resolveParser(page);
        for (var prop in page) {
            if (dateProps.indexOf(prop) > -1 && typeof page[prop] == 'string') {
                resolveDate(prop, page);
            }
        }
        
    };
    return resolver;
}
module.exports = PageDataResolver;
