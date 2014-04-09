/*
 * Container widget
 * 
 * properties: slide_direction
 * 
 * events: slide
 */

exports.init = function(env, context, send, react, sprout){
    var ui = env.dsa.parts.ui.get(env);
    var containers = [];

    react("create",
	  function(stack, info, obj, field){
	      var container = {
		  on_slide : function(){},
		  sliding : false,
		  x : 0,
		  animating : false
	      };

	      container._parent_frame = ui.comp.frame_create(info);

	      container._frame1 = ui.comp.frame_create({
						    x : '0%',
						    y : '0%',
						    width : '49%',
						    height : '100%'
						});

	      container._frame2 = ui.comp.frame_create({
						    x : '50%',
						    y : '0%',
						    width : '50%',
						    height : '100%'
						});

	      var sliding_anim_left = ui.comp.anim_create([
							      {
								  duration : 100,
								  actions : {
								      x : -3
								  }
							      }
							  ]);

	      var sliding_anim_right = ui.comp.anim_create([
							      {
								  duration : 100,
								  actions : {
								      x : 3
								  }
							      }
							  ]);

	      var bsliding_anim_left = ui.comp.anim_bind(container._parent_frame, sliding_anim_left);
	      var bsliding_anim_right = ui.comp.anim_bind(container._parent_frame, sliding_anim_right);

	      ui.comp.event_register(bsliding_anim_left, 'animation_stopped');
	      ui.comp.event_register(bsliding_anim_right, 'animation_stopped');
	      ui.comp.event_register(container._parent_frame, 'pointer_motion');
	      ui.comp.event_register(container._parent_frame, 'pointer_up');
	      ui.comp.event_register(container._parent_frame, 'pointer_down', function(eventName, eventData){
					 switch(eventName){
					     case 'animation_stopped' :
					     container.animating = false;
					     break;

					     case 'pointer_motion' : 
					     if(!container.animating &&
						container.sliding){
						 container.animating = true;
						 console.log(JSON.stringify(eventData.pointer_obj[0]));
						 container.x += eventData.pointer_obj[0].x;
						 if(container.x < eventData.pointer_obj[0].x)
						     ui.comp.anim_start(bsliding_anim_right);
						 else
						     ui.comp.anim_start(bsliding_anim_left);
//						 container.x = eventData.pointer_obj[0].x;
					     }
					     break;

					     case 'pointer_down' :
					     container.x = eventData.pointer_obj[0].x;
					     container.sliding = true;
					     break;

					     case 'pointer_up' :
					     container.x = 0;
					     container.sliding = false;
					     break;
					 }
				     });

	      ui.comp.frame_add(container._parent_frame, container._frame1);
	      ui.comp.frame_add(container._parent_frame, container._frame2);
	      ui.comp.frame_add(stack[obj][field], container._parent_frame);
//	      ui.comp.anim_start(bsliding_anim_left);
//	      ui.comp.anim_start(bsliding_anim_right);

	      return {
		  _frame1 : container._frame1,
		  _frame2 : container._frame2
	      };
	  });
}