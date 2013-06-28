function Server(context) {
    var fs = require('fs');
    var connect = require('connect');

    var rewriteTest = /\?passthru$/;
    var jsTest = /\.js$/;
    var cssTest = /\.css$/;

    var app = connect()
        .use(connect.favicon())
        .use(connect.logger('dev'))
        .use(connect.query())
        .use(function(req, res){
            if (req.url.indexOf('/deploy') === 0 || req.url.indexOf('/styles') === 0 || req.url.indexOf('/templates') === 0) {
                var serverRelativeUrl = req.url.replace(contentRoot, '').replace(/\?.*$/, '');
                if (jsTest.test(serverRelativeUrl)) {
                    res.writeHead(200, {'Content-Type': 'text/javascript'});
                } else if (cssTest.test(serverRelativeUrl)) {
                    res.writeHead(200, {'Content-Type': 'text/css'});
                } else {
                    res.writeHead(200, {'Content-Type': 'text/html'});
                }
                console.log( serverRoot + '/' + serverRelativeUrl );
                res.end(fs.readFileSync(serverRoot + serverRelativeUrl));
            } else {
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.end(fs.readFileSync(serverRoot + contentRoot +'/index.html'));
            }
        }).listen(this.config.port);

    return app;
}