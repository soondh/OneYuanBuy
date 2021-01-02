const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const user = require('../../services/user.js');

//获取应用实例
const app = getApp()
Page({
  data: {
    popimgUrl: '',
    popshow: false,
    goodsCount: 0,
    id: 0,
    currentpage: 1,
    banner: [],
    channel: [],
    category: [],
    currentCategoryData: []
  },
  onShareAppMessage: function () {
    return {
      title: 'Mall',
      desc: '好又多',
      path: '/pages/index/index'
    }
  },

//获取banner以及categoryList
  getIndexData: function () {
    let that = this;
    var index = wx.getStorageSync('indexPic');
    console.log(index)
    util.request(api.indexPic).then(function (res) {
      console.log(res)
      if (res.cd == 0){
        if(res.data.id != wx.getStorageSync("indexPic")){
          that.setData({
            'popshow':true,
            'popimgUrl':res.data.url
          });
          wx.setStorageSync('indexPic',res.data.id);
        } else {
          that.setData({
            'popshow':false
          })
        }
      }
    });

    util.request(api.IndexUrl).then(function (res) {
      console.log(res)
      if (res.cd === 0) {
        that.setData({
          banner: res.data ,
        });
      }
    });

    util.request(api.CategoryList).then(function (res){
      if (res.cd == 0) {
        console.log(res)
        that.setData({
          category: res.data,
          id: res.data[0].id
        });
      that.getCategoryInfo()
      }
    });
  },

//获取当前分类下的商品列表
  getCategoryInfo: function () {
    let that = this;
    util.request(api.CategoryInfo, { id: that.data.id, page: that.data.currentpage, pageSize: 10})
      .then(function (res) {
        if (res.cd == 0) {
          console.log("res data",res.data)
          if(that.data.currentpage == 1) {
            that.setData({
              currentCategoryData: res.data
            })
          } else {
            that.setData({
              currentCategoryData: that.data.currentCategoryData.concat(res.data)
            });
        }

          //nav位置
          let currentIndex = 0;
          let navListCount = that.data.length;
          for (let i = 0; i < navListCount; i++) {
            currentIndex += 1;
            if (that.data.navList[i].id == that.data.id) {
              break;
            }
          }
          if (currentIndex > navListCount / 2 && navListCount > 5) {
            that.setData({
              scrollLeft: currentIndex * 60
            });
          }

        } else {
          //显示错误信息
        }
        
      });

  },
  
  onLoad: function (options) {
    var that = this;
    this.getIndexData();

    this.getCategoryInfo();

  },

  onReady: function () {
    // 页面渲染完成
    var that = this;

  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
    var that = this;
    /*
    util.request(api.GoodsCount).then(res => {

    });

    */
  },
  onUnload: function () {
    // 页面关闭
  },
  switchCate: function (event) {
    if (this.data.id == event.currentTarget.dataset.id) {
      return false;
    }
    
    var that = this;
    var clientX = event.detail.x;
    var currentTarget = event.currentTarget;
    if (clientX < 60) {
      that.setData({
        scrollLeft: currentTarget.offsetLeft - 60
      });
    } else if (clientX > 330) {
      that.setData({
        scrollLeft: currentTarget.offsetLeft
      });
    } else {
    }
    this.setData({
      id: event.currentTarget.dataset.id,
      currentpage: 1
    });

    this.getCategoryInfo();
  },

  onReachBottom: function() {
    var pageNum = this.data.currentpage;
    
    this.setData({
      currentpage: pageNum + 1 //设置下一页
    })

    this.getCategoryInfo();
  },

  onPullDownRefresh() {
    // 下拉刷新
    if (!this.loading) {
      this.getIndexData();

      this.getCategoryInfo().then(() => {
        wx.stopPullDownRefresh()
      })
    }
  },

  hidemodalbox:function (){
    
  },

  closemodalbox:function() {
    this.setData({
      popshow:false
    });
  }
})
