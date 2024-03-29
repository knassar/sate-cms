function PageContentParser() {

    var fs = require('fs'),
        path = require('path'),
        util = require('util'),
        _JSON = require(Sate.nodeModInstallDir+'greatjson'),
        markdown = require(Sate.nodeModInstallDir+'marked');

    var blockMatcher = /^@([^\:]+):/mi;

    var chainPageData = function (page, data) {
        if (data.trim().length > 0) {
            var pageData = _JSON.parse(data);
            if (pageData instanceof Error) {
                Sate.Log.logError("couldn't parse page data for "+page.url, 2, pageData);
            }
            else {
                Sate.chain.inPlace(page, pageData);
            }
        }
    }

	var escapeMustacheForMarkdown = function(content) {
		return content.replace(/\{\{\>/g, '{{\\>');
	};

    var parsedContent = function(content, page) {
        if (page.parser == Sate.Parser.HTML) {
            return content;
        }
        else if (page.parser == Sate.Parser.Markdown) {
            return markdown(escapeMustacheForMarkdown(content));
        }
        else {
            return content;
        }
    };
    
    var composeBlock = function(page, blockName, blockLines) {
        if (blockLines.length > 0) {
            var block = blockLines.join("\n");

            if (blockName) {
                page.compiledPartials[blockName] = parsedContent(block, page);
            }
            else {
                chainPageData(page, block);
            }
        }
    };

    var parser = this;
    parser.parse = function(page, content) {
        
        var lines = content.split('\n'),
            currentBlockName,
            currentBlock = [];

        page.compiledPartials.intro = "";
        page.compiledPartials.content = "";
        
        for (var l = 0; l < lines.length; l++) {
            var line = lines[l];
            var blockMatch = blockMatcher.exec(line);
            if (blockMatch && blockMatch.length > 1) {
                composeBlock(page, currentBlockName, currentBlock);
                currentBlock = [];
                currentBlockName = blockMatch[1];
            }
            else {
                currentBlock.push(line);
            }
        }

        if (currentBlockName || currentBlock.length > 0) {
            composeBlock(page, currentBlockName, currentBlock);
        }
    };
    
    parser.extractDataBlock = function(content) {
        var pageData = {},
            matches = content.match(blockMatcher);
    
        if (matches && matches.length > 1) {
            chainPageData(pageData, content.substring(0, matches.index));
        }        
        return pageData;
    }
    return parser;
}
module.exports = PageContentParser;
