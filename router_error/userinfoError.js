function jwtError(err, req, res, next){
    // console.log(Object.keys(err));
    // [ 'name', 'message', 'code', 'status', 'inner' ]

    // console.log(err.name);
    // UnauthorizedError

    // console.log(req.user);
    // undefined

    if(err.name === 'UnauthorizedError'){
        // console.log(req.rawHeaders);
        // [
            // 'Authorization',
            // 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InpoYW9sZSIsImlhdCI6MTY0OTgxMDY2NSwiZXhwIjoxNjQ5ODEzNjY1fQ.BYeADe1xzSeiakmMEHgfwTL7BSqWQ-209gzjxDBpWi',
            // 'User-Agent',
            // 'PostmanRuntime/7.29.0',
            // 'Accept',
            // '*/*',
            // 'Postman-Token',
            // 'd7019660-b4af-4bcd-ad44-04d49d5d9b22',
            // 'Host',
            // '127.0.0.1',
            // 'Accept-Encoding',
            // 'gzip, deflate, br',
            // 'Connection',
            // 'keep-alive'
            // ]

            if(req.rawHeaders.indexOf('Authorization') === -1){
                // token不存在
                // 也就是说客户端发送请求未在请求头加上Authorization字段
                res.send({
                    "status": 1,
                    "message": "令牌不存在",
                    data: {
                        id: 0,
                        username: '',
                        nickname: '',
                        email: '',
                        user_pic: ''
                    }
                  }
                );
                return next();
            }

            // 令牌存在，但是是错误的或者已经过期了
            res.send({
                "status": 1,
                "message": "令牌错误或已过期",
                data: {
                    id: 0,
                    username: '',
                    nickname: '',
                    email: '',
                    user_pic: ''
                }
              }
            );
            return next();
    }
    
    // 其他错误
    res.send({
        "status": 1,
        "message": "未知错误 " + err.name,
        data: {
            id: 0,
            username: '',
            nickname: '',
            email: '',
            user_pic: ''
        }
      }
    );
    return next();

}

// 暴露
module.exports = jwtError;