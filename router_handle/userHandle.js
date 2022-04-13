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

function infoHandle(req, res){
    // { id: 3, iat: 1649810665, exp: 1649813665 }
    // console.log(req.user);
    
    // 令牌验证通过
    const id = req.user.id || -1;

    // 在数据库中根据id查询
    db.query(`select * from users where id=${id}`, (err, result) => {
        if(err){
            // 如果执行出错返回错误描述并且结束处理函数
            console.log(err.message);
            return res.send({
                status: 1,
                message: '数据库查询出错',
                data: {
                    id: 0,
                    username: '',
                    nickname: '',
                    email: '',
                    user_pic: ''
                }
            });
        }

        // 查询成功
        if(result.length  === 1){
            // 该用户存在
            // console.log(result);
            // [
            //     RowDataPacket {
            //       id: 3,
            //       username: 'zhaole',
            //       password: '$2a$10$1TKOdmQcR283ZFy3pNon1OZAeF/aFa5ZbzEkfYtwMZtz5SXGFPrTW',
            //       nickname: null,
            //       email: null,
            //       user_pic: null
            //     }
            // ]

            return res.send({
                status: 0,
                message: '获取用户基本信息成功',
                data: {
                    id: result[0].id,
                    username: result[0].username || '',
                    nickname: result[0].nickname || '',
                    email: result[0].email || '',
                    user_pic: result[0].user_pic || ''
                }
            });
        }
        else{
            // 该用户不存在
            return res.send({
                status: 1,
                message: '不存在的用户',
                data: {
                    id: 0,
                    username: '',
                    nickname: '',
                    email: '',
                    user_pic: ''
                }
            });
        }     
    });
}

function infoHandlePost(req, res){
    // 令牌验证通过

    // 验证令牌保存的id和请求的id是否相同
    if(req.user.id != req.body.id){
        // 如果不相同，客户端涉嫌hack行为伪造令牌
        return res.send({
            status: 1,
            message: '令牌伪造'
        });
    }

    // 获取要修改的用户的id
    const id = req.body.id || -1;

    const data = {nickname: req.body.nickname || '', email: req.body.email || '', id: id};
    const sql = 'update users set ? where id=?';
    
    // 在数据库中根据id执行修改
    db.query(sql, [data, data.id], (err, result) => {
        if(err){
            // 如果执行出错返回错误描述并且结束处理函数
            console.log(err.message);
            return res.send({
                status: 1,
                message: '数据库查询出错'
            });
        }

        // 查询成功
        // 受影响的行为1
        if(result.affectedRows  === 1){
            return res.send({
                status: 0,
                message: '修改信息成功'
            });
        }
        else{
            return res.send({
                status: 1,
                message: '不存在的用户'
            });
        }     
    });
}

function updatepwdHandle(req, res){
     // 令牌验证通过

    // 获取token带来的用户id
    const id = req.user.id || -1;

    // 在数据库中根据id查询密码
    db.query(`select password from users where id='${id}'`, (err, result) => {
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
            if(!bcrypt.compareSync(req.body.oldPwd, result[0].password)){
                // 密码验证失败
                return res.send({
                    status: 1,
                    message: '原密码错误'
                });
            }

            // 密码验证成功
            // 执行修改密码操作
            // 用bcryptjs模块对用户的新密码进行加密存储在数据库中
            req.body.newPwd = bcrypt.hashSync(req.body.newPwd, 10);
            const data = {password: req.body.newPwd, id: id};
            const sql = 'update users set ? where id=?';
            
            // 在数据库中根据id执行修改
            db.query(sql, [data, data.id], (err, result) => {
                if(err){
                    // 如果执行出错返回错误描述并且结束处理函数
                    console.log(err.message);
                    return res.send({
                        status: 1,
                        message: '数据库查询出错'
                    });
                }
                // 修改成功
                return res.send({
                    status: 0,
                    message: '修改密码成功'
                });
            });
        }
        else{
            // 该用户不存在
            return res.send({
                status: 1,
                message: `用户不存在`
            });
        }      
    });
}

function updateAvatarHandle(req, res){
    // /my/update/avatar
    // 令牌验证通过
    // 获取要改变头像的用户的id
    const id = req.user.id || -1;

    const data = {user_pic: req.body.avatar || '', id: id};
    const sql = 'update users set ? where id=?';
    
    // 在数据库中根据id执行修改头像
    db.query(sql, [data, data.id], (err, result) => {
        if(err){
            // 如果执行出错返回错误描述并且结束处理函数
            console.log(err.message);
            return res.send({
                status: 1,
                message: '数据库查询出错'
            });
        }

        // 查询成功
        // 受影响的行为1
        if(result.affectedRows  === 1){
            return res.send({
                status: 0,
                message: '修改头像成功'
            });
        }
        else{
            return res.send({
                status: 1,
                message: '不存在的用户'
            });
        }     
    });
}

// 暴露
module.exports = {
    infoHandle,
    infoHandlePost,
    updatepwdHandle,
    updateAvatarHandle
}