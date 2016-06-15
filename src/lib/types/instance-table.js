const Corrode = require('../corrode');

const types = require('../data/types');

/**
 * @return [{
 *     namehash uint32,
 *     type <typeTableEntry>,
 *     offset uint32,
 *     size uint32,
 *     name string,
 *     data blob[offset, size],
 *     instanceMembers <instanceMembers>
 * }]
 */
Corrode.addExtension('instanceTable', function(strings, types, length){
    this
        .loopMax('values', length, function(){
            this
                // get instance metadata
                .uint32('namehash')
                .uint32('type')
                .map.fromObjectArray('type', types, 'namehash')
                .uint32('offset')
                .uint32('size')
                .pointer('name', strings)
                .position('offset')
                .blob('data', 'size')
                .ext.instanceMembers('instanceMembers');
        })
        .pushVars();
});

/**
 * @return <instanceMemberStructure>|<instanceMemberArray>|<instanceMemberStringHash>
 */
Corrode.addExtension('instanceMembers', function(instanceTableEntry){
    if(typeof instanceTableEntry === 'string'){
        instanceTableEntry = this.varStack.getValueAbove()[instanceTableEntry];
    } else if(typeof instanceTableEntry === 'undefined'){
        instanceTableEntry = this.varStack.getValueAbove();
    }

    let { typeId } = instanceTableEntry.type;
    let { structure, array, inlineArray, stringHash } = types.TYPE_IDS;

    if(typeId === structure){
        this.ext.instanceMemberStructure('values', instanceTableEntry);
    } else if(types.ARRAY_LIKE_TYPE_IDS.indexOf(typeId)){
        this.ext.instanceMemberArray('values', instanceTableEntry);
    } else if(typeId === stringHash){
        this.ext.instanceMemberStringHash('values', instanceTableEntry);
    }

    this.pushVars();
});


Corrode.addExtension('instanceMemberStructure', function(instanceTableEntry){

});
