// 云函数入口文件
const cloud = require('wx-server-sdk')

// cloud.init()
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const jobs = db.collection('jobs')

exports.main = async (event, context) => {
  // const wxContext = cloud.getWXContext()
  var mem = {}
  for(let key in mem){
      delete mem[key];
  }
  console.log(mem);
  var now = new Date().getTime();
  const _ = db.command
  // var data 
  const res = await jobs.where({
    est_time: _.lt(now)
  }).get()
  if(res.data.length === 0){
    // 没有任务需要处理
    return 0
  }
  const rp = require('request-promise');

  const rptasks = []
  for(let k=0; k<res.data.length; ++k){
    let record = res.data[k]
    if(!mem[record.hexname]){
      const init = {
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          "cookie": "[hide]",
        },
        method: "POST",
        body: "regionId=3&washerHexCode="+record.hexname+"&pageSize=15&pageNo=1",
      }
      let url = "[hide]";
      const pr = rp(url, init).catch(function(reason){
        console.log(reason)
      })
      mem[record.hexname] = true
      rptasks.push(pr)
    }
  }
  const rpresult = await Promise.all(rptasks)
  for(let i=0;i<rpresult.length; i++){
    let state = JSON.parse(rpresult[i])
    for(let j=0;j<state.result.length; j++){
      if(state.result[j].errorStatus===48){
        mem[state.result[j].washerHexCode] = state.result[j].remainRunning
      }
    }
  }
  console.log('res.data')
  console.log(res.data)
  console.log('mem')
  console.log(mem)
  for(let key in mem){
    if(mem[key]===1){
      mem[key]=0;
    }
  }

  const tasks = []
  // 检查洗衣机是否被抢
  for(let k=0; k<res.data.length; ++k){
    let record = res.data[k]
    if(mem[record.hexname]===0){
      continue
    }
    if(!mem[record.hexname]){
      console.log('error#1')
      continue
    }
    if(mem[record.hexname]===true){
      console.log('error#2, mem still true')
    }
    if(mem[record.hexname]!==true && mem[record.hexname]!==0){
      // renew job
      record.est_time = now+mem[record.hexname]*1000*60
      const promise0 = jobs.where({_id: record._id}).update({
        data:{
          est_time: now+mem[record.hexname]*1000*60
        }
      }).catch(function(reason){
        console.log(reason)
      })
      tasks.push(promise0)
    }
  }

  for(let i=0; i<res.data.length; ++i){
    let record = res.data[i]
    if(record.est_time > now) continue;
    const promise0 =  jobs.where({_id: record._id}).remove().catch(function(reason){
      console.log(reason)
    })
    tasks.push(promise0)
    const promise = cloud.openapi.subscribeMessage.send({
      touser: record.openid,
      page: 'page/final/index',
      lang: 'zh_CN',
      data: {
        thing1: {
          value: '洗衣服~'
        },
        thing9: {
          value: record.name
        },
      },
      templateId: '[hide]',
      miniprogramState: 'formal' //跳转小程序类型：developer为开发版；trial为体验版；formal为正式版；默认为正式版
    }).catch(function(reason){
      console.log(reason)
    })
    tasks.push(promise)
  }
  await Promise.all(tasks)
  return res.data
}