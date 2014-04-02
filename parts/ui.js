/*
 компосайтер должен только предоставлять frame, причём как для их прямого использования,
 так как и для их использования для создания других элементов. Сейчас он также содержит text и
 image, но их реализация должна быть вынесена за пределы compositer, прежде всего логически!
*/

function ui_tree(comp, parent_frame, base_items, controls){
    function _update(current_tree, update_tree){
	for(key in update_tree){
	    if(typeof(update_tree[key]) == 'object'){
		if(update_tree[key].hasOwnProperty('type')){
		    //нужно проверить правильность всех значений, вероятно)))
		    current_tree[key] = JSON.parse(JSON.stringify(update_tree[key]));
		    if(current_tree.hasOwnProperty(childs))
			delete current_tree.childs;

		    current_tree[key].new = true;

		    var type = update_tree[key].type;

		    if(type == 'frame'){		    
			console.log('modifying frame');
			if(current_tree[key].new){	
			    //creating new frame
			    var frame = comp.frame_create(update_tree[key]);
			    comp.frame_add(parent_frame, frame);
			    current_tree[key]._frame = frame;
			}else{
//			    current_tree[key].item
			    //modifying exists frame
			    
			}
			if(update_tree[key].hasOwnProperty('childs')){
			    current_tree[key].childs = _update(current_tree[key].childs, update_tree[key].childs);
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
			if(type == 'button'){
			    current_tree[key]['label'] = update_tree[key]['label'];
			    current_tree[key].on_pressed = update_tree[key].on_pressed;			
			} else if(type == 'entry'){
			    current_tree[key].on_text_changed = update_tree[key].on_text_changed;
			}

			if(current_tree[key].new){	
			    //creating new control
			    var control = controls[type].create(current_tree[key]);

			    if(control){
				comp.frame_add(parent_frame, control.frame);
				current_tree[key]._frame = control.frame;
				current_tree[key]._control = control;
			    } else
				console.log('control declaration is incorrent:', key);

			} else {
			    //modifying exists control
			    
			}
		    } else 
			console.log('this type of ui element is not supported: ', type);

		}else if(update_tree[key] == null)
		this.destroy(current_tree, key); //deleting any parts of type - is just null assigned to head of parts
		else
		    console.log('type field must be setten within ', key);
		
	    }else
		console.log('type of ', key, ' must be object');
	}	
    };

    this.update = function(update_tree){
    };

}

exports.comp = require('../capsule/modules/ui/Compositer.js').create();
exports.base_items = ('../capsule/modules/ui/base_items.js').create(this.comp);
//    var ncontrols = env.dsa.parts.ui.native_controls.create(comp, sequence);

this.comp.events_callback_set(function (elementId, eventName, eventData) {
				  console.log("event is happend", elementId, eventName);
			      });
