/*
 компосайтер должен только предоставлять frame, причём как для их прямого использования,
 так как и для их использования для создания других элементов. Сейчас он также содержит text и
 image, entry, button и video но их реализация должна быть вынесена за пределы compositer, 
 прежде всего логически!
*/

var ui = null;

exports.get = function(env){
    if(ui != null)
	return ui;

    var _comp = env.capsule.modules.ui.Compositer.create();
 
    return ui = {
	comp : _comp,
	base_items : env.capsule.modules.ui.base_items.create(_comp)	
    };
};

//    var ncontrols = env.dsa.parts.ui.native_controls.create(comp, sequence);
