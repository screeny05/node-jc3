const lodash = require('lodash');

exports.cloneWithoutProto = function(obj){
    let clonedObject = lodash.cloneDeep(obj);
    if(clonedObject.__proto__)
        delete clonedObject.__proto__;
    return clonedObject;
};

exports.tapBindObject = function(obj, ctx){
    return lodash.mapValues(obj, function(fn){
        return function(...args){
            return ctx.tap(fn.bind(ctx, ...args));
        }
    });
};

exports.bindObject = function(obj, ctx){
    return lodash.mapValues(obj, fn => fn.bind(ctx));
};
