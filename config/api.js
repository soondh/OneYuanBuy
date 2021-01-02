// const baseUrl = "http://47.111.120.237:8000/masbll";
// const baseUrl = "http://122.51.51.11:8001/"; 
// const baseUrl = "https://yiyuangou.online/hh/masbll"
const baseUrl = "http://10.225.10.58:8000/masbll"

module.exports = {
  indexPic: baseUrl + '/insbdexPic', //首页宣传图
  IndexUrl: baseUrl + '/basbnner', //首页banner数据接口
  CategoryList: baseUrl + '/casbtegory', //商品种类
  CategoryInfo: baseUrl + '/casbtegory/gosbods', //特定种类下的商品列表
  GoodsDetail: baseUrl + '/gosbods', //商品详情
  CartAdd: baseUrl + "/casbrt", //添加购物车
  CartList: baseUrl + "/casbrt", //购物车列表
  CartSelected: baseUrl + "/casbrt", //购物车项目选中&取消
  CartSelectedAll: baseUrl + '/casbrt', //购物车全选
  CartUpdate: baseUrl + "/casbrt", //修改购物车信息
  CartDelete: baseUrl + "/casbrt", //删除购物车

  AddressList: baseUrl + "/arsbealist", //获取地址列表
  AddressSavedList: baseUrl + "/adsbdress", //获取收获地址列表
  AddressInfo: baseUrl + "/adsbdress", //获取地址详情
  AddressSaved: baseUrl + "/adsbdress", //保存收货地址
  AddressUpdate: baseUrl + "/adsbdress", //修改收货地址
  AddressDelete: baseUrl + "/adsbdress", //删除收货地址

  OrderInfo: baseUrl + "/orsbder", //获取订单详情
  OrderGenerate: baseUrl + "/orsbder", //生成订单
  OrderAddressUpdate: baseUrl + "/orsbder", //修改订单收货地址
  OrderCancel: baseUrl + '/orsbder',  //取消订单

  PayPrepayId: baseUrl + '/paysb',

  AuthLoginByWeixin: baseUrl + '/login', //微信登陆

  //OrderSubmit: ApiRootUrl + 'order/submit', // 提交订单
  //PayPrepayId: ApiRootUrl + 'pay/prepay', //获取微信统一下单prepay_id

  //OrderExpress: ApiRootUrl + 'order/express', //物流详情

};