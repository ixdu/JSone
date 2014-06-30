/*
 * Implementation of card abstraction
 * 
 * Card - это что-то вроде колоды карт, стека карт, причём этакого объёмного стека, карта это как листик 
 * дерева.  В зависимости от условий дерево может быть отображено как дерево, стек, сетка, список, пара 
 * списков или как-то иначе. В сущности, чем примитивнее способ отображения(например маленький экран 
 * телефона), тем проще отображение, тем оно последовательнее и меньше, вплоть до списка.  
 */

exports.init = function(env, dsa, ui){
    var root,
        prev_card,
        cur_card,
        cur_layer,
        cards = {},
    cur_x = 0;
    
    dsa.on('card_create', 
	   function(sprout, stack, info){
	       var block_size = dsa.context.get('block_size');
	       //alert(JSON.stringify(stack.parent));
	       var id = env.capsule.modules.uuid.generate_str(),
	           card = {
		       geometry : {
			   x : typeof cur_card == 'undefined' ? 0 : 
			           cur_card.geometry.x + cur_card.geometry.width > 800 ? 0 :
			           cur_card.geometry.x + cur_card.geometry.width
			       + 'px',
			   y : typeof cur_card == 'undefined' ? 0 : 
			           cur_card.geometry.y + cur_card.geometry.height > 500 ? 0 :
			           cur_card.geometry.y + cur_card.geometry.height
			       + 'px',
			   width : '100%', //нужно менять свой размер в card_alloc_space
			   height : '100%'
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

	       stack['card'] = id;

	       dsa.sprout.msg(ui.container, 'create', card.geometry).sprout(sprout).run(stack);

	       return true;	       
	   });

    dsa.on('card_alloc_space', 
	   function(sprout, stack, height){
	       var card = cards[stack['card']];
	       var block_size = dsa.context.get('block_size');

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
	       }
	       else {
		   card.cur_part_y = card.cur_offset_y;
		   card.cur_offset_y += part_height;
		   card.height += part_height;
	       }

	       stack.part_position = {
		   x : card.cur_offset_x,
		   y : card.cur_part_y
	       };

	   });
    dsa.on('card_delete', 
	   function(sprout, stack, id){
	   });    
}