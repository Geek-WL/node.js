// const {exc, escape} = require('../db/mysql')
const User = require('../db/model/user')
async function getUser(username,password) {
    // username = escape(username) // 通过escape转义特殊字符  返回字符串
    // password = escape(password) // 转义特殊字符是为了防止sql注入攻击
    // if(password) {
    //     let sql = `select * from user where username = ${username} and password = ${password}`
    //     let results = await exc(sql)
    //     return results
    // } else {
    //     let sql = `select * from user where username = '${username}'`
    //     let results = await exc(sql)
    //     return results
    // }
    if(password) {
        let results = await User.findAll({
            where: {
                username,
                password
            }
        })
        console.log(results);
        return results
    } else {
        let results = await User.findAll({
            where: {
                username: username
            }
        })
        return results
    }
}

async function createUser({username, password, gender}) {
    // let sql = `insert into user (username, password, gender) values('${username}','${password}','${gender}')`
    // let results = await exc(sql)
    // return results
    let results = await User.create({
        username,
        password,
        gender
    })
    return results['dataValues']
}

module.exports = {
    getUser,
    createUser
}