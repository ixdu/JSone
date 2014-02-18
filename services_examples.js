var time_provider = {
    "out" : {
	"time" : function(time){}
    },
    "in" :{
	//ask for formated timestamp
	"ask_once"  : function(client, format){
	    send(client, 'time', new Date().milisencds);
	},
	//ask for formated timestamp every _clock_ miliseconds
	"subscribe" : function(client, format, clock){
	    capsule.timer.js.create(function(){
					//нужно обработать format
					dsa.send(client,'time', new Date().seconds);    
				    }, clock, true)
	}
    }
}

var time_consumer = {
    "in" : {
	"start" : function(clock){
	    var time_provider = manager.get(time_provider_uuid);
	    dsa.on(time_provider, 'time', function(time){
		       console.log(time);
	       })
	    dsa.send(time_provider, 'ask_once', "xxyyzz");
	    dsa.send(time_provider, 'subscribe', "xx yy zz");
	}	
    }
}
