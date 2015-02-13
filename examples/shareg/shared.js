/*
 * module for storing shared objects by other blocks application
 */

var objects = [];

exports.set = function(name, object){
    objects[name] = object;
};

exports.get = function(name){
    return objects[name];  
};