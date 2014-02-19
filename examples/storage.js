var contacts = {
    "in" : {
	"add_phone" : function(client, name, type, addr){
	    //проверка контакта
	    var item = storage.lookup(name);
	    if(!item)
		dsa.send(client, 'incorrect_contact', contact);
	    storage.update(item, { "phone" : { "type" : type, "addr" : addr }});
	}
    },
    "out" : {
	"incorrect_contact" : function(contact){}
    }
}
var client = {
    "in" : {
	"main" : function(client){
	    dsa.send('contacts', 'add_phone', 'Nikita', 'skype', 'ix@2du.ru');
	},
	"incorrect_contact" : function(client, contact){
	    console.log('то ли с полями контакта для поиска не то что-то, то ли не существует');
	    dsa.send('contacts', 'create_contact', contact);
	}
    }
}