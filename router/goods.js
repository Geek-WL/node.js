const { 
    GOODS_LIST,
    GOODS_DETAIL,
    GOODS_EDIT,
    GOODS_NEW
} = require('./routerConst.js')

const goodsRouterHandle = (req, res) => {
    if(req.method === 'get' && req.path === GOODS_LIST) {

    }else if(req.method === 'get' && req.path === GOODS_DETAIL) {

    }else if(req.method === 'get' && req.path === GOODS_EDIT) {
        
    }else if(req.method === 'get' && req.path === GOODS_NEW) {

    }
}

module.exports = goodsRouterHandle