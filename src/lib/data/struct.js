const lodash = require('lodash');
const dissolveHelpers = require('../utilities/dissolve-helpers');
const assert = require('../utilities/dissolve-assert');

let memberDefinitionData = module.exports = {
    parse(stringTable, structSize){
        let currentEntry = 0;

        this.loop('members', function(end){
            this
                .int64('nameStringIndex')
                .tap(dissolveHelpers.abs('nameStringIndex'))
                .tap(assert.inArrayBounds('nameStringIndex', stringTable))
                .tap(dissolveHelpers.getValueFromArray(stringTable, 'nameStringIndex', 'name'))
                .uint32('typeHash')
                .uint32('size')
                .uint32('offset')
                .uint32('defaultType')
                .uint64('defaultValue');

            if(++currentEntry > structSize - 1){
                end();
            }
        });
    }
}
