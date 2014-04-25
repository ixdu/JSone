/*
 * Button native widget
 * 
 * properties : state, label, activated
 * 
 * events: pressed, unpressed
 */

exports.init = function(env, dsa){
    var ui = env.dsa.parts.ui.get(env);
    var buttons = [];

    dsa.on("create", 
	   function(sprout, stack, info){
	       var button = {
		   pressed : false
	       };
	       
	       if(info.hasOwnProperty('on_pressed'))
		   button.on_pressed = info.on_pressed;
	       
	       button._item = ui.comp.button_create(info); 

	       buttons[button._item] = button;

	       ui.comp.button_get_control(button._item).on_pressed(
		   function(){
		       if(button.hasOwnProperty('on_pressed')){
			   dsa.sprout.run(button.on_pressed);
		       }						  
		   });
	       
	       if(stack['parent'] != undefined)
		   ui.comp.frame_add(stack['parent'].frame, button._item);
	       else {
		   ui.comp.frame_add(0, button._frame);
	       }
	   });
    
    dsa.on("destroy",
	   function(sprout, stack, id){
//	       comp.frame_remove(parent, button._item);
	       ui.comp.button_destroy(id);

	   });

    dsa.on("update",
	   function(sprout, stack, id, updating_info){
	       
	   });
}