// 云函数入口文件
const cloud = require('wx-server-sdk')

// cloud.init()
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const jobs = db.collection('jobs')
const binding = db.collection('binding')


// 云函数入口函数
exports.main = async (event, context) => {
  var TEXT = ''
  // const wxContext = cloud.getWXContext()
  const {
    OPENID
  } = cloud.getWXContext()
  if(OPENID==='[hide]'){
    TEXT='是卿卿呐~'
  }else if(OPENID==='[hide]'){
    TEXT='是自己诶~'
  }
  // 1. check db jobs
  // show jobs
  const result = await jobs.where({
    openid: OPENID
  }).get()
  if(result.data.length !== 0){
    return {
      jobs:{
        name: result.data[0].name,
        hexname: result.data[0].hexname,
        est_time: result.data[0].est_time
      },
      text: TEXT
    }
  }
  
  // 2. if no jobs, check binding & binding state

  // 3. no bindings
  // jump to bind
  const result2 = await binding.where({
    openid: OPENID
  }).get()
  // return result2
  if(result2.data.length === 0){
    return {
      nobinding: true,
      text: TEXT
    }
  }
  // show state
  bindingstate = result2.data[0]
  return {
    binding: {
      name: bindingstate.name,
      hexname: bindingstate.hexname
    },
    text: TEXT
  }
}