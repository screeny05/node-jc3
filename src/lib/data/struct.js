const lodash = require('lodash');
const dissolveHelpers = require('../utilities/dissolve-helpers');
const assert = require('../utilities/dissolve-assert');
const Dissolve = require('dissolve');
const typeDefinitionData = require('./type-definition');
const primitiveData = require('./primitive');

let structData = module.exports = {
    NAME: 'structure',

    isValidType(type){
        type = typeof type === 'object' ? type.type : type;
        return type == require('./type-definition').TYPES.structure;
    },

    parseMeta(stringTable, structSize){
        let currentEntry = 0;

        this.loop('members', function(end){
            this
                .int64('nameStringIndex')
                .tap(dissolveHelpers.abs('nameStringIndex'))
                .tap(assert.inArrayBounds('nameStringIndex', stringTable))
                .tap(dissolveHelpers.getValueFromArray(stringTable, 'nameStringIndex', 'name'))
                .uint32('typehash')
                .uint32('size')
                .uint32('offset')
                .uint32('defaultType')
                .uint64('defaultValue');

            if(++currentEntry > structSize - 1){
                end();
            }
        });
    },
    parse(buffer, file, instance){
        if(!structData.isValidType(instance.type))
            throw new TypeError(`invalid type - trying to parse data of type ${instance.type.name}(${instance.type.type}) as structure`);

        let typeDefinitionData = require('./type-definition');

        let memberData = {};

        instance.type.members.forEach(member => {
            let parser = typeDefinitionData.getParserForType(member.typehash, file.typeTable);
            let memberBuffer = buffer.slice(member.offset);
            console.log(memberData);
            memberData[member.name] = { type: member.typehash, key: member.name, value: parser.parse(memberBuffer, file, member) };
            //console.log(typeDefinitionData.getParserForType(member.typehash, file.typeTable).NAME);
        });

        return memberData;
    }
}
