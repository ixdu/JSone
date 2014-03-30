/*
 компосайтер должен только предоставлять frame, причём как для их прямого использования,
 так как и для их использования для создания других элементов. Сейчас он также содержит text и
 image, но их реализация должна быть вынесена за пределы compositer, прежде всего логически!
*/

function destroy_ui_tree(ui_tree){
    
}

function modify_ui_tree(comp, base_items, controls, current_tree, update_tree, parent_frame){
    for(key in update_tree){
	if(typeof(update_tree[key]) == 'object'){
	    if(update_tree[key].hasOwnProperty('type')){
		//нужно проверить правильность всех значений, вероятно)))
		current_tree[key] = {};
		current_tree[key].x = update_tree[key].x;
		current_tree[key].y = update_tree[key].y;
		current_tree[key].width = update_tree[key].width;
		current_tree[key].height = update_tree[key].height;
		current_tree[key].z_index = update_tree[key].z_index;
		current_tree[key].new = true;

		var type = update_tree[key].type;

		if(type == 'frame'){		    
		    console.log('modifying frame');
		    if(current_tree[key].new){	
			//creating new frame

			var frame = comp.frame_create(current_tree[key]);
			comp.frame_add(parent_frame, frame);
			current_tree[key]._frame = frame;
		    }else{
			//modifying exists frame
			
		    }
		    if(update_tree[key].hasOwnProperty('childs')){
			current_tree[key].childs = modify_ui_tree(comp, base_items, controls, {}, update_tree[key].childs, current_tree[key]._frame);
		    }
		} else if (base_items.hasOwnProperty(type)){
		    if(type == 'image')
			current_tree[key]['source'] = update_tree[key]['source'];
		    if(current_tree[key].new){	
			//creating new item
			var item = base_items[type].create(current_tree[key]);
			if(item){
			    comp.frame_add(parent_frame, item);
			    current_tree[key]._frame = item;			    
			} else
			    console.log('item declaration is incorrent:', key);
		    } else {
			//modifying exists control
			
		    }
		} else if(controls.hasOwnProperty(type)){
		    //this is just hack, copying specialized fiels must be doing rigth way
		    if(type == 'button')
			current_tree[key]['label'] = update_tree[key]['label'];

		    if(current_tree[key].new){	
			//creating new control

			var control = controls[type].create(current_tree[key]);
//			console.log(current);
			if(control){
			    comp.frame_add(parent_frame, control);
			    current_tree[key]._frame = control;			    
			} else
			    console.log('control declaration is incorrent:', key);

		    } else {
			//modifying exists control
			
		    }
		} else 
		    console.log('this type of ui element is not supported: ', type);

	    }else if(update_tree[key] == null)
		destroy_ui_tree(current_tree); //deleting any parts of typee - is just null assigned to head of parts
	    else
		console.log('type field must be setten within ', key);

	}else
	    console.log('type of ', key, ' must be object');
    }
}

exports.init = function(env, context, send, react, sequence){
    var comp = env.capsule.modules.ui.Compositer.create();
    var base_items = env.capsule.modules.ui.base_items.create(comp);
    var ocontrols =  env.dsa.parts.ui.overlay_controls.create(comp, base_items, sequence);
    var ncontrols = env.dsa.parts.ui.native_controls.create(comp, sequence);

    react("init",
	  function(next, controls_type){
	      if(controls_type == 'native')
		  context.set('controls_type', 'native');
	      else 
		  context.set('controls_type', 'overlay');

	      context.set('root', {});
	      context.set("elems", []);
	  });

    //change ui tree. Main point to create new elements, delete old, change relations and properties.
   //ui_tree - this is json definition of nested simple ui elements like buttons, entry, labels
    react("update",
	 function(next, update_tree){
	     var controls = context.get('controls_type') == 'native' ? ncontrols : ocontrols;

	     context.set('root', modify_ui_tree(comp, base_items, controls, context.get('root'), update_tree, 0));
	 });

    //export part of ui tree to json. Export_pattern used for detection of parts tree to export. Whole
    //tree exporting is allowed
    react("export",
	 function(next, export_pattern){
	 });
    

    react("hide_element",
	  function(next, element_id){
	  });
    
    react("show_hide",
	  function(next){
	      var elems = context.get("elems");
	      
	      if(context.get('visible') == true){
		  context.set('visible', false);
		  comp.change_prop(0, { "opacity" : "100%" });
		  for(elem in elems)
		      send(elems[elem].client, 'visible', 'true');
	      }else{
		  context.set('visible', true);
		  comp.change_prop(0, {"opacity" : "0%"});		  
		  for(elem in elems)
		      send(elems[elem].client, 'visible', 'false');
	      }
	      
	  });
}
