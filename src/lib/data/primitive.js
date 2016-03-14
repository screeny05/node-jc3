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

    parse(instanceBuffer, dataBuffer, file, instance){
        let types = primitiveData.PRIMITIVES;
        let type = instance.typehash;

        switch (type) {
            case types.string: return primitiveData.parseAsString(instanceBuffer, dataBuffer);
            case types.uint64: return primitiveData.parseAsType('uint64', instanceBuffer, dataBuffer);
            case types.sint64: return primitiveData.parseAsType('int64', instanceBuffer, dataBuffer);
            case types.uint32: return primitiveData.parseAsType('uint32', instanceBuffer, dataBuffer);
            case types.sint32: return primitiveData.parseAsType('int32', instanceBuffer, dataBuffer);
            case types.uint16: return primitiveData.parseAsType('uint16', instanceBuffer, dataBuffer);
            case types.uint8: return primitiveData.parseAsType('uint8', instanceBuffer, dataBuffer);
            case types.sint8: return primitiveData.parseAsType('int8', instanceBuffer, dataBuffer);
            case types.float: return primitiveData.parseAsType('float', instanceBuffer, dataBuffer);
            default: throw new TypeError(`unknown type, ${type} is not a primitive`)
        }
    },

    parseAsString(instanceBuffer, dataBuffer){
        let addressParser = Dissolve()
            .int64('offset')
            .tap(dissolveHelpers.abs('offset'))
            .tap(dissolveHelpers.keyToVar('offset'));

        let dataOffset = dissolveHelpers.parseBuffer(instanceBuffer, addressParser);
        let offsetBuffer = dataBuffer.slice(dataOffset);

        let parser = Dissolve()
            .tap(dissolveHelpers.terminated())
            .tap(dissolveHelpers.arrayToString())
            .tap(dissolveHelpers.keyToVar());

        return dissolveHelpers.parseBuffer(offsetBuffer, parser);
    },

    parseAsType(type, instanceBuffer){
        let parser = Dissolve()[type]('value');
        return dissolveHelpers.parseBuffer(instanceBuffer, parser);
    },

    isValidType(type){
        type = typeof type === 'object' ? type.type : type;
        return _(primitiveData.PRIMITIVES).values().contains(type);
    },

    getTypeAsString(type){
        return lodash.invert(primitiveData.PRIMITIVES)[type];
    }
}
