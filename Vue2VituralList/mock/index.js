//使用 Mock 构建本地服务器输出数据结果
const Mock = require('mockjs')
const express = require('express')
const app = express()
//根据传入的参数num,生成num条模拟的数据列表
function generatorList(num) {
    return Mock.mock({
        [`list|${num}`]: [{
            //模拟ID, 自增方式追加
            'id|+1': 1,
            //模拟标题,中文字符串15-25位
            title: '@ctitle(15,25)',
            //模拟图片索引, 自然数0-11
            image: '@natural(0,11)',
            //模拟访问人数, 自然数0-9999
            reads: '@natural(0,9999)',
            //模拟来源,中文字符串3-10位
            from: '@ctitle(3,10)',
            //模拟时间, 时间格式
            date: '@date(yyyy-MM-dd)'
        }]
    })
}

//允许跨域请求返回数据
app.all('*', function (req, res, next) {
    res.header('Access-control-Allow-Origin', '*')
    res.header('Access-control-Allow-Methods', 'PUT,GET,POST,DELETE,OPTIONS')
    res.header('Access-control-Allow-Headers', 'X-Requested-With')
    res.header('Access-control-Allow-Headers', 'Content-Type')
    next()
})

//截取路由并反馈数据
app.get('/data', function (req, res) {
    //获取get请求数据条数参数 num
    const { num } = req.query
    return res.send(generatorList(num))
})

const server = app.listen(4000, function () {
    console.log('本地MOCK服务器已启动：http://localhost:4000/data?num=请求列表数量');
})
console.log(server);