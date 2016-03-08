const expect = require('expect.js');
const _ = require('lazy.js');
const lodash = require('lodash');
const dissolveHelpers = require('./dissolve-helpers');

module.exports = {

    /**
     * assert strict equal single value
     * @param {string} key  key of the value to test
     */
    equal(key, value){
        return function(){
            if(this.vars[key] !== value)
                throw new TypeError(`binary assert failed - expected ${value}, found ${this.vars[key]} at ${key}`);
        }
    },

    /**
     * assert strict equal each value in Object
     * @param {string} key  key of the object to test
     */
    allEqualObject(key, value){
        return function(){
            let notEqualObjects = _(dissolveHelpers.cloneWithoutProto(this.vars[key]))
                .keys()
                .filter(subkey => this.vars[key][subkey] !== value)
                .value();

            if(notEqualObjects.length !== 0)
                throw new TypeError(`binary assert-all failed - expected values in ${JSON.stringify(this.vars[key])} to all be ${value}`);
        }
    },

    /**
     * assert equal objects
     * @param {string} key  key of the object to test
     */
    equalObjectDeep(key, value){
        return function(){
            let binaryValue = dissolveHelpers.cloneWithoutProto(this.vars[key]);
            if(!lodash.isEqual(binaryValue, value))
                throw new TypeError(`binary assert-object failed - expected ${JSON.stringify(value)}, found ${JSON.stringify(binaryValue)}`);
        }
    }
};
