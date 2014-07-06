var uuid = require('../../../modules/uuid.js'),
ui = require('../ui.js'),
part = require('part.js');

module.exports = function(info, dsa, stack){
    var new_info = this.part = part(info, null, stack);

    new_info.on_text_change = info.on_text_change,
    new_info.placeholder = info.advertisement,

    this.part.entry = new ui.lowlevel.entry(stack.part, null, stack);
    this.get_value = this.part.entry.get_value;
    this.set_value = this.part.entry.set_value;
    this.set_placeholder = this.part.entry.set_placeholder;

    this.delete = function(){
	
    };
};