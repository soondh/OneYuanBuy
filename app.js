App({
  onLaunch: function () {
    try {
      this.globalData.userInfo = JSON.parse(wx.getStorageSync('userInfo'));
      this.globalData.token = wx.getStorageSync('token');
      this.globalData.indexPic = wx.getStorageSync('indexPic');
    } catch (e) {
      console.log(e);
    }
  },

  globalData: {
    userInfo: {
      nickName: '点击登录',
      avatarUrl: 'http://q0n4s6rmz.bkt.clouddn.com/2019120721451575726323touxiang.jpg'
    },
    orderGoods: {

    },
    addressSelected: {

    },
    indexPic: 0,
    token: '',
    userId: '',
    addressEdit: '',
    deleteSelectAddress: '',
  }
})