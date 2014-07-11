/*
 * A little wrapper around comp.anim to work with ui items more convinient.
 * First attempt to design animation subsystem
 */

var ui;

module.exports = function(chain, ui_item, dsa, stack){
    if(typeof ui == 'undefined')
	ui = require('../../../parts/ui.js').get();
    
    var anim = ui.comp.anim_create(chain),
    banim = ui.comp.anim_bind(ui_item._frame, anim);
    
    this.start = function(){
	ui.comp.anim_start(banim);
    };

    this.destroy = function(){
	ui.comp.anim_unbind(banim);
	ui.comp.anim_destroy(anim);
    };
};