// 云函数入口文件
const cloud = require('wx-server-sdk')

// cloud.init()
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const binding = db.collection('binding')
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  // const wxContext = cloud.getWXContext()
  const {
    OPENID
  } = cloud.getWXContext()
  // event.name
  // event.hexname
  const result = await binding.where({
    openid: OPENID
  }).get()
  // return result
  if(result.data.length === 0){
    await binding.add({
      data: {
        name: event.name,
        hexname: event.hexname,
        openid: OPENID
      }
    })
    return 'new'
  }else{
    await binding.where({
      openid: OPENID
    }).update({
      data: {
        name: event.name,
        hexname: event.hexname
      }
    })
    return 'update'
  }
  // return 'ok'
}