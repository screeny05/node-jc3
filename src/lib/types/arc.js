const Corrode = require('../corrode');

/**
 * @return [{
 *     name string
 *     data buffer
 * }]
 */
Corrode.addExtension('arc', function(tab){
    this
        .loopMax('values', tab.length, function(i, end){
            let tabEntry = tab[i];
            let nextTabEntry = tab[i + 1];

            this.ext.arcEntry('values', tabEntry).pushVars();

            if(nextTabEntry){
                this.skip(nextTabEntry.offset - (tabEntry.offset + tabEntry.size));
            } else {
                return end();
            }
        })
        .assert.arrayLength('values', tab.length)
        .pushVars();
});

Corrode.addExtension('arcEntry', function(tabEntry){
    this.vars.name = tabEntry.name;

    if(this.streamOffset !== tabEntry.offset){
        this.skip(tabEntry.offset - this.streamOffset);
    }

    this
        .blob('data', tabEntry.size)
        .assert.arrayLength('data', tabEntry.size);
});
