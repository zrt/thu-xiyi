// 云函数入口文件
const cloud = require('wx-server-sdk')

// cloud.init()
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const binding = db.collection('binding')
const jobs = db.collection('jobs')

// 云函数入口函数
exports.main = async (event, context) => {
  // const wxContext = cloud.getWXContext()
  const tasks = [binding.count(), jobs.count()]
  const result = await Promise.all(tasks)
  return {
    usernum: result[0].total,
    tasknum: result[1].total
  }
}