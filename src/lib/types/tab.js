const Corrode = require('../corrode');


const HEADER = {
    signature: 0x424154,
    vmajor: 0x02,
    vminor: 0x01,
    check: 0x0800
};

/**
 * @return {
 *     header HEADER,
 *     files [{
 *         namehash uint32,
 *         offset uint32,
 *         size uint32
 *     }]
 * }
 */
Corrode.addExtension('tab', function(){
    this
        .tap('header', function(){
            this
                .uint32('signature')
                .uint16('vmajor')
                .uint16('vminor')
                .uint32('check');
        })
        .assert.deepEqualObject('header', HEADER)

        .loop('files', function(){
            this
                .uint32('namehash')
                .uint32('offset')
                .uint32('size');
        });
});
