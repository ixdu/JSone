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

var root,
    prev_card,
    cur_card,
    cur_layer,
    cards = {},
    cur_x = 0;

module.exports = function(info, dsa, stack){
    var block_size = stack.block_size,
    id = uuid.generate_str(),
    card = this.card = {
	geometry : {
	    x : '10%',
	    y : '10%',
//	    x : typeof cur_card == 'undefined' ? 0 : 
//		cur_card.geometry.x + cur_card.geometry.width > 800 ? 0 :
//		cur_card.geometry.x + cur_card.geometry.width
//		+ 'px',
//	    y : typeof cur_card == 'undefined' ? 0 : 
//		cur_card.geometry.y + cur_card.geometry.height > 500 ? 0 :
//		cur_card.geometry.y + cur_card.geometry.height
//		+ 'px',
	    width : '80%', //нужно менять свой размер в card_alloc_space
	    height : '80%'
	},
	prev_sprout : [],
	sprout : [],
	cur_offset_x : 0,
	cur_offset_y : 0,
	cur_part_y : 0
    };
    
    cards[id] = card;
    
    if(typeof(cur_card) != 'undefined'){
	if(typeof(prev_card) != 'undefined')
	    prev_card.prev_sprout.push(cur_card);
	prev_card = cur_card;
	cur_card.sprout.push(card);
	card.prev_sprout.push(cur_card);		   
    }
    
    cur_card = card;
    
    stack['card'] = this;
    
    card.container = new ui.lowlevel.container(card.geometry, null, stack);
    
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
	this.card.container.destroy();
    };    
};