let util = {

};
util.title = function (title) {
    title = title ? title : 'iView project';
    window.document.title = title;
};

util.IdExist = function (id, object) {
    for (let key in object) {
        if (id.toString() == key.toString()) {
            return true
        }
    }
    return false
}


export default util;