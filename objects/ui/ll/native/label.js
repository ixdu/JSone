/*
 * Label widget
 * 
 * properties : text, image
 * 
 * events: 
 */

var ui, labels = [];

module.exports = function(info, dsa, stack){

    ui = require('../../../../parts/ui.js').get();

    var label = this.label = {
	text : 'label',
	image : null
    };

    if(info.hasOwnProperty('text'))
	label.text = info.text;
    if(info.hasOwnProperty('image'))
	label.image = info.image;
    
    label._frame = ui.comp.frame_create(info);

    if(label.image == null){
	label.content = ui.base_items.text.create( 
	    {
		"x" : "0%",
		"y" : "0%",
		"width" : "100%",
		"height" : "100%",
		
		"z_index" : 2,
		
		"text" : label.text
	    });
    } else
	label.content = ui.base_items.image.create( 
	    {
		"x" : "0%",
		"y" : "0%",
		"width" : "100%",
		"height" : "100%",
		
		"z_index" : 2,
		
		"source" : label.image
	    });
    

    ui.comp.frame_add(label._frame, label.content);

    if(stack['parent'] != undefined)
	ui.comp.frame_add(stack['parent'].frame, label._frame);
    else {
	ui.comp.frame_add(0, label._frame);
    }


    this.destroy = function(){
	var label = this.label;
	ui.comp.frame_remove(label._frame);
	ui.comp.frame_remove(label.content);
	ui.comp.frame_destroy(label._frame);
	
	if(label.image == null)
	    ui.base_items.text.destroy(label.content);
	else
	    ui.base_items.image.destroy(label.content);
    };

    this.add_to = function(parent){
	ui.comp.frame_add(parent.stack['parent'].frame, label._frame);
    };
};