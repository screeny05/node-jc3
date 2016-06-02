const Corrode = require('../corrode');


const HEADER = {
    signature: 0x41444620,
    revision: 0x04
};

/**
 * @return {
 *     header HEADER,
 *     meta {
 *         instanceTableSize uint32,
 *         instanceTableOffset uint32,
 *         typeTableSize uint32,
 *         typeTableOffset uint32,
 *         stringHashTableSize uint32,
 *         stringHashTableOffset uint32,
 *         stringTableSize uint32,
 *         stringTableOffset uint32,
 *         addressedFileSize uint32
 *     },
 *     sanityChecks SANITY,
 *     comment string
 * }
 */
Corrode.addExtension('adfMeta', function(){
    this
        .tap('header', function(){
            this
                .uint32('signature')
                .uint32('revision');
        })
        .assert.deepEqualObject('header', HEADER)

        .tap('meta', function(){
            this
                .uint32('instanceTableSize')
                .uint32('instanceTableOffset')
                .uint32('typeTableSize')
                .uint32('typeTableOffset')
                .uint32('stringHashTableSize')
                .uint32('stringHashTableOffset')
                .uint32('stringTableSize')
                .uint32('stringTableOffset')
                .uint32('addressedFileSize');
        })

        .tap('sanityChecks', function(){
            this
                .uint32('flag1')
                .uint32('flag2')
                .uint32('flag3')
                .uint32('flag4')
                .uint32('flag5');
        })
        .assert.allEqualObject('sanityChecks', 0)

        .terminatedString('comment');
});
