const Dissolve = require('dissolve');
const BinaryFile = require('./binary');
const assert = require('../utilities/dissolve-assert');
const dissolveHelpers = require('../utilities/dissolve-helpers');
const _ = require('lazy.js');
const lodash = require('lodash');
const typeDefinitionData = require('../data/type-definition');

module.exports = class AdfFile extends BinaryFile {

    headers = null;
    stringTable = null;
    typeTable = null;
    instanceTable = null;
    stringHashTable = null;

    static HEADER = {
        signature: 0x41444620,
        revision: 0x04
    }

    constructor(meta){
        super(meta);
        if(meta){
            lodash.extend(this, meta);
        }
    }

    static deserialize(buffer){
        let position = 0;

        let file = {};

        file.headers = dissolveHelpers.parseBuffer(buffer, this.getHeaderParser());

        if(file.headers.meta.addressedFileSize > buffer.length)
            throw new TypeError(`binary assert bufferlength failed - expected buffer to be at least ${file.headers.meta.addressedFileSize}, is ${buffer.length}`);


        if(file.headers.meta.stringTableSize > 0){
            let typeDataBuffer = buffer.slice(file.headers.meta.stringTableOffset);
            file.stringTable = dissolveHelpers.parseBuffer(typeDataBuffer, this.getStringTableParser(file.headers.meta.stringTableSize));
        }

        if(file.headers.meta.typeTableSize > 0){
            let typeTableBuffer = buffer.slice(file.headers.meta.typeTableOffset);
            file.typeTable = dissolveHelpers.parseBuffer(typeTableBuffer, this.getTypeTableParser(file.stringTable, file.headers.meta.typeTableSize));
            this.populateTypeInfo(file.stringTable, file.typeTable);
        }

        if(file.headers.meta.instanceTableSize > 0){
            let instanceTableBuffer = buffer.slice(file.headers.meta.instanceTableOffset);
            file.instanceTable = dissolveHelpers.parseBuffer(instanceTableBuffer, this.getInstanceTableParser(file.stringTable, file.headers.meta.instanceTableSize));
        }

        if(file.headers.meta.stringHashTableSize > 0){
            let stringHashTableBuffer = buffer.slice(file.headers.meta.stringHashTableOffset);
            file.stringHashTable = dissolveHelpers.parseBuffer(stringHashTableBuffer, this.getStringHashTableParser(file.stringTable, file.headers.meta.stringHashTableSize));
        }

        if(file.instanceTable && file.typeTable){
            file.instanceTable.forEach(instance => {
                instance.type = file.typeTable.find(type => type.namehash === instance.typehash);
                if(!instance.type)
                    throw new TypeError(`No Type found for Instance of ${instance.typehash}`);
            });
        }

        if(file.instanceTable){
            file.instances = file.instanceTable.map(instance => {
                let instanceBuffer = buffer.slice(instance.offset, instance.offset + instance.size);
                if(instanceBuffer.length !== instance.size)
                    throw new TypeError(`Expected instance ${instance.name} to be of length ${instance.size}, found ${instanceBuffer.length}`);

                let instanceParser = typeDefinitionData.getParserForType(instance.type);
                return instanceParser.parse(instanceBuffer, file, instance);
            });
        }


        return new AdfFile(file);
    }

    static populateTypeInfo(stringTable, typeTable){
        typeTable.map(type => {
            if(type.type === typeDefinitionData.TYPES.structure && type.members){
                type.members.map(member => {
                    member.type = typeTable.find(searchType => searchType.namehash === member.typehash);
                    return member;
                });
            } else if (type.type === typeDefinitionData.TYPES.array) {
                type.elementType = typeTable.find(searchType => searchType.namehash === type.elementTypeHash);
            }
            return type;
        });
        console.log(JSON.stringify(typeTable, true, "  "));
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
                    .uint32('instanceTableSize')
                    .uint32('instanceTableOffset')
                    .uint32('typeTableSize')
                    .uint32('typeTableOffset')
                    .uint32('stringHashTableSize')
                    .uint32('stringHashTableOffset')
                    .uint32('stringTableSize')
                    .uint32('stringTableOffset')
                    .uint32('addressedFileSize');
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
            .tap(dissolveHelpers.terminated('comment'))
            .tap(dissolveHelpers.arrayToString('comment'))
    }

    static getStringTableParser(tableLength){
        let currentEntry = 0;

        return Dissolve()
            .loop('sizes', function(end){
                this.uint8('size');

                if(++currentEntry > tableLength - 1){
                    currentEntry = 0;
                    end();
                }
            })
            .loop('strings', function(end){
                this
                    .string('value', this.vars_list[0].sizes[currentEntry].size)
                    .uint8('terminator')
                    .tap(assert.equal('terminator', 0));

                if(++currentEntry > this.vars_list[0].sizes.length - 1){
                    end();
                }
            })
            .tap(function(){
                this.vars = this.vars.strings.map(str => str.value);
            });
    }

    static getTypeTableParser(stringTable, tableLength){
        let currentEntry = 0;

        return Dissolve()
            .loop('values', function(end){
                this
                    .uint32('type')
                    .tap(assert.callback('type', typeDefinitionData.isValidType, 'typeDefinition.isValidType'))
                    .tap(assert.inArray('type', typeDefinitionData.VALID_ROOT_TYPES))
                    .uint32('size')
                    .uint32('alignment')
                    .uint32('namehash')
                    .int64('nameStringIndex')
                    .tap(dissolveHelpers.abs('nameStringIndex'))
                    .tap(assert.inArrayBounds('nameStringIndex', stringTable))
                    .tap(dissolveHelpers.getValueFromArray(stringTable, 'nameStringIndex', 'name'))
                    .uint32('flags')
                    .uint32('elementTypeHash')
                    .uint32('elementLength')
                    .tap(function(){
                        typeDefinitionData.parseMeta.call(this, stringTable, this.vars.type)
                    });

                if(++currentEntry > tableLength - 1){
                    end();
                }
            })
            .tap(dissolveHelpers.loopedToArray());
    }

    static getInstanceTableParser(stringTable, tableLength){
        let currentEntry = 0;

        return Dissolve()
            .loop('values', function(end){
                this
                    .uint32('namehash')
                    .uint32('typehash')
                    .uint32('offset')
                    .uint32('size')
                    .int64('nameStringIndex')
                    .tap(dissolveHelpers.abs('nameStringIndex'))
                    .tap(assert.inArrayBounds('nameStringIndex', stringTable))
                    .tap(dissolveHelpers.getValueFromArray(stringTable, 'nameStringIndex', 'name'));

                if(++currentEntry > tableLength - 1){
                    end();
                }
            })
            .tap(dissolveHelpers.loopedToArray());
    }

    static getStringHashTableParser(stringTable, tableLength){
        let currentEntry = 0;

        return Dissolve()
            .loop('values', function(end){
                this
                    .tap(dissolveHelpers.terminated('value'))
                    .uint32('valuehash')
                    .uint32('extra'); // TODO: Unknown

                if(++currentEntry > tableLength - 1){
                    end();
                }
            })
            .tap(dissolveHelpers.loopedToArray());
    }
};
