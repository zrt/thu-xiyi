// miniprogram/page/final/setting.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    result_desc: '',
    list: [],
    kw: '26号楼',
    hexname: '000003E5',
    loading: false
  },
  bindKeyInput(e){
    // console.log(e)
    this.setData({
      kw: e.detail.value
    })
  },
  bindKeyInput2(e){
    // console.log(e)
    this.setData({
      hexname: e.detail.value
    })
  },
  search(){
    // search kw
    // result to list
    this.setData({loading: true})
    // wx.showLoading({
    //   title: '查询中',
    // })
    let kw = this.data.kw
    var that = this
    wx.cloud.callFunction({
      name: 'wash',
      data: {kw: kw},
      success: function(res) {
        // wx.hideLoading()

        that.setData({loading: false})
        // logg(res.result)
        // console.log(res)
        let result = JSON.parse(res.result)
        that.setData({result_desc: '查到'+result.result.length+'台洗衣机'})
        let now = new Date().getTime()
        for(let i=0;i<result.result.length; i++){
          result.result[i].lastUpdateTime = parseInt((now - result.result[i].lastUpdateTime)/1000)
          if(result.result[i].errorStatus === 48 ){
            result.result[i].state = '正常('+result.result[i].runingStatus+")"
          }else{
            result.result[i].state = '异常('+result.result[i].errorStatus+","+result.result[i].runingStatus+")"
          }
        }
        that.setData({
          list: result.result
        })
        console.log(result.result)
      },
      fail: console.error
    })
  },
  searchhex(){
    // search hexname
    // result to list
    var that = this

    wx.scanCode({
      onlyFromCamera: false,
      success: function(res){
        console.log(res)
        if(!res.result){
          wx.showToast({
            title: '这个码不对',
            icon: 'none',
            duration: 2000,
          });
          return
        }

        // wx.showLoading({
        //   title: '查询中',
        // })
        let hexname = res.result
        let invalid = false
        if(hexname.length <=5 || hexname.length > 10) invalid = true;
        for(let i=0;i<hexname.length && !invalid;i++){
          if(!((hexname[i]>='a'&&hexname[i]<='f') || (hexname[i]>='A'&&hexname[i]<='F') || (hexname[i]>='0'&&hexname[i]<='9'))){
            invalid = true;
          }
        }
        if(invalid){
          wx.showToast({
            title: '这个码不对',
            icon: 'none',
            duration: 2000,
          });
          return
        }

        that.setData({loading: true})
        wx.cloud.callFunction({
          name: 'washhex',
          data: {hexname: hexname},
          success: function(res) {
            that.setData({loading: false})
            // logg(res.result)
            // console.log(res)
            let result = JSON.parse(res.result)
            that.setData({result_desc: '查到'+result.result.length+'台洗衣机'})
            let now = new Date().getTime()
            for(let i=0;i<result.result.length; i++){
              result.result[i].lastUpdateTime = parseInt((now - result.result[i].lastUpdateTime)/1000)
              if(result.result[i].errorStatus === 48 ){
                result.result[i].state = '正常('+result.result[i].runingStatus+")"
              }else{
                result.result[i].state = '异常('+result.result[i].errorStatus+","+result.result[i].runingStatus+")"
              }
            }
            that.setData({
              list: result.result
            })
            console.log(result.result)
          },
          fail: console.error
        })
      }
    })

  },
  kindToggle(e) {
    const id = e.currentTarget.id
    const list = this.data.list
    for (let i = 0, len = list.length; i < len; ++i) {
      if (list[i].washerHexCode === id) {
        list[i].open = !list[i].open
      } else {
        list[i].open = false
      }
    }
    this.setData({
      list
    })
    // wx.reportAnalytics('click_view_programmatically', {})
  },
  bind(e){
    console.log(e)
    const id = e.currentTarget.id
    const list = this.data.list
    wx.showLoading({
      title: '绑定中',
    })
    for (let i = 0, len = list.length; i < len; ++i) {
      if (list[i].washerHexCode === id) {
        wx.cloud
          .callFunction({
            name: 'bind',
            data: {
              name: list[i].washerName,
              hexname: list[i].washerHexCode
            },
          })
          .then((e) => {
            // logg(e)
            wx.hideLoading()
            console.log(e)
            wx.showToast({
              title: '绑定成功',
              icon: 'success',
              duration: 2000,
            });
            wx.showTabBarRedDot({index:0})
          })
          .catch((e) => {
            // logg(e)
            console.log(e)
            wx.hideLoading()
            wx.showToast({
              title: '绑定失败',
              icon: 'none',
              duration: 2000,
            });
          });
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  onShareAppMessage: function () {

  }
})