const Corrode = require('../corrode');

/**
 * @return {
 *     arrayCheck uint32,
 * }
 */
Corrode.addExtension('arrayTypeMeta', function(){
    this
        .uint32('arrayCheck')
        .assert.equal('arrayCheck', 0);
});

/**
 * @return {
 *     offset int64,
 *     count int64
 * }
 */
Corrode.addExtension('array', function(){
    this
        .int64('offset')
        .map.abs('offset')
        .int64('count')
        .map.abs('count');
});
