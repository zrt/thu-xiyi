// 云函数入口文件
const cloud = require('wx-server-sdk')
var rp = require('request-promise');

// cloud.init()
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  // const wxContext = cloud.getWXContext()
  // return 'ok'

  const init = {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      "cookie": "[hide]",
    },
    method: "POST",
    body: "regionId=3&washerHexCode="+event.hexname+"&pageSize=15&pageNo=1",
  }

  let url = "[hide]";
  return await rp(url, init)
    .then(function (res) {
      return res
    })
    .catch(function (err) {
      return '失败'
    });
}
