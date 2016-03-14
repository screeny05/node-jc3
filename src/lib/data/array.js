const lodash = require('lodash');
const dissolveHelpers = require('../utilities/dissolve-helpers');
const assert = require('../utilities/dissolve-assert');
const Dissolve = require('dissolve');

let arrayData = module.exports = {
    NAME: 'array',

    isValidType(type){
        type = typeof type === 'object' ? type.type : type;
        return type == require('./type-definition').TYPES.array;
    },

    parse(buffer, file, instance){
    }
}
