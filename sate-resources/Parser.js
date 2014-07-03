// Sate.Parser
module.exports = {
    HTML: 'html',
    Markdown: 'markdown',
    extensionForParser: function(parser) {
        switch (parser.toLowerCase()) {
        case this.HTML:
            return ".html";
        case this.Markdown:
            return ".md";
        }
    },
    parserForExtension: function(extension) {
        switch (extension.toLowerCase()) {
        case "html":
        case "htm":
            return this.HTML;
        case "md":
        case "markdown":
            return this.Markdown;
        default: 
            return false;
        }
    },
    parsers: function() {
        var parsers = {};
        for (var p in this) {
            if (this.hasOwnProperty(p) && typeof this[p] == 'string') {
                parsers[p.toLowerCase()] = this.extensionForParser(this[p]);
            }
        }
        return parsers;
    }
};
