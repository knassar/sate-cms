var noTitleWords = ['the', 'of', 'and', 'in', 'from'];
var fileNamePattern = /^(?:(\d{4}-\d{2}-\d{2})-)?(.+)$/mi;

module.exports = {
    toTitleCase: function(str, omitWords) {
        if (!omitWords) {
            omitWords = noTitleWords;
        }
        var title = "";
        var word = "";
        var edge = /[\s\-]/;
        for (var i = 0; i < str.length; i++) {
            var c = str.charAt(i);
            if (edge.test(c)) {
                var lowerWord = word.toLowerCase();
                if (title.length > 0 && omitWords.indexOf(lowerWord) != -1) {
                    word = lowerWord;
                }
                
                title += word + c;
                word = "";
            }
            else if (word == "") {
                word += c.toUpperCase();
            }
            else {
                word += c;
            }
        }
        return title + word;
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

		if (fs.existsSync(filepath)) {
			return;
		}
		
        var pathParts = filepath.split('/');

        var check = pathParts.shift();
		if (check.length == 0) {
			check = '/'+pathParts.shift();
		}
		if (check == '.' || check == '..') {
			check = path.join(check, pathParts.shift());
		}
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
