var noTitleWords = ['the', 'of', 'and', 'in', 'from'];
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
    pageNameFromFileName: function(str, omitWords) {
        var hyph = '%%%hyphen%%%';
        return this.toTitleCase(str.replace('--', hyph).replace('-', ' ').replace(hyph, '-'));
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
