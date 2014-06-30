/*
 * Implementation of part(element, item) abstraction
 * 
 * Часть - это фрагмент menu или card. Каждая часть может занимать какое-то пространство, обозначаемое
 * числом от 1 до 10. Размер это всего лишь предпочитаемая величина. Помимо размера возможно назначить 
 * приоритет для вертикального и горизонтального отображения.
 * С помощью частей формируется весь ui, располагая эти части либо в виде элементов меню, либо в виде
 * содержимого card. 
 */

exports.init = function(env, dsa, ui){
    dsa.on('part_create',
	  function(sprout, stack, info, add_to){
	      var block_size = dsa.context.get('block_size');

	      if(!info.hasOwnProperty('type')){
		  console.log('type of part is not setted');
		  return false;
	      };
	      if(!info.hasOwnProperty('width')){
		  console.log('width of part is not setted');
		  return false;
	      };
	      if(!info.hasOwnProperty('height')){
		  console.log('height of part is not setted');
		  return false;
	      };

	      stack['part'] = {
		  width : (info.width * block_size.width),
		  height : (info.height * block_size.height)
	      };

	      if(info.hasOwnProperty('row'))
		  stack.part.row = info.row;

	      function ui_item_creator(sprout, stack){
		  var info = stack.part;
		  info.width += 'px';
		  info.height += 'px';
		  info.x = stack.part_position.x  + 'px';
		  info.y = stack.part_position.y  + 'px';
		  sprout.msg(stack.ui_service, 'create', info).run(stack);		  
	      }

	      switch(info.type){
	      case 'text_input' :
		  //something like a entry
		  with(dsa.sprout){
		      stack['ui_service'] = ui.entry;
		      stack.part.placeholder = info.advetisement;

		      msg(dsa.context.service, 'card_alloc_space').sprout(
			  f(ui_item_creator)
		      ).run(stack);
		  }
		  break;
		  
	      case 'click_item' : 
		  //button, list click item or something else
		  with(dsa.sprout){
		      stack['ui_service'] = ui.button;
		      stack.part.label = info.label;
		      stack.part.on_pressed = info.on_pressed;

		      msg(dsa.context.service, 'card_alloc_space').sprout(
			  f(ui_item_creator)
		      ).run(stack);
		  }
		  break;
	      };
	  });

    dsa.on('part_delete',
	  function(sprout,stack, id){
	  });
};