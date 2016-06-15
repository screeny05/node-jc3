const util = require('util');

const Corrode = require('../corrode');

const types = require('../data/types');

/**
 * @param {array}  strings stringTable
 * @param {number} length  number of elements of the typeTable
 * @return [<type>]
 */
Corrode.addExtension('typeTable', function(strings, length){
    this
        .loopMax('values', length, function(){
            this.ext.type('values', strings).pushVars();
        })
        .pushVars();
});

/**
 * @param {array}  strings stringTable
 * @return {
 *     typeId uint32,
 *     size uint32,
 *     alignment uint32,
 *     name string,
 *     flags uint32,
 *     elementTypeHash uint32,
 *     elementLength uint32,
 *     <memberTypes>|<arrayTypeMeta>
 * }
 */
Corrode.addExtension('type', function(strings){
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
            if(this.vars.typeId === types.TYPE_IDS.structure){
                this.uint32('memberCount').ext.structureMemberTypes('memberTypes', strings, 'memberCount');
            } else if(types.ARRAY_LIKE_TYPE_IDS.indexOf(this.vars.typeId) !== -1){
                this.ext.arrayTypeMeta('arrayTypeMeta');
            } else {
                throw new TypeError(`unsupported data-type (${this.vars.typeId})`);
            }
        });
}, {
    inspect(depth){
        let header = `Type: ${this.name}<${this.getReadableTypename()}>`;

        if(this.typeId === types.TYPE_IDS.structure){
            header += `(Count: ${this.memberCount})`;
        }

        return `${header}\n${util.inspect(this, { depth, customInspect: false })}`;
    },

    getReadableTypename(){
        return types.TYPE_IDS_BY_ID[this.typeId];
    }
});
