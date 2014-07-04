/*
 * Реализация концепции ui, где каждый элемент представлен объектом, интегрированным с sprout.
 * Главная задача в том, чтобы небыло никакой разницы при формировании ui для различных 
 * устройств(от 1,5 до 60 дюймов), используя один набор инструментов
 */

function ll_pc_init(){
    return {
	label : require('./ui/ll/native/label.js'),
	button : require('./ui/ll/native/button.js'),
//    ui.button = require('./ui/ll/overlay/button.js');
	entry : require('./ui/ll/native/entry.js'),
//    ui.panel = require('./ui/ll/overlay/panel.js'),
	container : require('./ui/ll/overlay/container.js')
    };
}

function hl_init(){
    return {
	card : require('./ui/card.js'),
	menu : require('./ui/menu.js'),
        click : require('./ui/click.js'),
	entry : require('./ui/entry.js')	
    };
}

exports.block_size = { width : 40, height : 30 };

exports.lowlevel = null;
exports.highlevel = null;
;
exports.init = function(style){
    if(style == 'pc') //personal computer interface
	exports.lowlevel = ll_pc_init();    
    
    if(exports.lowlevel != null)
	exports.highlevel = hl_init();
};

exports.block_size_ask = function(callback){
    var ll = exports.lowlevel, ask_container;
    
    var stack = [];
    ask_container = new ll.container({
					 x : '15%',
					 y : '5%',
					 width : '70%',
					 height : '90%',
					 on_destroy : callback
				     }, null, stack);
    function _finish_ask(){
	ask_container.destroy();
    }

    new ll.label({
		     x : '0%',
		     width : '100%',
		     height : '30px',
		     
		     text : 'Выберите подходящий размер'
		 }, null, stack);
    new ll.button({
		      x : '0%',
		      y : '30px',
		      width : '120px',
		      height : '30px',
		      label : 'Такой',
		      on_press : function(){
			  exports.block_size = { width : 120, 
						 height : 30 };
			  _finish_ask();
		      }
		  }, null ,stack);

    new ll.button({
		      x : '0%',
		      y : '62px',
		      width : '200px',
		      height : '60px',
		      label : 'Сякой',
		      on_press : function(){
			  exports.block_size = { width : 200, 
						 height : 60 };
			  _finish_ask();
		      }
		  }, null, stack);
    new ll.button({
		      x : '0%',
		      y : '124px',
		      width : '400px',
		      height : '100px',
		      label : 'Этакий',
		      on_press : function(){
			  exports.block_size = { width : 400, 
						 height : 100 };
			  _finish_ask();
		      }
		  }, null, stack);
    new ll.button({
		      x : '0%',
		      y : '226px',
		      width : '600px',
		      height : '140px',
		      label : 'Большой',
		      on_press : function(){
			  exports.block_size = { width : 600, 
						 height : 140 };
			  _finish_ask();
		      }
		  }, null, stack);
};
