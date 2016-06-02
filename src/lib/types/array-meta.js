const Corrode = require('../corrode');

/**
 * @return {
 *     arrayCheck uint32,
 * }
 */
Corrode.addExtension('arrayMeta', function(){
    this
        .uint32('arrayCheck')
        .assert.equal('arrayCheck', 0);
});
