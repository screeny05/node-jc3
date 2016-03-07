const Dissolve = require('dissolve');
const BinaryFile = require('./binary');
const BinaryUtils = require('../utilities/binary-helper');
const _ = require('lazy.js');

module.exports = class AdfFile extends BinaryFile {
    constructor(data){
        console.log(data);
    }

    static getParser(){
        return Dissolve()
            .uint32('magic')
            .uint32('vmajor')
            .tap(BinaryUtils.assertEqual('magic', 1094993440))
            .tap(BinaryUtils.assertEqual('vmajor', 4))
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
                    .uint32('typeDataEndOffset')
            })
            .tap('saneChecks', function(){
                this
                    .uint32('flag1')
                    .uint32('flag2')
                    .uint32('flag3')
                    .uint32('flag4')
                    .uint32('flag5')
            })
            .tap(BinaryUtils.assertAllEqual('saneChecks', 0))
    }
};
