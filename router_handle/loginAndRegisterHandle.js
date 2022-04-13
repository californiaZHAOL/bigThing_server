// 登录注册的路由模块的处理模块

// mysql数据库
const mysql = require('mysql');
const db = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '123456',
    // 数据库的名称为bigThing
    database: 'bigThing'
});

// bcryptjs加密模块
const bcrypt = require('bcryptjs');

// jsonwebtoken模块
const jwt = require('jsonwebtoken');

// 加密Token的密码
const secretKey = 'anskj@#dds@#&kj$s#dsj@d*#&@dfasdmcm';

// 处理注册请求
function registerHandle(req, res){
    // 获取提交到服务器的数据
    // 要获取客户端提交的表单数据，需要注册解析表单的中间件
    // 这里使用bodyparse插件，在app.js中注册
    // data为一个对象

    if(!req.body.username || !req.body.password){
        // 用户名和密码有一项为空都不行
        return res.send({
            status: 1,
            message: '用户名和密码不能为空'
        });
    }

    // console.log(data);
    // [Object: null prototype] { username: 'itle', password: '111111' }
    const data = req.body;

    // 在数据库中查询是否有username等于当前data.username的记录
    db.query(`select count(*) from users where username='${data.username}'`, (err, result) => {
        if(err){
            // 如果执行出错返回错误描述并且结束处理函数
            console.log(err.message);
            return res.send({
                status: 1,
                message: '数据库查询出错'
            });
        }

        // 查询成功
        // console.log(result);
        // [ RowDataPacket { 'count(*)': 0 } ]
        
        if(result[0]['count(*)'] !== 0){
            // 有重名
            return res.send({
                status: 1,
                message: '用户名已被注册'
            });
        }
        else{
            // 没有重名
            // 把用户数据存储到数据库

            // 用bcryptjs模块对用户的密码进行加密存储在数据库中
            data.password = bcrypt.hashSync(data.password, 10);

            // 插入信息到数据库
            const sql = 'insert into users set ?';
            db.query(sql, data, (err, results) => {
                if(!err){
                    // 如果影响的行数为1
                    if(results.affectedRows === 1){
                        // 插入成功
                        return res.send({
                            status: 0,
                            message: '注册成功'
                        });
                    }
                }
                else{
                    // 错误
                    console.log(err.message);
                    return res.send({
                        status: 1,
                        message: '数据库插入数据错误'
                    });
                }
            });
        }
    });
}

// 处理登录请求
function loginHandle(req, res){
    // 登录请求要返回一个代表用户信息的token字符串
    
    //用户名和密码不能为空
    if(!req.body.username || !req.body.password){
        // 用户名和密码有一项为空都不行
        return res.send({
            status: 1,
            message: '用户名和密码不能为空'
        });
    }

    // 表单数据
    const data = req.body;

    // 查询该用户是否存在
    // 如果存在就查询他的密码
    db.query(`select password,id from users where username='${data.username}'`, (err, result) => {
        if(err){
            // 如果执行出错返回错误描述并且结束处理函数
            console.log(err.message);
            return res.send({
                status: 1,
                message: '数据库查询出错'
            });
        }

        // 查询成功
        if(result.length !== 0){
            // 该用户存在
            // 验证密码
            if(!bcrypt.compareSync(data.password, result[0].password)){
                // 密码验证失败
                return res.send({
                    status: 1,
                    message: '密码错误'
                });
            }

            // 密码验证成功
            res.send({
                status: 0,
                message: '登录成功',
                // jwt.sign() 方法生成 JWT 字符串
                // 参数：信息对象，秘钥，配置对象
                // expiresIn: '3000s'表示token有效期3000s
                // token要固定加上'Bearer '头
                token: 'Bearer ' + jwt.sign({id: result[0].id}, secretKey, {expiresIn: '3000s'}) // 要发送给客户端的 token 字符串
            });
        }
        else{
            // 该用户不存在
            return res.send({
                status: 1,
                message: `用户${data.username}不存在`
            });
        }     
    });
}

// 暴露方法
module.exports = {
    registerHandle,
    loginHandle,
    'secretKey': secretKey
}