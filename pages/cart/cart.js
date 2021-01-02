var util = require('../../utils/util.js');
var api = require('../../config/api.js');

var app = getApp();

Page({
  data: {
    cartGoods: [],
    cartTotal: {
      "goodsCount": 0,
      "goodsAmount": 0.00,
      "selectedgoodsCount": 0,
      "selectedgoodsAmount": 0.00
    },
    checkedAllStatus: true,
    bgColor: "#e4e4e4",
    textColor: "#9b9b9b",
    tapTime: 0,
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数


  },
  onReady: function () {
    // 页面渲染完成

  },
  onShow: function () {
    // 页面显示
    let that = this
    this.getCartList();
  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  },
  getCartList: function () {
    let that = this;
    util.request(api.CartList).then(function (res) {
      if (res.cd === 0) {
        that.setData({
          cartGoods: res.data.cartGoods,
          cartTotal: res.data.cartTotal
        });
      }

      that.setData({
        checkedAllStatus: that.isCheckedAll()
      });

      if (that.data.cartTotal.selectedgoodsCount == 0) {
        that.setData({
          bgColor: "#e4e4e4",
          textColor: "#9b9b9b"
        });
      } else {
        that.setData({
          bgColor: "#FF5D69",
          textColor: "#fff"
        });
      }

    });
  },
  isCheckedAll: function () {
    //判断购物车商品已全选
    return this.data.cartGoods.every(function (element, index, array) {
      if (element.selected == true) {
        return true;
      } else {
        return false;
      }
    });
  },
  checkedItem: function (event) {
    //console.log("selected itme",event)
    let itemIndex = event.target.dataset.itemIndex;
    let that = this;
    //console.log("cartGoods",that.data.cartGoods[itemIndex])
    util.request(api.CartSelected, { goodsId: that.data.cartGoods[itemIndex].id, count: that.data.cartGoods[itemIndex].count, selected:  that.data.cartGoods[itemIndex].selected ? 0 : 1}, 'PUT').then(function (res) {
      //console.log(res)
      if (res.cd === 0) {
        that.setData({
          cartGoods: res.data.cartGoods,
          cartTotal: res.data.cartTotal
        });
      }

      that.setData({
        checkedAllStatus: that.isCheckedAll()
      });

      if (that.data.cartTotal.selectedgoodsCount == 0) {
        that.setData({
          bgColor: "#e4e4e4",
          textColor: "#9b9b9b"
        });
      } else {
        that.setData({
          bgColor: "#FF5D69",
          textColor: "#fff"
        });
      }

    });

  },
  getCheckedGoodsCount: function(){
    let checkedGoodsCount = 0;
    this.data.cartGoods.forEach(function (v) {
      if (v.checked === true) {
        checkedGoodsCount += v.number;
      }
    });
    return checkedGoodsCount;
  },
  
  checkedAll: function () {
    let that = this;

    if (that.data.checkedAllStatus) {
      util.request(api.CartSelectedAll + "?isAll=1", {}, "DELETE").then(function (res) {
        if (res.cd === 0) {
          that.setData({
            cartGoods: res.data.cartGoods,
            cartTotal: res.data.cartTotal
          });
        }

        that.setData({
          checkedAllStatus: that.isCheckedAll()
        });

        if (that.data.cartTotal.selectedgoodsCount == 0) {
          that.setData({
            bgColor: "#e4e4e4",
            textColor: "#9b9b9b"
          });
        } else {
          that.setData({
            bgColor: "#FF5D69",
            textColor: "#fff"
          });
        }

      });
    } else {
      util.request(api.CartSelectedAll + "?isAll=2", {}, "DELETE").then(function (res) {
        if (res.cd === 0) {
          that.setData({
            cartGoods: res.data.cartGoods,
            cartTotal: res.data.cartTotal
          });
        }

        that.setData({
          checkedAllStatus: that.isCheckedAll()
        });

        that.setData({
          checkedAllStatus: that.isCheckedAll()
        });

        if (that.data.cartTotal.selectedgoodsCount == 0) {
          that.setData({
            bgColor: "#e4e4e4",
            textColor: "#9b9b9b"
          });
        } else {
          that.setData({
            bgColor: "#FF5D69",
            textColor: "#fff"
          });
        }

      });

    }
  
  },

  updateCart: function (goodsId, count, selected) {
    let that = this;

    util.request(api.CartUpdate, {
      goodsId: goodsId,
      count: count,
      selected: selected
    }, 'PUT').then(function (res) {
      if (res.cd === 0) {
        that.setData({
          cartGoods: res.data.cartGoods,
          cartTotal: res.data.cartTotal
        });
      }

      that.setData({
        checkedAllStatus: that.isCheckedAll()
      });
    });

  },
  cutNumber: function (event) {
    var nowTime = new Date()
    if(nowTime - this.data.tapTime < 500) {
      return false;
    }
    let that = this;
    let itemIndex = event.target.dataset.itemIndex;
    let goodsItem = this.data.cartGoods[itemIndex];
    if(goodsItem.count == 1){
      wx.showModal({
        title: '确认删除',
        content: '你的购物车中还剩一个该商品，确认删除吗',
        showCancel: true,
        cancelText: '取消',
        cancelColor: '#000000',
        confirmText: '确定',
        confirmColor: '#3CC51F',
        success: (result) => {
          if(result.confirm){
            util.request(api.CartDelete + "?isAll=0" + "&goodsId=" + goodsItem.id, '', 'DELETE').then(function (res) {

              if (res.cd === 0) {
                that.setData({
                  cartGoods: res.data.cartGoods,
                  cartTotal: res.data.cartTotal
                });
              }
        
              that.setData({
                checkedAllStatus: that.isCheckedAll()
              });
            });
          }
        },
        fail: ()=>{},
        complete: ()=>{}
      });
    }
    let count = (goodsItem.count - 1 > 1) ? goodsItem.count - 1 : 1;

    this.updateCart(goodsItem.id, count, goodsItem.selected);
    //console.log("execute")
    this.setData({
      tapTime: nowTime
    })
  },
  addNumber: function (event) {
    var nowTime = new Date()
    if(nowTime - this.data.tapTime < 500) {
      //console.log("too fast")
      return false;
    }
    let itemIndex = event.target.dataset.itemIndex;
    let goodsItem = this.data.cartGoods[itemIndex];
    let count = goodsItem.count + 1;

    this.updateCart(goodsItem.id, count, goodsItem.selected);
    //console.log("execute")
    this.setData({
      tapTime: nowTime
    })
  },
  checkoutOrder: function () {
    //获取已选择的商品
    let that = this;

    if (that.data.cartTotal.selectedgoodsCount <= 0) {
      wx.showToast({
        image: '/static/images/icon_error.png',
        title: '未选中商品'
      });
      return false;
    }
    
    util.request(api.OrderGenerate,{},'POST').then(function (res){
      if(res.cd == 0){
        var id = res.data.id;
        wx.navigateTo({
          url: '../shopping/checkout/checkout?id=' + id
        })
      }
    });
  },
  deleteCart: function () {
    //获取已选择的商品
    let that = this;

    let productIds = this.data.cartGoods.filter(function (element, index, array) {
      if (element.checked == true) {
        return true;
      } else {
        return false;
      }
    });

    if (productIds.length <= 0) {
      return false;
    }

    productIds = productIds.map(function (element, index, array) {
      if (element.checked == true) {
        return element.product_id;
      }
    });


    util.request(api.CartDelete, {
      productIds: productIds.join(',')
    }, 'POST').then(function (res) {
      if (res.errno === 0) {
        //console.log(res.data);
        let cartList = res.data.cartList.map(v => {
          //console.log(v);
          v.checked = false;
          return v;
        });

        that.setData({
          cartGoods: cartList,
          cartTotal: res.data.cartTotal
        });
      }

      that.setData({
        checkedAllStatus: that.isCheckedAll()
      });
    });
  },

  onPullDownRefresh() {
    // 上拉刷新
    if (!this.loading) {
      this.getCartList(1, true).then(() => {
        // 处理完成后，终止下拉刷新
        wx.stopPullDownRefresh()
      })
    }
  },

  watchgooscount: function(event){
    
  },


  deleteCartItem: function(event) {
    let that = this;

    if(that.data.cartGoods.length <= 0) {
      return false;
    }

    let itemIndex = event.target.dataset.itemIndex;
    let goodsItem = this.data.cartGoods[itemIndex];

    wx.showModal({
      title: '确认删除',
      content: '确认删除该商品吗',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '确定',
      confirmColor: '#3CC51F',
      success: (result) => {
        if(result.confirm){
          util.request(api.CartDelete + "?isAll=0" + "&goodsId=" + goodsItem.id, '', 'DELETE').then(function (res) {
            if (res.cd === 0) {
              that.setData({
                cartGoods: res.data.cartGoods,
                cartTotal: res.data.cartTotal
              });
            }
      
            that.setData({
              checkedAllStatus: that.isCheckedAll()
            });
          });
        }
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  },

  poptips:function () {
    wx.showModal({
      title: '一元购须知',
      content: '下单后只需预付一元，确认收货后补足剩余尾款',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '确定',
      confirmColor: '#3CC51F',
      success: (result) => {
        if(result.confirm){
        }
      },
      fail: ()=>{},
      complete: ()=>{}
    });

  }

})