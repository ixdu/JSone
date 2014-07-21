/*
 * Entry widget
 * 
 * properties: text, selected_text, read_only, max_length, cursor_position
 * 
 * events: editing_finished, selection_changed, text_changed, cursor_position_changed
 */

var ui = require('../../../../parts/ui.js').get(),
entries = [];

module.exports = function(info, dsa, stack){
    var entry = this.entry = {
    };
    
    if(info.hasOwnProperty('on_text_change'))
	entry.on_text_change = info.on_text_change;
    
    entry._frame = ui.comp.frame_create(info);	      
    
    
    entry._entry = ui.comp.entry_create({
					    width : '100%',
					    height: '100%',
					    x : '0%',
					    y : '0%',
					    z_index : 3,
					    opacity : 100,
					    
					    placeholder : info.hasOwnProperty('placeholder') ? info.placeholder : 'please type a text'
					});
    
    ui.comp.frame_add(entry._frame, entry._entry);
    (entry.control = ui.comp.entry_get_control(entry._entry)).on_text_change(function(text){
							       entry.on_text_change(text);
							   });
    if(info.hasOwnProperty('text'))
	entry.control.set_value(info.text);
    
    entries[entry._frame] = entry;
    
    if(stack['parent'] != undefined)
	ui.comp.frame_add(stack['parent'].frame, entry._frame);
    else {
	ui.comp.frame_add(0, entry._frame);
    }

    this.get_value = entry.control.get_value;
    this.set_value = entry.control.set_value;
    this.set_placeholder = entry.control.set_placeholder;

    this.destroy = function(){
    };

    this.add_to = function(parent){
    };
};
