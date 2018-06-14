
var app = getApp()
Page( {
  data: {
  },

  onLoad: function() {
    
  },
  navigateToIntroduction: function(e){
    wx.navigateTo({
      url: '../introduction/index'
		});
  },
  navigateToHandleList:function(){
    wx.navigateTo({
      url: '../handle/list/index'
		});
  },

})