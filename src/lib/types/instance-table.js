const Corrode = require('../corrode');

/**
 * @return [{
 *     namehash uint32,
 *     typehash uint32,
 *     offset uint32,
 *     size uint32,
 *     name string
 * }]
 */
Corrode.addExtension('instanceTable', function(strings, length){
    this
        .loopMax('values', length, function(){
            this
                // get instance metadata
                .uint32('namehash')
                .uint32('typehash')
                .uint32('offset')
                .uint32('size')
                .pointer('name', strings);
        })
        .pushVars();
});
