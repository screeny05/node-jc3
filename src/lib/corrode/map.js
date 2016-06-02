let bind = function(fn){
    return function(name, src = name){
        this.vars[name] = fn(this.vars[src]);
    };
};

module.exports = {
    map(name, fn){
        this.vars[name] = fn(this.vars[name]);
    },

    fromArray(name, accessible, src = name){
        this.vars[name] = accessible[this.vars[src]];
    },

    abs: bind(Math.abs),
    invert: bind(val => val * -1),
    trim: bind(str => str.trim())
};
