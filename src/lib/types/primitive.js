const Corrode = require('../corrode');

const types = require('../data/types');

const getStringParser = function(){

};

const getNumberParser = function(){

};

/**
 * @return number|string
 */
module.exports = function(type){
    if(type === types.PRIMITIVE_IDS.string){
        return getStringParser();
    } else {
        return getStringParser();
    }
};
