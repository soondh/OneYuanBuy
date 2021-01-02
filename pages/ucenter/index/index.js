const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
const user = require('../../../services/user.js');
const app = getApp();

Page({
  data: {
    userInfo: {},
    showLoginDialog: false
  },
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady: function() {

  },
  onShow: function() {
    this.setData({
      userInfo: wx.getStorageSync("userInfo"),
      //userInfo: app.globalData.userInfo,
    });
    console.log(app.globalData.userInfo)
    console.log(wx.getStorageSync("userInfo"))
  },
  onHide: function() {
    // 页面隐藏

  },
  onUnload: function() {
    // 页面关闭
  },

  onUserInfoClick: function() {
    if (wx.getStorageSync('token')) {
      console.log(app.globalData.userInfo)

    } else {
      this.showLoginDialog();
    }
  },

  onLogoutClick: function() {
    if (wx.getStorageSync('token')) {
      wx.removeStorageSync('token')
      wx.removeStorageSync('userInfo')
      
    }
  },

  showLoginDialog() {
    this.setData({
      showLoginDialog: true
    })
  },

  onCloseLoginDialog () {
    this.setData({
      showLoginDialog: false
    })
  },

  onDialogBody () {
    // 阻止冒泡
  },

  onWechatLogin(e) {
    console.log(e)
    if (e.detail.errMsg !== 'getUserInfo:ok') {
      if (e.detail.errMsg === 'getUserInfo:fail auth deny') {
        return false
      }
      wx.showToast({
        title: '微信登录失败',
      })
      return false
    }
    util.login().then((res) => {
      console.log(res)
      console.log(e.detail)
      return util.request(api.AuthLoginByWeixin, {
        code: res,
        //userInfo: e.detail
      }, 'POST');
    }).then((res) => {
      console.log(res)
      if (res.cd !== 0) {
        wx.showToast({
          title: '微信登录失败',
        })
        return false;
      }
      // 设置用户信息
      this.setData({
        userInfo: e.detail.userInfo,
        //userInfo: res.data.userInfo,
        showLoginDialog: false
      });
      app.globalData.userInfo = e.detail.userInfo;
      //app.globalData.userInfo = res.data.userInfo;
      app.globalData.token = res.data.token;
      app.globalData.userId = res.data.userId;
      wx.setStorageSync('userInfo', e.detail.userInfo);
      //wx.setStorageSync('userInfo', JSON.stringify(res.data.userInfo));
      wx.setStorageSync('token', res.data.token);
      wx.setStorageSync('userId',res.data.userId)
      console.log(wx.getStorageSync('userInfo'))
    }).catch((err) => {
      console.log(err)
    })
  },

  onOrderInfoClick: function(event) {
    wx.navigateTo({
      url: '/pages/ucenter/order/order',
    })
  },

  onSectionItemClick: function(event) {

  },

  // TODO 移到个人信息页面
  exitLogin: function() {
    wx.showModal({
      title: '',
      confirmColor: '#b4282d',
      content: '退出登录？',
      success: function(res) {
        if (res.confirm) {
          wx.removeStorageSync('token');
          wx.removeStorageSync('userInfo');
          wx.switchTab({
            url: '/pages/index/index'
          });
        }
      }
    })

  },

  orderdaifukuan:function (){
    wx.navigateTo({
      url: '../order/order?id=1'
    });
  },

  checkAllOrder:function (){
    wx.navigateTo({
      url: '../order/order?id=0'
    });
  }
})