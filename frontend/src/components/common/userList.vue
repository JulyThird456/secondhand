<template>
    <div class="main-border">
        <div class="page-header">
            <h2 class="page-title">用户管理</h2>
            <div v-show="mode != 3" class="search-container">
                <el-input 
                    placeholder="搜索用户账号..." 
                    v-model="searchValue" 
                    @keyup.enter.native="searchIdle"
                    prefix-icon="el-icon-search"
                    clearable
                    class="search-input">
                    <el-button slot="append" icon="el-icon-search" @click="searchIdle">搜索</el-button>
                </el-input>
            </div>
            <div v-show="mode == 3" class="admin-actions">
                <el-button 
                    type="primary" 
                    icon="el-icon-plus" 
                    size="small" 
                    @click="adminRegVisible = true"
                    class="add-admin-btn">
                    添加管理员
                </el-button>
            </div>
        </div>

        <el-tabs v-model="activeTab" @tab-click="handleTabClick" type="card" class="custom-tabs">
            <el-tab-pane label="正常用户" name="1">
                <div class="table-container">
                    <el-table
                        :data="userData"
                        stripe
                        style="width: 100%"
                        :header-cell-style="{ background: '#f5f7fa', color: '#303133', fontWeight: 'bold' }"
                        border
                        v-loading="tableLoading">
                        <el-table-column label="头像" width="80" align="center">
                            <template slot-scope="scope">
                                <el-avatar shape="circle" :size="40" :src="scope.row.avatar">
                                    <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
                                </el-avatar>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="accountNumber"
                            label="用户账号"
                            show-overflow-tooltip
                            min-width="150"
                            width="150">
                        </el-table-column>
                        <el-table-column
                            prop="nickname"
                            label="用户昵称"
                            show-overflow-tooltip
                            min-width="150"
                            width="150">
                        </el-table-column>
                        <el-table-column
                            prop="signInTime"
                            label="注册时间"
                            show-overflow-tooltip
                            width="180">
                        </el-table-column>
                        <el-table-column label="操作" width="120" align="center">
                            <template slot-scope="scope">
                                <el-button
                                    size="mini"
                                    type="danger"
                                    icon="el-icon-lock"
                                    @click="confirmSealUser(scope.$index)"
                                    round>
                                    封号
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-tab-pane>
            
            <el-tab-pane label="违规用户" name="2">
                <div class="table-container">
                    <el-table
                        :data="badUserData"
                        stripe
                        style="width: 100%"
                        :header-cell-style="{ background: '#f5f7fa', color: '#303133', fontWeight: 'bold' }"
                        border
                        v-loading="tableLoading">
                        <el-table-column label="头像" width="80" align="center">
                            <template slot-scope="scope">
                                <el-avatar shape="circle" :size="40" :src="scope.row.avatar">
                                    <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
                                </el-avatar>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="accountNumber"
                            label="用户账号"
                            show-overflow-tooltip
                            min-width="150"
                            width="150">
                        </el-table-column>
                        <el-table-column
                            prop="nickname"
                            label="用户昵称"
                            show-overflow-tooltip
                            width="150">
                        </el-table-column>
                        <el-table-column
                            prop="signInTime"
                            label="注册时间"
                            show-overflow-tooltip
                            width="180">
                        </el-table-column>
                        <el-table-column label="操作" width="120" align="center">
                            <template slot-scope="scope">
                                <el-button
                                    size="mini"
                                    type="success"
                                    icon="el-icon-unlock"
                                    @click="confirmUnsealUser(scope.$index)"
                                    round>
                                    解封
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-tab-pane>
            
            <el-tab-pane label="管理员" name="3">
                <div class="table-container">
                    <el-table
                        :data="userManage"
                        stripe
                        style="width: 100%"
                        :header-cell-style="{ background: '#f5f7fa', color: '#303133', fontWeight: 'bold' }"
                        border
                        v-loading="tableLoading">
                        <el-table-column
                            prop="accountNumber"
                            label="管理员账号"
                            show-overflow-tooltip
                            width="200">
                        </el-table-column>
                        <el-table-column
                            prop="adminName"
                            label="管理名称">
                            <template slot-scope="scope">
                                <el-tag type="primary" effect="plain">{{ scope.row.adminName }}</el-tag>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-tab-pane>
        </el-tabs>

        <div class="pagination-container">
            <el-pagination
                @current-change="handleCurrentChange"
                :current-page.sync="nowPage"
                :page-size="8"
                background
                layout="total, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </div>

        <!-- 添加管理员对话框 -->
        <el-dialog
            title="添加管理员"
            :visible.sync="adminRegVisible"
            width="400px"
            center
            class="admin-dialog">
            <div class="admin-form">
                <el-form :model="adminForm" label-position="top">
                    <el-form-item label="管理员名称">
                        <el-input 
                            v-model="adminName" 
                            maxlength="8" 
                            placeholder="请输入管理员名称" 
                            prefix-icon="el-icon-user"
                            clearable>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="管理员账户">
                        <el-input 
                            v-model="adminAccount" 
                            minlength="8" 
                            maxlength="10" 
                            placeholder="请输入管理员账户" 
                            prefix-icon="el-icon-s-custom"
                            clearable>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="管理员密码">
                        <el-input 
                            v-model="adminPassword" 
                            minlength="8" 
                            placeholder="请输入管理员密码" 
                            prefix-icon="el-icon-lock"
                            show-password>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="确认密码">
                        <el-input 
                            v-model="adminRePassword" 
                            minlength="8" 
                            placeholder="请再次输入管理员密码" 
                            prefix-icon="el-icon-key"
                            show-password>
                        </el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="adminRegVisible = false">取 消</el-button>
                <el-button type="primary" @click="regAdmin">添 加</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "userList",
        created() {
            this.getUserData();
        },
        methods: {
            handleTabClick(tab) {
                this.mode = parseInt(tab.name);
                this.nowPage = 1;
                
                if (this.mode === 1) {
                    this.getUserData();
                } else if (this.mode === 2) {
                    this.getBadUserData();
                } else {
                    this.getUserManage();
                }
            },
            handleCurrentChange(val) {
                this.nowPage = val;
                if(this.mode == 1){
                    this.getUserData();
                } else if(this.mode == 2){
                    this.getBadUserData();
                } else {
                    this.getUserManage();
                }
            },
            handleSelect(val){
                if(this.mode !== val){
                    this.mode = val
                    if(val == 1){
                        this.nowPage = 1;
                        this.getUserData();
                    }
                    if(val == 2){
                        this.nowPage = 1;
                        this.getBadUserData();
                    }
                    if(val == 3){
                        this.nowPage = 1;
                        this.getUserManage();
                    }
                }
            },
            confirmSealUser(index) {
                this.$confirm('确定要封禁该用户吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.sealUser(index);
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消封禁'
                    });          
                });
            },
            confirmUnsealUser(index) {
                this.$confirm('确定要解除该用户的封禁状态吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.unsealUser(index);
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消操作'
                    });          
                });
            },
            getUserData(){
                //正常普通用户
                this.tableLoading = true;
                this.$api.getUserData({
                    page: this.nowPage,
                    nums:8,
                    status:0
                }).then(res => {
                    this.tableLoading = false;
                    if(res.status_code==1){
                        this.userData = res.data.list;
                        this.total = res.data.count;
                    }else {
                        this.$message.error(res.msg)
                    }
                }).catch(e => {
                    this.tableLoading = false;
                    console.log(e)
                })
            },
            getBadUserData(){
                //违规用户
                this.tableLoading = true;
                this.$api.getUserData({
                    page: this.nowPage,
                    nums:8,
                    status:1
                }).then(res => {
                    this.tableLoading = false;
                    if(res.status_code==1){
                        this.badUserData = res.data.list;
                        this.total = res.data.count;
                    }else {
                        this.$message.error(res.msg)
                    }
                }).catch(e => {
                    this.tableLoading = false;
                    console.log(e)
                });
            },
            getUserManage(){
                //管理员
                this.tableLoading = true;
                this.$api.getUserManage({
                    page: this.nowPage,
                    nums:8,
                }).then(res => {
                    this.tableLoading = false;
                    if(res.status_code==1){
                        this.userManage = res.data.list;
                        this.total = res.data.count;
                    }else {
                        this.$message.error(res.msg)
                    }
                }).catch(e => {
                    this.tableLoading = false;
                    console.log(e)
                })
            },
            sealUser(i){
                this.tableLoading = true;
                this.$api.updateUserStatus({
                    id: this.userData[i].id,
                    status:1
                }).then(res => {
                    this.tableLoading = false;
                    if(res.status_code==1){
                        this.$message.success('用户已成功封禁');
                        this.getUserData();
                    }else {
                        this.$message.error(res.msg)
                    }
                }).catch(e => {
                    this.tableLoading = false;
                    console.log(e)
                })
            },
            unsealUser(i){
                this.tableLoading = true;
                this.$api.updateUserStatus({
                    id: this.badUserData[i].id,
                    status:0
                }).then(res => {
                    this.tableLoading = false;
                    if(res.status_code==1){
                        this.$message.success('用户已成功解封');
                        this.getBadUserData();
                    }else {
                        this.$message.error(res.msg)
                    }
                }).catch(e => {
                    this.tableLoading = false;
                    console.log(e)
                })
            },
            regAdmin(){
                if(this.adminPassword == this.adminRePassword){
                    this.tableLoading = true;
                    this.$api.regAdministrator({
                        adminName: this.adminName,
                        accountNumber: this.adminAccount,
                        adminPassword: this.adminPassword,
                    }).then(res => {
                        this.tableLoading = false;
                        if(res.status_code==1){
                            this.$message.success('管理员添加成功');
                            this.total = this.total+1;
                            this.nowPage= Math.ceil(this.total/8);
                            this.getUserManage();
                            this.adminRegVisible = false;
                            // 清空表单
                            this.adminName = '';
                            this.adminAccount = '';
                            this.adminPassword = '';
                            this.adminRePassword = '';
                        }else {
                            this.$message.error(res.msg)
                        }
                    }).catch(e => {
                        this.tableLoading = false;
                        console.log(e);
                        this.$message.error("添加失败，账号重复或网络异常")
                    });
                }
                else {
                    this.$message.error("两次输入的密码不一致");
                }
            },
            searchIdle() {
                this.tableLoading = true;
                this.$api.queryUser({
                    searchValue: this.searchValue,
                    mode: this.mode,
                    page: this.nowPage,
                    nums: 8,
                }).then(res => {
                    this.tableLoading = false;
                    if (res.status_code == 1) {
                        if(this.mode == 1){
                            this.userData = res.data.list;
                            this.total = res.data.count;
                        }else if(this.mode == 2){
                            this.badUserData = res.data.list;
                            this.total = res.data.count;
                        }else {
                            this.userManage = res.data.list;
                            this.total = res.data.count;
                        }
                    } else{
                        this.$message.error(res.msg)
                    }
                }).catch(e => {
                    this.tableLoading = false;
                    console.log(e)
                })
            }
        },
        data(){
            return {
                mode: 1,
                activeTab: "1",
                nowPage: 1,
                total: 63,
                adminRegVisible: false,
                adminAccount: '',
                adminPassword: '',
                adminRePassword: '',
                adminName: '',
                adminForm: {},
                userData: [],
                badUserData: [],
                userManage: [],
                searchValue: '',
                tableLoading: false
            }
        },
    }
</script>

<style scoped>
    .main-border {
        background-color: #fff;
        margin: 20px;
        padding: 25px;
        box-shadow: 0 4px 18px rgba(0, 0, 0, 0.08);
        border-radius: 10px;
        height: calc(100% - 40px);
        display: flex;
        flex-direction: column;
    }

    .page-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 25px;
        border-bottom: 1px solid #ebeef5;
        padding-bottom: 15px;
    }

    .page-title {
        font-size: 20px;
        font-weight: 600;
        color: #303133;
        margin: 0;
    }

    .search-container, .admin-actions {
        width: 350px;
        display: flex;
        justify-content: flex-end;
    }

    .search-input {
        width: 100%;
    }

    .search-input >>> .el-input__inner {
        border-radius: 20px 0 0 20px;
        border-right: none;
    }

    .search-input >>> .el-input-group__append {
        border-radius: 0 20px 20px 0;
        background-color: #409EFF;
        border-color: #409EFF;
        color: white;
    }

    .search-input >>> .el-input-group__append .el-button {
        color: white;
        border: none;
    }

    .add-admin-btn {
        border-radius: 20px;
        padding: 10px 20px;
    }

    .custom-tabs >>> .el-tabs__header {
        margin-bottom: 20px;
    }

    .custom-tabs >>> .el-tabs__item {
        font-size: 15px;
        padding: 0 25px;
        height: 40px;
        line-height: 40px;
    }

    .custom-tabs >>> .el-tabs__item.is-active {
        color: #409EFF;
        font-weight: bold;
    }

    .table-container {
        margin-bottom: 20px;
        flex: 1;
    }

    .el-table {
        border-radius: 6px;
        overflow: hidden;
    }

    .pagination-container {
        margin-top: 20px;
        display: flex;
        justify-content: center;
    }

    .el-button--danger {
        background-color: #ff6b6b;
        border-color: #ff6b6b;
    }

    .el-button--danger:hover, .el-button--danger:focus {
        background-color: #ff8c8c;
        border-color: #ff8c8c;
    }

    .el-button--success {
        background-color: #67c23a;
        border-color: #67c23a;
    }

    .el-button--success:hover, .el-button--success:focus {
        background-color: #85ce61;
        border-color: #85ce61;
    }

    /* 管理员对话框样式 */
    .admin-dialog >>> .el-dialog__header {
        background-color: #f5f7fa;
        padding: 15px 20px;
        border-bottom: 1px solid #ebeef5;
        border-radius: 10px 10px 0 0;
    }

    .admin-dialog >>> .el-dialog__title {
        font-size: 18px;
        font-weight: 600;
        color: #303133;
    }

    .admin-dialog >>> .el-dialog__body {
        padding: 20px 25px;
    }

    .admin-form .el-form-item {
        margin-bottom: 20px;
    }

    .admin-form .el-input {
        width: 100%;
    }

    /* 加载状态样式 */
    .el-loading-mask {
        background-color: rgba(255, 255, 255, 0.8);
    }

    /* 响应式调整 */
    @media screen and (max-width: 768px) {
        .page-header {
            flex-direction: column;
            align-items: flex-start;
        }

        .search-container, .admin-actions {
            width: 100%;
            margin-top: 15px;
        }

        .main-border {
            padding: 15px;
            margin: 10px;
        }
    }
</style>