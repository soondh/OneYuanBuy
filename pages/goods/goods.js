var app = getApp();
var WxParse = require('../../lib/wxParse/wxParse.js');
var util = require('../../utils/util.js');
var api = require('../../config/api.js');

Page({
  data: {
    page: '',
    id: 0,
    goods: {},
    gallery: [],
    attribute: [],
    issueList: [],
    comment: [],
    brand: {},
    specificationList: [],
    productList: [],
    relatedGoods: [], 
    cartGoodsCount: 0,
    userHasCollect: 0,
    number: 1,
    checkedSpecText: '请选择规格数量',
    openAttr: false,
    buyopenAttr: false,
    noCollectImage: "/static/images/icon_collect.png",
    hasCollectImage: "/static/images/icon_collect_checked.png",
    collectBackImage: "/static/images/icon_collect.png",
    showLoginDialog:false
  },
  getGoodsInfo: function () {
    let that = this;
    util.request(api.GoodsDetail, { id: that.data.id }).then(function (res) {
      if (res.cd === 0) {
        that.setData({
          goods: res.data,
          gallery: res.data.coverPic,
        });

        WxParse.wxParse('page', 'html', that.data.page, that);

        if (res.data.userHasCollect == 1) {
          that.setData({
            'collectBackImage': that.data.hasCollectImage
          });
        } else {
          that.setData({
            'collectBackImage': that.data.noCollectImage
          });
        }

        //WxParse.wxParse('goodsDetail', 'html', res.data.info.goods_desc, that);

        //that.getGoodsRelated();
      }
    });

  },
  getGoodsRelated: function () {
    let that = this;
    util.request(api.GoodsRelated, { id: that.data.id }).then(function (res) {
      if (res.errno === 0) {
        that.setData({
          relatedGoods: res.data.goodsList,
        });
      }
    });

  },
  clickSkuValue: function (event) {
    let that = this;
    let specNameId = event.currentTarget.dataset.nameId;
    let specValueId = event.currentTarget.dataset.valueId;

    //判断是否可以点击

    //TODO 性能优化，可在wx:for中添加index，可以直接获取点击的属性名和属性值，不用循环
    let _specificationList = this.data.specificationList;
    for (let i = 0; i < _specificationList.length; i++) {
      if (_specificationList[i].specification_id == specNameId) {
        for (let j = 0; j < _specificationList[i].valueList.length; j++) {
          if (_specificationList[i].valueList[j].id == specValueId) {
            //如果已经选中，则反选
            if (_specificationList[i].valueList[j].checked) {
              _specificationList[i].valueList[j].checked = false;
            } else {
              _specificationList[i].valueList[j].checked = true;
            }
          } else {
            _specificationList[i].valueList[j].checked = false;
          }
        }
      }
    }
    this.setData({
      'specificationList': _specificationList
    });
    //重新计算spec改变后的信息
    this.changeSpecInfo();

    //重新计算哪些值不可以点击
  },

  //获取选中的规格信息
  getCheckedSpecValue: function () {
    let checkedValues = [];
    let _specificationList = this.data.specificationList;
    for (let i = 0; i < _specificationList.length; i++) {
      let _checkedObj = {
        nameId: _specificationList[i].specification_id,
        valueId: 0,
        valueText: ''
      };
      for (let j = 0; j < _specificationList[i].valueList.length; j++) {
        if (_specificationList[i].valueList[j].checked) {
          _checkedObj.valueId = _specificationList[i].valueList[j].id;
          _checkedObj.valueText = _specificationList[i].valueList[j].value;
        }
      }
      checkedValues.push(_checkedObj);
    }

    return checkedValues;

  },
  //根据已选的值，计算其它值的状态
  setSpecValueStatus: function () {

  },
  //判断规格是否选择完整
  isCheckedAllSpec: function () {
    return !this.getCheckedSpecValue().some(function (v) {
      if (v.valueId == 0) {
        return true;
      }
    });
  },
  getCheckedSpecKey: function () {
    let checkedValue = this.getCheckedSpecValue().map(function (v) {
      return v.valueId;
    });

    return checkedValue.join('_');
  },
  changeSpecInfo: function () {
    let checkedNameValue = this.getCheckedSpecValue();

    //设置选择的信息
    let checkedValue = checkedNameValue.filter(function (v) {
      if (v.valueId != 0) {
        return true;
      } else {
        return false;
      }
    }).map(function (v) {
      return v.valueText;
    });
    if (checkedValue.length > 0) {
      this.setData({
        'checkedSpecText': checkedValue.join('　')
      });
    } else {
      this.setData({
        'checkedSpecText': '请选择规格数量'
      });
    }

  },
  getCheckedProductItem: function (key) {
    return this.data.productList.filter(function (v) {
      if (v.goods_specification_ids == key) {
        return true;
      } else {
        return false;
      }
    });
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: options.name,
    })


    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      id: parseInt(options.id),
      page: '<div>好东西，具体看图<img src="http://image.chunshuitang.com/goods/401078.jpg"></img>看图<img src="http://image.chunshuitang.com/goods/401078.jpg"></img></div>'
    });
    var that = this;
    this.getGoodsInfo();
    
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
  switchAttrPop: function () {
    if (this.data.openAttr == false) {
      this.setData({
        openAttr: !this.data.openAttr
      });
    }
  },
  closeAttr: function () {
    this.setData({
      openAttr: false,
    });
  },
  buycloseAttr: function () {
    this.setData({
      buyopenAttr: false,
    });
  },
  addCannelCollect: function () {
    let that = this;
    //添加或是取消收藏
    util.request(api.CollectAddOrDelete, { typeId: 0, valueId: this.data.id }, "POST")
      .then(function (res) {
        let _res = res;
        if (_res.errno == 0) {
          if (_res.data.type == 'add') {
            that.setData({
              'collectBackImage': that.data.hasCollectImage
            });
          } else {
            that.setData({
              'collectBackImage': that.data.noCollectImage
            });
          }

        } else {
          wx.showToast({
            image: '/static/images/icon_error.png',
            title: _res.errmsg,
            mask: true
          });
        }
      });
  },

  openCartPage: function () {
    wx.switchTab({
      url: '/pages/cart/cart',
    });
  },

  addToCart: function () {
    var that = this;
    console.log(that.data.goods)
    //打开规格选择窗口
    this.setData({
      openAttr: !this.data.openAttr
    });
  },

  addToBuy: function () {
    var that = this;
    console.log(that.data.goods)
    //打开规格选择窗口
    this.setData({
      buyopenAttr: !this.data.buyopenAttr
    });
  },

  cutNumber: function () {
    this.setData({
      number: (this.data.number - 1 > 1) ? this.data.number - 1 : 1
    });
  },
  addNumber: function () {
    this.setData({
      number: (this.data.number + 1 < 100) ? this.data.number + 1 : 99
    });
  },
  buy_cutNumber: function () {
    this.setData({
      number: (this.data.number - 1 > 1) ? this.data.number - 1 : 1
    });
  },
  buy_addNumber: function () {
    this.setData({
      number: (this.data.number + 1 < 100) ? this.data.number + 1 : 99
    });
  },

  confirmAddToCart:function (){
    var that = this;
    //提示选择完整规格
    if (!this.isCheckedAllSpec()) {
      wx.showToast({
        image: '/static/images/icon_error.png',
        title: '请选择规格',
        mask: true
      });
      return false;
    }
    if(!util.isLogin()) {
      console.log("please login")
      that.setData({
        showLoginDialog:true
      });
    } 
    //添加到购物车
    util.request(api.CartAdd, { goodsId: this.data.goods.id, count: this.data.number, selected: true}, "POST")
    .then(function (res) {
      let _res = res;
      if (_res.cd == 0) {
        wx.showToast({
          title: '添加成功'
        });
        that.setData({
          openAttr: !that.data.openAttr,
          cartGoodsCount: _res.data.cartTotal.goodsCount
        });
      } else {
        wx.showToast({
          image: '/static/images/icon_error.png',
          title: _res.errmsg,
          mask: true
        });
      }

    });
  },

  //确认购买
  confirmBuy: function() {
    var that = this;

    if(!util.isLogin()) {
      console.log("please login")
      that.setData({
        showLoginDialog:true
      });
    } 
    util.request(api.OrderGenerate, { goodsId: this.data.goods.id, count: this.data.number, addressId: 0, freight: 0}, "POST")
    .then(function (res) {
      if(res.cd == 0){
        var id = res.data.id;
        wx.navigateTo({
          url: '../shopping/checkout/checkout?id=' + id
        })
      }
    });

  },

  onCloseLoginDialog () {
    this.setData({
      showLoginDialog: false
    })
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

      this.setData({
        showLoginDialog: false
      });
    
      app.globalData.userInfo = e.detail.userInfo;
      app.globalData.token = res.data.token;
      app.globalData.userId = res.data.userId;
      wx.setStorageSync('userInfo', e.detail.userInfo);
      wx.setStorageSync('token', res.data.token);
      wx.setStorageSync('userId',res.data.userId)
    }).catch((err) => {
      console.log(err)
    })
  },

  onShareAppMessage:function (){
    var that = this
    return {
      title: '分享一个链接',
      path: '/pages/goods/goods?id=' + that.data.id,

    }
  }

})