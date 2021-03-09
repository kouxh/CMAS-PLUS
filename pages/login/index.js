const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    hasBindMobile:false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    encryptedInfo:'',
    ivInfo:'',
    code:'',//登录code1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this;
    // wx.login({
    //   success(res) {
    //     if(res.code){
    //       that.setData({
    //         code:res.code
    //       })
    //     }
    //   }
    // })
    let token = wx.getStorageSync('userInfoData').token
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo'] && !that.data.hasBindMobile && token) {
          wx.getUserInfo({
            success: function (res) {
              app.globalData.userInfo = res.userInfo
              //用户已经授权过
              wx.reLaunch({
                url: "/pages/plus/index"
              })
            }
          });
        }
      }
    })

  },
  // 微信授权
  getUserInfo: function (e) {
    if(e.detail.userInfo){
       //用户按了允许授权按钮
       wx.showToast({
        title: '授权成功',
        icon: 'success',
        duration: 1000
      })
       app.globalData.userInfo = e.detail.userInfo
      //  wx.setStorageSync('www',e.detail.userInfo)
       console.log(e,'用户授权e.detail.userInfo')
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true,
        hasBindMobile:true,
        encryptedInfo: e.detail.encryptedData,//用户授权的加密数据
        ivInfo: e.detail.iv,//用户授权的iv
      })
      console.log(this.data.hasBindMobile,'0000this.data.hasBindMobile')
    }else{
       //用户按了拒绝按钮
       wx.showModal({
         title:'警告',
         content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
         showCancel: false,
         confirmText: '返回授权',
         success: function(res) {
          if (res.confirm) {
              console.log('用户点击了“返回授权”');
          }
      }

       })
    }
  },
  // 手机号授权
  getPhoneNumber (e) {
    console.log(e,'手机号授权888')
      let that = this;
    if (e.detail.encryptedData) {
      wx.setStorageSync('bindPhone', true)
      //用户点击允许
      // wx.login({
        // success(res) {
          var datas = {
            code:that.data.code,
            encryptedDataInfo: that.data.encryptedInfo,
            ivInfo: that.data.ivInfo,
            encryptedDataPhone: encodeURI(e.detail.encryptedData),
            ivPhone: e.detail.iv,
            type:2
          };

          var jsonStr = JSON.stringify(datas)
          wx.showLoading({
            title: "登录中...",
            mask: true
          });
          // 小程序授权绑定手机号接口成功之后弹框消失
          getApp()
            .globalData.api.login({json:jsonStr})
            .then(res1 => {
              if(!res1.bol){
                    wx.showToast({
                      title: "绑定失败",
                      icon: "none"
                    });
              }else{
                  wx.showToast({
                      title: '登录成功',
                      icon: 'success',
                      duration: 2000
                });
                wx.setStorageSync('userInfoData', res1.data)
                wx.hideLoading();
                wx.reLaunch({
                    url: "/pages/plus/index"
                  })
              }
             
            });
      //   }
      // });
    } else {
      //用户点击拒绝
      wx.showModal({
        title:'警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function(res) {
         if (res.confirm) {
             console.log('用户点击了“返回授权”');
         }
     }

      })
    }
    
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
    //登录态刷新
    let that=this;
    wx.login({
      success(res) {
        if(res.code){
          that.setData({
            code:res.code
          })
        }
      }
    })
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
  onShareAppMessage: function () {

  }
})