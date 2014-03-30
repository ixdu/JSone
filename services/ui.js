/*
 копосайтер должен только предоставлять frame, причём как для их прямого использования,
 так как и для их использования для создания других элементов. Сейчас он также содержит text и
 image, но их реализация должна быть вынесена за пределы compositer, прежде всего логически!
*/

var comp = new Compositer(); 

var elem_image = {
    "create" : comp.image_create,
    "destroy" : comp.image_destroy
}

var elem_text = {
    "create" : comp.text_create,
    "destroy" : comp.text_destroy
}

//image and text based ui controls

function overlay_controls(){
    this.image = elem_image;

    this.text = elem_text;

    /*
     * Button widget
     * 
     * properties : state, label, activated
     * 
     * events: pressed, unpressed
     */
    this.button = {
	"create" : function(info){
	    return 0;
	},
	"update" : function(updating_info){
	    
	},
	"destroy" : function(){
	}
    }

    /*
     * Entry widget
     * 
     * properties: text, selected_text, read_only, max_length, cursor_position
     * 
     * events: editing_finished, selection_changed, text_changed, cursor_position_changed
     */

    this.entry = {
	"create" : function(info){
	    return 0;
	},
	"update" : function(updating_info){
	    
	},
	"destroy" : function(){
	}
    }
}

var ocontrols = new overlay_controls();

//native ui controls like a button in html or etry in gtk

function native_controls(){
    
}

var ncontrols = new native_controls();

function destroy_ui_tree(ui_tree){
    
}

function modify_ui_tree(controls, current_tree, update_tree, parent_frame){
    for(key in update_tree){
	if(typeof(update_tree[key]) == 'object'){
	    if(update_tree[key].hasOwnProperty('type')){
		//нужно проверить правильность всех значений, вероятно)))
		current_tree[key] = {};
		current_tree[key].x = update_tree[key].x;
		current_tree[key].y = update_tree[key].y;
		current_tree[key].width = update_tree[key].width;
		current_tree[key].heigth = update_tree[key].heigth;
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
			current_tree[key].childs = modify_ui_tree(controls, {}, update_tree[key].childs, parent_frame);
		    }
		} 
		else if (controls.hasOwnProperty(type)){
		    console.log('modifying ', type);
		    //this is just hack, copying specialized fiels must be doing rigth way
		    if(type == 'image')
			current_tree[key]['source'] = update_tree[key]['source'];

		    if(current_tree[key].new){	
			//creating new control

			var control = controls[type].create(current_tree[key]);
//			console.log(current);
			if(control)
			    comp.frame_add(parent_frame, control);
			current_tree[key]._frame = control;
		    }else{
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

exports.init = function(context, send, react, sequence){
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

	     context.set('root', modify_ui_tree(controls, context.get('root'), update_tree, 0));
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
