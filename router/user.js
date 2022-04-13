const express = require('express');
const router = express.Router();
const userinfoHandle = require('../router_handle/userHandle');

// 获取用户信息
router.get('/my/userinfo', userinfoHandle.infoHandle);
// 更新用户邮箱和别名
router.post('/my/userinfo', userinfoHandle.infoHandlePost);
// 修改密码
router.post('/my/updatepwd', userinfoHandle.updatepwdHandle);
// 更改头像
router.post('/my/update/avatar', userinfoHandle.updateAvatarHandle);

// 暴露
module.exports = router;