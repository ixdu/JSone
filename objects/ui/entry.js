var uuid = require('../../../modules/uuid.js'),
ui = require('../ui.js');

module.exports = function(info, dsa, stack){
    var block_size = ui.block_size;
    
    if(!info.hasOwnProperty('width')){
	console.log('width of part is not setted');
	return false;
    };
    if(!info.hasOwnProperty('height')){
	console.log('height of part is not setted');
	return false;
    };
    
    stack['part'] = this.part = {
	placeholder : info.advertisement,
	width : (info.width * block_size.width),
	height : (info.height * block_size.height)
    };
    
    if(info.hasOwnProperty('row'))
	stack.part.row = info.row;
    stack.card.alloc_space(stack);

    var info = stack.part;
    info.width += 'px';
    info.height += 'px';
    info.x = stack.part_position.x  + 'px';
    info.y = stack.part_position.y  + 'px';

    stack.part.placeholder = info.placeholder;

    stack.part.on_text_change = info.on_text_change;
    
    this.part.entry = new ui.lowlevel.entry(stack.part, null, stack);

    dsa.on('part_delete',
	  function(sprout,stack, id){
	  });
};