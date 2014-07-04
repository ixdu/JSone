/*
 * Implementation of part(element, item) abstraction
 * 
 * Часть - это фрагмент menu или card. Каждая часть может занимать какое-то пространство, обозначаемое
 * числом от 1 до 10. Размер это всего лишь предпочитаемая величина. Помимо размера возможно назначить 
 * приоритет для вертикального и горизонтального отображения.
 * С помощью частей формируется весь ui, располагая эти части либо в виде элементов меню, либо в виде
 * содержимого card. 
 */

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
	label : info.label,
	on_press : info.on_press,
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

    this.part.button = new ui.lowlevel.button(stack.part, null, stack);

    this.delete = function(){
	
    };
};