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

function slide_animate(ui_item, x, y){
    var anim_slide = new ui.lowlevel.animation([					   {
						       duration : 300,
						       actions : {
							   x : x,
							   y : x
						       }
						   }
					       ],
					       ui_item, null, []);
    anim_slide.start();
}

function nav_bar(card){
    var _stack = [],
    cur_card = card,
    label_def = {
	x : '40%',
	y : '92%',
	width : '20%',
	height : '7%',
	text : card.name	
    },
    cur_card_name = new ui.lowlevel.label(label_def, null, _stack),
    next = new ui.lowlevel.button({ 
				      x : '60%',
				      y : '92%',
				      width : '10%',
				      height : '7%',
				      label : 'next',
				      on_press : function(){
					  if(cur_card.next != undefined){
					      slide_animate(cur_card.container.container, -80, -90);
					      slide_animate(cur_card.next.container.container, -80, -90);
					      cur_card = cur_card.next;
					  }
				      }
				  }, null, _stack),
    prev = new ui.lowlevel.button({ 
				      x : '30%',
				      y : '92%',
				      width : '10%',
				      height : '7%',
				      label : 'prev',
				      on_press : function(){
					  if(cur_card.prev.length){	
					      slide_animate(cur_card.container.container, 80, 90);
					      slide_animate(cur_card.prev[0].container.container, 80, 90);
					      cur_card = cur_card.prev[0];
					  }
				      }
				  }, null, _stack);
    
    this.set_current = function(card){
	cur_card = card;
	cur_card_name.destroy();
	label_def.text = card.name;
	cur_card_name = new ui.lowlevel.label(label_def, null, _stack);
    };

    this.destroy = function(){
	cur_card_name.destroy();
	next.destroy();
	prev.destroy();
    };
};

var root,
    cards = {},
    cur_card,
    prev_card,
    nav_bar_obj;

module.exports = function(info, dsa, stack){
    prev_card = typeof cur_card != 'undefined' ? cur_card : undefined;

    var block_size = stack.block_size,
    id = uuid.generate_str(),
    card = this.card = cur_card = {
	name : info.name,
	geometry : {
	    x : '100%',
	    y : '100%',
	    width : '60%', //нужно менять свой размер в card_alloc_space
	    height : '60%'
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
	nav_bar_obj = new nav_bar(card);
	slide_animate(card.container.container, -80, -90);
    } else {
	nav_bar_obj.set_current(card);
	slide_animate(card.container.container, -80, -90);
	slide_animate(prev_card.container.container, -80, -90);
	card.prev.push(prev_card);
	prev_card.next = this.card;
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

    this.hide = function(stack){
	
    };

    this.make_current = function(stack){
	stack['card'] = this;
	this.card.container.make_current(stack);
    };
};