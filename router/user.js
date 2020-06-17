const {
    USER_INFO,
    USER_LOGIN,
    USER_REGISTER
} = require('./routerConst.js')

// const {SuccessModel,ErrorModel} = require('../model/ResultModel')


const {registerUser,loginCheck} =  require('../controller/userController')

const {redisSet} = require('../db/redis')


const userRouterHandle = async (req, res) => {
    if (req.method === 'post' && req.path === USER_LOGIN) {
        let result = await loginCheck(req.body)
        if(result.code === 200) {
            req.session.username = result.data.username
            req.session.password = result.data.password
            req.session.gender = result.data.gender
            await redisSet(req.userId, req.session)
        }
        // return new SuccessModel()
        return result
    } else if (req.method === 'post' && req.path === USER_REGISTER) {
        // let sql = `insert into user (username, password) values ('jwl', 999888)`
        // exc(sql).then((res) => {
        //     console.log(res);
        // }).catch(err => {
        //     console.log(err);
        // })
        let result = await registerUser(req.body)
        return result
    } else if (req.method === 'get' && req.path === USER_INFO) {
        // return new SuccessModel()
    } 
}
module.exports = userRouterHandle