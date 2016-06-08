const Corrode = require('../corrode');

/**
 * @return [string]
 */
Corrode.addExtension('stringTable', function(length){
    this
        // table begins with list of uint8 sizes for the strings
        .loopMax('sizes', length, function(){
            this.uint8('size');
        })
        .assert.arrayLength('sizes', length)

        // get the strings with the given size, terminated by a zero
        .loopMax('values', length, function(string){
            this
                .string('values', this.varStack.getValueAbove().sizes[string].size)
                .uint8('terminator')
                .assert.equal('terminator', 0)
                .pushVars();
        })
        .pushVars();
});
