const lodash = require('lodash');
const _ = require('lazy.js');

module.exports = {
    cloneWithoutProto(obj){
        let clonedObject = lodash.cloneDeep(obj);
        if(clonedObject.__proto__)
            delete clonedObject.__proto__;
        return clonedObject;
    },
    parseBuffer(buffer, parser){
        parser.write(buffer);
        return parser.vars_list.length > 0 ? parser.vars_list[0] : parser.vars;
    },
    objectToString(arr, key = 'byte', encoding = 'ascii'){
        return new Buffer(arr.map(el => el[key])).toString(encoding);
    }
};
