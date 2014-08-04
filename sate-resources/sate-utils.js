var noTitleWords = ['the', 'of', 'and', 'in', 'from'];
var fileNamePattern = /^(?:(\d{4}-\d{2}-\d{2})-)?(.+)$/mi;

module.exports = {
    toTitleCase: function(str, omitWords) {
        if (!omitWords) {
            omitWords = noTitleWords;
        }
        var words = str.split(/[\s\-]+/g);
        for (var i=0; i < words.length; i++) {
            if (i === 0 || omitWords.indexOf(words[i]) == -1) {
                var word = words[i].substr(0, 1).toUpperCase() + words[i].substr(1);
                str = str.replace(words[i], word);
            }
        }
        return str;
    },
    dateFromDateString: function(dateString) {
        return new Date(dateString.replace(/-{1}/g, '/'));
    },
    pageDateFromFileName: function(str) {
        var matches = fileNamePattern.exec(str);
        if (matches.length > 2 && matches[1]) {
            return this.dateFromDateString(matches[1]);
        }
        else {
            return null;
        }
    },
    pageNameFromFileName: function(str, omitWords) {
        var matches = fileNamePattern.exec(str);
        var namePart;
        if (matches.length > 0) {
            namePart = matches[matches.length - 1];
        }
        else {
            namePart = str;
        }
        return this.toTitleCase(namePart.replace(/-{1}/g, ' ').replace(/--/g, '-'));
    },
    ensurePath: function(filepath) {
        var fs = require('fs'),
            path = require('path');
            
        var pathParts = filepath.split('/');
        
        var check = pathParts.shift();
        if (check.length > 0 && !fs.existsSync(check)) {
            fs.mkdirSync(check);
        }
        
        var check = fs.realpathSync(check);
        while (pathParts.length > 1) {
            check = path.join(check, pathParts.shift());
            if (!fs.existsSync(check)) {
                fs.mkdirSync(check);
            }
        }
    },
    md5: function(str) {
        var md5sum = require('crypto').createHash('md5');
        md5sum.update(str);
        return md5sum.digest('hex');
    }
};
