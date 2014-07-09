/**
* Sate logo and link to sate resource
* Use like: {{sate-powered}}
*/
module.exports = function(Sate) {
    var Plugin = require(__dirname+'/../Plugin');

    var plg = new Plugin(Sate, {
        type: 'sate-powered',
        version: '0.1.0',
        sateGithubUrl: "##",
        compile: function(props, page, Sate, complete) {
            complete.apply();
        },
        templates: {'main': __dirname+'/powered-by-sate.tpl'},
        stylesheets: ['/sate-cms/plugins/sate-powered/powered-by-sate.css'],

        objectToRender: function(config, page) {
            this.composeClasses(this);
            return this;
        }
    });
    return plg;
};
