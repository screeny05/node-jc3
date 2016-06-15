const lodash = require('lodash');

exports.TYPE_IDS = {
    primitive:   0x00,
    structure:   0x01,
    pointer:     0x02,
    array:       0x03,
    inlineArray: 0x04,
    string:      0x05,
    bitField:    0x07,
    enumeration: 0x08,
    stringHash:  0x09
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
    float:  4,
    double: 4
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

exports.TYPE_IDS_BY_ID = lodash.invert(exports.TYPE_IDS);
exports.PRIMITIVE_TYPE_IDS_BY_ID = lodash.invert(exports.PRIMITIVE_TYPE_IDS);
