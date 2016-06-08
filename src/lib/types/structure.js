const Corrode = require('../corrode');

/**
 * @return [{
 *     name string,
 *     typehash uint32,
 *     size uint32,
 *     offset uint32,
 *     defaultType uint32,
 *     defaultValue uint32
 * }]
 */
Corrode.addExtension('structureMembers', function(strings, length = 'structureSize'){
    if(typeof length === 'string'){
        length = this.varStack.getValueAbove()[length];
    }

    this
        .loopMax('values', length, function(){
            this
                // get members data
                .pointer('name', strings)
                .uint32('typehash')
                .uint32('size')
                .uint32('offset')
                .uint32('defaultType')
                .uint64('defaultValue');
        })
        .pushVars();
});
