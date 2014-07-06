/*
 * Button native widget
 * 
 * properties : state, label, activated
 * 
 * events: pressed, unpressed
 */

var ui, buttons = [];

module.exports = function(info, dsa, stack){
    ui = require('../../../../parts/ui.js').get();

    var button = this.button = {
	pressed : false
    };
	       
    if(info.hasOwnProperty('on_press'))
	button.on_press = info.on_press;
    
    button._item = ui.comp.button_create(info); 
    
    buttons[button._item] = button;
    
    ui.comp.button_get_control(button._item).on_press(
	function(){
	    if(button.hasOwnProperty('on_press')){
		button.on_press();
	    }						  
	});
    
    if(stack['parent'] != undefined)
	ui.comp.frame_add(stack['parent'].frame, button._item);
    else {
	ui.comp.frame_add(0, button._frame);
    }

    this.destroy = function(){
	//	       comp.frame_remove(parent, button._item);
	ui.comp.button_destroy(id);
    };

    this.add_to = function(parent){
    };
};