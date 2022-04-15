// mysql数据库
const mysql = require('mysql');
const db = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '123456',
    // 数据库的名称为bigThing
    database: 'bigThing'
});

function getArticleList(req, res){
    // 到这里令牌验证就通过了

    // 进行查询 查询没有被删除的文章
    let sql = 'select * from article_cate where is_delete=0';
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
        res.send({
            status: 0,
            message: '获取文章分类列表成功',
            data: result
        });   
    });
}

function addArticleCate(req, res){
    // 取得要插入的数据
    let data = {
        name: req.body.name || '',
        alias: req.body.alias || ''
    }

    // 数据库插入
    // 插入信息到数据库
    const sql = 'insert into article_cate set ?';
    db.query(sql, data, (err, results) => {
        if(!err){
            // 如果影响的行数为1
            if(results.affectedRows === 1){
                // 插入成功
                return res.send({
                    status: 0,
                    message: '新增文章分类成功'
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

function deleteArticleCate(req, res){
    // 取得到删除的文章类别的Id
    let id = req.params.id || -1;

    // 执行删除sql
    let sql = `update article_cate set is_delete=1 where Id=${id}`;
    db.query(sql, (err, results) => {
        if(!err){
            // 如果影响的行数为1
            if(results.affectedRows === 1){
                // 删除成功
                return res.send({
                    status: 0,
                    message: '删除文章分类成功'
                });
            }
        }
        else{
            // 错误
            console.log(err.message);
            return res.send({
                status: 1,
                message: '删除文章分类失败'
            });
        }
    });
}

function getArticleCate(req, res){
    // 取得到要查询的文章类别的Id
    let id = req.params.id || -1;

    // 执行查询sql
    let sql = `select * from article_cate where Id=${id}`;
    db.query(sql, (err, result) => {
        if(!err){
            // 如果影响的行数为1
            // 且该文章分类没有被标记为删除
            if(result.length === 1 && result[0].is_delete === 0){
                // 获取成功
                return res.send({
                    status: 0,
                    message: '获取文章分类成功',
                    data: result[0]
                });
            }
            else{
                // 该分类已被删除
                return res.send({
                    status: 1,
                    message: '该分类已被删除',
                    "data": {
                        "Id": '',
                        "name": '',
                        "alias": '',
                        "is_delete": ''
                    }
                });
            }
        }
        else{
            // 错误
            console.log(err.message);
            return res.send({
                status: 1,
                message: '查询文章分类失败',
                "data": {
                    "Id": '',
                    "name": '',
                    "alias": '',
                    "is_delete": ''
                }
            });
        }
    });
}

function updateArticleCate(req, res){
    // 取得要更新的数据
    let data = {
        name: req.body.name || '',
        alias: req.body.alias || '',
        // 取得到要查询的文章类别的Id
        Id: req.body.Id || -1
    }

    // 数据库更新
    // 更新信息到数据库
    const sql = `update article_cate set ? where Id=?`;
    db.query(sql, [data, data.Id], (err, results) => {
        if(!err){
            // 如果影响的行数为1
            if(results.affectedRows === 1){
                // 插入成功
                return res.send({
                    status: 0,
                    message: '更新文章分类成功'
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

module.exports  = {
    getArticleList,
    addArticleCate,
    deleteArticleCate,
    getArticleCate,
    updateArticleCate
}