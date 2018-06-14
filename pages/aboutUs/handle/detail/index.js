var WxParse = require('../../../wxParse/wxParse.js');
import h from '../../../../utils/url.js'
var app = getApp()
Page({
  data: {
    id:'',
    title:'',
    loadingHidden: false
  },
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
    
  },
  onShow: function () {
    wx.request({
      url: h.main + '/fdatail',
      data: {
        id: this.data.id,
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      success: (res) => {
        console.log('文章详情----')
        console.log(res.data)
        this.setData({
          title: res.data[0].title
        })
        var article = res.data[0].fdetail;
        WxParse.wxParse('article', 'html', article, this, 5);


      },
      fail: (res) => {
        // fail
      },
      complete: (res) => {
        // complete
        this.setData({
          loadingHidden: true
        })
      }
    })


  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  }
  
})