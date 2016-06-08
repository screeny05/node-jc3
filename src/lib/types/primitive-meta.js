const Corrode = require('../corrode');

const types = require('../data/types');

Corrode.addExtension('primitiveMeta', function(strings, typeId){
    if(typeId === types.TYPE_IDS.structure){
        this
            .uint32('structureSize')
            .ext.structureMembers('values', strings)
    } else if(types.ARRAY_LIKE_TYPE_IDS.indexOf(typeId) !== -1){
        this.ext.arrayMeta('values');
    } else {
        throw new TypeError(`unsupported data-type (${typeId})`);
    }

    this.pushVars();
});
