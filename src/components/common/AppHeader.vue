<template>
    <div class="header">
        <div class="header-container">
            <div class="app-name">
                <router-link to="/index" :query="{project: projectMode}">
                    <i :class="projectMode==='space'?'el-icon-user-solid':'el-icon-s-shop'"></i>
                    <span v-if="projectMode==='space'">个人空间</span>
                    <span v-else>校园二手集市</span>
                </router-link>
            </div>
            <div class="search-container">
                <el-input 
                    placeholder="搜索闲置好物..."
                    v-model="searchValue" 
                    @keyup.enter.native="searchIdle"
                    prefix-icon="el-icon-search"
                    clearable>
                    <el-button slot="append" icon="el-icon-search" @click="searchIdle">搜索</el-button>
                </el-input>
            </div>
            <div class="home-btn" @click="goHome" title="返回首页">
                <i class="el-icon-s-home"></i>
            </div>
            <div class="action-buttons">
                <el-button type="primary" icon="el-icon-plus" class="publish-btn" @click="toRelease">发布好物</el-button>
                <el-button type="info" icon="el-icon-chat-dot-round" class="message-btn" @click="toMessage">消息</el-button>
                
                <router-link v-if="!isLogin" class="user-name-text login-btn" to="/login">
                    <i class="el-icon-user"></i> 登录
                </router-link>
                
                <el-dropdown trigger="click" v-else class="user-dropdown">
                    <div class="user-info">
                        <div class="user-name">{{nicknameValue?nicknameValue:nickname}}</div>
                        <el-avatar :size="32" :src="avatarValue?avatarValue:avatar" class="user-avatar"></el-avatar>
                    </div>
                    <el-dropdown-menu slot="dropdown" class="dropdown-menu">
                        <el-dropdown-item>
                            <div @click="toMe" class="dropdown-item">
                                <i class="el-icon-user-solid"></i> 个人中心
                            </div>
                        </el-dropdown-item>
                        <el-dropdown-item divided>
                            <div @click="loginOut" class="dropdown-item logout">
                                <i class="el-icon-switch-button"></i> 退出登录
                            </div>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'Header',
        props: ['searchInput','nicknameValue','avatarValue'],
        data() {
            return {
                searchValue: this.searchInput,
                nickname:'登录',
                projectMode: '',
                avatar:'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
                isLogin:false
            };
        },
        created(){
            this.projectMode = this.$projectMode || (this.$route.query && this.$route.query.project) || '';
            if(! this.$globalData.userInfo.nickname){
                this.$api.getUserInfo().then(res=>{
                    if(res.status_code===1){
                        this.nickname=res.data.nickname;
                        this.avatar=res.data.avatar;
                        res.data.signInTime=res.data.signInTime.substring(0,10);
                        this.$globalData.userInfo=res.data;
                        this.isLogin=true;
                    }
                })
            }else {
                this.nickname=this.$globalData.userInfo.nickname;
                this.avatar=this.$globalData.userInfo.avatar;
                this.isLogin=true;
            }
        },
        methods: {
            searchIdle() {
                if(this.searchValue && this.searchValue.trim() !== '') {
                    if ('/search' !== this.$route.path) {
                        this.$router.push({path: '/search', query: {searchValue: this.searchValue, project: this.projectMode}});
                    } else {
                        this.$router.replace({path: '/search', query: {searchValue: this.searchValue, project: this.projectMode}});
                        this.$router.go(0);
                    }
                } else {
                    this.$message.warning('请输入搜索关键词');
                }
            },
            toMe() {
                if ('/me' !== this.$route.path) {
                    this.$router.push({path: '/me', query: {project: this.projectMode}});
                }
            },
            toMessage(){
                if ('/message' !== this.$route.path) {
                    this.$router.push({path: '/message', query: {project: this.projectMode}});
                }
            },
            goHome() {
                if ('/' !== this.$route.path) {
                    this.$router.push({path: '/'});
                }
            },
            toRelease(){
                if ('/release' !== this.$route.path) {
                    this.$router.push({path: '/release', query: {project: this.projectMode}});
                }
            },
            loginOut(){
                this.$api.logout().then(res=>{
                    if(res.status_code===1){
                        this.$globalData.userInfo={};
                        this.$message.success('退出登录成功');
                        if ('/index' === this.$route.path) {
                            this.$router.go(0);
                        }else {
                            this.$router.push({path: '/index', query: {project: this.projectMode}});
                        }
                    }else {
                        this.$message.error('网络或系统异常，退出登录失败！');
                    }
                });
            }
        }
    };
</script>

<style scoped>
    .header {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        width: 100%;
        height: 60px;
        background: #ffffff;
        display: flex;
        justify-content: center;
        border-bottom: 1px solid #ebeef5;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        z-index: 1000;
    }
    .header-container {
        width: 1200px;
        max-width: 95%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .app-name {
        flex-shrink: 0;
        margin-right: 15px;
    }
    .app-name a {
        color: #409EFF;
        font-size: 20px;
        font-weight: 600;
        text-decoration: none;
        display: flex;
        align-items: center;
        transition: all 0.3s;
    }
    .app-name a:hover {
        color: #66b1ff;
    }
    .app-name i {
        margin-right: 8px;
        font-size: 24px;
    }
    .search-container {
        flex-grow: 1;
        max-width: 500px;
        margin: 0 20px;
    }
    .home-btn {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s;
        margin-right: 10px;
        color: #909399;
        font-size: 20px;
    }
    .home-btn:hover {
        background-color: #f5f7fa;
        color: #409EFF;
    }
    .action-buttons {
        display: flex;
        align-items: center;
        flex-shrink: 0;
    }
    .publish-btn, .message-btn {
        margin-right: 10px;
        border-radius: 20px;
    }
    .user-name-text {
        font-size: 16px;
        font-weight: 600;
        color: #409EFF;
        cursor: pointer;
        text-decoration: none;
        display: flex;
        align-items: center;
        transition: all 0.3s;
    }
    .user-name-text:hover {
        color: #66b1ff;
    }
    .login-btn i {
        margin-right: 5px;
    }
    .user-dropdown {
        cursor: pointer;
    }
    .user-info {
        display: flex;
        align-items: center;
        padding: 0 5px;
        border-radius: 20px;
        transition: all 0.3s;
    }
    .user-info:hover {
        background-color: #f5f7fa;
    }
    .user-name {
        font-size: 15px;
        color: #409EFF;
        margin-right: 8px;
    }
    .user-avatar {
        border: 2px solid #ebeef5;
    }
    .dropdown-menu {
        min-width: 130px;
    }
    .dropdown-item {
        display: flex;
        align-items: center;
        font-size: 14px;
    }
    .dropdown-item i {
        margin-right: 5px;
    }
    .logout {
        color: #f56c6c;
    }
    @media (max-width: 992px) {
        .app-name a { font-size: 18px; }
        .search-container { max-width: 300px; }
        .publish-btn, .message-btn { padding: 9px 12px; }
    }
    @media (max-width: 768px) {
        .app-name i { margin-right: 0; font-size: 22px; }
        .search-container { max-width: 200px; }
        .publish-btn, .message-btn { padding: 7px 10px; font-size: 12px; }
        .user-name { font-size: 14px; margin-right: 5px; }
    }
</style>