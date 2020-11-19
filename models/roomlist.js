var list = {};
module.exports = {
  getList: function() {
    return list;
  },
  clearList: function() {
    for (var key in list) {
      delete list[key];
    }
    return list;
  }
};
