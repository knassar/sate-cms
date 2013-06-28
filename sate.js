(function(){

    var sate = {
        Action: {
            Run: 'run',
            Generate: 'generate'
        }
    };
    
    var context = {
        serverRoot: './',
        contentRoot: '',
        port: 80
    };

    process.argv.forEach(function (val, index, array) {
        switch (val) {
            case '-s':
            case '--server':
                context.serverRoot = process.argv[index+1];
                break;
            case '-c':
            case '--content':
                context.contentRoot = process.argv[index+1];
                break;
            case '-p':
            case '--port':
                context.port = process.argv[index+1];
                break;
            case '-r':
            case '--run':
                context.action = sate.Action.Run;
                break;
            case '-g':
            case '--generate':
                context.action = sate.Action.Generate;
                break;
            case '-w':
            case '--website':
                context.website = process.argv[index+1];
                break;
        }
    });

    sate.context = context;
    var Site = require('./server/Site');
    // load and process site
    var sate.context.site = new Site(sate.context);
    
    
    switch (sate.context.action) {
        case sate.Action.Run:
            var Server = require('./server/Server');
            // server to serve pages
            context.server = new Server(sate.context);
            break;
        case sate.Action.Generate:
            // generator to produce a static site
            
            break;
    }

    
    
    
    
    
    var server = require('./server/Server')(context);
    console.log('Server running at http://127.0.0.1:3000/');

})();