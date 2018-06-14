import h from '../../../../utils/url.js'
var app = getApp()
Page( {
  data: {
    loadingHidden:false
  },

  onShow: function(){
    this.getListData()
  },
  goDetail: function(e){
    var ID = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../detail/index?id='+ID,
    })
  },
  // 获取标题列表
  getListData: function(){
    var reg = /[\\\/]/g
    wx.request({
      url: h.main + '/title',
      data: {
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      }, // 设置请求的 header
      success: (res) => {
        console.log('标题列表backInfo---=')
        console.log(res.data)
        res.data.map(function(item,idx){
          item.fimage = "http://jingsairs.com/js/userfiles/images/" + item.fimage.replace(reg, "/")
           
        })
        this.setData({
          titList: res.data
        })

      },
      fail: (res) => {
      },
      complete: (res) => {
        this.setData({
          loadingHidden: true
        })
        wx.stopPullDownRefresh()

      }
    })
  },
onPullDownRefresh: function () {
  this.setData({
    loadingHidden: false
  })
  this.getListData()
  }
 
  
})