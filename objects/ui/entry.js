var uuid = require('../../../modules/uuid.js'),
ui = require('../ui.js'),
part = require('part.js');

module.exports = function(info, dsa, stack){
    this.part = part(info, null, stack);

    if(info.hasOwnProperty('on_text_change'))
	this.part.on_text_change = info.on_text_change;
    if(info.hasOwnProperty('advertisement'))
	this.part.placeholder = info.advertisement;
    if(info.hasOwnProperty('text'))
	this.part.text = info.text;

    this.part.entry = new ui.lowlevel.entry(stack.part, null, stack);
    this.get_value = this.part.entry.get_value;
    this.set_value = this.part.entry.set_value;
    this.set_placeholder = this.part.entry.set_placeholder;

    this.delete = function(){
	
    };
};