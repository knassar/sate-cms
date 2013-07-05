/** 
* target - the source object to compile 
* complete - success callback with the pattern: function(errors)
* failed - failure callback with the pattern: function(errors, incompleteSteps)
*/
function Compiler(target, complete, failed) {

    var unmarkCompileStep = function(compiler, step) {
        var idx = compiler.compileSteps.indexOf(step);
        if (idx > -1) {
            compiler.compileSteps.splice(idx, 1);
        }
    };
    var checkCompileComplete = function(compiler) {
        if (compiler.compileSteps.length === 0) {
            compiler.target.compiled = true;
            process.nextTick(function() {
                compiler.complete();
            });
        }
    };
    var compileError = function(compiler, target, step, err) {
        compiler.compileErrors.push({compileStep: step, error: err});
        checkCompileComplete(compiler);
    };

    target.compiled = false;
    var compiler = {
        target: target,
        completeCallback: complete,
        failedCallback: failed,
        compileSteps: [],
        failedSteps: [],
        compileErrors: [],
        stepStart: function(stepName) {
            this.compileSteps.push(stepName);
        },
        stepComplete: function(stepName) {
            var compiler = this;
            process.nextTick(function() {
                unmarkCompileStep(compiler, stepName);
                checkCompileComplete(compiler);
            });
        },
        stepError: function(stepName, err) {
            unmarkCompileStep(this, stepName);
            compileError(this, this.target, stepName, err);
            checkCompileComplete(this);
        },
        stepFailed: function(stepName, err) {
            this.stepError(stepError, err);
            this.failedCallback.apply(this.target, [this.compileErrors, this.compileSteps]);
        },
        complete: function() {
            var compiler = this;
            process.nextTick(function() {
                compiler.completeCallback.apply(compiler.target, [compiler.compileErrors]);
            });
        }
    };
    return compiler;
};

module.exports = Compiler;