var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app = getApp();
Page({
  data: {
    address: {
      addressId:0,
      provinceId: 0,
      province: '',
      cityId: 0,
      city: '',
      districtId: 0,
      district: '',
      content: '',
      fullRegion: '',
      name: '',
      phone: '',
      isDefault: 0
    },
    style: 0,
    addressId: 0,
    openSelectRegion: false,
    selectRegionList: [
      { id: 0, fullname: '省份', type: 1 },
      { id: 0, fullname: '城市', type: 2 },
      { id: 0, fullname: '区县', type: 3 }
    ],
    //leib
    regionType: 1,
    regionList: [],
    selectRegionDone: false
  },
  bindinputMobile(event) {
    let address = this.data.address;
    address.phone = event.detail.value;
    this.setData({
      address: address
    });
  },
  bindinputName(event) {
    let address = this.data.address;
    address.name = event.detail.value;
    this.setData({
      address: address
    });
  },
  bindinputAddress (event){
    let address = this.data.address;
    address.content = event.detail.value;
    this.setData({
      address: address
    });
  },
  bindIsDefault(){
    let address = this.data.address;
    if (address.isDefault == 0) {
      address.isDefault = 1
    } else {
      address.isDefault = 0
    }
    //address.isDefault = !address.isDefault;
    this.setData({
      address: address
    });
  },
  getAddressDetail() {
    let that = this;
    util.request(api.AddressInfo, { addressId: that.data.addressId }).then(function (res) {
      if (res.cd === 0) {
        that.setData({
          address: res.data[0]
        });
      }
    });
  },
  setRegionDoneStatus() {
    let that = this;
    let doneStatus = that.data.selectRegionList.every(item => {
      return item.id != 0;
    });

    that.setData({
      selectRegionDone: doneStatus
    })

  },
  chooseRegion() {
    let that = this;
    this.setData({
      openSelectRegion: !this.data.openSelectRegion
    });

    //设置区域选择数据
    let address = this.data.address;
    if (address.provinceId > 0 && address.cityId > 0 && address.districtId > 0) {
      let selectRegionList = this.data.selectRegionList;
      selectRegionList[0].id = address.provinceId;
      selectRegionList[0].fullname = address.province;

      selectRegionList[1].id = address.cityId;
      selectRegionList[1].fullname = address.city;

      selectRegionList[2].id = address.districtId;
      selectRegionList[2].fullname = address.district;

      this.setData({
        selectRegionList: selectRegionList,
        regionType: 3
      });

      this.getRegionList(3,address.cityId);

    } else {
      this.setData({
        selectRegionList: [
          { id: 0, fullname: '省份', parent_id: 1, type: 1 },
          { id: 0, fullname: '城市', parent_id: 1, type: 2 },
          { id: 0, fullname: '区县', parent_id: 1, type: 3 }
        ],
        regionType: 1
      })
      this.getRegionList(1,0);
    }

    this.setRegionDoneStatus();

  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    let that = this;
    if (options.id != "0") {
      that.setData({
        addressId: options.id
      });
      that.getAddressDetail();
    }

    that.setData({
      style:options.style
    })


    this.getRegionList(1,0);

  },
  onReady: function () {

  },
  selectRegionType(event) {
    let that = this;
    let regionTypeIndex = event.target.dataset.regionTypeIndex;
    let selectRegionList = that.data.selectRegionList;

    //判断是否可点击
    if (regionTypeIndex + 1 == this.data.regionType || (regionTypeIndex - 1 >= 0 && selectRegionList[regionTypeIndex-1].id <= 0)) {
      return false;
    }

    this.setData({
      regionType: regionTypeIndex + 1
    })
    
    let selectRegionItem = selectRegionList[regionTypeIndex];

    if (regionTypeIndex >= 1) {
      this.getRegionList(regionTypeIndex+1,selectRegionList[regionTypeIndex-1].id);
    } else {
      this.getRegionList(1,0)
    }
    this.setRegionDoneStatus();

  },
  selectRegion(event) {
    let that = this;
    let regionIndex = event.target.dataset.regionIndex;
    let regionItem = this.data.regionList[regionIndex];
    let regionType = regionItem.type;
    let selectRegionList = this.data.selectRegionList;
    selectRegionList[regionType - 1] = regionItem;
 
    if (regionType != 3) {
      this.setData({
        selectRegionList: selectRegionList,
        regionType: regionType + 1
      })
      this.getRegionList(regionType + 1,regionItem.id);
    } else {
      this.setData({
        selectRegionList: selectRegionList
      })
    }

    //重置下级区域为空
    selectRegionList.map((item, index) => {
      if (index > regionType - 1) {
        item.id = 0;
        item.fullname = index == 1 ? '城市' : '区县';
        item.parent_id = 0;
      }
      return item;
    });

    this.setData({
      selectRegionList: selectRegionList
    })


    that.setData({
      regionList: that.data.regionList.map(item => {

        //标记已选择的
        if (that.data.regionType == item.type && that.data.selectRegionList[that.data.regionType - 1].id == item.id) {
          item.selected = true;
        } else {
          item.selected = false;
        }

        return item;
      })
    });

    this.setRegionDoneStatus();

  },
  doneSelectRegion() {
    if (this.data.selectRegionDone === false) {
      return false;
    }

    let address = this.data.address;

    let selectRegionList = this.data.selectRegionList;
    address.provinceId = selectRegionList[0].id;
    address.cityId = selectRegionList[1].id;
    address.districtId = selectRegionList[2].id;
    address.province = selectRegionList[0].fullname;
    address.city = selectRegionList[1].fullname;
    address.district = selectRegionList[2].fullname;
    address.fullRegion = selectRegionList.map(item => {
      return item.fullname;
    }).join('');

    this.setData({
      address: address,
      openSelectRegion: false
    });

  },
  cancelSelectRegion() {
    this.setData({
      openSelectRegion: false,
      regionType: this.data.regionDoneStatus ? 3 : 1
    });

  },
  getRegionList(level, selectedId) {
    let that = this;
    let regionType = that.data.regionType;
    util.request(api.AddressList, { level: level, selectedId: selectedId }).then(function (res) {
      if (res.cd === 0) {
        that.setData({
          regionList: res.data.map(item => {

            //标记已选择的
            if (regionType == item.type && that.data.selectRegionList[regionType - 1].id == item.id) {
              item.selected = true;
            } else {
              item.selected = false;
            }

            return item;
          })
        });
      }
    });
  },
  cancelAddress(){
    wx.setStorageSync("addressEdit",false)
    wx.navigateBack()
    /*
    wx.navigateTo({
      url: '/pages/ucenter/address/address',
    })
    */
  },
  saveAddress(){
    let address = this.data.address;

    if (address.name == '') {
      util.showErrorToast('请输入姓名');

      return false;
    }

    if (address.mobile == '') {
      util.showErrorToast('请输入手机号码');
      return false;
    }


    if (address.districtId == 0) {
      util.showErrorToast('请输入省市区');
      return false;
    }

    if (address.address == '') {
      util.showErrorToast('请输入详细地址');
      return false;
    }


    let that = this;
    if (that.data.addressId == 0) {
    util.request(api.AddressSaved, { 
      id: address.id,
      name: address.name,
      phone: address.phone,
      provinceId: address.provinceId,
      province:address.province,
      cityId: address.cityId,
      city:address.city,
      districtId: address.districtId,
      district:address.district,
      fullRegion:address.fullRegion,
      content: address.content,
      isDefault: address.isDefault,
    }, 'POST').then(function (res) {
      if (res.cd === 0) {
        wx.setStorageSync("addressEdit",true)
        wx.navigateBack()
        /*
        wx.redirectTo({
          url: '/pages/ucenter/address/address',
        })
        */
      }
    });
  } else {
    util.request(api.AddressUpdate, { 
      id: address.id,
      name: address.name,
      phone: address.phone,
      provinceId: address.provinceId,
      province:address.province,
      cityId: address.cityId,
      city:address.city,
      districtId: address.districtId,
      district:address.district,
      fullRegion:address.fullRegion,
      content: address.content,
      isDefault: address.isDefault,
    }, 'PUT').then(function (res) {
      if (res.cd === 0) {
        wx.setStorageSync("addressEdit",true)
        wx.navigateBack()
        /*
        wx.redirectTo({
          url: '/pages/ucenter/address/address',
        })
        */
      }
    });
  }

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

  deleteAddress(event){
    let that = this;
    let addressID2delete = that.data.address.id
    wx.showModal({
      title: '',
      content: '确定要删除地址？',
      success: function (res) {
        if (res.confirm) {
          //删除地址的参数id必须跟在url串中，不要传json
          util.request(api.AddressDelete + '?id=' + addressID2delete, {}, "DELETE").then(function (res) {
            if (res.cd == 0) {
              wx.setStorageSync("addressEdit",true)
              if (addressID2delete == wx.getStorageSync("addressSelected").id)
              {
                wx.setStorageSync("addressSelected",{})
                wx.setStorageSync("deleteSelectAddress",true)
              }
              wx.navigateBack()
            }
          });
          
        }
      }
    })
    return false;
    
  },
})