const Dissolve = require('dissolve');
const Concentrate = require('concentrate');
const BinaryFile = require('./binary');
const assert = require('../utilities/dissolve-assert');

module.exports = class TabFile extends BinaryFile {

    static HEADER = {
        signature: 0x424154,
        vmajor: 0x02,
        vminor: 0x01,
        check: 0x0800
    }

    constructor(data){
        console.log(data);
    }

    static getParser(){
        return Dissolve()
            .tap('header', function(){
                this
                    .uint32('signature')
                    .uint16('vmajor')
                    .uint16('vminor')
                    .uint32('check');
            })
            .tap(assert.equalObjectDeep('header', this.HEADER))
            .loop('files', function(end){
                this
                    .uint32('namehash')
                    .uint32('offset')
                    .uint32('size');
            });
    }

    static serialize(tabFile){
        let serializer = Concentrate()
            .uint32(this.HEADER.signature)
            .uint16(this.HEADER.vmajor)
            .uint16(this.HEADER.vminor)
            .uint32(this.HEADER.check);

        tabFile.files.forEach(fileEntry => {
            serializer
                .uint32(fileEntry.namehash)
                .uint32(fileEntry.offset)
                .uint32(fileEntry.size);
        });

        return serializer.result();
    }
};
