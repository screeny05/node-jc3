const Corrode = require('../corrode');

const types = require('../data/types');

/**
 * structure:
 * @return <structureMemberTypes>
 *
 * array:
 * @return <arrayTypeMeta>
 */
Corrode.addExtension('primitiveTypeMeta', function(strings, typeId){
    if(typeId === types.TYPE_IDS.structure){
        this
            .uint32('structureSize')
            .ext.structureMemberTypes('values', strings)
    } else if(types.ARRAY_LIKE_TYPE_IDS.indexOf(typeId) !== -1){
        this.ext.arrayTypeMeta('values');
    } else {
        throw new TypeError(`unsupported data-type (${typeId})`);
    }

    this.pushVars();
});
