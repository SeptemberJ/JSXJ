const MD5 = require('../../utils/md5.js')
import h from '../../utils/url.js'
var app = getApp()
Page( {
  data: {
    userName:'',
    psd:'',
    loadingHidden:true
  },

  onLoad: function() {
    //调用应用实例的方法获取全局数据
    app.getUserInfo((userInfo) => {
      this.setData({
        userInfo: userInfo,
        nickName: userInfo.nickName,
      })
      console.log(this.data.userInfo)
    })
    
   
  },
  userName: function (e) {
    this.setData({
      userName: e.detail.value
    })
  },
  psd: function (e) {
    this.setData({
      psd: e.detail.value
    })
  },
  toSign: function(){
    wx.navigateTo({
      url: '../sign/index',
    })
  },
  forgetPsd: function () {
    wx.navigateTo({
      url: '../modify/index',
    })
  },
  submitLogin: function(){
    this.setData({
      loadingHidden:false
    }) 
    var loginInfo = {
      // oppen_id: app.globalData.oppenid,
      username: this.data.userName,
      password: this.data.psd
    }
    
    //用户登录
    wx.request({
      url: h.main + '/checkLog',
      data: {
        loginInfo: JSON.stringify(loginInfo)
        // oppen_id: app.globalData.oppenid,
        // username: this.data.userName,
        // password: this.data.psd
        // password: MD5.hexMD5(this.data.psd)

      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      }, // 设置请求的 header
      success: (res) => {
        console.log('登录信息backInfo---=')
        console.log(res)
        switch (res.data){
          case 0:
            wx.showModal({
              title: '提示',
              content: '用户尚未通过审核!',
              showCancel: false,
              success: (res) => {
                if (res.confirm) {
                }
              }
            })
            break;
            case 2:
            wx.showModal({
              title: '提示',
              content: '密码错误!',
              showCancel: false,
              success: (res) => {
                if (res.confirm) {
                }
              }
            })
            break;
            case 3:
            wx.showModal({
              title: '提示',
              content: '用户不存在!',
              showCancel: false,
              success: (res) => {
                if (res.confirm) {
                }
              }
            })
            break;
            case 4:
              wx.showModal({
                title: '提示',
                content: '用户名或密码错误!',
                showCancel: false,
                success: (res) => {
                  if (res.confirm) {
                  }
                }
              })
              break;
            default:
            console.log(res.data.substring(6))
            app.globalData.ftype = Number(res.data.substring(6))
            app.globalData.fname = this.data.userName
            wx.redirectTo({
              url: '../index/index',
            })
        }
        


      },
      fail: (res) => {
      },
      complete: (res) => {
        this.setData({
          loadingHidden: true
        })
       
      }
    })
  },
  navigateToIntroduction: function (e) {
    wx.navigateTo({
      url: '../aboutUs/introduction/index'
    });
  },
  navigateToHandleList: function () {
    wx.navigateTo({
      url: '../aboutUs/handle/list/index'
    });
  },
  navigateToChoose: function () {
    wx.navigateTo({
      url: '../aboutUs/choose/list/index'
    });
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  }
  
})