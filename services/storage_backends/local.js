/*
 * Storage backend that using capsule/storage api for update and extract.
 * Useful for stanalone applications(like a applets) or client-server applications like a web site and 
 * web server side
 *   
 */

exports.init = function(env, dsa){
    if(env.capsule.modules.hasOwnProperty('storage')){
	var storage = env.capsule.modules.storage;
	dsa.on('update', function(stack, id, updating_tree){
		   return storage.extract(id, updating_tree);
	       });
	dsa.on('extract', function(stack, id, mask_tree){
		   return storage.extract(id, mask_tree);
	       });
	dsa.on('delete', function(stack, id){
		   return storage.delete(id);
	       });
    } else 
	console.log('local storage is not exists');
}