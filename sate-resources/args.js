
var accum = {
    flags: [],
    opts: {},
    values: []
};

var parsingValids;
var invalids = [];

var short  = /^-{1}/m;
var long   = /^-{2}/m;
var value  = /^[^-]+/m;

var parseGroup = function(group) {
    var flags = group.replace(short, '').split('').map(function(flag) {
        return '-'+flag;
    });
    flags.forEach(function(flag) {
        parseShort(flag, '');
    });
};

var parseShort = function(arg, nextArg) {
    if (arg.length > 2) {
        parseGroup(arg);
        return false;
    }
    if (parsingValids.hasOwnProperty(arg)) {
        if (value.test(nextArg)) {
            opts[parsingValids[arg]] = nextArg;
            return true;
        }
        else {
            flags.push(arg);
        }
    }
    else {
        invalids.push(arg);
    }
    return false;
};

var parseLong = function(arg, nextArg) {
    if (parsingValids.hasOwnProperty(arg)) {
        if (value.test(nextArg)) {
            opts[parsingValids[arg]] = nextArg;
            return true;
        }
        else {
            flags.push(arg);
        }
    }
    else {
        invalids.push(arg);
    }
    return false;
};

var argsArray = function(args) {
    return Array.prototype.slice.call(arguments, 0);
};


var getArgs = function(valids, args) {
    parsingValids = valids;
    var args = argsArray(args);
    
    for (var i = 0; i < args.length; i++) {
        var arg = args[i],
            nextArg = args[i+1],
            isOpt = false;
            
        if (long.test(arg)) {
            isOpt = parseLong(arg, nextArg);
        }
        else if (short.test(arg)) {
            isOpt = parseShort(arg, nextArg);
        }
        else {
            accum.values.push(arg);
        }
        if (isOpt) {
            i++;
        }
    }
    
    return accum;
}


module.exports = getArgs;