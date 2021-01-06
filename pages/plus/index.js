
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isIphoneX: getApp().globalData.isIphoneX,
    repeatBool: true, // 防止重复请求
    payData: {}, // 支付配置参数
    radio: '1',//默认选中单选框
    vipType:0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(wx.getStorageSync('userInfoData').uid!==undefined){
      this.checkUserVip();
    }
    
  },
  //判断是否是VIP
  checkUserVip(){
    let that=this;
    getApp()
      .globalData.api.checkUserVip({
        uid:wx.getStorageSync('userInfoData').uid
      }).then(res=>{
        if (res.bol == true){
          that.setData({
            vipType:res.data.is_vip,
          })
        }else{
        wx.showToast({ title: "获取数据失败，请稍后重试哟~", icon: "none" });
        }
   })
  },

  
 // 点击立即支付(单独购买599)
   goPayFn() {
    let that = this;
    that.setData({ repeatBool: false }); // 防止重复请求
    let bindPhone = wx.getStorageSync('bindPhone');
    let token = wx.getStorageSync('userInfoData').token;
      wx.getSetting({
        success: res => {
          console.log(res.authSetting['scope.userInfo'],'---')
          if (!res.authSetting['scope.userInfo']  || token==undefined || bindPhone=='') {
                wx.reLaunch({
                 url: '/pages/login/index'
                })
          }else{
            // 请求接口获取唤醒支付的参数
              that.unifiedPay();
          }
        }
      })
    
  },
  //新支付统一接口 599
  unifiedPay(){
    let that=this;
    var jsonDatas={};
      let datas = {
            uid: wx.getStorageSync('userInfoData').uid,
            vid: 2,//2单独购买
            payChoice:2
          };
      jsonDatas= JSON.stringify(datas)
    getApp()
      .globalData.api.unifiedPay({
        type:2,
        json:jsonDatas
      })
      .then(res => {
        // 得到支付需要的参数信息
        if (res.bol == false) {
          return wx.showToast({ title: res.err_msg, icon: "none" });
        } 
        that.setData({
          payData: res.data,
        })
        that.arousePayFn();
      });
  },
  // 唤起支付弹框
  arousePayFn() {
    let that = this;
    let payData = that.data.payData;
    wx.requestPayment({
      timeStamp: payData.timeStamp.toString(),
      nonceStr: payData.nonceStr,
      package: payData.package,
      signType: payData.signType,
      paySign: payData.sign,
      success(res) {
        wx.navigateToMiniProgram({
          appId: 'wxc7e3c8a2629a168b',//小程序appid
          path: 'pages/member/my/index',//跳转关联小程序app.json配置里面的地址
          extraData: {//需要传递给目标小程序的数据，目标小程序可在 App.onLaunch()，App.onShow() 中获取到这份数据。
            name:'plus小程序'
          },
         //**重点**要打开的小程序版本，有效值 develop（开发版），trial（体验版），release（正式版） 
          envVersion: 'release',
          success(res) {
            // 打开成功
            console.log(res,'小程序跳转成功')
          },
          fail(res){
            console.log(res,'小程序跳转失败')
          }
        })
      },
      fail(res) {
        that.setData({ repeatBool: true });
        console.log(res,'支付失败,请求重试')
        wx.showToast({ title: "支付失败,请求重试", icon: "none" });
      },
      complete(res) {
        that.setData({ repeatBool: true });
      }
    });
  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
   
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (options) {
    // if (options.from === 'button') {
    //   // 来自页面内转发按钮
    // }
    // return {
    //   title: '快来拼团吧！',
    //   path: `/pages/course/plus/index?uid=${wx.getStorageSync("userInfoData").uid}`,
    // }
  }
})