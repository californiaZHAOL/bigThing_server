// 关于文章类别的路由

const express = require('express');
const router = express.Router();
const articleCateHandle = require('../router_handle/articleCateHandle');

// 获取文章类别列表
router.get('/my/article/cates', articleCateHandle.getArticleList);
// 新增文章类别列表
router.post('/my/article/addcates', articleCateHandle.addArticleCate);
// 根据id删除文章类别
router.get('/my/article/deletecate/:id', articleCateHandle.deleteArticleCate);
// 根据id获取文章分类数据
router.get('/my/article/cates/:id', articleCateHandle.getArticleCate);
// 根据id更新文章分类
router.post('/my/article/updatecate', articleCateHandle.updateArticleCate);

// 暴露
module.exports = router;