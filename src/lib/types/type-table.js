const Corrode = require('../corrode');

const types = require('../data/types');

/**
 * @param {array}  strings stringTable
 * @param {length} number  number of elements of the typeTable
 * @return [{
 *     typeId uint32,
 *     size uint32,
 *     alignment uint32,
 *     name string,
 *     flags uint32,
 *     elementTypeHash uint32,
 *     elementLength uint32,
 *     meta {<primitiveMeta>}
 * }]
 */
Corrode.addExtension('typeTable', function(strings, length){
    this
        .loopMax('values', length, function(){
            this
                // get type-id and check if it's valid
                .uint32('typeId')
                .assert.inArray('typeId', types.VALID_ROOT_TYPE_IDS)

                // get type metadata
                .uint32('size')
                .uint32('alignment')
                .uint32('namehash')
                .pointer('name', strings)
                .uint32('flags')
                .uint32('elementTypeHash')
                .uint32('elementLength')
                .tap(function(){
                    this.ext.primitiveMeta('meta', strings, this.vars.typeId);
                });
        })
        .pushVars();
});
