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
ui = require('../ui.js'),
part = require('part.js');

module.exports = function(info, dsa, stack){
    var new_info = this.part = part(info, null, stack);
    new_info.label = info.label;
    new_info.on_press = info.on_click;
 
    this.part.button = new ui.lowlevel.button(new_info, null, stack);

    this.delete = function(){
	
    };
};