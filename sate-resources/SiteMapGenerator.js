function SiteMapGenerator() {
    try {
    var fs = require('fs'),
        path = require('path'),
        extend = require(Sate.nodeModInstallDir+'node.extend'),
        flow = require(Sate.nodeModInstallDir+'flow');
    } catch(e) {
        console.log(e);
    }

    var availableParsers = Sate.Parser.parsers();

    var indexPageForDirectory = function(directory, name, files, encoding) {
        var page = {
            type: Sate.PageType.Index,
            subPages: {}
        };
                
        var index;
        
        for (var parser in availableParsers) {
            if (availableParsers.hasOwnProperty(parser)) {
                if (files.indexOf("index" + availableParsers[parser]) > -1) {
                    index = "index" + availableParsers[parser];
                    page.parser = parser;
                }
            }
        }
        
        if (index) {
            page = extend(true, page, Sate.Page.dataFromFile(path.join(directory, index), encoding));
        }

        if (!page.name) {
            page.name = Sate.utils.pageNameFromFileName(name);
        }
        
        return page;
    };

    var crawlSitemapFromDirectory = function(graph, directory, encoding, name, complete, error) {
        var files = fs.readdirSync(path.normalize(directory));

        var page = indexPageForDirectory(directory, name, files, encoding);
        for (var f=0; f < files.length; f++) {
            if (files[f].substring(0,1) != "." && files[f].substring(0,6) != "index.") {
                var filepath = path.join(directory, files[f]);
                var stats = fs.statSync(filepath);
                if (stats.isDirectory()) {
                    crawlSitemapFromDirectory(page.subPages, filepath, encoding, files[f]);
                }
                else if (stats.isFile()) {
                    var fileParts = files[f].split('.');
                    var ext = fileParts.reverse()[0];
                    var parser = Sate.Parser.parserForExtension(ext);
                    if (parser !== false) {
                        fileParts.shift();
                        var fileName = fileParts.join('.');
                        var article = {
                            type: Sate.PageType.Article,
                            parser: parser,
                            subPages: {}
                        };
    
                        article = extend(true, article, Sate.Page.dataFromFile(filepath, encoding));
                        if (!article.name) {
                            article.name = Sate.utils.pageNameFromFileName(fileName);
                        }
                        article.contentExtension = ext;
                        page.subPages[fileName] = article;
                    }
                }
            }
        }

        graph[name] = page;
        if (complete) {
            complete.apply();
        }
    };

    var generator = {
        crawlWebsite: function(website, complete) {
            crawlSitemapFromDirectory(website.siteMap, website.contentPath, website.config.encoding, website.config.rootPage, complete);
        }
    };
    return generator;
}

module.exports = SiteMapGenerator;