На данный момент compositer можно рассматривать просто как js объект следующего вида:

```js
function compositer(){

//ui elements
    this.frame_create = function(frame_def){
        return frame_id;
    }
    this.frame_destroy = function (frame_id){
        //return void;
    }

    //root_frame_id == 1
    this.frame_add = function(frame_id, child_id){
        //return void;
    }
    
    this.frame_remove = function(frame_id, child_id){
        //return void;
    }

    this.image_create = function(image_def){
        return image_id;
    }
   
    this.image_destroy = function(image_id){
        //return void;
    }

//ui animation
    this.anim_create = function(chain){
        return anim_id;
    }

    this.anim_destroy = function(anim_id){
        //return void; 
    }

    this.anim_bind = function(element_id, anim_id){
        //return void;
    }

    this.anim_unbind = function(element_id, anim_id){
        //return void;
    }

    this.anim_start = function(element_id, anim_id){
        //return void;
    }

    this.anim_resume = function(element_id, anim_id){
        //return void;
    }

    this.anim_stop = function(element_id, anim_id){
        //return void;
    }

//ui events

    this.event_register = function(element_id, event_name){
        //return void;
    }

    this.event_unregister = function(element_id, event_name){
        //return void;
    }
    
     pointer_obj = {
      pointer_id,
      //позиция указана относительно левого-верхнего угла _текущего_ элемента
      x,
      y
     }
     pointer_in(group_id, pointer_obj[num_of_pointers])
     pointer_out(group_id, pointer_obj[num_of_pointers])
     pointer_down(group_id, pointer_obj[num_of_pointers])
     pointer_up(group_id, pointer_obj[num_of_pointers])
     pointer_motion(group_id, pointer_obj[num_of_pointers])

     focus_in(group_id)
     focus_out(group_id)

     key_obj = {
         group_id,
         keynum
     }  
     key_down(key_obj)
     key_up(key_obj)
     
     on_move(x, y)
     on_resize(width, height)
    
     animation_stopped(anim_id)
    
    //event_callback(element_id, event_name, event_data)
    this.events_callback_set = function(event_callback){
        //return void;
    }

}
```

* Events

** Input events
События устройств ввода: движение курсора, множества курсоров, клавиатурный ввод.
Концепт устройств ввода изначально включает в себя поддержку мультитача, многокурсорности и множества клавиатур. Для этого все устройства ввода принадлежат к какой-то группа. И именно группа обладает понятием
фокуса ввода. Таким образом один комплект мыши и клавиатуры можети быть объеденен в группу 0, а ещё один комплект в группу 1. В итоге будет две группы с разными фокусами ввода, которые могут работать с элементами независимо. Конечно, данная возможность должна поддерживаться платформной, в случае xorg+evas такая поддержка есть, в случае mac os - частичная. Web также поддерживает эту возможность частично. То есть множество указателей в web возможно, но невозможны группы, всегда только одна группа. 
Для целей поддержки любых платформ, группа 0 зарезервированна под использование по умолчанию. Например в случае web все события ввода будут иметь group_id 0, потому как привязать разные устройства ввода к разным группам не представляется возможным. Это не отменяет поддержки мультитача, но делает невозможным использовать множество фокусов.
Каждый указателль имеет уникальный id в рамках группы. В зависимости от поддержки платформы этот уникальный id может быть либо постоянным, либо только в течении motion. Однако этого достаточно для отделения одного указателя от другого.

** pointer
Под указателем понимается любой указатель: мышь, тачпад, планшет, пальцы - любой. События pointer отрабатывают на изменение позиции или другие действия указателей в рамках группы. Например у вас есть две мыши и один палец и вы двигаете ими одновременно: таким образом происходит перемещение 3х указателей и эти перемещения передаются в _одно_ pointer_motion в один момент времени. В этом событии указываются позиции каждого из 3х указателей в некоторый момент времени. 
Таким образом не делается никакого различия между прикасаниями пальцами, мышью или любым другим способом перемещения указателя. Соответственно multitouch жесты будут работать одинаково хорошо как с помощью пальцев, так и с помощью двух трекпоинтов:)
