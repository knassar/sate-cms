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

    var ensurePath = function(filepath) {
        var pathParts = filepath.split('/');
        
        var check = pathParts.shift();
        if (check.length > 0 && !fs.existsSync(check)) {
            fs.mkdirSync(check);
        }
        
        var check = fs.realpathSync(check);
        while (pathParts.length > 1) {
            check = path.join(check, pathParts.shift());
            if (!fs.existsSync(check)) {
                fs.mkdirSync(check);
            }
        }
    };

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
                    console.log( " +--> plugin-sate-gallery: found");
                    return;
                }
            } else if (Sate.configForPlugin('sate-gallery').foundIM !== false) {
                Sate.configForPlugin('sate-gallery').foundIM = false;
                console.log(" X--> plugin-sate-gallery: ImageMagick binaries not installed. IM calls will be skipped.");
            }
        });
    }

    var makeThumbnailImage = function(imagePath, gallery, complete) {
        loadIM();
        filenameBase = imagePath.split('/').reverse()[0].split('.').reverse().slice(1).reverse().join('.');
        var thumbPath = imagePath.replace(gallery.contentPath, path.join(gallery.contentPath, gallery.thumbnailsPath));
        ensurePath(thumbPath);
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

    var compileFlow = function(gallery, complete) {
        var imgExtRegex = /\.jpg|\.gif|\.png$/;
        flow.exec(
            function() {
                if (Sate.configForPlugin('sate-gallery').foundIM) {
                    fs.readdir(path.join(gallery.contentPath, gallery.imagesPath), this);
                }
                else {
                    this.apply();
                }
            },
            function(err, imagesPaths) {
                var multiCount = 0;
                if (Sate.configForPlugin('sate-gallery').foundIM && util.isArray(imagesPaths)) {
                    for (var i=0; i < imagesPaths.length; i++) {
                        if (imgExtRegex.test(imagesPaths[i])) {
                            var imagePath = path.join(gallery.contentPath, gallery.imagesPath, imagesPaths[i]);
                            gallery.heroes.push(imagePath);
                            multiCount++;
                            makeThumbnailImage(imagePath, gallery, this.MULTI(imagePath));
                        }
                    }
                }
                if (multiCount === 0) {
                    this.apply();
                }
            },
            function() {
                complete.apply();
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
        thumbnailsPath: "../gallery-thumbs",
        imagesPath: "",
        thumbnails: [],
        heroes: [],
        compile: function(props, page, Sate, complete) {
            this.contentPath = path.join(page.contentPath, '.');
            this.extendWithProperties(props);
            compileFlow(this, complete);
        },
        templates: {'main': __dirname+'/gallery.tpl'},
        stylesheets: ['/sate-cms/plugins/sate-gallery/sate-gallery.css'],
        scripts: ['/sate-cms/plugins/sate-gallery/sate-gallery.js'],
        objectToRender: function(config, page) {
            this.template = this.templates.main;
            var path = require('path'),
                g = {};
            if (config.id) {
                g = page.pluginById(config.id);
            }
            if (g.thumbnailsPath) {
                var thumbPath = g.thumbnailsPath.replace(g.contentPath, '').replace(/^\.\./, '');
                g.images = g.heroes.map(function(item) {
                    return {
                        heroSrc: '/'+item,
                        thumbSrc: path.join(thumbPath, item.replace(g.contentPath, ''))
                    };
                });
            }
            return g;
        }
    });
    
    return plg;
};
