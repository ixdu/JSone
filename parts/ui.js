/*
 * Object ui API wrapper around Compositer
 */
var Compositer;

module.exports = function(modules){
    Compositer = require('modules/ui/Compositer');
    //здесь будем подключать модули к Compositer - dnd, filechooser etc
    var comp = new Compositer.Compositer();
    function element_proto(){
	this.on = function(event, callback){
	    if(callback === 'undefined')
		comp.event_unregister(this.id, event);
	    else
		comp.event_register(this.id, event, callback);
	};

	this.remove = function(){
	    comp.frame_remove(this.id);
	};
    }

    function frame(info){
	var children = [];

	this.id = info == undefined? 0 : comp.frame_create(info);
	this.add = function(child){
	    child.parent = this;
	    children.push(child);
	    comp.frame_add(this.id, child.id);	
	};
	this.destroy = function(){
	    for(child in children){
		comp.frame_remove(children[child].id);
		children[child].destroy();
	    }
	    children = undefined;
	    if(this.parent != undefined)
		comp.frame_remove(this.id);
	    comp.frame_destroy(this.id);
	};
    }

    frame.prototype = new element_proto();

    function image(info){
	this.id = comp.image_create(info);
	this.destroy = function(){
	    comp.image_destroy(this.id);
	};    
    }

    image.prototype = new element_proto();

    function text(info){
	this.id = comp.text_create(info);
	this.destroy = function(){
	    comp.text_destroy(this.id);
	};    
    }

    text.prototype = new element_proto();

    function button(info){
	this.id = comp.button_create(info);
	this.destroy = function(){
	    comp.button_destroy(this.id);
	};    
    }

    button.prototype = new element_proto();

    function entry(info){
	this.id = comp.entry_create(info);
	this.control = comp.entry_get_control(this.id);
	this.destroy = function(){
	    comp.entry_destroy(this.id);
	};    
    }    

    entry.prototype = new element_proto();

    return {
	comp : comp,
	root_f : new frame(undefined),
	frame : frame,
	image : image,
	text: text,
	button : button,
	entry: entry	
    };
};

