/**
* Sate Images Gallery plugin
* First initialize in page data, then
* Use like: {{plugin-sate-gallery}}
*/

// verify that ImageMagick dependency is installed
if (!Sate.configForPlugin('sate-gallery').foundIMBins) {
    var exec = require('child_process').exec;
    exec('convert -version', function(er, stdout, stderr) {
        if (stdout.toString().indexOf('ImageMagick') > -1) {
            var matches = /ImageMagick [\S]+/.exec(stdout.toString());
            if (matches && matches.length > 0) {
                Sate.configForPlugin('sate-gallery').foundIMBins = true;
				
                return;
            }
        }
        Sate.Log.logError("plugin-sate-gallery: ImageMagick binaries not installed. IM calls will be skipped.", 1);
    });
}


module.exports = function() {
    var fs = require('fs'),
        path = require('path'),
        flow = require(Sate.nodeModInstallDir+'flow'),
        im;

    var SateGalleryPluginThumbnailsRoot = 'sate-gallery-thumbs';
    var SateGalleryPluginDefaultBase = '--';
    var SateGalleryPluginDefaultThumbnailParams = {
            format: 'jpg',
            size: null, // use size for best fit
            width: 150, // use w/h to crop
            height: 150 // use w/h to crop
        };

    var loadIM = function() {
        if (Sate.configForPlugin('sate-gallery').foundIMBins) {
            im = require(Sate.nodeModInstallDir+'imagemagick'); // node-imagemagick - https://github.com/rsms/node-imagemagick
        } else {
            // mock out im;
            im = {
                resize: function(props, complete) {
Sate.Log.logError("Couldn't find ImageMagick. Skipping thumbnail: " + props.srcPath, 2);
complete.apply();
                }
            };
        }
    };
    
	var pathToSources;
	
    var generateThumbnail = function(thumbnailPath, handlerOrGallery, complete) {
        loadIM();

        var pathParts = thumbnailPath.split('/');
        pathParts.shift();
        pathParts.shift();
        var galleryId = pathParts.shift();
        
        var gallery;
        if (handlerOrGallery.type == 'sate-gallery') {
            gallery = handlerOrGallery;
        }
        else if (handlerOrGallery.type == 'sate-gallery-thumbnail-request-handler') {
            gallery = handlerOrGallery.galleries[galleryId];
        }

        var imagePath = path.join(pathToSources, pathParts.join('/'));
        thumbnailPath = path.join(pathToSources, thumbnailPath);
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
    
    var sateGalleryThumbnailRequestHandler;
    if (Sate.executingCommand != 'deploy') {
        var handlerRegex = /^\/sate-gallery-thumbs\/.+/mi;
        if (Sate.resourceRequestHandlers[handlerRegex]) {
            sateGalleryThumbnailRequestHandler = Sate.resourceRequestHandlers[handlerRegex].handler;
        }
        else {
            sateGalleryThumbnailRequestHandler = new Sate.RequestHandler(handlerRegex, {
                type: 'sate-gallery-thumbnail-request-handler',
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
                httpCodeForRequest: function(request) {
                    return 200;
                },
                handleRequest: function(request, website, deliverResponse) {
                    if (!Sate.configForPlugin('sate-gallery').foundIMBins) {
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
            });
            sateGalleryThumbnailRequestHandler.galleries[SateGalleryPluginDefaultBase] = {thumbnail: SateGalleryPluginDefaultThumbnailParams};
        }
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
		        dir = path.join(pathToSources, dir.replace(/^[\/\.]*/m, ''));
                traverseImages(gallery, dir, this);
            },
            function() {
                if (gallery.generateThumbnailsOnDemand === true) {
                    if (gallery.id && !sateGalleryThumbnailRequestHandler.galleries.hasOwnProperty(gallery.id)) {
                        sateGalleryThumbnailRequestHandler.galleries[gallery.id] = gallery;
                    }
                    // early escape
                    complete.apply();
                }
                else {
                    this.apply();
                }
            },
            function() {
                Sate.Log.logAction("generating thumbnails for gallery "+gallery.id, 3);
                
                var thumbBaseURL = thumbnailBaseURL(gallery);
                var imagesToThumb = gallery.heroes.map(function(item) {
                    return imageEntryForHero(item, thumbBaseURL);
                });
                var outerFlow = this;
                var count = 1;
                flow.serialForEach(imagesToThumb, function(item, idx) {
                    var innerFlow = this;
                    fs.stat(path.join(pathToSources, item.thumbSrc), function(err, stats) {
                        if (err) {
                            generateThumbnail(item.thumbSrc, gallery, innerFlow);
                            count++;
                        }
                        else {
                            innerFlow.apply();
                        }
                    });
                },function(error, newVal) {
					if (error) {
						console.log(error);
					}
                    if (count % 3 == 0) {
                        process.stdout.write(".");
                    }
                },function() {
                    outerFlow.apply(count);
                });
            },
            function(count) {
                if (count > 3) {
                    console.log("");
                }
                complete.apply();
            }
        );
    };

    var cleanPath = function(path) {
        return path.replace(pathToSources, '/').replace(/^[\/\.]*/m, '/');
    };

    var imageEntryForHero = function(hero, thumbBaseURL) {
        return {
            heroSrc: cleanPath(hero),
            thumbSrc: '/' + path.join(thumbBaseURL, hero.replace(pathToSources, ''))
        };
    };

    var thumbnailBaseURL = function(gallery) {
        var galleryBasePath = gallery.id;
        if (!galleryBasePath) {
            galleryBasePath = SateGalleryPluginDefaultBase;
        }
        return path.join(SateGalleryPluginThumbnailsRoot, galleryBasePath);
    };

    var plg = new Sate.Plugin({
        type: 'sate-gallery',
        version: '0.8.5',
        thumbnail: SateGalleryPluginDefaultThumbnailParams,
        contentPath: '',
        thumbnailsPath: "gallery-thumbs",
        imagesPath: "",
        thumbnails: [],
        heroes: [],
        generateThumbnailsOnDemand: true,
        compile: function(props, page, complete) {
			pathToSources = fs.realpathSync(Sate.currentSite.sitePath);
			
            Sate.chain.inPlace(this, props);
            if (!this.id) {
                this.id = Sate.utils.md5(this.imagesPath);
            }
            if (Sate.executingCommand == 'deploy') {
                this.generateThumbnailsOnDemand = false;
            }
            compileFlow(this, complete);
        },
        templates: {'main': 'gallery.tpl'},
        stylesheets: ['sate-gallery.css'],
        scripts: ['sate-gallery.js'],
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

            var thumbBaseURL = thumbnailBaseURL(obj);

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
            if (obj.title) {
                obj.galleryTitle = obj.title;
            }
            else {
                obj.galleryTitle = "";
            }
            
            return obj;
        }
    });
    
    return plg;
};
