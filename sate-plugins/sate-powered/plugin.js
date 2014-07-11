/**
* Sate logo and link to sate resource
* Use like: {{sate-powered}}
*/
module.exports = function() {
    var Plugin = require(__dirname+'/../Plugin');

    var plg = new Plugin({
        type: 'sate-powered',
        version: '0.8.0',
        sateGithubUrl: "##",
        compile: function(props, page, complete) {
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
