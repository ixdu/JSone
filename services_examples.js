var time_provider = {
    "out" : {
	"time" : function(time){}
    },
    "in" :{
	//ask for formated timestamp
	"ask_once"  : function(client, format){
	    dsa.send(client, 'time', new Date().milisencds);
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
	"start" : function(client, clock){
	    var time_provider = dsa.lookup(time_provider_uuid);
	    dsa.send(time_provider, 'ask_once', "xxyyzz");
	    dsa.send(time_provider, 'subscribe', "xx yy zz");
	},
	"time" : function(client, time){
	    console.log(time);
	}
    }
}
