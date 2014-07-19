/**
* Sate markup hygene
* Use like: {{sate-powered}}
*/
module.exports = function() {

    var plg = new Sate.Plugin({
        type: 'sate-markup',
        version: '0.5.0',
        config: {
            externalLinks: true,
            externalLinkTarget: "_blank"
        },
        compile: function(props, page, complete) {
            Sate.chain.inPlace(this.config, props);
            complete.apply();
        },
        templates: {'main': 'config.tpl'},
        stylesheets: ['sate-markup.css'],
        scripts: ['sate-markup.js'],

        objectToRender: function(config, page) {
            var obj = this.prototype.objectToRender.call(this, config, page);
            if (!obj) {
                obj = {
                    config: {}
                };
            }
            
            obj.configJSON = JSON.stringify(obj.config);
            
            return obj;
        }
    });
    return plg;
};
