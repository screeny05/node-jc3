const lodash = require('lodash');
const dissolveHelpers = require('../utilities/dissolve-helpers');
const assert = require('../utilities/dissolve-assert');
const Dissolve = require('dissolve');
const primitiveData = require('./primitive');

let arrayData = module.exports = {
    NAME: 'array',

    isValidType(type){
        type = typeof type === 'object' ? type.type : type;
        return type == require('./type-definition').TYPES.array;
    },

    parse(instanceBuffer, dataBuffer, file, instance){
        let metaParser = Dissolve()
            .int64('offset')
            .tap(dissolveHelpers.abs('offset'))
            .int64('count')
            .tap(dissolveHelpers.abs('count'));

        let meta = dissolveHelpers.parseBuffer(instanceBuffer, metaParser);

        let fullDataBuffer = dataBuffer.slice(meta.offset);

        let memberData = [];
        let elementSize = typeof instance.type.elementSize !== 'undefined' ? instance.type.elementSize : instance.type.elementType.size;

        for (var i = 0; i < meta.count; i++) {
            let elementBuffer = fullDataBuffer.slice(i * elementSize);
            memberData.push(instance.type.elementType.parse(elementBuffer, elementBuffer, file, lodash.extend({}, instance.type, { type: instance.type.elementType })));
        }

        if(memberData.length !== meta.count)
            throw new TypeError(`expected A[${JSON.stringify(instance.type.elementType)}] to be of size ${meta.count}, instead it's ${memberData.length}`);

        instance.data = memberData;
        return memberData;
    }
}
