const Corrode = require('../corrode');

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
