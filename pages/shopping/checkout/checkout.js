var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
const pay = require('../../../services/pay.js');

var app = getApp();

Page({
  data: {
    id: '',
    addressId: 0,
    checkedGoodsList: [],
    checkedAddress: {},
    goodsTotalPrice: 0.00, //商品总价
    freightPrice: 0.00,    //快递费
    couponPrice: 0.00,     //优惠价格
    orderTotalPrice: 0.00,  //订单总价
    actualPrice: 0.00,     //实际需要支付的总价
    address: {},
  },
  onLoad: function (options) {
    console.log(options)
    var that = this;
    that.setData({
      id: options.id
    });
  },

  //根据订单id获取订单详情- 地址，商品
  getOrderInfo: function () {
    var that = this

    util.request(api.OrderInfo,{
      statuId: 1,
      uuid: that.data.id
    },'GET').then(function (res){
      console.log(res)
      if(res.cd == 0){
        that.setData({
          checkedGoodsList:res.data[0].goodsList,
          addressId: res.data[0].addressId,
          freightPrice: res.data[0].freight,
          goodsTotalPrice: res.data[0].originAmount,
          couponPrice: res.data[0].totalAmount,
          actualPrice: res.data[0].realPrice
        });

        if (that.data.addressId != 0){
        util.request(api.AddressInfo,{
          addressId: that.data.addressId
        },'GET').then(function (res){
          if(res.cd == 0){
            that.setData({
              checkedAddress: res.data[0]
            });
          }
        });
      }
      }

      wx.hideLoading();
    });
  },

  selectAddress() {
    var that = this;
    var id = that.data.id;
    wx.navigateTo({
      url: '/pages/shopping/address/address?id=' + id,
    })
  },

  addAddress() {
    var that = this
    wx.navigateTo({
      url: '/pages/shopping/address/address?id=' + that.data.id,
    })
  },
  onReady: function () {
    // 页面渲染完成

  },
  onShow: function () {
    // 页面显示
    let that = this;
    wx.showLoading({
      title: '加载中...',
    })

  
    that.getOrderInfo();
  
  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  },
  submitOrder: function () {
    if (this.data.addressId <= 0) {
      util.showErrorToast('请选择收货地址');
      return false;
    }
    util.request(api.OrderSubmit, { addressId: this.data.addressId, couponId: this.data.couponId }, 'POST').then(res => {
      if (res.errno === 0) {
        const id = res.data.orderInfo.id;
        pay.payOrder(parseInt(id)).then(res => {
          wx.redirectTo({
            url: '/pages/payResult/payResult?status=1&id=' + id
          });
        }).catch(res => {
          wx.redirectTo({
            url: '/pages/payResult/payResult?status=0&id=' + id
          });
        });
      } else {
        util.showErrorToast('下单失败');
      }
    });
  },

  //地址列表排序，默认地址排第一个
  compareDefault: function(isDefault) {
    return function(a,b) {
      var value1 = a.isDefault;
      var value2 = b.isDefault;
      return value2-value1;
    }
  },

})