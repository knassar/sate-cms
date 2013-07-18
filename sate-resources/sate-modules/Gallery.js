function Gallery(props, page) {
    var fs = require('fs'),
        path = require('path'),
        extend = require('node.extend'),
        im = require('imagemagick'), // node-imagemagick - https://github.com/rsms/node-imagemagick
        util = require("util");

    var websiteBasePath = function(filepath) {
        return path.join(page.content, filepath);
    }

    var processGallery = function(gallery) {
        if (gallery.heroes.length > 0) {
            traverseImages(gallery.heroes, gallery);
        } else if (gallery.imagesPath) {
            fs.readdir(websiteBasePath(gallery.imagesPath), function(err, files) {
                traverseImages(files, gallery);
            });
        }
    };

    var traverseImages = function(imagesPaths, gallery) {
        for (var i=0; i < imagesPaths.length; i++) {
            if (/\.jpg|\.gif|\.png$/.test(imagesPaths[i])) {
                makeThumbnailImage(imagesPaths[i], gallery);
            }
        }
    };

    var makeThumbnailImage = function(imagePath, gallery) {
        filenameBase = imagePath.split('/').reverse()[0].split('.').reverse().slice(1).reverse().join('.');
        im.resize({
            srcPath: path.join(page.content, gallery.imagesPath, imagePath),
            dstPath: path.join(page.content, gallery.thumbnailsPath, filenameBase+'.'+gallery.thumbnail.format),
            quality: 0.8,
            format: gallery.thumbnail.format,
            width: gallery.thumbnail.width,
            height: gallery.thumbnail.height,
            strip: true
        }, function(err, stdout, stderr) {
            if (err) {
                console.log( err );
            }
        });
    };

    var gallery = extend(true, this, {
        thumbnail: {
            format: 'jpg',
            size: null, // use size for best fit
            width: 150, // use w/h to crop
            height: 150, // use w/h to crop
        },
        thumbnailsPath: "./gallery-thumbs",
        imagesPath: "",
        thumbnails: [],
        heroes: []
    },
    // page,
    props,
    {
        init: function() {
            try {
                // make sure ImageMagick binaries are installed
                im.identify('im-test.jpg', function() {});
            } catch (err) {
                // TODO: Handle this better, or ditch ImageMagick
                console.error("ImageMagick binaries not installed");
                process.exit(1);
            }
            processGallery(this);
        }
    });
    
    gallery.init();
    return gallery;
}
module.exports = Gallery;

