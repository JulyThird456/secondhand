import Vue from 'vue';
import App from './App.vue';
import router from './router';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'babel-polyfill';

import api from './api/index.js';
Vue.prototype.$api = api;

let globalData={
    userInfo:{
        nickname:''
    }
};
let sta={
    isLogin:false,
    adminName:''
};
Vue.prototype.$sta = sta;
Vue.prototype.$globalData=globalData;
Vue.prototype.$projectMode = '';

Vue.config.productionTip = false;

Vue.use(ElementUI, {
    size: 'medium'
});

/* 导航守卫：保持project参数，检测登录 */
router.beforeEach((to, from, next) => {
    document.title = `${to.meta.title}`;

    /* 从from.query继承project参数 */
    if (!to.query.project && from.query.project) {
        to.query.project = from.query.project;
    }
    /* 从Vue.prototype继承 */
    if (!to.query.project && Vue.prototype.$projectMode) {
        to.query.project = Vue.prototype.$projectMode;
    }

    const nickname = Vue.prototype.$globalData.userInfo.nickname;
    if (!nickname
        &&(to.path === '/me'
        || to.path === '/message'
        || to.path === '/release'
        || to.path === '/order')) {
        api.getUserInfo().then(res=>{
           console.log('getUserInfo:',res);
           if(res.status_code!==1){
               next('/login');
           }else {
               res.data.signInTime=res.data.signInTime.substring(0,10);
               Vue.prototype.$globalData.userInfo=res.data;
               next();
           }
        }).catch(e=>{
            next('/login');
        });
    }else{
        next();
    }
});

/* 在导航完成后更新projectMode */
router.afterEach((to) => {
    if (to.query && to.query.project) {
        Vue.prototype.$projectMode = to.query.project;
    }
});

new Vue({
    router,
    render: h => h(App)
}).$mount('#app');