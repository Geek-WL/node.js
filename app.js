// 服务端业务逻辑的核心文件
// 用于处理各种请求
const queryString = require('querystring')
const userRouterHandle = require('./router/user')
const goodsRouterHandle = require('./router/goods')
const staticServer = require('./utils/staticServer')
const path = require('path')
const rootPath = path.join(__dirname, 'public')
const {redisGet} = require('./db/redis')
const writeLog = require('./utils/log')
//定义变量作为session的容器
// const SESSION_CONTAINER = {}
const setEnd = (res,data) => {
    res.writeHead(200, {
        'Content-Type': 'application/json; charset=utf-8;'
    })
    res.end(JSON.stringify(data))
}
const getCookieExpires = () => {
    let date = new Date();
    date.setTime(date.getTime() + (24*60*60*1000))
    return date.toGMTString();
}

const initCookieSession = async (req, res) => {
    req.cookie = {}
    if(req.headers.cookie){
        req.headers.cookie.split(';').forEach((item) => {
            let keyValue = item.split('=')
            req.cookie[keyValue[0].trim()] = keyValue[1]
        })
    }
    // 获取用户的唯一标识
    req.userId = req.cookie.userId
    if(!req.userId) {
        req.userId = `${Date.now()}_${Math.random()}_it666`
        // SESSION_CONTAINER[req.userID] = {}
        req.session = {}
        res.setHeader('set-Cookie',`userId=${req.userId};path=/;httpOnly;expires=${getCookieExpires()}`)
    }
    // if(!SESSION_CONTAINER[req.userID]) {
    //     SESSION_CONTAINER[req.userID] = {}
    // }
    if(!req.session) {
        req.session = await redisGet(req.userId) || {}
    }
    // req.session = SESSION_CONTAINER[req.userID]
}
const initParams = (req, res) => {
    // 此函数用于初始化 请求方式 / 请求路径 / 请求参数
    // 1.处理请求方式
    req.method = req.method.toLowerCase();
    // 2.处理请求路径 新增path属性
    req.path = req.url.split('?')[0]
    // 3.处理请求参数
    return new Promise ((resolve, reject) => {
        if(req.method === 'get') {
            let params = req.url.split('?')[1]
            req.query = queryString.parse(params)
            resolve()
        }else if(req.method === 'post') {
            let params = ''
            req.on('data', (chunk) => {
                params += chunk
            })
            req.on('end', () => {
                req.body = queryString.parse(params)
                resolve()
            })
        }
    })
}
const serverHandle = async (req, res) => {
    writeLog(`${req.method}--${req.url}--${req.headers['user-agent']}`)
    // 准备cookie和session
    await initCookieSession(req, res)
    // 返回静态网页
    await staticServer.readFile(req, res, rootPath)
    res.setEnd = setEnd
    initParams(req, res).then( async () => {
        let goodsData = await goodsRouterHandle(req, res)
        if(goodsData) {
            // res.end(JSON.stringify(goodsData))
            res.setEnd(res, goodsData)
            return
        }

        let userData = await userRouterHandle(req, res)
        if(userData) {
            // res.end(JSON.stringify(userData))
            res.setEnd(res, userData)
            return
        }

        res.writeHead(404, {
            'Content-Type': 'text/plain; charset=utf-8;'
        })
        res.end('Page Not Found')
    })
}

module.exports = serverHandle