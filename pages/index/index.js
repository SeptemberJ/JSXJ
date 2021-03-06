// const MD5 = require('../../utils/md5.js')
import h from '../../utils/url.js'
var app = getApp()
// var util = require('../../utils/util')
// var requestPromisified = util.wxPromisify(wx.request)
Page({
  data: {
    // toView: 'red',
    // scrollTop: 100,
    loadingHidden:true,
    ifShowImg:0,
    imgSrc:'',
    topTit2: ['操作', '序号', '零件号', '品名', '市场单价', '优惠单价', '库存', '需求数量', '总价', '图片'],
    topTit:['序号','零件号','品名','市场单价','优惠单价','库存','图片'],
    infor:[0],
    inforArray:[0],
    goodNo:[],
    amount:[0]
  },

  // 增加一行
  addOne: function () {
        console.log('addOneKind----')
    if (this.data.infor.length == 8) {
      wx.showModal({
        title: '提示',
        content: '一次最多查询8条,请先清空!',
        showCancel: false
      })
      return false
    }
        var tempArrayInfor= this.data.infor
        var tempArrayAmount= this.data.amount
        tempArrayInfor.push({})
        tempArrayAmount.push(0)
        this.setData({  
          infor:tempArrayInfor,
          amount:tempArrayAmount
        }) 
    },

    //  清空
   clearAll: function () {
     this.setData({
       infor: [0],
       inforArray: [0],
       goodNo: [],
       amount: [0]
     })
   },
    // 修改输入零件号
    changeGoodNo: function (e) {
      let temp = this.data.goodNo
      temp[e.currentTarget.dataset.index] = e.detail.value
      this.setData({  
        goodNo: temp
      })
    },
  getInfo: function (e) {
    console.log(e.detail)
    if (e.detail.value.trim() == '') {
      return false
    }
    let tempInfo = this.data.infor
    let idx = e.currentTarget.dataset.index
    var backInfo = {
      'fname': '',
      'fsalePrice': '',
      'image': '',
      'fqty': '',
      'discount': '',
      'id': '',
      'choosed': true,
      'YHprice': '',
    }
    tempInfo.splice(idx, 1, backInfo)
    this.setData({
      infor: tempInfo
    })
    // this.addOne()
    },
    // 获取零件信息
    getInfo2: function (e) {
      if(e.detail.value.trim()=='' || e.detail.value.trim()==null){
        return false
      }
       console.log(e.detail.value)
       console.log(e.currentTarget.dataset.index)
       this.setData({
         loadingHidden:false
       })
       var idx=e.currentTarget.dataset.index
       wx.request({
            url: h.main + '/itemsearch',
            method: 'GET',
            data: {
                partno:e.detail.value,
                ftype: app.globalData.ftype,
                fusername:app.globalData.fname
                // oppen_id: app.globalData.oppenid
            },
           header: {
                'content-type': 'application/x-www-form-urlencoded',
                
            }, 
            success: (res)=>{
                this.setData({
                  loadingHidden:true
                })
                console.log('获取零件信息==');
                console.log(res.data)
                if (res.data!=''){
                  
                  var tempInfo = this.data.infor
                  var backInfo = {
                    'fname': res.data.fname,
                    'fsalePrice': res.data.fsalePrice,
                    'image': res.data.image,
                    'fqty': res.data.kcstatus != '' ? (res.data.kcstatus) : (res.data.fqty == 0 ? '现货' : res.data.fqty),
                    // 'fqty': res.data.fqty == 0 ? '现货' : (res.data.fqty > 1 ? res.data.fqty : res.data.kcstatus),
                    // 'kcstatus': res.data.kcstatus ? res.data.kcstatus : res.data.fqty,
                    'discount': res.data.discount,
                    'id': res.data.order_id,
                    'choosed': true,
                    'YHprice': Math.round(Number(res.data.fsalePrice) * Number(res.data.discount))
                  }
                  tempInfo.splice(idx, 1, backInfo)
                  this.setData({
                    infor: tempInfo
                  })
                  this.addOne()
                  this.saveOneRecord(tempInfo[tempInfo.length-1])
                  console.log(idx)
                  console.log(backInfo)
                  console.log(this.data.infor)
                }else{
                     wx.showModal({    
                        title:'提示',    
                        content: '该零件号不存在!',    
                        showCancel: false,    
                        success: function (res) {    
                            if (res.confirm) {      
                            }    
                        }    
                     })
                }
                
            }
        });


    },
    // 保存一条记录
    saveOneRecord: function (itemInfo) {
      let obj = {
        'fnumber': itemInfo.fnumber || '',
        'id': itemInfo.id,
        'fdiscount': itemInfo.discount,
        'ftotal': itemInfo.ftotal || '',
      }
      wx.request({
        url: h.main + '/submitno',
        data: {
          orders: JSON.stringify({ 'fusername': app.globalData.fname, 'order': obj })
        },
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
        }, // 设置请求的 header
        success: (res) => {
        },
        fail: (res) => {
        },
        complete: (res) => {
        }
      })
    },
    // 输入数量
    inputAmount: function(e) {
       console.log('amount-----');
       var idx = e.currentTarget.dataset.index
       this.data.amount.splice(idx,1,parseInt(e.detail.value))
       var newAmount = this.data.amount
       let tempInfo = this.data.infor
       tempInfo[idx].fnumber = parseInt(e.detail.value)
       tempInfo[idx].fdiscount = Math.round(Number(tempInfo[idx].fsalePrice) * Number(tempInfo[idx].discount))
       tempInfo[idx].ftotal = Math.round(Number(e.detail.value) * (Number(tempInfo[idx].fsalePrice) * Number(tempInfo[idx].discount)))

       
       this.setData({  
                amount:newAmount,
                infor: tempInfo
            }) 
       console.log('tijiao----')
       console.log(this.data.infor)
    },

    //删除一条记录
    deleteRecord: function(e){
      var recordId = e.currentTarget.dataset.ridx
      console.log(recordId+'-----')
      let tempInfo = this.data.infor
      tempInfo[recordId].choosed = !tempInfo[recordId].choosed
      this.setData({
        infor: tempInfo
      })
      console.log(this.data.infor)


    },

    // 查看图片
    showImg: function(e) {
      console.log('showImg-----');
      const sym = ''
      var idx = e.currentTarget.dataset.index
      var src = this.data.infor[idx].image
      var reg = /[\\\/]/g;
      // console.log(src)
      // console.log(src.replace(reg, "/"))
      if(this.data.infor[idx].image){
        this.setData({
                ifShowImg:1,
                imgSrc: "http://jingsairs.com/js/userfiles/images/" + src.replace(reg, "/")
            }) 
        console.log('imgSrc-----')
        console.log(this.data.imgSrc)
      }else{
        console.log('fail---')
        return false
      }
      
    },

    // 隐藏图片
    closeImg: function() {
      console.log('closeImg-----');
      this.setData({
                ifShowImg:0,
                imgSrc:''
            }) 
      // console.log(this.data.ifShowImg);
    },
  submitOrder: function () {
    console.log(this.data.goodNo)
    if (this.data.goodNo.length == 0){
      wx.showModal({
        title: '提示',
        content: '请输入需要查询的零件号!',
        showCancel: false,
        success: (res) => {
        }
      })
      return false
    }
    wx.showLoading({
      title: '加载中',
    })
    // var submitOrder = []
    // this.data.infor.map(function (item, idx) {
    //   if (item.choosed) {
    //     let obj = {
    //       'fnumber': item.fnumber,
    //       'id': item.id,
    //       'fdiscount': item.fdiscount,
    //       'ftotal': item.ftotal,
    //     }
    //     submitOrder.push(obj)
    //   }
    // })
    wx.request({
      url: h.main + '/itemsearch',
      method: 'GET',
      data: {
        partno: this.data.goodNo,
        ftype: app.globalData.ftype,
        fusername: app.globalData.fname
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: (res) => {
        let tempInfoArray = this.data.infor
          this.data.goodNo.map((partno, idxC) => {
            res.data.map((item, idx) => {
            if (item.partno == partno ) {
              let InfoItem = {
                'fname': item.fname,
                'fsalePrice': item.fsalePrice,
                'image': res.data.image,
                'fqty': item.kcstatus != '' ? (item.kcstatus) : (item.fqty == 0 ? '现货' : item.fqty),
                'discount': item.discount,
                'id': item.order_id,
                'choosed': true,
                'YHprice': Math.round(Number(item.fsalePrice) * Number(item.discount))
              }
              tempInfoArray.splice(idxC, 1, InfoItem)
            }
          })
        })
        console.log(tempInfoArray)
        this.setData({
          infor: tempInfoArray
        })
        wx.hideLoading()
        wx.showModal({
          title: '提示',
          content: '提交成功，下单请电话或微信联系13370206676朱先生',
          showCancel: false,
          success(res) {
          }
        })
      }
    });
  },
    //提交订单
    submitOrder2: function(){
      
      var submitOrder = []
      console.log(this.data.infor)
      this.data.infor.map(function(item,idx){
        if (item.choosed){
          let obj = {
            'fnumber': item.fnumber,
            'id': item.id,
            'fdiscount': item.fdiscount,
            'ftotal': item.ftotal,
          }
          submitOrder.push(obj)
        }
      })
      wx.request({
        url: h.main + '/submit',
        data: {
          orders: JSON.stringify({ 'fusername': app.globalData.fname, 'order': submitOrder })
        },
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
        }, // 设置请求的 header
        success: (res) => {
          console.log('提交订单backInfo---=')
          console.log(res)
          var _this = this
          if (res.data == 1) {
            wx.showToast({
              title: '提交成功',
              icon: 'success',
              duration: 2000
            })
            this.setData({
              infor: [0],
              amount: [0],
              goodNo: []
            })
          } else {
            wx.showModal({
              title: '提示',
              content: '订单不能为空!',
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
        }
      })

      for (let i = 0; i < submitOrder.length;i++){
        if (!submitOrder[i].fnumber || submitOrder[i].fnumber < 0) {
          wx.showModal({
            title: '提示',
            content: '请确认您需提交的数量都已填写!',
            showCancel: false,
            success: (res) => {
              if (res.confirm) {
              }
            }
          })
          return false
        }

      }

      //提交订单
      wx.request({
        url: h.main + '/submit',
        data: {
          orders: JSON.stringify({ 'fusername': app.globalData.fname, 'order': submitOrder })
        },
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
        }, // 设置请求的 header
        success: (res) => {
          console.log('提交订单backInfo---=')
          console.log(res)
          var _this = this
          if (res.data==1){
            wx.showToast({
              title: '提交成功',
              icon: 'success',
              duration: 2000
            })
            this.setData({
              infor: [0],
              amount: [0],
              goodNo: []
            })
          }else{
            wx.showModal({
              title: '提示',
              content: '订单不能为空!',
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