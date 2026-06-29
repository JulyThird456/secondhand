<template>
	<div class="admin-container">
		<el-container>
			<el-header height="60px" class="header-container">
				<div class="header">
					<div class="header-left">
						<router-link to="/platform-admin" class="app-name">校园二手集市管理</router-link>
					</div>
					<div class="header-right">
						<span class="admin-info">管理员：{{admin.nickname}}</span>
						<el-button type="primary" size="small" @click="logout">退出登录</el-button>
					</div>
				</div>
			</el-header>
			<el-container class="main-container">
				<el-aside width="200px">
					<el-menu
						:default-active="mode.toString()"
						class="el-menu-vertical-demo"
						@select="handleSelect"
						background-color="#ffffff"
						text-color="#303133"
						active-text-color="#409EFF">
						<el-menu-item index="1">
							<i class="el-icon-goods"></i>
							<span>闲置管理</span>
						</el-menu-item>
						<el-menu-item index="2">
							<i class="el-icon-s-goods"></i>
							<span slot="title">订单管理</span>
						</el-menu-item>
						<el-menu-item index="3">
							<i class="el-icon-s-custom"></i>
							<span slot="title">用户管理</span>
						</el-menu-item>
						<el-menu-item index="4">
							<i class="el-icon-data-analysis"></i>
							<span slot="title">数据统计</span>
						</el-menu-item>
					</el-menu>
				</el-aside>
				<el-main>
					<GoodsManage v-if="mode == 1"></GoodsManage>
					<orderList v-if="mode == 2"></orderList>
					<userList v-if="mode == 3"></userList>
					<DataStatistics v-if="mode == 4"></DataStatistics>
				</el-main>
			</el-container>
		</el-container>
		<div class="spacer"></div>
		<footer class="footer">
			<app-foot></app-foot>
		</footer>
	</div>
</template>

<script>
    import AppFoot from '../common/AppFoot.vue'
    import GoodsManage from '../common/GoodsManage.vue'
    import orderList from '../common/orderList.vue'
    import userList from '../common/userList.vue'
    import DataStatistics from '../common/DataStatistics.vue'

    export default {
        name: "platform-admin",
        components: {
            AppFoot,
            GoodsManage,
            orderList,
            userList,
            DataStatistics,
        },
        data() {
            return {
                mode: 1,
                admin: {
                    nickname: '',
                },
            }
        },
        created() {
            // 通过API获取当前管理员信息
            this.$api.getUserInfo().then(res => {
                if (res.status_code === 1 && res.data.adminName) {
                    this.$sta.adminName = res.data.adminName;
                    this.admin.nickname = res.data.adminName;
                } else {
                    // 如果API没有返回管理员名称，再尝试从全局状态获取
                    if (this.$sta && this.$sta.adminName) {
                        this.admin.nickname = this.$sta.adminName;
                    }
                }
            }).catch(e => {
                console.log('获取管理员信息失败', e);
                // 发生错误时尝试从全局状态获取
                if (this.$sta && this.$sta.adminName) {
                    this.admin.nickname = this.$sta.adminName;
                }
            });
            
            // 从URL参数中获取要显示的模块
            const pageParam = this.$route.query.page;
            if (pageParam) {
                this.mode = parseInt(pageParam);
            }
        },
        methods: {
            logout() {
                this.$api.loginOut({}).then(res => {
                    if (res.status_code === 1) {
                        this.$sta.isLogin = false;
                        this.$sta.adminName = '';
                        this.$router.push({path: '/login-admin'});
                    }
                }).catch(e => {
                    console.log(e)
                })
            },
            handleSelect(val) {
                if (this.mode !== val) {
                    this.mode = parseInt(val);
                    // 更新URL参数，便于刷新页面后仍保持选中状态
                    this.$router.push({
                        query: {
                            ...this.$route.query,
                            page: val
                        }
                    });
                }
            }
        },
    }
</script>

<style scoped>
	.admin-container {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		background-color: #f6f6f6;
		position: relative;
	}

	.header-container {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		background-color: #fff;
		padding: 0;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
		z-index: 1000;
		border-bottom: 1px solid #eaeaea;
	}

	.header {
		height: 60px;
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 20px;
		max-width: calc(100% - 40px);
		margin: 0 auto;
	}

	.header-left {
		display: flex;
		align-items: center;
	}

	.header-right {
		display: flex;
		align-items: center;
		white-space: nowrap;
		margin-right: 20px;
	}

	.admin-info {
		margin-right: 20px;
		font-size: 14px;
		color: #606266;
	}

	.main-container {
		padding-top: 60px;
		flex: 1;
		overflow: hidden;
	}

	.app-name {
		color: #409EFF;
		font-size: 18px;
		font-weight: 800;
		text-decoration: none;
	}

	.el-menu {
		border-right: none;
		height: 100%;
	}

	.el-main {
		padding: 0;
		background-color: #f6f6f6;
		height: calc(100vh - 120px);
		overflow-y: auto;
	}

	.el-aside {
		background-color: #fff;
		box-shadow: 2px 0 10px rgba(0, 0, 0, 0.05);
		height: calc(100vh - 60px);
	}
	
	.spacer {
		height: 60px; /* 为页脚留出空间 */
	}

	.footer {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: #fff;
		padding: 15px 0;
		text-align: center;
		border-top: 1px solid #e5e5e5;
		height: 60px;
		z-index: 999;
	}

	/* 菜单项样式 */
	.el-menu-item {
		height: 56px;
		line-height: 56px;
		font-size: 14px;
	}

	.el-menu-item i {
		margin-right: 10px;
		font-size: 18px;
	}

	/* 适应小屏设备 */
	@media screen and (max-width: 768px) {
		.app-name {
			font-size: 16px;
		}
		
		.admin-info {
			margin-right: 10px;
			font-size: 13px;
		}
		
		.el-aside {
			width: 160px !important;
		}
		
		.header {
			padding: 0 10px;
			max-width: calc(100% - 20px);
		}
		
		.header-right {
			margin-right: 10px;
		}
		
		.header-right .el-button {
			padding: 7px 10px;
			font-size: 12px;
		}
	}
</style>
