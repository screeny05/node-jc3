const Corrode = require('../corrode');


const HEADER = {
    signature: 0x424154,
    vmajor: 0x02,
    vminor: 0x01,
    check: 0x0800
};

/**
 * @return [{
 *     namehash uint32,
 *     offset uint32,
 *     size uint32
 * }]
 */
Corrode.addExtension('tab', function(hashNamesTable){
    this
        .tap('header', function(){
            this
                .uint32('signature')
                .uint16('vmajor')
                .uint16('vminor')
                .uint32('check');
        })
        .assert.deepEqualObject('header', HEADER)

        .loop('values', function(end, discard){
            this
                .uint32('namehash')
                .uint32('offset')
                .uint32('size')
                .tap(function(){
                    if(!this.vars.namehash){
                        return discard();
                    }

                    this.vars.name = null;

                    if(!hashNamesTable){
                        return;
                    }

                    // get the name from the tabfile
                    let filtered = hashNamesTable.filter(item => item.hash === this.vars.namehash && item.offset === this.vars.offset);
                    if(filtered.length === 0){
                        return;
                    }
                    let hashNameEntry = filtered[0];

                    // check if it's the same entry
                    this
                        .assert.equal('offset', hashNameEntry.offset)
                        .assert.equal('size', hashNameEntry.size);

                    this.vars.name = hashNameEntry.name;
                });
        })
        .pushVars()
});
