const Corrode = require('../corrode');


const LINE_REGEX = /(0x[0-9a-fA-F]+?)\s+(0x[0-9a-fA-F]+?)\s+(0x[0-9a-fA-F]+?)\s+(?:0x[0-9a-fA-F]+?)\s+(.*)/;

/**
 * @return [{
 *     hash int64,
 *     offset int64,
 *     size int64,
 *     name string
 * }]
 */
Corrode.addExtension('hashNamesTable', function(){
    this.loop('values', function(end, discard){
        this
            .terminatedString('values', '\n', 'utf8')
            .tap(function(){
                let match = this.vars.values.trim().match(LINE_REGEX);
                if(!match){
                    return discard();
                }

                this.vars = {
                    hash: parseInt(match[1]),
                    offset: parseInt(match[2]),
                    size: parseInt(match[3]),
                    name: match[4]
                };
            });
    })
    .pushVars();
});
