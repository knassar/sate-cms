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
            return this.HTML;
        case "md":
            return this.Markdown;
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
