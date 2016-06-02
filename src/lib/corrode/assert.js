const _ = require('lazy.js');
const lodash = require('lodash');
const utils = require('./utils');

module.exports = {

    /**
     * assert strict equal single value
     * @param {string} name   key of the value to test
     * @param {mixed}  value  comparision
     * @throws TypeError assertion-error
     */
    equal(name, value){
        if(this.vars[name] !== value)
            throw new TypeError(`Expected ${value}, found ${this.vars[name]} at ${name}`);
    },

    /**
     * assert deep equal each value in Object
     * @param {string} name  key of the object to test
     * @param {mixed} value comparision
     * @throws TypeError assertion-error
     */
    allEqualObject(name, value){
        let notEqualObjects = _(utils.cloneWithoutProto(this.vars[name]))
            .keys()
            .filter(subkey => this.vars[name][subkey] !== value)
            .value();

        if(notEqualObjects.length !== 0)
            throw new TypeError(`Expected values in ${JSON.stringify(this.vars[name])} to all be ${value}`);
    },

    /**
     * assert equal objects
     * @param {string} name  key of the object to test
     * @param {object} value comparision
     * @throws TypeError assertion-error
     */
    deepEqualObject(name, value){
        let binaryValue = utils.cloneWithoutProto(this.vars[name]);
        if(!lodash.isEqual(binaryValue, value))
            throw new TypeError(`Expected ${JSON.stringify(value)}, found ${JSON.stringify(binaryValue)}`);
    },

    /**
     * assert array to contain item
     * @param {string} name key of the value to test
     * @param {array} arr   comparision
     * @throws TypeError assertion-error
     */
    inArray(name, arr){
        if(!lodash.includes(arr, this.vars[name]))
            throw new TypeError(`Expected one of ${JSON.stringify(arr)}, found ${this.vars[name]}`);
    },

    /**
     * assert value to be within the bounds of an array
     * @param {string} name  key of the number to test
     * @param {array} value comparision
     * @throws TypeError assertion-error
     */
    inArrayBounds(name, value){
        let index = this.vars[name];

        if(index < 0 || index >= value.length)
            throw new TypeError(`Expected Array of ${value.length} items to be at least ${this.vars[name]}`);
    },

    /**
     * assert value via callback
     * @param {string}   name   key of the value to test
     * @param {function} value  comparator
     * @param {string}   fnName optional test-name
     * @throws TypeError assertion-error
     */
    callback(name, fn, fnName = fn.name){
        if(!fn(this.vars[name]))
            throw new TypeError(`Callback failed at ${fnName}(${this.vars[name]})`);
    },

    /**
     * assert var_list to be a given length
     * @param {number} length comparision
     * @throws TypeError assertion-error
     */
    varsListLength(length){
        if(typeof this.vars_list === 'undefined' || this.vars_list.length !== length)
            throw new TypeError(`Expected context to have ${length} vars, has ${this.vars_list.length}`);
    },

    exists(name){
        if(typeof this.vars[name] === 'undefined')
            throw new TypeError(`Expected var ${name} to exist`);
    }
};
