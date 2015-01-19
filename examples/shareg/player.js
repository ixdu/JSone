var trecord = require('types/record'),
    tllplayer = require('parts/player'),
    ui = require('parts/ui');

var player;

function tplayer(state){
    var llplayer = new tllplayer({ type : 'any', 
				   parent_surface : ui.root, 
				   geometry : {
				       x : '0%',
				       y : '0%',
				       width : '50%',
				       height : '50%'
				   }
				 }
				 );
    //create with image
    if(typeof state != 'undefined'){
	llplayer.load(state.loaded_object);
	llplayer.set_state(state.state);
	llplayer.set_position(state.position);
	llplayer.set_volume(state.volume);
    }

    this.get_state = function(){
	return {
	    loaded_object : llplayer.get_loaded_object(),
	    state : llplayer.get_state(),
	    position : llplayer.get_position(),
	    volume : llplayer.get_volume()	    
	};
    };

    this.destroy = function(){
	llplayer.destroy();
    };
};

exports.service['media_player'] = {
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
	    player = new tplayer(image);
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
