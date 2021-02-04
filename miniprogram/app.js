const config = require('./config')
App({
  
  onLaunch(opts, data) {
    const that = this;
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: config.envId,
        traceUser: true,
      })
    }
    wx.setStorageSync('usernum', 0)
    wx.setStorageSync('tasknum', 0)
    wx.cloud.callFunction({
      name: 'statistic',
      data: {},
      success: function(res) {
        // wx.hideLoading()
        // console.log(res)
        wx.setStorageSync('usernum',res.result.usernum)
        wx.setStorageSync('tasknum',res.result.tasknum)
      },
      fail: console.error
    })
  },
  onShow(opts) {
    console.log('App Show', opts)
    // console.log(wx.getSystemInfoSync())
  },
  onHide() {
    console.log('App Hide')
  },
  globalData: {
    theme: wx.getSystemInfoSync().theme
  }
})
