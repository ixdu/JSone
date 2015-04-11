var shared = require('shareg/shared'),
ui;

exports.init = function(_cn){
    _cn.on('state_start', function(sprout, stack, image){
	       ui = require('shareg/shared').get('ui');

	       var list = tlist({
				    x : '30%',
				    y : '20%',
				    width : '40%',
				    height : '70%'		      
				});

	       ui.comp.frame_add(0, list.id);

	       list.insert(3, telement(new ui.button({
					   x : '0%',
					   y : '0%',
					   width : '100%',
					   height : '100%',
					   label : 'добавить',
					   on_press : function(){
					       var _modal = modal(),
					       list_b = new ui.button({
								 x : '0%',
								 y : '60%',
								 width : '100%',
								 height : '30%',
								 label : 'список',
								 on_press : function(){
								     _modal.destroy();
								     elist.form();
								 }
							     });
					       _modal.content.add(list_b); 								} 
				       })));
	  });

    _cn.on('state_stop', function(sprout, stack){
	  });

    _cn.on('state_save', function(sprout, stack, image){
	  });  
};
