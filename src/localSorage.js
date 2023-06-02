module.exports = {
  setLocal: function(item, value){
    localStorage.setItem(item,value);
  },
  getLocal: function(item){
    localStorage.getItem(item);
  }
}