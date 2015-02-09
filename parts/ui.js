/*
 компосайтер должен только предоставлять frame, причём как для их прямого использования,
 так как и для их использования для создания других элементов. Сейчас он также содержит text и
 image, entry, button и video но их реализация должна быть вынесена за пределы compositer, 
 прежде всего логически!
*/

var ui = null;

exports.get = function(){
    if(ui != null)
	return ui;

    var _comp = new (require('modules/ui/Compositer')).Compositer();
    return ui = {
	comp : _comp
    };
};
