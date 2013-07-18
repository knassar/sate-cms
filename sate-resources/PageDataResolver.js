var util = require('util');

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

var resolveModules = function(page) {
    var resolvedModules = [];
    var modulePath = function(type) {
        return /\.js$/.test(type) ? type : './sate-modules/'+type+'.js';
    };
    for (var i=0; i < page.modules.length; i++) {
        if (page.modules[i].resolved) continue; // skip alread-resolved modules
        if (!page.modules[i].type) throw new Error("cannot resolve module declared without 'type' at index: "+i);
        var ModuleClass = require(modulePath(page.modules[i].type));
        var resolvedModule = new ModuleClass(page.modules[i], page);
        resolvedModule.resovled = true;
        resolvedModules.push(resolvedModule);
    };
    return resolvedModules;
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
            if (prop == 'modules' && util.isArray(page[prop])) {
                page.modules = resolveModules(page);
            } else if (dateProps.indexOf(prop) > -1 && typeof page[prop] == 'string') {
                resolveDate(prop, page);
                
            }
        }
        
    };
    return resolver;
}
module.exports = PageDataResolver;
