// 关于文章的路由

const express = require('express');
const router = express.Router();
const articleListHandle = require('../router_handle/articleListHandle');

// 获取参数返回指定的文章列表
router.get('/my/article/list', articleListHandle.getArticlesList);
// 根据文章Id删除文章
router.get('/my/article/delete/:id', articleListHandle.deleteArticle);
// 根据文章Id获取文章内容
router.get('/my/article/:id', articleListHandle.getArticle);

// 导入解析 formdata 格式表单数据的包
const multer = require('multer')
// 导入处理路径的核心模块
const path = require('path')

// 创建 multer 的实例对象，通过 dest 属性指定文件的存放路径
const upload = multer({ dest: path.join(__dirname, '../uploads') })

// 发布新文章的路由
// upload.single() 是一个局部生效的中间件，用来解析 FormData 格式的表单数据
// 将文件类型的数据，解析并挂载到 req.file 属性中
// 将文本类型的数据，解析并挂载到 req.body 属性中

// 发布新文章
router.post('/my/article/add', upload.single('cover_img'), articleListHandle.pubArticle);
// 根据id更新文章
router.post('/my/article/edit', upload.single('cover_img'), articleListHandle.editArticle);

// 暴露
module.exports = router;