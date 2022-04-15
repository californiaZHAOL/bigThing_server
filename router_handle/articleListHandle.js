// mysql数据库
const res = require('express/lib/response');
const mysql = require('mysql');
const db = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '123456',
    // 数据库的名称为bigThing
    database: 'bigThing'
});
const path = require('path');

function getArticlesList(req, res){
    // req.query带来的参数
    // pagenum	是	int	页码值 >0
    // pagesize	是	int	每页显示多少条数据 >0
    // cate_id	否	string	文章分类的 Id  能为空
    // state	否	string	文章的状态，可选值有：已发布、草稿 可能为空

    // 要返回的仅仅是满足条件的文章
    // 格式：res
    //     "status": 0,
    //     "message": "获取文章列表成功！",
    //     "data": [
    //       {
    //         "Id": 1,
    //         "title": "abab",
    //         "pub_date": "2020-01-03 12:19:57.690",
    //         "state": "已发布",
    //         "cate_name": "最新"
    //       },
    //       {
    //         "Id": 2,
    //         "title": "666",
    //         "pub_date": "2020-01-03 12:20:19.817",
    //         "state": "已发布",
    //         "cate_name": "股市"
    //       }
    //     ],
    //     "total": 5
    // }

    // sql语句 初始sql仅仅表示查找所有未删除的文章
    let sql ='select Id, title, pub_date, state, cate_id from articles where is_delete=0';
    if(req.query.cate_id && req.query.state){
        // 如果文章分类和文章状态均存在有效值
        sql += ` and cate_id=${req.query.cate_id} and state='${req.query.state}'`;
    }
    else if(req.query.cate_id){
        // 文章分类为有效值
        sql += ` and cate_id=${req.query.cate_id}`;
    }
    else if(req.query.state){
        // 文章状态为有效值
        sql += ` and state='${req.query.state}'`;
    }

    // 执行查询
    db.query(sql, (err, result) => {
        if(err){
            // 如果执行出错返回错误描述并且结束处理函数
            console.log(err.message);
            return res.send({
                status: 1,
                message: '数据库查询出错'
            });
        }

        // 查询成功

        // 查询到的结果的数量
        let length = result.length;
        // 要第pagenum页，每页要pagesize条数据   2   3  4---6
        let start = Math.max(1, (req.query.pagenum - 1) * req.query.pagesize + 1);
        let end = Math.min(length, req.query.pagenum * req.query.pagesize);
        // 体现在数组中 数组的下标为[start - 1, end - 1]的位置需要被返回
        let data = result.filter((item, index) => index >= start - 1 && index <= end - 1);

        // 在文章分类表查询出所有未删除的文章的 分类id. 分类name
        let sql = `select name, Id from article_cate where is_delete=0`;
        db.query(sql, (err, result) => {
            if(!err){
                // 查询成功
                // 保存文章分类 id->name的对象
                let cateObj = {};
                result.forEach(item => {
                    cateObj[item.Id] = item.name;
                });

                // 给返回的结果加上cate_name属性，删除cate_id属性
                data.map(item => {
                    item.cate_name = cateObj[item.cate_id] || '未知分类';
                    delete item.cate_id;
                    return item;
                });

                // 返回结果
                res.send({
                    "status": 0,
                    "message": "获取文章列表成功！",
                    "data": data,
                    "total": length
                });
            }
            else{
                // 错误
                console.log(err.message);
                return res.send({
                    status: 1,
                    message: '查询文章分类失败'
                });
            }
        });
    });
}

// 根据文章Id删除文章
function deleteArticle(req, res){
    // 获得url参数
    let id = req.params.id || -1;

    // 执行删除
    const sql = `update articles set is_delete=1 where Id=?`;
    db.query(sql, id, (err, results) => {
        if(!err){
            // 如果影响的行数为1
            if(results.affectedRows === 1){
                // 删除成功
                return res.send({
                    status: 0,
                    message: '删除文章成功'
                });
            }
            else{
                return res.send({
                    status: 1,
                    message: '数据库更新失败'
                });
            }
        }
        else{
            // 错误
            console.log(err.message);
            return res.send({
                status: 1,
                message: '数据库更新数据错误'
            });
        }
    });
}

// 根据文章Id返回文章内容
function getArticle(req, res){
    // 获得url参数
    let id = req.params.id || -1;

    // 执行查询
    const sql = `select * from articles where Id=?`;
    db.query(sql, id, (err, results) => {
        if(!err){
            if(results.length !== 1){
                return res.send({
                    status: 1,
                    message: '查询失败'
                });
            }

            // 查询成功
            res.send({
                status: 0,
                message: '获取文章成功',
                data: results[0]
            });
        }
        else{
            // 错误
            console.log(err.message);
            return res.send({
                status: 1,
                message: '数据库查询数据错误'
            });
        }
    });
}

function pubArticle(req, res){
    // console.log(req.file);
    // console.log(req.body);
    // {
    //     fieldname: 'cover_img',
    //     originalname: 'blob',
    //     encoding: '7bit',
    //     mimetype: 'image/png',
    //     destination: 'C:\\Users\\ztlzl\\Desktop\\阶段四_前后端交互\\bigThing_server\\uploads',
    //     filename: '46a2418d9de02030644cb43329283d60',
    //     path: 'C:\\Users\\ztlzl\\Desktop\\阶段四_前后端交互\\bigThing_server\\uploads\\46a2418d9de02030644cb43329283d60',
    //     size: 63924
    //   }
    //   [Object: null prototype] {
    //     title: '计算机啊',
    //     cate_id: '14',
    //     content: '<p>嗯呢</p>',
    //     state: '已发布'
    // }

    let sql = `insert into articles set ?`;
    const info = {
        ...req.body,
        cover_img: '/uploads/' + req.file.filename,
        pub_date: new Date(),
        author_id: req.user.id
    }
    // console.log(info);
    
    db.query(sql, info, (err, result) => {
        if(err){
            return res.send({
                status: 1,
                message: '数据库插入失败'
            });
        }
        // 插入成功
        res.send({
            status: 0,
            message: '发布文章成功！'
        });
    });
}

function editArticle(req, res){
        // console.log(req.file);
    // console.log(req.body);
    // {
    //     fieldname: 'cover_img',
    //     originalname: 'blob',
    //     encoding: '7bit',
    //     mimetype: 'image/png',
    //     destination: 'C:\\Users\\ztlzl\\Desktop\\阶段四_前后端交互\\bigThing_server\\uploads',
    //     filename: '46a2418d9de02030644cb43329283d60',
    //     path: 'C:\\Users\\ztlzl\\Desktop\\阶段四_前后端交互\\bigThing_server\\uploads\\46a2418d9de02030644cb43329283d60',
    //     size: 63924
    //   }
    //   [Object: null prototype] {
    //     title: '计算机啊',
    //     cate_id: '14',
    //     content: '<p>嗯呢</p>',
    //     state: '已发布'
    // }

    let sql = `update articles set ? where Id=?`;
    const info = {
        ...req.body,
        cover_img: path.join('/uploads', req.file.filename)
    }
    // console.log(info);
    
    db.query(sql, [info, info.Id], (err, result) => {
        console.log(err);
        if(err){
            return res.send({
                status: 1,
                message: '数据库更新失败'
            });
        }
        // 插入成功
        res.send({
            status: 0,
            message: '更新文章成功！'
        });
    });
}

module.exports = {
    getArticlesList,
    getArticle,
    deleteArticle,
    pubArticle,
    editArticle
};