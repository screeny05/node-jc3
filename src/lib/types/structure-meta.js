const Corrode = require('../corrode');

const TYPE_ID = 1;

/**
 * @return {
 *     members [{
 *         name string,
 *         typehash uint32,
 *         size uint32,
 *         offset uint32,
 *         defaultType uint32,
 *         defaultValue uint32
 *     }]
 * }
 */
Corrode.addExtension('structureMeta', function(strings, length = 'structureSize'){
    if(typeof length === 'string'){
        length = this.vars[length];
    }

    this
        .loopMax('members', length, function(){
            this
                // get members data
                .pointer('name', strings)
                .uint32('typehash')
                .uint32('size')
                .uint32('offset')
                .uint32('defaultType')
                .uint64('defaultValue');
        });
});
