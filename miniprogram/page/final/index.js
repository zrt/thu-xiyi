// miniprogram/page/final/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    state:{},
    washer:{},
    lastupdate: 0,
    never_pull: true,
    loading: false,
    text: ''
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
  getstate: function(){
    var that = this
    wx.cloud
      .callFunction({
        name: 'getstate',
        data: {},
        success: function(res){
          // wx.hideLoading()
          wx.stopPullDownRefresh()
          that.setData({loading: false})
          wx.vibrateShort({
            type: 'light'
          })
          console.log(res)
          let state = res.result
          that.setData({text: state.text})
          if(state.jobs){
            let now = new Date().getTime()
            state.jobs.est_time = parseInt((state.jobs.est_time - now)/1000/60+3)
          }
          that.setData({
            state: state
          })
          if(state.binding){
            wx.cloud.callFunction({
              name: 'washhex',
              data: {hexname: state.binding.hexname},
              success: function(res) {
                // wx.hideLoading()
                // logg(res.result)
                // console.log(res)
                let result = JSON.parse(res.result)
                // that.setData({result_desc: '查到'+result.result.length+'台洗衣机'})
                let now = new Date().getTime()
                for(let i=0;i<result.result.length; i++){
                  if(state.binding.hexname===result.result[i].washerHexCode){
                    // console.log(result.result[i])
                    result.result[i].lastUpdateTime = parseInt((now - result.result[i].lastUpdateTime)/1000)
                    if(result.result[i].errorStatus === 48 ){
                      result.result[i].state = '正常('+result.result[i].runingStatus+")"
                    }else{
                      result.result[i].state = '异常('+result.result[i].errorStatus+","+result.result[i].runingStatus+")"
                    }
                    that.setData({
                      washer: result.result[i],
                      lastupdate: new Date().getTime()
                    })
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
        }
      })
      
  },
  subs: function(){
    var that = this
    wx.requestSubscribeMessage({
      tmplIds: ['[hide]'],
      success(res){
        if(res['[hide]'] === 'accept'){
          wx.showLoading({
            title: '正在设置',
          })
          wx.cloud
            .callFunction({
              name: 'newjob',
              data: {
                name: that.data.state.binding.name,
                hexname: that.data.state.binding.hexname,
                est_time: that.data.lastupdate + that.data.washer.remainRunning*60*1000
              },
              success: function(res){
                wx.hideLoading()
                that.setData({
                  loading:true
                })
                that.getstate()
              }
            })
          }else{
            wx.showToast({
              title: '订阅失败',
              icon: 'none',
              duration: 2000,
            })
          }
        }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    wx.hideTabBarRedDot({index:0})
    that.setData({
      loading: true,
    })
    that.getstate()
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
    // getState
    this.setData({
      never_pull: false
    })
    this.setData({
      loading: true,
    })
    // getState
    this.getstate()
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