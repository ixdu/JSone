var uuid1 = modules.uuid.generate_bin();
mq1.on(uuid1, function(msg){
	   console.log(msg);
});

var uuid2 = modules.uuid.generate_bin();
mq2.on(uuid2, function(msg){
	   console.log(msg);
})

mq2.send(uuid1, 'hello one');
mq1.send(uuid2, 'hello two');
