const lodash = require('lodash');
const _ = require('lazy.js');

let dissolveHelpers = module.exports = {
    cloneWithoutProto(obj){
        let clonedObject = lodash.cloneDeep(obj);
        if(clonedObject.__proto__)
            delete clonedObject.__proto__;
        return clonedObject;
    },
    parseBuffer(buffer, parser){
        parser.write(buffer);
        return parser.vars_list.length > 0 ? parser.vars_list[0] : parser.vars;
    },
    arrayToString(key, encoding = 'ascii'){
        return function(){
            this.vars[key] = new Buffer(this.vars[key]).toString(encoding);
        }
    },
    getValueFromArray(valueTable, key, assignTo){
        return function(){
            this.vars[assignTo] = valueTable[this.vars[key]];
        }
    },
    invert(key){
        return function(){
            this.vars[key] *= -1;
        }
    },
    abs(key){
        return function(){
            this.vars[key] = Math.abs(this.vars[key]);
        }
    },
    terminated(key, terminator = 0, type = 'uint8'){
        return function(){
            this.loop(key, function(end){
                this
                    [type]('__value')
                    .tap(function(){
                        if(this.vars.__value === terminator){
                            end(true);
                        }
                    });
            }).tap(function(){
                this.vars[key] = this.vars[key].map(val => val.__value);
            });
        }
    },
    loopedToArray(key = 'values'){
        return function(){
            this.vars = this.vars[key];
        }
    },
    debug(){
        console.log(this.vars);
    }
};
