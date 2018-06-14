//app.js
import h from '/utils/url.js'
// require('./utils/wx-pro.js')
// const AV = require('./utils/av-weapp.js');
const appId = "wx7d06d43fe223ed6c";
const appKey = "xdv2nwjUK5waNglFoFXkQcxP";
// AV.init({ 
// 	appId: appId, 
// 	appKey: appKey,
// });

App({
  onLaunch: function () {
    console.log('App Launch')
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  getUserInfo: function (cb) {
    var that = this
    wx.login({
      success: function (a) {
        var code = a.code;
        console.log(code + "*******************")
        wx.getUserInfo({
          success: function (res) {
            var encryptedData = encodeURIComponent(res.encryptedData);
            var iv = res.iv;
            that.globalData.userInfo = res.userInfo
            that.globalData.code = code
            that.globalData.encryptedData = encryptedData
            that.globalData.iv = res.iv
            //Login(code,encryptedData,iv);
            typeof cb == "function" && cb(that.globalData.userInfo)
          }
        })
      }
    })
  },
         
    
  // },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  },
  globalData: {
    userInfo: null,
    code: "",
    encryptedData: "",
    iv: "",
    // oppenid:"oZz7u0AM8-LyLgUf5_3maiT1P3-Q",
    oppenid: '',
    fname:'',
    ftype:'',
    goodsNoList:[],
  },

})

//Login-----

function Login(code, encryptedData, iv) {
  console.log('开始登录----');
  var app = getApp();
  console.log(app.globalData.userInfo);
  console.log(code)
  //请求服务器
  wx.request({
    url: h.main + "/userInsertWsc",
    data: {
      code: code,
      realname: app.globalData.userInfo.nickName,
      head_img: app.globalData.userInfo.avatarUrl
    },
    method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    header: {
      'content-type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    }, // 设置请求的 header
    success: (res) => {
      console.log('登录返回oppen_id-----');
      // success
      console.log(res.data);
      if (res.data.isUrl == 1){
        app.globalData.oppenid = res.data.oppen_id
      }else{
        wx.showModal({
          title: '提示',
          content: '服务器繁忙，稍后重试!',
          showCancel: false,
          success: (res) => {
            if (res.confirm) {
            }
          }
        });
      }
    },
    fail: (res)=> {
      // fail
      console.log(res);
    },
    complete: (res) => {
      // complete
      console.log(res);
    }
  })
}