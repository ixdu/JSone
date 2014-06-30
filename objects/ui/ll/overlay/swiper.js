/*
 * Swiper proto - prototype of panel with swipe effect
 * 
 * status : without disabling drag and drop - impossible to implement
 * 
 * properties: orientation,
 * 
 * events: 
 */

function sliding(comp, frame){
    var cur_x = 0,
        cur_y = 0;
    
    
    var anim_slide_up = [{
			     duration : 100,
			     actions : {
				 y : 1
			     }
			 }];

    var started = false;
    
    this.start = function(){
	started = true;
    };

    this.stop = function(){
	started = false;
    };

    this.action = function(x, y){
	if(started){
	    anim_slide_up[0].actions.y = y - cur_y;
	    var anim = comp.anim_create(anim_slide_up);
	    var banim = comp.anim_bind(frame, anim);
	    comp.anim_start(banim);		    
	}
    };   
}

exports.init = function(env, context, send, react, sprout){
    var ui = env.dsa.parts.ui.get(env);
    var swipers = [];

    react("create",
	  function(stack, info, add_to){
	      var swiper = {
		  "orientation" : "vertical"
	      };
	      
	      swiper._frame = ui.comp.frame_create(info);
	      var _sliding = new sliding(ui.comp, swiper._frame);
	      swiper[swiper._frame] = swiper;
              
	      swiper.bg_image = ui.comp.image_create({
						      width : '100%',
						      height : '100%',

						      x : '0%',
						      y : '0%',

						      z_index : 1,
						      source : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAMSURBVBhXY2D4zwAAAgIBANHTRkQAAAAASUVORK5CYII='	
 						  });
	      ui.comp.frame_add(swiper._frame, swiper.bg_image);


	      ui.comp.event_register(swiper._frame, 'pointer_down');
	      ui.comp.event_register(swiper._frame, 'pointer_up');
	      ui.comp.event_register(swiper._frame, 'pointer_motion', function(eventName, eventData){
					 switch(eventName){
					     case 'pointer_down' :
					     _sliding.start();
					     break;

					     case 'pointer_up' :
					     _sliding.stop();
					     break;
					     case 'pointer_motion' :
					     _sliding.action(eventData.pointer_obj.x, eventData.pointer_obj.y);
					     break;
					 }
				     })

	      if(typeof(add_to) == 'string')
		  ui.comp.frame_add(stack[add_to], swiper._frame);

	      return swiper._frame;
	  });

    react("add",
	 function(stack, id, child){
	     ui.comp.frame_add(id, child); 
	 });

    react("update",
	  function(stack, id, updating_info){
	      
	  });

    react("destroy",
	  function(stack, id){
	  });
}
