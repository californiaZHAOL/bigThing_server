// router文件夹仅仅存放路由
// router_handle文件夹存放路由处理逻辑

// express: 快速搭建web服务器框架
// nodemon: 修改自启动项目
// body-parser: 解析表单数据
// mysql: 操作mysql数据库插件
// bcryptjs: 加密模块
// jsonwebtoken: 用于生成token
// express-jwt: 中间件，用于将jwt字符串解析还原成json对象
// cors: 解决跨域问题中间件

// npm init -y
// npm i express@4.17.1
// npm i nodemon 
// npm i body-parser
// npm i mysql
// npm i bcryptjs
// npm i jsonwebtoken express-jwt
// npm i cors

const express = require('express');
// 创建app的实例
const app = express();

// 配置跨域中间件
app.use(require('cors')());

// express-jwt用来解析jwt字符串
const expressJWT = require('express-jwt');
// 从另一个文件获得secretKey
const loginAndRegisterHandle = require('./router_handle/loginAndRegisterHandle.js');
let secretKey = loginAndRegisterHandle.secretKey;
// 配置解析的中间件
// 但是以api开头的不需要token解析
// 这个中间件会挂载req.user属性
app.use(expressJWT({secret: secretKey, algorithms: ['HS256']}).unless({path: [/^\/api\//]}));

// 配置解析表单数据的中间件
const parser = require('body-parser');
app.use(parser.urlencoded({extended: false}));

// 注册路由模块
let router = require('./router/loginAndRegister');
app.use(router);
router = require('./router/user');
app.use(router);

// 配置错误处理中间件
// express-jwt解析jwt字符串错误
app.use(require('./router_error/userinfoError'));

// 开启服务
app.listen(80, () => {
    console.log('server is running on http://127.0.0.1');
})