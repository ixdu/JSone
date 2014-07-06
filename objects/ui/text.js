/*
 * Implementation of text part which is representing many line text
 */
var ui = require('../ui.js'),
part = require('part.js');

module.exports = function(info, dsa, stack){
    var new_info = this.part = part(info, null, stack);
    new_info.text = info.text;

    this.part.label = new ui.lowlevel.label(new_info, null, stack);

    this.delete = function(){
	
    };    
};