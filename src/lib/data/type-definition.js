const lodash = require('lodash');
const structData = require('./struct');
const assert = require('../utilities/dissolve-assert');

let typeDefinitionData = module.exports = {
    TYPES: {
        primitive: 0,
        structure: 1,
        pointer: 2,
        array: 3,
        inlineArray: 4,
        string: 5,
        bitField: 7,
        enumeration: 8,
        stringHash: 9,
    },

    isValidType(type){
        return lodash.includes(typeDefinitionData.TYPES_IDENTIFIERS, type);
    },

    parse(stringTable, type){
        let types = typeDefinitionData.TYPES;

        console.log(typeDefinitionData.getTypeAsString(type));

        if(type === types.structure){
            this
                .uint32('structSize')
                .tap(function(){
                    structData.parse.call(this, stringTable, this.vars.structSize);
                });
        } else if(lodash.includes([types.pointer, types.array, types.inlineArray, types.stringHash], type)){
            this
                .uint32('arrayCheck')
                .tap(assert.equal('arrayCheck', 0));
        } else {
            throw new TypeError(`unsupported data-type ${typeDefinitionData.getTypeAsString(type)}(${type})`);
        }
    },

    getTypeAsString(type){
        return lodash.invert(typeDefinitionData.TYPES)[type];
    }
}

typeDefinitionData.TYPES_IDENTIFIERS = lodash.values(typeDefinitionData.TYPES);

typeDefinitionData.VALID_ROOT_TYPES = [
    typeDefinitionData.TYPES.structure,
    typeDefinitionData.TYPES.pointer,
    typeDefinitionData.TYPES.array,
    typeDefinitionData.TYPES.inlineArray,
    typeDefinitionData.TYPES.stringHash
];
