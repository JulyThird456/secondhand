<template>
    <div class="main-border">
        <div class="page-header">
            <h2 class="page-title">订单管理</h2>
            <div class="search-container">
                <el-input 
                    placeholder="搜索订单编号..." 
                    v-model="searchValue" 
                    @keyup.enter.native="searchIdle"
                    prefix-icon="el-icon-search"
                    clearable
                    class="search-input">
                    <el-button slot="append" icon="el-icon-search" @click="searchIdle">搜索</el-button>
                </el-input>
            </div>
        </div>

        <div class="table-container">
            <el-table
                :data="Order"
                stripe
                style="width: 100%"
                :header-cell-style="{ background: '#f5f7fa', color: '#303133', fontWeight: 'bold' }"
                border
                v-loading="tableLoading">
                <el-table-column
                    prop="orderNumber"
                    label="订单号"
                    show-overflow-tooltip
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="idleItem.idleName"
                    label="闲置名称"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    prop="orderPrice"
                    label="金额"
                    min-width="100"
                    width="100">
                    <template slot-scope="scope">
                        <span class="price-tag">¥{{ scope.row.orderPrice }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="createTime"
                    label="创建时间"
                    show-overflow-tooltip
                    min-width="150"
                    width="180">
                </el-table-column>
                <el-table-column
                    label="订单状态"
                    width="100">
                    <template slot-scope="scope">
                        <el-tag :type="getOrderStatusType(scope.row.orderStatus)" size="medium">
                            {{ orderStatus[scope.row.orderStatus] }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                    label="支付状态"
                    width="100">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.paymentStatus ? 'success' : 'warning'" size="medium">
                            {{ paymentStatus[scope.row.paymentStatus] }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="paymentWay"
                    label="支付方式"
                    width="100">
                    <template slot-scope="scope">
                        <span class="payment-way">{{ scope.row.paymentWay }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="paymentTime"
                    label="支付时间"
                    width="180"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column label="操作" width="120" align="center">
                    <template slot-scope="scope">
                        <el-button
                            size="mini"
                            type="danger"
                            icon="el-icon-delete"
                            @click="confirmDeleteOrder(scope.$index, scope.row)"
                            round>
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

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
    </div>
</template>

<script>
    export default {
        name: "orderList",
        created() {
            this.getOrder();
        },
        methods:{
            getOrderStatusType(status) {
                const statusMap = {
                    0: 'warning',   // 待付款
                    1: 'primary',   // 待发货
                    2: 'info',      // 待收货
                    3: 'success',   // 已完成
                    4: 'danger'     // 已取消
                };
                return statusMap[status] || 'info';
            },
            confirmDeleteOrder(index, row) {
                this.$confirm('确定要删除该订单吗？此操作将不可恢复', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteOrder(index);
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });          
                });
            },
            getOrder(){
                this.tableLoading = true;
                this.$api.getOrderList({
                    page: this.nowPage,
                    nums:8
                }).then(res => {
                    this.tableLoading = false;
                    if(res.status_code==1){
                        this.Order = res.data.list;
                        this.total = res.data.count;
                    }else {
                        this.$message.error(res.msg)
                    }
                }).catch(e => {
                    this.tableLoading = false;
                    console.log(e)
                })
            },
            deleteOrder(index){
                this.tableLoading = true;
                this.$api.deleteOrder({
                    id:this.Order[index].id
                }).then(res=>{
                    this.tableLoading = false;
                    if(res.status_code==1){
                        this.$message.success('订单已成功删除');
                        this.getOrder();
                    }else {
                        this.$message.error(res.msg)
                    }
                }).catch(e => {
                    this.tableLoading = false;
                    console.log(e)
                })
            },
            handleCurrentChange(val) {
                this.nowPage = val;
                this.getOrder();
            },
            searchIdle(){
                this.tableLoading = true;
                this.$api.queryOrder({
                    page: this.nowPage,
                    nums: 8,
                    searchValue: this.searchValue
                }).then(res => {
                    this.tableLoading = false;
                    if (res.status_code == 1) {
                        this.Order = res.data.list;
                        this.total = res.data.count;
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
                mode:1,
                nowPage: 1,
                total: 0,
                paymentStatus:['未支付','已支付'],
                orderStatus:['待付款','待发货','待收货','已完成','已取消'],
                Order: [],
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

    .search-container {
        width: 350px;
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

    .table-container {
        margin-bottom: 20px;
        flex: 1;
    }

    .el-table {
        border-radius: 6px;
        overflow: hidden;
    }

    .price-tag {
        color: #ff6b6b;
        font-weight: bold;
    }

    .payment-way {
        color: #606266;
        font-weight: 500;
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

        .search-container {
            width: 100%;
            margin-top: 15px;
        }

        .main-border {
            padding: 15px;
            margin: 10px;
        }
    }
</style>