/*
 * Container widget
 * 
 * properties: slide_direction
 * 
 * events: slide
 */

//history, animated part, two and more work frame
/*
	       container._frame2 = ui.comp.frame_create({
							    x : '50%',
							    y : '0%',
							    width : '50%',
							    height : '100%'
							});

	       var move_animations = {
		   
	       };

	       function create_anim_by_x(cur_x){
		   var anim_proto = [{
					 duration : 0,
					 actions : {
					     x : 0
					 }
				     }
				    ];
		   var anim,
		   banim,
		   offset;
		   
		   offset = cur_x - container.prev_x;
		   container.prev_x = cur_x;
		   
		   anim_proto[0].actions.x = offset;
		   container.x += offset;
		   
		   if(typeof(move_animations['xr' + offset]) == 'undefined'){
		       move_animations['xr' + offset] = anim = ui.comp.anim_create(anim_proto);
		       move_animations['bxr' +  offset] = banim = ui.comp.anim_bind(container._parent_frame, anim);
//		       console.log('banim is', anim);
		       ui.comp.event_register(banim, 'animation_stopped');		      
		   } else
		       banim = move_animations['bxr' + offset];

		   ui.comp.anim_start(banim);		  
	       }

//	       ui.comp.event_register(container._parent_frame, 'pointer_motion');
	       ui.comp.event_register(container._parent_frame, 'pointer_up');
	       ui.comp.event_register(container._parent_frame, 'pointer_out');
	       ui.comp.event_register(container._parent_frame, 'pointer_down', function(eventName, eventData){
					  switch(eventName){
					  case 'animation_stopped' :
					      container.animating = false;
					      break;

					  case 'pointer_motion' : 
					      var cur_x = Math.round(eventData.pointer_obj[0].x);
					      if(!container.animating &&
						 container.sliding){
						  container.animating = true;
						  create_anim_by_x(cur_x);
					      }
					      break;

					  case 'pointer_down' :
					      container.prev_x = Math.round(eventData.pointer_obj[0].x);
					      container.sliding = true;
					      break;

					  case 'pointer_up' :
					  case 'pointer_out' :
					      container.sliding = false;
					      break;
					  }
				      });
*/

var ui, containers = [];

function sprout_item(){
    this.sprout = function(){
	console.log(arguments);	
	return {
	    run : function(){}
	};
    };
}

module.exports = function(info, dsa, stack){
    if(typeof ui == 'undefined')
	ui = require('../../../../parts/ui.js').get();

    this.prototype = new sprout_item();
    
    var container = this.container = {
	on_destroy : info.hasOwnProperty('on_destroy') ? info.on_destroy : null,
	//		   on_slide : function(){},
	//		   sliding : false,
	//		   x : 0,
	//		   prev_x : 0,
	//		   animating : false,
	childs : []
    };

    container._frame = ui.comp.frame_create(info);
    if(stack['parent'] != undefined){
	container.parent = stack.parent;
    } else {
	container.parent = { frame : 0 , 
			     geometry : ui.comp.elem_get_geometry(0, true)
			   };
    }
	       
    ui.comp.frame_add(container.parent.frame, container._frame);
    
    stack['parent'] = {
	frame : container._frame,
	geometry : ui.comp.elem_get_geometry(container._frame, true)
    };
    
    containers[container._frame] = container;

    this.destroy = function(){
	var adisappear = ui.comp.anim_create([
						 {
						     duration : 300,
						     actions : {
							 opacity : 100
						     }
						 }
					     ]),
	badisappear = ui.comp.anim_bind(container._frame, adisappear);
	
	ui.comp.event_register(badisappear, 'animation_stopped');
	ui.comp.event_register(container._frame, 'animation_stopped', 
			       function(eventName, eventData){
				   ui.comp.frame_remove(container._frame);
				   
				   ui.comp.frame_destroy(container._frame);
				   //	       for(child_id in container.childs){
				   //		   dsa.send()
				   //	       }
				   stack.parent = container.parent;
				   if(container.on_destroy != null)
				       container.on_destroy(stack);
			       });
	ui.comp.anim_start(badisappear);
	return true;	
    };

    this.make_current = function(stack){
	stack['parent'] ={
	    frame : container._frame,
	    geometry : ui.comp.elem_get_geometry(container._frame, true)
	};    
    };

    this.add = function(child){
//	ui.frame_add(this.container)
//	       childs[id] = type;	
    };
};