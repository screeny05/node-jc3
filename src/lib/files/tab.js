const Dissolve = require('dissolve');
const BinaryFile = require('./binary');

module.exports = class TabFile extends BinaryFile {
    constructor(data){
        console.log(data);
    }

    static getParser(){
        return Dissolve()
            .uint32('magic')
            .uint16('vmajor')
            .uint16('vminor')
            .uint32('check')
            .loop('files', function(end){
                this
                    .uint32('namehash')
                    .uint32('offset')
                    .uint32('size');
            });
    }
};
