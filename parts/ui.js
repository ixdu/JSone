/*
 компосайтер должен только предоставлять frame, причём как для их прямого использования,
 так как и для их использования для создания других элементов. Сейчас он также содержит text и
 image, но их реализация должна быть вынесена за пределы compositer, прежде всего логически!
*/

var ui = null;

exports.get = function(env){
    if(ui != null)
	return ui;

    var _comp = env.capsule.modules.ui.Compositer.create();
    _comp.events_callback_set(function (elementId, eventName, eventData) {
				  console.log("event is happend", elementId, eventName);
			      });

    return ui = {
	comp : _comp,
	base_items : env.capsule.modules.ui.base_items.create(_comp)	
    };
};

//    var ncontrols = env.dsa.parts.ui.native_controls.create(comp, sequence);
