const lodash = require('lodash');

module.exports = {};

exports.TYPE_IDS = {
    primitive:   0x0,
    structure:   0x1,
    pointer:     0x2,
    array:       0x3,
    inlineArray: 0x4,
    string:      0x5,
    bitField:    0x7,
    enumeration: 0x8,
    stringHash:  0x9
};

exports.PRIMITIVE_TYPE_IDS = {
    string: 0x8955583e,
    float:  0x7515a207,
    double: 0xc609f663,
    uint64: 0xa139e01f,
    sint64: 0xaf41354f,
    uint32: 0x075e4e4f,
    sint32: 0x192fe633,
    uint16: 0x86d152bd,
    sint16: 0xd13fcf93,
    uint8:  0x0ca2821d,
    sint8:  0x580d0a62,
};

exports.PRIMITIVE_TYPE_SIZES = {
    string: NaN,
    uint64: 8,
    sint64: 8,
    uint32: 4,
    sint32: 4,
    uint16: 2,
    uint8:  1,
    sint8:  1,
    float:  4
};

exports.TYPE_IDS_ARRAY = lodash.values(exports.TYPE_IDS);
exports.PRIMITIVE_TYPE_IDS_ARRAY = lodash.values(exports.PRIMITIVE_TYPE_IDS_ARRAY);

exports.VALID_ROOT_TYPE_IDS = [
    exports.TYPE_IDS.structure,
    exports.TYPE_IDS.pointer,
    exports.TYPE_IDS.array,
    exports.TYPE_IDS.inlineArray,
    exports.TYPE_IDS.stringHash
];

exports.ARRAY_LIKE_TYPE_IDS = [
    exports.TYPE_IDS.pointer,
    exports.TYPE_IDS.array,
    exports.TYPE_IDS.inlineArray,
    exports.TYPE_IDS.stringHash
];
