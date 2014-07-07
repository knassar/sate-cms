/**
* Sate Images Gallery plugin
* First initialize in page data, then
* Use like: {{plugin-sate-gallery}}
*/

var foundIMBins = false;
// verify that ImageMagick dependency is installed
if (!foundIMBins) {
    var exec = require('child_process').exec;
    exec('convert -version', function(er, stdout, stderr) {
        if (stdout.toString().indexOf('ImageMagick') > -1) {
            var matches = /ImageMagick [\S]+/.exec(stdout.toString());
            if (matches && matches.length > 0) {
                foundIMBins = true;
                return;
            }
        }
        Sate.Log.logError("plugin-sate-gallery: ImageMagick binaries not installed. IM calls will be skipped.", 1);
    });
}


module.exports = function(Sate) {
    var fs = require('fs'),
        path = require('path'),
        flow = require(Sate.nodeModInstallDir+'flow'),
        im,
        Plugin = require(__dirname+'/../Plugin');

    var SateGalleryPluginThumbnailsRoot = 'sate-gallery-thumbs';
    var SateGalleryPluginDefaultBase = '--';
    var SateGalleryPluginDefaultThumbnailParams = {
            format: 'jpg',
            size: null, // use size for best fit
            width: 150, // use w/h to crop
            height: 150 // use w/h to crop
        };

    var loadIM = function() {
        if (foundIMBins) {
            im = require(Sate.nodeModInstallDir+'imagemagick'); // node-imagemagick - https://github.com/rsms/node-imagemagick
        } else {
            // mock out im;
            im = {
                resize: function() {}
            };
        }
    };
    
    var generateThumbnail = function(thumbnailPath, handler, complete) {
        loadIM();

        var pathParts = thumbnailPath.split('/');
        pathParts.shift();
        pathParts.shift();
        var gallery = handler.galleries[pathParts.shift()];

        var imagePath = './'+pathParts.join('/');
        thumbnailPath = path.join('.', thumbnailPath);
        
        Sate.utils.ensurePath(thumbnailPath);
        im.resize({
            srcPath: imagePath,
            dstPath: thumbnailPath,
            quality: 0.8,
            format: gallery.thumbnail.format,
            width: gallery.thumbnail.width,
            height: gallery.thumbnail.height,
            strip: true
        }, function(err, stdout, stderr) {
            if (err) {
                console.log( err );
            }
            complete.apply();
        });
    };
    
    var handlerRegex = /^\/sate-gallery-thumbs\/.+/mi;
    var sateGalleryThumbnailRequestHandler;
    if (Sate.resourceRequestHandlers[handlerRegex]) {
        sateGalleryThumbnailRequestHandler = Sate.resourceRequestHandlers[handlerRegex].handler;
    }
    else {
        sateGalleryThumbnailRequestHandler = {
            galleries: {},
            headersForRequest: function(request) {
                headers = {
                    'Content-Type': ''
                };
                switch (request.url.split('.').reverse()[0]) {
                    case 'jpg':
                    case 'jpeg':
                        headers['Content-Type'] = 'image/jpeg';
                        break;
                    case 'png':
                        headers['Content-Type'] = 'image/png';
                        break;
                    case 'gif':
                        headers['Content-Type'] = 'image/gif';
                        break;
                }
                return headers;
            },
            handleRequest: function(request, website, deliverResponse) {
                if (!foundIMBins) {
                    deliverResponse('');
                }
                else {
                    var thumb = website.resourceForPath(request.url);
                    if (thumb) {
                        deliverResponse(thumb);
                    }
                    else {
                        generateThumbnail(request.url, this, function() {
                            deliverResponse(website.resourceForPath(request.url));
                        });
                    }
                }
            }
        };
        sateGalleryThumbnailRequestHandler.galleries[SateGalleryPluginDefaultBase] = {thumbnail: SateGalleryPluginDefaultThumbnailParams};
        Sate.registerRequestHandlerForRequests(sateGalleryThumbnailRequestHandler, handlerRegex);
    }
    
    var imgExtRegex = /\.jpg|\.jpeg|\.gif|\.png$/mi;
    var traverseImages = function(gallery, dir, complete) {
        flow.exec(
            function() {
                fs.readdir(dir, this);
            },
            function(err, imagesPaths) {
                var descent = 0;
                for (var i in imagesPaths) {
                    if (imagesPaths.hasOwnProperty(i)) {
                        var filename = imagesPaths[i];
                        var filepath = path.join(dir, filename);
                        var fstats = fs.statSync(filepath);
                        if (fstats.isDirectory()) {
                            descent++;
                            traverseImages(gallery, filepath, this.MULTI(filepath));
                        }
                        else if (fstats.isFile() && imgExtRegex.test(filename)) {
                            gallery.heroes.push(filepath);
                        }
                    }
                }
                if (descent === 0) {
                    this.apply();
                }
            },
            function() {
                complete.apply();
            }
        );
    };

    var compileFlow = function(gallery, complete) {
        flow.exec(
            function() {
                gallery.heroes = [];
                this(cleanPath(gallery.imagesPath));
            },
            function(dir) {
                traverseImages(gallery, localPath(dir), this);
            },
            function() {
                if (gallery.id && !sateGalleryThumbnailRequestHandler.galleries.hasOwnProperty(gallery.id)) {
                    sateGalleryThumbnailRequestHandler.galleries[gallery.id] = gallery;
                }
                complete.apply();
            }
        );
    };

    var cleanPath = function(path) {
        return path.replace(/^[\/\.]*/m, '/');
    };

    var localPath = function(path) {
        return path.replace(/^[\/\.]*/m, './');
    };

    var imageEntryForHero = function(hero, thumbBaseURL) {
        return {
            heroSrc: cleanPath(hero),
            thumbSrc: '/' + path.join(thumbBaseURL, hero)
        };
    };

    var plg = new Plugin(Sate, {
        type: 'sate-gallery',
        version: '0.8.0',
        thumbnail: SateGalleryPluginDefaultThumbnailParams,
        contentPath: '',
        thumbnailsPath: "gallery-thumbs",
        imagesPath: "",
        thumbnails: [],
        heroes: [],
        compile: function(props, page, Sate, complete) {
            Sate.chain.inPlace(this, props);
            if (!this.id) {
                this.id = Sate.utils.md5(this.imagesPath);
            }
            compileFlow(this, complete);
        },
        templates: {'main': __dirname+'/gallery.tpl'},
        stylesheets: ['/sate-cms/plugins/sate-gallery/sate-gallery.css'],
        scripts: ['/sate-cms/plugins/sate-gallery/sate-gallery.js'],
        objectToRender: function(config, page) {
            this.template = this.templates.main;
            var path = require('path');

            var obj = page.pluginById(config.id);

            if (obj) {
                obj = Sate.chain(obj, config);
            }
            else {
                obj = {
                    id: SateGalleryPluginDefaultBase
                };
            }
            
            var galleryBasePath = obj.id;
            if (!galleryBasePath) {
                galleryBasePath = SateGalleryPluginDefaultBase;
            }
            var thumbBaseURL = path.join(SateGalleryPluginThumbnailsRoot, galleryBasePath);

            obj.composeClasses();

            obj.images = [];
            if (obj.heroes) {
                if (config.image || config.imagesPath) {
                    if (config.image) {
                        obj.images = [
                            imageEntryForHero(config.image, thumbBaseURL)
                        ];
                    }
                    else if (config.imagesPath) {
                        imgPath = cleanPath(config.imagesPath);
                        obj.heroes.forEach(function(item) {
                            if (cleanPath(item).indexOf(imgPath) == 0) {
                                obj.images.push(imageEntryForHero(item, thumbBaseURL));
                            }
                        });
                    }
                }
                else {
                    obj.images = obj.heroes.map(function(item) {
                        return imageEntryForHero(item, thumbBaseURL);
                    });
                }
            }
            return obj;
        }
    });
    
    return plg;
};
