// 云函数入口文件
const cloud = require('wx-server-sdk')

// cloud.init()
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const jobs = db.collection('jobs')

// 云函数入口函数
exports.main = async (event, context) => {
  // const wxContext = cloud.getWXContext()
  const {
    OPENID
  } = cloud.getWXContext()
  var now = new Date().getTime();
  var est_time = parseInt(event.est_time)
  if(est_time > now && est_time <= now+1000*60*60*4){
    await jobs.add({
      data: {
        name: event.name,
        hexname: event.hexname,
        est_time: est_time,
        add_time: now,
        openid: OPENID
      }
    })
    return {
      name: event.name,
      hexname: event.hexname,
      est_time: est_time,
      add_time: now,
      openid: OPENID
    }
  }else{
    return 'gg'
  }
  
}