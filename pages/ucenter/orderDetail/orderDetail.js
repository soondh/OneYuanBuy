var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');

Page({
  data: {
    id: 0,
    orderId: 0,
    orderInfo: {},
    orderGoods: [],
    handleOption: {},
    orderTime:'',
    tapTime: '',		// 防止两次点击操作间隔太快
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      id: options.id,
      orderId: options.orderId
    });
    this.getOrderDetail();
  },
  getOrderDetail() {
    let that = this;
    util.request(api.OrderInfo, {
      uuid: that.data.id
    }).then(function (res) {
      if (res.cd == 0) {
        console.log(res)
        that.setData({
          orderInfo: res.data[0],
          orderGoods: res.data[0].goodsList,
          handleOption: res.data.handleOption
        });
        var time = util.formatTime(that.data.orderInfo.createTime,'Y/M/D h:m:s');
        console.log(time)
        that.setData({
          orderTime:time
        });
        //that.payTimer();
      }
    });
  },
  payTimer() {
    let that = this;
    let orderInfo = that.data.orderInfo;

    setInterval(() => {
      orderInfo.add_time -= 1;
      that.setData({
        orderInfo: orderInfo,
      });
    }, 1000);
  },
  payOrder() {
    var nowTime = new Date();
      if (nowTime - this.data.tapTime < 1000) {
          console.log('阻断')
          return;
      }
      console.log('执行')
      this.setData({ tapTime: nowTime });
    let that = this;
    util.request(api.PayPrepayId, {
      id: that.data.id
    },'POST').then(function (res) {
      if (res.cd === 0) {
        const payParam = res.data;
        console.log(payParam)
        const pkg = "prepay_id=" + payParam.prepay_id
        wx.requestPayment({
          'appId': "wxde514a8f0a2f15ec",
          'timeStamp': payParam.timeStamp,
          'nonceStr': payParam.nonce_str,
          'package': pkg,
          'signType': "MD5",
          'paySign': payParam.sign,
          'success': function (res) {
            console.log(res)
          },
          'fail': function (res) {
            util.request(api.PayPrepayId, {
              id: that.data.id
            },'PUT').then(function (res) {
              if (res.cd === 0) {
                console.log("reset order")
              } else {
                console.log(res)
              }
            });
          }
        });
      } else {
        console.log(res)
      }
    });

  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },

  cancelOrder:function (){
    var that =  this
    var orderId = that.data.orderId
    var id = that.data.id

    wx.showModal({
      title: '取消订单',
      content: '确认取消该订单吗',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '确定',
      confirmColor: '#3CC51F',
      success: (result) => {
        if(result.confirm){
          console.log("confirm")
          util.request(api.OrderCancel + "?id=" + id, '', 'DELETE').then(function (res) {
            if (res.cd === 0) {
              wx.navigateBack({
                delta: 0,
                success: (res) => {},
                fail: (res) => {},
                complete: (res) => {},
              })
            } 
          });
        }
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  }
})