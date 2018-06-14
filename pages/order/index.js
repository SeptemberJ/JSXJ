import h from '../../utils/url.js'
require('../../utils/wx-pro.js')
var app = getApp()
Page( {
  data: {
    loadingHidden:true,
    states:['待回复','已回复'],
    cur:1,
    orderList2:[{"orderNo":10101,"goodNo":'1001',"goodName":'行李箱',"amount":200,"marketPrice":399,"futures":'现货',"salePrice":300},{"orderNo":10102,"goodNo":'1002',"goodName":'LED灯',"amount":300,"marketPrice":299,"futures":'现货',"salePrice":200},{"orderNo":10102,"goodNo":'1002',"goodName":'LED灯',"amount":300,"marketPrice":299,"futures":'现货',"salePrice":200}],
    orderList:[{"orderNo":10101,"total":6000,'goodsList':[{"goodNo":'1001',"goodName":'行李箱',"amount":200,"marketPrice":399,"futures":'现货',"salePrice":300},{"goodNo":'1002',"goodName":'LED灯',"amount":300,"marketPrice":299,"futures":'现货',"salePrice":200}]},{"orderNo":10102,"total":12000,'goodsList':[{"goodNo":'1001',"goodName":'行李箱',"amount":200,"marketPrice":399,"futures":'现货',"salePrice":300}]}],
    orderListAll:[],
    
  },

  onLoad: function() {
    
   
  },
  onShow: function(){
    //获取所有询价单
    // wx.pro.request({
    //   url: h.main+'/XDCJK/main/11111.html',
    //   method: 'GET',
    //   data: {
    //     orderNo:idx,
    //   },
    //   header:{
    //     'contentType': 'application/x-www-form-urlencoded' ,
    //     'Accept': 'application/json'
    //   }
    // })
    // .then(res => {
    //       console.log(res.data);
    //           var tempList=[]
    //           // 清除原来的
    //           this.setData({
    //             orderList:[],
    //             orderListAll:res.data  
    //           })
    //           this.data.orderListAll.map(function(item){
    //                   if(item.status==that.data.curt+1){
    //                       tempList.push(item)
    //                   }
    //           })
    //           this.setData({
    //             orderList:tempList
    //           })
    // })
    // .catch(err => {
    //   console.log(err)
    //   // 网络错误、或服务器返回 4XX、5XX
    // })

  },
  changeTab: function(e){
    var idx = e.currentTarget.dataset.index
    var tempList=[]
    this.setData({
      cur:idx
    })
    // this.setData({
    //   orderList:[]
    // })
    // this.data.orderListAll.map(function(item){
    //   if(item.status==that.data.curt+1){
    //     tempList.push(item)
    //   }
    // })
    // this.setData({
    //   orderList:tempList
    // })
  },
  cancelEnquiry: function(e){
    var idx = e.currentTarget.dataset.index
    console.log(idx+'----------')
    wx.showModal({
      title: '提示',
      content: '确定取消该询价单吗？',
      success: (res)=> {
        if (res.confirm) {
          console.log('用户点击确定')
          //取消询价单
          // wx.pro.request({
          //   url: h.main+'/XDCJK/main/11111.html',
          //   method: 'GET',
          //   data: {
          //     orderNo:idx,
          //   },
          //   header: {
          //      'contentType': 'application/x-www-form-urlencoded' ,
          //       'Accept': 'application/json'
          //   }
          // })
          // .then(res => {
          //   console.log(res.data);
          //     // 删除取消的，实现刷新
          //     var tempList = this.data.orderList
          //     tempList.splice(idx,1)
          //     this.setData({
          //       orderList:tempList
          //     })
          // })
          // .catch(err => {
          //   console.log(err)
          //   // 网络错误、或服务器返回 4XX、5XX
          // })
         
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  }
 
  
  
})