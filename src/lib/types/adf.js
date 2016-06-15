const Corrode = require('../corrode');


const HEADER = {
    signature: 0x41444620,
    revision: 0x04
};

/**
 * @return {
 *     instanceTableSize uint32,
 *     instanceTableOffset uint32,
 *     typeTableSize uint32,
 *     typeTableOffset uint32,
 *     stringHashTableSize uint32,
 *     stringHashTableOffset uint32,
 *     stringTableSize uint32,
 *     stringTableOffset uint32,
 *     addressedFileSize uint32,
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

        .terminatedString('comment')

        .tap(function(){
            this.vars = {
                ...this.vars.meta,
                comment: this.vars.comment
            };
        });
});


/**
 * @return {
 *     stringTable <stringTable>,
 *     stringHashTable <stringHashTable>,
 *     typeTable <typeTable>,
 *     instanceTable <instanceTable>,
 * }
 */
Corrode.addExtension('adf', function(){
    this
        .ext.adfMeta('meta')

        .tap(function(){
            this
                .position(this.vars.meta.stringTableOffset)
                .ext.stringTable('stringTable', this.vars.meta.stringTableSize)

                .position(this.vars.meta.stringHashTableOffset)
                .ext.stringHashTable('stringHashTable', this.vars.meta.stringHashTableSize);
        })

        .tap(function(){
            this
                .position(this.vars.meta.typeTableOffset)
                .ext.typeTable('typeTable', this.vars.stringTable, this.vars.meta.typeTableSize);
        })

        .tap(function(){
            this
                .position(this.vars.meta.instanceTableOffset)
                .ext.instanceTable('instanceTable', this.vars.stringTable, this.vars.typeTable, this.vars.meta.instanceTableSize);
        })

        .tap(function(){
            this.vars = {
                stringTable: this.vars.stringTable,
                stringHashTable: this.vars.stringHashTable,
                typeTable: this.vars.typeTable,
                instanceTable: this.vars.instanceTable
            };
        });
});
