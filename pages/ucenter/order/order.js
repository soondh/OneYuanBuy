var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');

Page({
  data:{
    orderList: [],
    currentpage: 1,
    pageSize: 10
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    // this.getOrderList();
  },
  getOrderList(){
    let that = this;
    util.request(api.OrderInfo,{
      'statuId':1,
      'page':that.data.currentpage,
      'pageSize':that.data.pageSize
    },'GET').then(function (res) {
      //隐藏loading 提示框
      wx.hideLoading();
      //隐藏导航条加载动画
      wx.hideNavigationBarLoading();
      //停止下拉刷新
      wx.stopPullDownRefresh();
      if (res.cd === 0) {
        that.setData({
          //orderList: that.data.orderList.concat(res.data)
          orderList: res.data
        });
      }
    });
  },
  payOrder(){
    wx.redirectTo({
      url: '/pages/pay/pay',
    })
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
    this.setData({
      currentpage: 1 //设置初始页
    })
    this.getOrderList();
  },
  
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },

  onReachBottom: function() {
    console.log("reach bottom")
    var pageNum = this.data.currentpage;
    
    this.setData({
      currentpage: pageNum + 1 //设置下一页
    })

    this.getNextPageData();
  },

  getNextPageData(){
    let that = this;
    util.request(api.OrderInfo,{
      'statuId':1,
      'page':that.data.currentpage,
      'pageSize':that.data.pageSize
    },'GET').then(function (res) {
      if (res.cd === 0) {
        that.setData({
          orderList: that.data.orderList.concat(res.data)
        });
      }
    });
  },

  //刷新
  onRefresh(){
    //在当前页面显示导航条加载动画
    wx.showNavigationBarLoading(); 
    //显示 loading 提示框。需主动调用 wx.hideLoading 才能关闭提示框
    wx.showLoading({
      title: '刷新中...',
    })
    this.getOrderList();
  },
  
/**
 * 页面相关事件处理函数--监听用户下拉动作
 */
  onPullDownRefresh: function () {
    //调用刷新时将执行的方法
    this.onRefresh();
  }

})