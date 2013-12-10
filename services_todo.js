//this file consist the definitions of modules which must be implemented in the future


///searcher

var object_info = {
    'key' : '',
    'size' : null
}

//client

function resource_searcher(){
    this.search_exists = function(object_info){
	return storage;	
    }

    this.search_new = function(object_info){
	return storage
    }

}

function cloud_object(){
    this.write = function(object_info, object, offset, length){
	
    }

    this.read = function(object_info, offset, length){
	return object;
    }

    this.get_accessable_link = function(object_info){
	return link;
    }    
}

function storage(){
    this.can_create = function(object_info){
	//return boolean;
    }
    this.create = function(object_info, object){
	
    }

    this.get = function(object_info){
    }

}

//server

function searcher_setter(type, info){
    this.exists_set = function(storage, id){
    }

    this.new_set = function(storage, max_object_info){}
}

function storage_manager(type, address_to_listen, modules){
    this.start = function(){
    }
    
    this.publish = function(){
	//using searcher_setter
    }

    this.stop = function(){
	//delete all my info from searcher_settter
    }
}