import request from '../utils/request';

const api = {

    // 用户功能 对应usercontroller
    userLogin(query) {
        return request({
            url: '/user/login',
            method: 'get',
            params: query
        });
    },
    logout(query) {
        return request({
            url: '/user/logout',
            method: 'get',
            params: query
        });
    },
    signIn(data) {
        return request({
            url: '/user/sign-in',
            method: 'post',
            data: data
        });
    },
    getUserInfo(query) {
        return request({
            url: '/user/info',
            method: 'get',
            params: query
        });
    },
    updateUserPublicInfo(data) {
        return request({
            url: '/user/info',
            method: 'post',
            data: data
        });
    },
    updatePassword(query) {
        return request({
            url: '/user/password',
            method: 'get',
            params: query
        });
    },
    //  地址功能  对应addresscontroller
    addAddress(data) {
        return request({
            url: '/address/add',
            method: 'post',
            data: data
        });
    },
    getAddress(query) {
        return request({
            url: '/address/info',
            method: 'get',
            params: query
        });
    },
    updateAddress(data) {
        return request({
            url: '/address/update',
            method: 'post',
            data: data
        });
    },
    deleteAddress(data) {
        return request({
            url: '/address/delete',
            method: 'post',
            data: data
        });
    },

    // 商品操作   对应idleitemController
    addIdleItem(data) {
        return request({
            url: '/goods/add',
            method: 'post',
            data: data
        });
    },
    getIdleItem(query) {
        return request({
            url: '/goods/info',
            method: 'get',
            params: query
        });
    },
    getAllIdleItem(query) {
        return request({
            url: '/goods/all',
            method: 'get',
            params: query
        });
    },
    findIdleTiem(query) {
        return request({
            url: '/goods/find',
            method: 'get',
            params: query
        });
    },
    findIdleTiemByLable(query) {
        return request({
            url: '/goods/lable',
            method: 'get',
            params: query
        });
    },
    updateIdleItem(data) {
        return request({
            url: '/goods/update',
            method: 'post',
            data: data
        });
    },

    // 个人中心的功能  ordercontroller
    addOrder(data) {
        return request({
            url: '/order/add',
            method: 'post',
            data: data
        });
    },
    getOrder(query) {
        return request({
            url: '/order/info',
            method: 'get',
            params: query
        });
    },
    updateOrder(data) {
        return request({
            url: '/order/update',
            method: 'post',
            data: data
        });
    },
    getMyOrder(query) {
        return request({
            url: '/order/my',
            method: 'get',
            params: query
        });
    },
    getMySoldIdle(query) {
        return request({
            url: '/order/my-sold',
            method: 'get',
            params: query
        });
    },

    // 订单的地址信息   orderAddressController
    addOrderAddress(data) {
        return request({
            url: '/order-address/add',
            method: 'post',
            data: data
        });
    },
    updateOrderAddress(data) {
        return request({
            url: '/order-address/update',
            method: 'post',
            data: data
        });
    },
    getOrderAddress(query) {
        return request({
            url: '/order-address/info',
            method: 'get',
            params: query
        });
    },

    // 收藏功能就是购物车    favoriteController
    addFavorite(data) {
        return request({
            url: '/wish/add',
            method: 'post',
            data: data
        });
    },
    getMyFavorite(query) {
        return request({
            url: '/wish/my',
            method: 'get',
            params: query
        });
    },
    deleteFavorite(query) {
        return request({
            url: '/wish/delete',
            method: 'get',
            params: query
        });
    },
    checkFavorite(query) {
        return request({
            url: '/wish/check',
            method: 'get',
            params: query
        });
    },

    // 留言功能   messagecontroller
    sendMessage(data) {
        return request({
            url: '/message/send',
            method: 'post',
            data: data
        });
    },
    getMessage(query) {
        return request({
            url: '/message/info',
            method: 'get',
            params: query
        });
    },
    getAllIdleMessage(query) {
        return request({
            url: '/message/idle',
            method: 'get',
            params: query
        });
    },
    getAllMyMessage(query) {
        return request({
            url: '/message/my',
            method: 'get',
            params: query
        });
    },
    deleteMessage(query) {
        return request({
            url: '/message/delete',
            method: 'get',
            params: query
        });
    },

    // 管理员相关操作
    getGoods(query) {
        return request({
            url: '/admin/idleList',
            method: 'get',
            params: query
        });
    },
    updateGoods(query) {
        return request({
            url: '/admin/updateIdleStatus',
            method: 'get',
            params: query
        });
    },
    getOrderList(query) {
        return request({
            url: '/admin/orderList',
            method: 'get',
            params: query
        });
    },
    deleteOrder(query) {
        return request({
            url: '/admin/deleteOrder',
            method: 'get',
            params: query
        });
    },
    getUserData(query) {
        return request({
            url: '/admin/userList',
            method: 'get',
            params: query
        });
    },
    getUserManage(query) {
        return request({
            url: '/admin/list',
            method: 'get',
            params: query
        });
    },
    updateUserStatus(query){
        return request({
            url: '/admin/updateUserStatus',
            method: 'get',
            params: query
        });
    },
    regAdministrator(data){
        return request({
            url: '/admin/add',
            method: 'post',
            data: data
        });
    },
    adminLogin(query) {
        return request({
            url: '/admin/login',
            method: 'get',
            params: query
        });
    },
    loginOut(query) {
        return request({
            url: '/admin/loginOut',
            method: 'get',
            params: query
        });
    },
    queryIdle(query) {
        return request({
            url: '/admin/queryIdle',
            method: 'get',
            params: query
        });
    },
    queryOrder(query) {
        return request({
            url: '/admin/queryOrder',
            method: 'get',
            params: query
        });
    },
    queryUser(query) {
        return request({
            url: '/admin/queryUser',
            method: 'get',
            params: query
        });
    },
    updateAlipay(query) {
        return request({
            url: '/alipay/pay',
            method: 'get',
            params: query
        });
    },
    // 添加以下数据统计相关API
    // 获取交易数据统计
    getTradingData(query) {
        return request({
            url: '/statistics/trading-data',
            method: 'get',
            params: query
        });
    },

    // 获取月度统计数据
    getMonthlyStatistics(query) {
        return request({
            url: '/statistics/monthly-statistics',
            method: 'get',
            params: query
        });
    },

    // 获取商品分类统计
    getCategoryStatistics(query) {
        return request({
            url: '/statistics/category-statistics',
            method: 'get',
            params: query
        });
    },

    // 获取用户统计数据
    getUserStatistics(query) {
        return request({
            url: '/statistics/user-statistics',
            method: 'get',
            params: query
        });
    },
};


export default api;
