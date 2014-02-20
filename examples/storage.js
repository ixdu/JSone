var storage = {
    "in" : {
	"read" : function(uuid){
	    
	},
	"write" : function(uuid, data){},
	//Для перевариваемых объёмов данных, примерно <2 мб применяется запись последовательности изменения, log вариант, для этого активно используется append
	"append" : function(uuid, data){}
    },
    "out" : {
	"object_readed" : function(uuid){},
	"object_written" : function(uuid){}
    }
}

// log structured merge
function lsmer(){
    //assemble data structure from log of data updating process
    this.assemble = function(updating_tree){
	return data;
    }
    //checking of correctness of updating_tree
    this.verify = function(updating_tree){
	return true;
    }
    //optimizing of updating tree for compact and reading speedups purpose
    this.optimize = function(updating_tree){
	return optimized_updating_tree;
    }
}

function verify_contact(contact){
    //здесь должна быть проверка всех полей контакта на верность
    return null;
}
var contacts = {
    "_id" : 'uuid',
    "in" : {
	"create_contact" : function(contact){
	    if(verify_contact(contact))
		dsa.send(client, 'incorrect_contact', contact);
	    var uuid = modules.uuid.generate_str();
	    var updating_tree = {
		peoples : {
		    uuid : contact
		}
	    }
	    dsa.send('storage', 'append', _id, updating_tree);
	},
	"update_contact" : function(client, contact_id, contact){
	    //тут надо бы ещё проверить есть ли такой контакт уже в контактах или нет
	    if(verify_contact(contact))
		dsa.send(client, 'incorrect_contact', contact, contact_id);
	    //проверяем что надо добавить и что изменить
	    // cоставляем последовательность изменений
	    // что-то вроде { "name" : deleted, "phone" : { "type" : "skype", "addr" : "ix@2du.ru"}}
	    // то есть дерево изменений такое же как основное, но содержит изменения - новые значения и удаления значений
	    // Фактически, ничего не удаляется, просто происходит рост данных, а для того, чтобы получить
	    // последнее состояние надо просто подгрузить данные и все деревья изменений.
	    // 
	    dsa.send('storage', 'append', contact_id, updating_tree);	    
	}
    },
    "out" : {
	"incorrect_contact" : function(contact){}
    }
}
var client = {
    "in" : {
	"main" : function(client){
	    dsa.send('contacts', 'update_contact', contact_id, { "phone" : { "type" : 'skype', "addr" : 'ix@2du.ru' }});
	},
	"incorrect_contact" : function(client, contact, contact_id){
	    console.log('то ли с полями контакта для поиска не то что-то, то ли не существует');
//	    dsa.send('contacts', 'create_contact', contact);
	}
    }
}