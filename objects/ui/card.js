/*
 * Implementation of card abstraction
 * 
 * Card - это что-то вроде колоды карт, стека карт, причём этакого объёмного стека, карта это как листик 
 * дерева.  В зависимости от условий дерево может быть отображено как дерево, стек, сетка, список, пара 
 * списков или как-то иначе. В сущности, чем примитивнее способ отображения(например маленький экран 
 * телефона), тем проще отображение, тем оно последовательнее и меньше, вплоть до списка.  
 */
var uuid = require('../../../modules/uuid.js');
var ui = require('../ui.js');

function left_up_slide_animate(ui_item){
    var anim_slide = new ui.lowlevel.animation([
						   {
						       duration : 300,
						       actions : {
							   x : -90,
							   y : -90
						       }
						   }
					       ],
					       ui_item, null, []);
    anim_slide.start();
}

var root,
    cards = {},
    cur_card,
    prev_card;

module.exports = function(info, dsa, stack){
    prev_card = typeof cur_card != 'undefined' ? cur_card : undefined;

    var block_size = stack.block_size,
    id = uuid.generate_str(),
    card = this.card = cur_card = {
	name : info.name,
	geometry : {
	    x : '100%',
	    y : '100%',
	    width : '80%', //нужно менять свой размер в card_alloc_space
	    height : '80%'
	},
	cur_offset_x : 0,
	cur_offset_y : 0,
	cur_part_y : 0,

	prev : [],
	next : null
    },
    card_obj = this;
    
    cards[id] = card;
    stack.parent = undefined; //too lowlevel
    card.container = new ui.lowlevel.container(card.geometry, null, stack);

    if(typeof stack['card'] == 'undefined'){
	//adding controls for card navigating
	var _stack = [];
	new ui.lowlevel.label({
				  x : '40%',
				  y : '92%',
				  width : '20%',
				  height : '7%',
				  text : info.name
			      }, null, _stack);
	new ui.lowlevel.button({ 
				   x : '60%',
				   y : '60%',
				   width : '10%',
				   height : '7%',
				   label : 'next',
				   on_press : function(){
				       if(cur_card.next != null){
					   card_obj.hide();
					   cur_card.next.make_current(null, _stack);
				       }
				   }
			       }, null, _stack);
	new ui.lowlevel.button({ 
				   x : '30%',
				   y : '92%',
				   width : '10%',
				   height : '7%',
				   label : 'prev',
				   on_press : function(){
				       if(cur_card.prev.length){	
					   card_obj.hide();
					   cur_card.prev[0].make_current(null, _stack);			   
				       }
				   }
			       }, null, _stack);

	left_up_slide_animate(card.container.container);
    } else {
	left_up_slide_animate(card.container.container);
	left_up_slide_animate(prev_card.container.container);
	card.prev.push(prev_card);
	prev_card.next = this;
    }

    stack['card'] = this;
    
    this.alloc_space = function(stack){
	var card = stack['card'].card;
	var block_size = ui.block_size;
	
	stack['part_position'] = {};
	var part_height = stack.part.height + block_size.height / 10;
	if(stack.part.hasOwnProperty('row') &&
	   stack.part.row){
	    var part_width = stack.part.width + block_size.width/10;
	    if(card.width <= card.cur_offset_x + stack.part.width + block_size.width / 10){
		card.cur_offset_x += part_width;
		card.width += part_width;   
	    } else {
		if(card.width < part_width)
		    card.width += part_width;   
		card.cur_offset_x = 0;
		card.cur_part_y = card.cur_offset_y;
		card.cur_offset_y += part_height;
		card.height += part_height;
	    }		   
	} else {
	    card.cur_part_y = card.cur_offset_y;
	    card.cur_offset_y += part_height;
	    card.height += part_height;
	}
	
	stack.part_position = {
	    x : card.cur_offset_x,
	    y : card.cur_part_y
	};
	
    };

    this.destroy = function(){
//	if(stack.card == this)
//	    stack.card = undefined; //need replace with prev card

	this.card.container.destroy();
    };    

    this.hide = function(dsa, stack){
	
    };

    this.make_current = function(dsa, stack){
    };
};