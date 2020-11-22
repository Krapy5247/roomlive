var list = {};
var listbuy = {};
module.exports = {
  getList: function() {
    return list;
  },
  clearList: function() {
    for (var key in list) {
      delete list[key];
    }
    return list;
  },
  buyList: function(){
    return listbuy;
  }
};
