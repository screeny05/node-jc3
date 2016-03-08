const Dissolve = require('dissolve');
const BinaryFile = require('./binary');
const assert = require('../utilities/dissolve-assert');
const dissolveHelpers = require('../utilities/dissolve-helpers');
const _ = require('lazy.js');

module.exports = class AdfFile extends BinaryFile {

    static HEADER = {
        signature: 0x41444620,
        revision: 0x04
    }

    constructor(data){
        //console.log(data);
    }

    static deserialize(buffer){
        let position = 0;

        let headers = dissolveHelpers.parseBuffer(buffer, this.getHeaderParser());
        let headerCommentString = dissolveHelpers.objectToString(headers.comment);
        position += 0x40 + headers.comment.length;

        if(headers.meta.typeDataEndOffset > buffer.length)
            throw new TypeError(`binary assert bufferlength failed - expected buffer to be at least ${headers.meta.typeDataEndOffset}, is ${buffer.length}`);


        let bufferWithoutHeaders = buffer.slice(position);
        let typeDataBuffer = buffer.slice(headers.meta.typeDataStartOffset, headers.meta.typeDataEndOffset);


        return headers;
    }

    static getHeaderParser(){
        return Dissolve()
            .tap('header', function(){
                this
                    .uint32('signature')
                    .uint32('revision');
            })
            .tap(assert.equalObjectDeep('header', this.HEADER))
            .tap('meta', function(){
                this
                    .uint32('num2')
                    .uint32('num3')
                    .uint32('num4')
                    .uint32('num5')
                    .uint32('num6')
                    .uint32('num7')
                    .uint32('num8')
                    .uint32('typeDataStartOffset')
                    .uint32('typeDataEndOffset');
            })
            .tap('saneChecks', function(){
                this
                    .uint32('flag1')
                    .uint32('flag2')
                    .uint32('flag3')
                    .uint32('flag4')
                    .uint32('flag5');
            })
            .tap(assert.allEqualObject('saneChecks', 0))
            .loop('comment', function(end){
                this.uint8('byte').tap(function(){
                    if(this.vars.byte === 0){
                        end(true);
                    }
                });
            })
    }
};
