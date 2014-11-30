/*
 * implementation of sharing context by objects and services
 * Context is object which is consisted from other objects(commonly is stack and dsa object).
 * Any context can be current but only one
 */

var contexts = {},
current;

/*
 * getter and setter of current context
 * 
 * @context - context object or undefined. If undefined then getter
 */
exports.current = function(context){
    if(typeof context == 'object')
	current = context;
};

exports.get = function(name){
    if(contexts.hasOwnProperty(name))
	return contexts[name];
    return contexts[name] = {stack : []};
};