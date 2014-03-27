exports.init = function(context, send, react, sequence){
    context.set('hello', 'hoi');
    context.set('important', { "imp" : "очень важно"});

    react("init", function(next, arg1){
	      console.log('init say: ' + arg1);
	      send(context.service, 'pong', "heloo ball");
	  });
	  
    react("ping", function(next, thing){
	      console.log("context gg is: ", context.get('gg'));
	      console.log('ping say: ' + thing);
	  });
    react("pong", function(next, ball){
	      console.log('pong say: ' + ball);
	  });
}