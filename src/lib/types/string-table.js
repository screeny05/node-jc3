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
        .assert.varsListLength('sizes', length)

        // get the strings with the given size, terminated by a zero
        .loopMax('strings', length, function(string){
            this
                .string('value', this.vars_list[0].sizes[string].size)
                .uint8('terminator')
                .assert.equal('terminator', 0);
        })
        .tap(function(){
            this.vars = this.vars.strings.map(str => str.value);
        });
});
