// 登录注册的路由模块

/**
 * 创建路由实例
 */
 const express = require('express');
 const router = express.Router();
//  引入处理模块
 const loginAndRegisterHandle = require('./../router_handle/loginAndRegisterHandle.js');

 /**
  * 挂载路由
  */
 // 注册的接口
 router.post('/api/reguser', loginAndRegisterHandle.registerHandle);
 // 登录的接口
 router.post('/api/login', loginAndRegisterHandle.loginHandle);

 /**
  * 向外暴露路由
  */
 module.exports = router;