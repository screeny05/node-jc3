const lodash = require('lodash');
const _ = require('lazy.js');
const dissolveHelpers = require('../utilities/dissolve-helpers');
const assert = require('../utilities/dissolve-assert');
const Dissolve = require('dissolve');
const typeDefinitionData = require('./type-definition');

let primitiveData = module.exports = {
    NAME: 'primitive',

    PRIMITIVES: {
        string: 0x8955583e,
        uint64: 0xa139e01f,
        sint64: 0xaf41354f,
        uint32: 0x75e4e4f,
        sint32: 0x192fe633,
        uint16: 0x86d152bd,
        uint8: 0xca2821d,
        sint8: 0x580d0a62,
        float: 0x7515a207
    },

    parse(buffer, file, instance){
        let types = primitiveData.PRIMITIVES;
        let type = instance.type;
        if(typeof type === 'object'){
            type = type.type;
        }
        if(typeof type === 'undefined'){
            type = instance.typehash;
        }

        console.log(instance);

        switch (type) {
            case types.string: return primitiveData.parseAsString(buffer);
            case types.uint64: return primitiveData.parseAsType('uint64', buffer);
            case types.sint64: return primitiveData.parseAsType('int64', buffer);
            case types.uint32: return primitiveData.parseAsType('uint32', buffer);
            case types.sint32: return primitiveData.parseAsType('int32', buffer);
            case types.uint16: return primitiveData.parseAsType('uint16', buffer);
            case types.uint8: return primitiveData.parseAsType('uint8', buffer);
            case types.sint8: return primitiveData.parseAsType('int8', buffer);
            case types.float: return primitiveData.parseAsType('float', buffer);
            default: throw new TypeError(`unknown type, ${type} is not a primitive`)
        }
    },

    parseAsString(buffer){
        console.log(instance);
        throw new TypeError('parseAsString not implemented yet');
    },

    parseAsType(type, buffer){
        let parser = Dissolve()[type]('value');
        console.log(buffer);
        return dissolveHelpers.parseBuffer(buffer, parser);
    },

    isValidType(type){
        type = typeof type === 'object' ? type.type : type;
        return _(primitiveData.PRIMITIVES).values().contains(type);
    }
}
