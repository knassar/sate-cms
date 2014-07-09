/**
* Sate logo and link to sate resource
* Use like: {{sate-powered}}
*/
module.exports = function(Sate) {
    var Plugin = require(__dirname+'/../Plugin');

    var plg = new Plugin(Sate, {
        type: 'sate-powered',
        version: '0.8.0',
        sateGithubUrl: "##",
        compile: function(props, page, Sate, complete) {
            complete.apply();
        },
        templates: {'main': 'powered-by-sate.tpl'},
        stylesheets: ['powered-by-sate.css'],

        objectToRender: function(config, page) {
            this.composeClasses(this);
            return this;
        }
    });
    return plg;
};
