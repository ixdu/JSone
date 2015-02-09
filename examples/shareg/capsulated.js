exports.main = function(env){
    var caravan = require('caravan/init');
    caravan.init();
    var main = caravan.get('shareg/main');    
    main.state_start().run();    
//    var frontend = dsa.get('sphere/frontend'),
//    backend = dsa.get('sphere/backend');
    
//    backend.create().run();
//    frontend.create(backend.id).run([]);
};
