module.exports = class BinaryHelper {
    static assertEqual(key, value){
        return function(){
            if(this.vars[key] !== value)
                throw new TypeError('binary assert failed');
        }
    }
    static assertAllEqual(key, value){
        return function(){
            let isSane = Object.keys(this.vars[key]).filter(subkey => typeof this.vars[key][subkey] === typeof value && key !== "__proto__" && this.vars[key][subkey] !== value).length === 0;
            if(!isSane)
                throw new TypeError('binary assert-all failed');
        }
    }
};
