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
    topTit:['操作','序号','零件号','品名','市场单价','优惠单价','库存','需求数量','总价','图片'],
    infor:[0],
    inforArray:[0],
    goodNo:[],
    amount:[0]
  },

  // 增加一行
  addOne: function () {
        console.log('addOneKind----')
        var tempArrayInfor= this.data.infor
        var tempArrayAmount= this.data.amount
        tempArrayInfor.push({})
        tempArrayAmount.push(0)
        this.setData({  
                infor:tempArrayInfor,
                amount:tempArrayAmount
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

    // 获取零件信息
    getInfo: function (e) {
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
                    'fqty': res.data.fqty,
                    'kcstatus': res.data.kcstatus ? res.data.kcstatus : res.data.fqty,
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
    
    //提交订单
    submitOrder: function(){
      
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