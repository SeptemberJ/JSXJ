const MD5 = require('../../utils/md5.js')
import h from '../../utils/url.js'
var app = getApp()
Page( {
  data: {
    userName:'',
    enterpriseName:'',
    contactPerson:'',
    enterpriseName:'',
    psd:'',
    psdAgain:'',
    canDo:false,
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
  userName: function (e) {
    this.setData({
      userName: e.detail.value
    })
  },
  enterpriseName: function (e) {
    this.setData({
      enterpriseName:e.detail.value
    })
  },
  contactPerson: function (e) {
    this.setData({
      contactPerson: e.detail.value
    })
  },
  enterprisePhone: function (e) {
    this.setData({
      enterprisePhone: e.detail.value
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
  submitSign: function (e) {
    var users = {}
    this.setData({
      loadingHidden: false
    })
    if (this.data.userName =='' || this.data.enterpriseName == '' || this.data.contactPerson == '' || this.data.psd == '') {
      wx.showModal({
        title: '提示',
        content: '请将信息填写完整!',
        showCancel: false,
        success: (res) => {
          if (res.confirm) {
            this.setData({
              canDo: false,
              // loadingHidden: true
            })
          }
        },
        complete: (res) => {
          this.setData({
            loadingHidden: true
          })
        },
      });
      return;
    }
    if (!(/^1[34578]\d{9}$/.test(this.data.enterprisePhone))) {
      wx.showModal({
        title: '提示',
        content: '请填写正确手机号码!',
        showCancel: false,
        success: (res)=> {
          if (res.confirm) {
            this.setData({
              canDo: false,
              loadingHidden: true
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
              canDo: false,
              loadingHidden: true
            })
          }
        }
      });
      return;
    }
    var user = {
      fusername:this.data.userName,
      fcompanyname: this.data.enterpriseName,
      fcontact: this.data.contactPerson,
      fmobile: this.data.enterprisePhone,
      oppen_id: app.globalData.oppenid,
      fpassword: this.data.psdAgain
      // fpassword: MD5.hexMD5(this.data.psdAgain)
    }
    console.log(user)
    console.log(JSON.stringify(user))

    // 用户注册
    wx.request({
      url: h.main + '/register',
      data: {
        users: JSON.stringify(user)
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      }, // 设置请求的 header
      success: (res) => {
        console.log('注册信息backInfo---=')
        console.log(res.data)
        if (res.data == 1){
          wx.showToast({
            title: '注册成功!',
            icon: 'success',
            duration: 500
          })
          setTimeout(function () {
            wx.navigateTo({
              url: '../login/index',
            })
          }, 500)

        } else if (res.data == 3){
          wx.showModal({
            title: '提示',
            content: '用户名重复!',
            showCancel: false,
            success: (res) => {
              if (res.confirm) {

              }
            }
          });
        } else if (res.data == 4){
          wx.showModal({
            title: '提示',
            content: '改手机号已经注册过!',
            showCancel: false,
            success: (res) => {
              if (res.confirm) {

              }
            }
          });
        }else{
          wx.showModal({
            title: '提示',
            content: '注册失败，稍后重试!',
            showCancel: false,
            success: (res) => {
              if (res.confirm) {
                
              }
            }
          });
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

    console.log(this.data.enterpriseName + this.data.contactPerson + this.data.enterprisePhone)
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  }
  
})