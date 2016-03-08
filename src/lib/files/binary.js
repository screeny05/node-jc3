module.exports = class BinaryFile {
    header = null;

    hasCorrectHeader(){
        return false;
    }

    static deserialize(buffer){
        let parser = this.getParser();
        parser.write(buffer);
        return parser.vars_list.length > 0 ? parser.vars_list[0] : parser.vars;
    }
};
