/**
* Sate Images Gallery plugin
* First initialize in page data, then
* Use like: {{plugin-sate-gallery}}
*/
module.exports = function(Sate) {
    var fs = require('fs'),
        path = require('path'),
        util = require('util'),
        flow = require(Sate.nodeModInstallDir+'flow'),
        im,
        Plugin = require(__dirname+'/../Plugin');

    var loadIM = function() {
        if (Sate.configForPlugin('sate-gallery').foundIM) {
            im = require(Sate.nodeModInstallDir+'imagemagick'); // node-imagemagick - https://github.com/rsms/node-imagemagick
        } else {
            // mock out im;
            im = {
                resize: function() {}
            };
        }
    };

    // verify that ImageMagick dependency is installed
    if (!Sate.configForPlugin('sate-gallery').FoundIM) {
        var exec = require('child_process').exec;
        exec('convert -version', function(er, stdout, stderr) {
            if (stdout.toString().indexOf('ImageMagick') > -1) {
                var matches = /ImageMagick [\S]+/.exec(stdout.toString());
                if (matches) {
                    Sate.configForPlugin('sate-gallery').foundIM = matches[0];
                    Sate.Log.logAction("plugin-sate-gallery: found", 1);
                    return;
                }
            } else if (Sate.configForPlugin('sate-gallery').foundIM !== false) {
                Sate.configForPlugin('sate-gallery').foundIM = false;
                Sate.Log.logError("plugin-sate-gallery: ImageMagick binaries not installed. IM calls will be skipped.", 1);
            }
        });
    }

    var makeThumbnailImage = function(imagePath, gallery, complete) {
        loadIM();
        filenameBase = imagePath.split('/').reverse()[0].split('.').reverse().slice(1).reverse().join('.');
        var thumbPath = path.join(gallery.thumbnailsPath, imagePath);
        Sate.utils.ensurePath(thumbPath);
        im.resize({
            srcPath: imagePath,
            dstPath: thumbPath,
            quality: 0.8,
            format: gallery.thumbnail.format,
            width: gallery.thumbnail.width,
            height: gallery.thumbnail.height,
            strip: true
        }, function(err, stdout, stderr) {
            if (err) {
                console.log( err );
            } else {
                gallery.thumbnails.push(thumbPath);
            }
            complete.apply();
        });
    };
    
    var imgExtRegex = /\.jpg|\.gif|\.png$/;
    var descendAndThumbnailImages = function(gallery, dir, complete) {
        
        flow.exec(
            function() {
                fs.readdir(dir, this);
            },
            function(err, imagesPaths) {
                var outerFlow = this;
                flow.serialForEach(
                    imagesPaths, 
                    function(filename) {
                        var filepath = path.join(dir, filename);
                        var fstats = fs.statSync(filepath);
                        if (fstats.isDirectory()) {
                            descendAndThumbnailImages(gallery, filepath, this);
                        }
                        else if (fstats.isFile()) {
                            if (imgExtRegex.test(filename)) {
                                gallery.heroes.push(filepath);
                                makeThumbnailImage(filepath, gallery, this);
                            }
                            else {
                                this.apply();
                            }
                        }
                        else {
                            this.apply();
                        }
                    }, 
                    function() {}, 
                    function() {
                        outerFlow.apply();
                    }
                );
            },
            function() {
                setTimeout(complete, 10);
            }
        );
    };

    var compileFlow = function(gallery, complete) {
        flow.exec(
            function() {
                this(path.join(gallery.imagesPath));
            },
            function(dir) {
                descendAndThumbnailImages(gallery, dir, this);
            },
            function() {
                setTimeout(complete, 200);
                // complete.apply();
            }
        );
    };

    var plg = new Plugin(Sate, {
        type: 'sate-gallery',
        version: '0.2.0',
        thumbnail: {
            format: 'jpg',
            size: null, // use size for best fit
            width: 150, // use w/h to crop
            height: 150 // use w/h to crop
        },
        contentPath: '',
        thumbnailsPath: "gallery-thumbs",
        imagesPath: "",
        thumbnails: [],
        heroes: [],
        compile: function(props, page, Sate, complete) {
            this.extendWithProperties(props);
            compileFlow(this, complete);
        },
        templates: {'main': __dirname+'/gallery.tpl'},
        stylesheets: ['/sate-cms/plugins/sate-gallery/sate-gallery.css'],
        scripts: ['/sate-cms/plugins/sate-gallery/sate-gallery.js'],
        objectToRender: function(config, page) {
            this.template = this.templates.main;
            var path = require('path');
            
            var obj = this.super.objectToRender(config, page);
            if (!obj) {
                obj = {};
            }

            if (obj.thumbnailsPath) {
                obj.images = obj.heroes.map(function(item) {
                    return {
                        heroSrc: '/' + item,
                        thumbSrc: '/' + path.join(obj.thumbnailsPath, item)
                    };
                });
            }
            return obj;
        }
    });
    
    return plg;
};
