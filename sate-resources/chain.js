var util = require('util');

var copy = function(a) {
    var cp;
    switch (typeof a) {
        case 'string':
            cp = a.substr(0);
            break;
            
        case 'number':
        case 'boolean':
            cp = a;
            break;

        case 'object':
            if (util.isArray(a)) {
                cp = [];
                for (var i = 0; i < a.length; i++) {
                    cp.push(copy(a[i]));
                }
            }
            else {
                cp = a;
            }
            break;
            
        case 'function':
        default:
            cp = a;
     }
     return cp;
}

var merge = function(a, b) {
    if (typeof b != 'object' || typeof a != typeof b || util.isArray(a) != util.isArray(b)) {
        return copy(b);
    }
    else if (util.isArray(b)) {
        return copy(a).concat(copy(b));
    }
    else {
        return chain(a, b);
    }
}

function chain() {
    var obj = {};

    for (var i = 0; i < arguments.length; i++) {
        var link = arguments[i];
        if (typeof link == 'object') {
            for (var prop in link) {
                if (link.hasOwnProperty(prop)) {
                    if (obj.hasOwnProperty(prop)) {
                        obj[prop] = merge(obj[prop], link[prop]);
                    }
                    else {
                        obj[prop] = copy(link[prop]);
                    }
                }
            }
        }
    }

    return obj;
}


module.exports = chain;