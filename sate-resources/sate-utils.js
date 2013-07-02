var noTitleWords = ['the', 'of', 'and', 'in', 'from'];
module.exports = {
    toTitleCase: function(str, omitWords) {
        if (!omitWords) {
            omitWords = noTitleWords;
        }
        var words = str.split(/[\s\-]+/g);
        for (var i=0; i < words.length; i++) {
            if (i === 0 || omitWords.indexOf(words[i]) == -1) {
                var word = words[i].substr(0).toUpperCase() + words[i].substr(1);
                str = str.replace(words[i], word);
            }
        }
        return str;
    }
};
