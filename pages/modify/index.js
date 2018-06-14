const MD5 = require('../../utils/md5.js')
import h from '../../utils/url.js'
var app = getApp()
Page( {
  data: {
    enterprisePhone:'',
    psd:'',
    psdAgain:'',
    canDo:false,
    canGetCode:false,
    timerCount: '获取验证码',
    code:'',
    realSignCode:'',
    loadingHidden:true
    
  },

  onLoad: function() {
    app.getUserInfo((userInfo) => {
      this.setData({
        userInfo: userInfo,
        nickName: userInfo.nickName,
      })
      console.log(this.data.userInfo)
    })
  },
  enterprisePhone: function (e) {
    this.setData({
      enterprisePhone: e.detail.value
    })
  },
  code: function (e) {
    this.setData({
      code: e.detail.value
    })
  },
  psd: function (e) {
    this.setData({
      psd: e.detail.value
    })
  },
  psdAgain: function (e) {
    this.setData({
      psdAgain: e.detail.value
    })
  },
  //获取手机验证码
  toGetCode: function () {
    console.log(this.data.enterprisePhone)
    //验证手机格式
    if (!(/^1[34578]\d{9}$/.test(this.data.enterprisePhone))) {
      wx.showModal({
        title: '提示',
        content: '请填写正确的手机号码!',
        showCancel: false,
        success: (res)=> {
        }
      });
      return;
    }
    //是否允许再次点击
    if (this.data.canGetCode) {
      return
    }
    //接口获取验证码
    wx.request({
      url: h.main + '/smsSend',
      data: {
        fmobile: this.data.enterprisePhone
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      }, // 设置请求的 header
      success: (res) => {
        console.log('获取验证码backInfo---=')
        console.log(res)
        this.setData({
          realSignCode: res.data
        })
      },
      fail: (res) => {
      },
      complete: (res) => {
      }
    })
    //倒计时
    var countdown = 60;
    var _this = this
    settime()
    function settime() {
      if (countdown == 0) {
        _this.setData({
          canGetCode: false,
          timerCount: '获取验证码',
        })
        countdown = 60;
      } else {
        _this.setData({
          canGetCode: true,
          timerCount: "重新发送(" + countdown + ")"
        })
        countdown--;
      }
      setTimeout(function () {
        if (_this.data.canGetCode == true) {
          settime()
        }
      }, 1000)
    }
  },
  submitSign: function (e) {
    this.setData({
      loadingHidden:false,
      canDo: true
    })
    if (!(/^1[34578]\d{9}$/.test(this.data.enterprisePhone))) {
      wx.showModal({
        title: '提示',
        content: '请填写正确手机号码!',
        showCancel: false,
        success: (res)=> {
          if (res.confirm) {
            this.setData({
              loadingHidden: true,
              canDo: false
            })
          }
        }
      });
      return;
    }
    if (this.data.psd != this.data.psdAgain) {
      wx.showModal({
        title: '提示',
        content: '两次输入的密码不一致!',
        showCancel: false,
        success: (res) => {
          if (res.confirm) {
            this.setData({
              loadingHidden: true,
              canDo: false
            })
          }
        }
      });
      return;
    }
    if (this.data.code != this.data.realSignCode || this.data.code=='') {
      wx.showModal({
        title: '提示',
        content: '请输入正确的验证码!',
        showCancel: false,
        success: (res) => {
          if (res.confirm) {
            this.setData({
              loadingHidden: true,
              canDo: false
            })
          }
        }
      });
      return;
    }

    // 修改密码
    wx.request({
      url: h.main + '/setPass',
      data: {
        fmobile: this.data.enterprisePhone,
        password: this.data.psdAgain
        // password: MD5.hexMD5(this.data.psdAgain)
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      }, // 设置请求的 header
      success: (res) => {
        console.log('修改密码backInfo---=')
        console.log(res.data)
        if (res.data == 1){
          wx.showToast({
            title: '修改成功!',
            icon: 'success',
            duration: 500
          })
          setTimeout(function(){
            wx.navigateTo({
              url: '../login/index',
            })
          },500)
        }else{
          wx.showModal({
            title: '提示',
            content: '修改失败，稍后重试!',
            showCancel: false,
            success: (res) => {
              if (res.confirm) {
              }
            }
          });
        }
        this.setData({
          loadingHidden: true,
          canDo: false
        })

      },
      fail: (res) => {
      },
      complete: (res) => {
      }
    })
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  }
  
})