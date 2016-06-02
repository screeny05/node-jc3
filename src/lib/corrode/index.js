const Dissolve = require('./dissolve-own');
const utils = require('./utils');

const EXTENSIONS = {};
const MAPPERS = require('./map');
const ASSERTIONS = require('./assert');

class Corrode extends Dissolve {
    constructor(){
        super(...arguments);

        this.ext = utils.bindObject(EXTENSIONS, this);
        this.map = utils.tapBindObject(MAPPERS, this);
        this.assert = utils.tapBindObject(ASSERTIONS, this);
    }

    loopMax(name, length, fn){
        let currentPosition = 0;

        let loopGuard = function(end){
            fn.call(this, currentPosition, end);

            if(++currentPosition > length - 1){
                currentPosition = 0;
                end();
            }
        };

        if(typeof name === 'number'){
            fn = length;
            length = name;
            name = undefined;
        }

        if(!name){
            return this.loop(loopGuard);
        }

        return this.loop(name, loopGuard);
    }

    array(name, terminator = 0, type = 'uint8'){
        terminator = typeof terminator === 'string' ? terminator.charCodeAt(0) : terminator;

        return this
            .loop(name, function(end){
                this
                    [type]('__value')
                    .tap(function(){
                        if(this.vars.__value === terminator){
                            end(true);
                        }
                    });
            })
            .tap(function(){
                this.vars[name] = this.vars[name].map(val => val.__value);
            });
    }

    terminatedString(name, terminator = 0, encoding = 'ascii'){
        terminator = typeof terminator === 'string' ? terminator.charCodeAt(0) : terminator;

        return this
            .array(name, terminator)
            .tap(function(){
                if(!this.vars[name] || this.vars[name].length === 0){
                    this.vars[name] = '';
                } else {
                    this.vars[name] = new Buffer(this.vars[name]).toString(encoding);
                }
            });
    }

    pointer(name, array, type = 'int64'){
        return this
            [type](name)
            .map.abs(name)
            .assert.inArrayBounds(name, array)
            .map.fromArray(name, array);
    }

    pushVars(name = 'values'){
        return this
            .assert.exists(name)
            .tap(function(){
                this.vars = this.vars[name];
            });
    }

    debug(){
        return this.tap(function(){
            console.log(this.vars);
        });
    }

    fromBuffer(buffer){
        this.write(buffer);
        return this.vars_list.length > 0 ? this.vars_list[0] : this.vars;
    }
}

module.exports = function(){
    return new Corrode(...arguments);
};

module.exports.addExtension = function(name, fn){
    EXTENSIONS[name] = function(name = 'values', ...args){
        return this.tap(name, function(){
            fn.apply(this, args);
        });
    };
}

module.exports.EXTENSIONS = EXTENSIONS;
module.exports.MAPPERS = MAPPERS;
module.exports.ASSERTIONS = ASSERTIONS;
