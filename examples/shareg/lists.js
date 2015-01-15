exports.serivce['media_source'] = {
    //возвращает media объект одного из поддерживаемых capsule типов
    get_media : function(id){
    },
    //возвращает следующий объект. lists сам решает что значит следующий(это может быть реально следующий
    //объект, а может быть следующий media объект, если следующий не media. А может быть произвольный объект(shuffle)
    get_next_media : function(){
    },
    //как предыдущий, но возвращает предшествующий
    get_prev_media : function(){
    }
};

exports.service['state'] = {
    start : function(){
    },
    stop : function(){
    },
    save : function(){
    },
    restore : function(image){
    }
};
