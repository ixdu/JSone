var trecord = require('types/record'); 

var player;

function tplayer(state){
    var pcontrol;
    this.get_state = function(){
	return {
	    loaded_object : pcontrol.get_loaded_object(),
	    state : pcontrol.get_state(),
	    position : pcontrol.get_position(),
	    volume : pcontrol.get_volume()	    
	};
    };

    this.destroy = function(){
    };
};

exports.serivce['media_player'] = {
    //загрузить объект из источника
    load : function(source, id){
	
    },
    start : function(){
    },
    stop : function(){
    },
    //перемотать
    seek : function(timesec){
    },
    //установить уровень звука
    volume : function(new_volume){
    }
};

exports.service['state'] = {
    start : function(sprout, stack, image){
	if(typeof image == 'undefined'){
	    player = new tplayer();
	} else {
	    player = new tplayer(image);
	}
    },
    stop : function(){
	player.destroy();
    },
    save : function(sprout, stack, image){
	var pimage = new trecord();
	pimage.data = player.get_state();
	pimage.update();
	image.services['player'] = pimage;
    }
};
