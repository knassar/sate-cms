/** 
* target - the source object to compile 
* complete - success callback with the pattern: function(errors)
* failed - failure callback with the pattern: function(errors, incompleteSteps)
*/
function Compiler(target, complete, failed) {
    var extend = require('node.extend');

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
    
    function CompileRecord(name) {
        var rec = extend(this, {
            name: name,
            errrors: [],
            start: (new Date()).getTime(),
            end: function() {
                var end = (new Date()).getTime();
                this.time = end - this.start;
                this.end = end;
            }
        });
        return rec;
    }
    
    target.compiled = false;
    var compiler = {
        target: target,
        metrics: false,
        completeCallback: complete,
        failedCallback: failed,
        compileSteps: [],
        failedSteps: [],
        compileErrors: [],
        compileRecord: {},
        recordsOrder: [],
        recordMetrics: function() {
            this.metrics = true;
        },
        stepStart: function(stepName) {
            this.compileSteps.push(stepName);
            if (this.metrics) {
                this.compileRecord[stepName] = new CompileRecord(stepName);
                recordsOrder.push(stepName);
            }
        },
        stepComplete: function(stepName) {
            if (this.metrics) {
                this.compileRecord[stepName].end();
            }
            var compiler = this;
            process.nextTick(function() {
                unmarkCompileStep(compiler, stepName);
                checkCompileComplete(compiler);
            });
        },
        stepError: function(stepName, err) {
            console.log( err );
            if (this.metrics) {
                this.compileRecord[stepName].end();
                this.compileRecord[stepName].errors.push(err);
            }
            unmarkCompileStep(this, stepName);
            compileError(this, this.target, stepName, err);
            checkCompileComplete(this);
        },
        stepFailed: function(stepName, err) {
            console.log( err );
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
}

module.exports = Compiler;