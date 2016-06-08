const Corrode = require('../corrode');

/**
 * @return [{
 *     value [uint8],
 *     valuehash uint32,
 *     extra uint32, // TODO: Unknown
 * }]
 */
Corrode.addExtension('stringHashTable', function(length){
    this
        .loopMax('values', length, function(){
            this
                .terminatedString('value')
                .uint32('valuehash')
                .uint32('extra');
        })
        .assert.arrayLength('values', length)
        .pushVars();
});
