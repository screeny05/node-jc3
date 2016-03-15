const _ = require('lazy.js');

module.exports = class HashNamesFile {
    static LINE_REGEX = /(0x[0-9a-fA-F]+?)\s+(0x[0-9a-fA-F]+?)\s+(0x[0-9a-fA-F]+?)\s+(?:0x[0-9a-fA-F]+?)\s+(.*)/;

    constructor(data){
        this.data = data;
    }

    static deserialize(buffer){
        let data = buffer.toString('utf8');
        data = _(data.split('\n'))
            .map(line => line.trim())
            .map(line => line.match(this.LINE_REGEX))
            .filter(match => match !== null)
            .map(match => { return { hash: match[1], offset: match[2], size: match[3], name: match[4] } })
            .value();
        return new HashNamesFile(data);
    }
};
