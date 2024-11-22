/* jshint esversion: 6 */
const express = require ('express');
const compression = require('compression');
const app = express();
const https = require('https');
const fs = require('fs');

const options = {
  cert: fs.readFileSync('./full_chain.pem'),
  key: fs.readFileSync('./private.key')
};

//一定把这一行代码写在静态资源托管之前
//静态资源压缩
app.use(compression());
//静态资源托管
app.use(express.static('./dist'));

app.listen(80, () => {
  console.log('server running at http://127.0.0.1');
});


// 创建https服务器
// https.createServer(options,app).listen(443);