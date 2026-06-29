<template>
    <div>
        <app-head></app-head>
        <app-body>
            <div class="order-page-container">
                <div class="order-header">
                    <div class="order-status">
                        <el-tag :type="getStatusType(orderInfo.orderStatus)" effect="dark">
                            {{ orderStatus[orderInfo.orderStatus] }}
                        </el-tag>
                        <div class="order-id">订单编号: {{ orderInfo.orderNumber }}</div>
                    </div>
                </div>
                
                <el-card class="product-card" shadow="hover">
                    <div class="idle-info-container" @click="toDetails(orderInfo.idleItem.id)">
                        <el-image
                            class="product-image"
                            :src="orderInfo.idleItem.imgUrl"
                            fit="cover">
                            <div slot="error" class="image-slot">
                                <i class="el-icon-picture-outline"></i>
                            </div>
                        </el-image>
                        <div class="product-info">
                            <div class="idle-info-title">
                                <i class="el-icon-shopping-bag-1"></i>
                                {{orderInfo.userId==userId?'买到的':'卖出的'}}：{{orderInfo.idleItem.idleName}}
                            </div>
                            <div class="idle-info-price">￥{{orderInfo.orderPrice}}</div>
                        </div>
                    </div>
                </el-card>
                
                <el-card class="address-card" shadow="hover">
                    <div slot="header" class="address-card-header">
                        <span><i class="el-icon-location"></i> 收货地址</span>
                        <el-button 
                            v-if="orderInfo.userId==userId&&orderInfo.orderStatus===0" 
                            type="text" 
                            icon="el-icon-edit"
                            @click.stop="selectAddressDialog">
                            修改
                        </el-button>
                    </div>
                    <div class="address-container" :class="{'clickable': orderInfo.userId==userId&&orderInfo.orderStatus===0}" @click.stop="selectAddressDialog">
                        <div v-if="addressInfo.detailAddress" class="address-content">
                            <div class="address-person">
                                <span class="recipient-name">{{addressInfo.consigneeName}}</span>
                                <span class="recipient-phone">{{addressInfo.consigneePhone}}</span>
                            </div>
                            <div class="address-details">{{addressInfo.detailAddress}}</div>
                        </div>
                        <div v-else class="empty-address">
                            <i class="el-icon-map-location empty-icon"></i>
                            <p class="empty-text">请选择收货地址</p>
                            <el-button @click.stop="selectAddressDialog" type="primary" size="small" icon="el-icon-plus">选择收货地址</el-button>
                        </div>
                    </div>
                </el-card>
                
                <el-dialog
                        title="选择地址"
                        :visible.sync="addressDialogVisible"
                        width="800px"
                        custom-class="address-dialog">
                    <el-table
                            stripe
                            border
                            highlight-current-row
                            empty-text="无地址信息，请先在个人中心添加地址"
                            :data="addressData"
                            style="width: 100%">
                        <el-table-column
                                prop="consigneeName"
                                label="收货人姓名"
                                width="120">
                        </el-table-column>
                        <el-table-column
                                prop="consigneePhone"
                                label="手机号"
                                width="140">
                        </el-table-column>
                        <el-table-column
                                prop="detailAddressText"
                                label="地址">
                        </el-table-column>
                        <el-table-column label="操作" width="120" align="center">
                            <template slot-scope="scope">
                                <el-button
                                        size="mini"
                                        type="primary"
                                        icon="el-icon-check"
                                        @click="selectAddress(scope.$index, scope.row)">选择
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="addressDialogVisible = false">取消</el-button>
                        <el-button type="primary" @click="addressDialogVisible = false">确定</el-button>
                    </div>
                </el-dialog>
                
                <el-card class="order-info-card" shadow="hover">
                    <div slot="header" class="order-info-header">
                        <span><i class="el-icon-document"></i> 订单信息</span>
                    </div>
                    <div class="order-info-container">
                        <el-row :gutter="20">
                            <el-col :xs="24" :sm="12">
                                <div class="order-info-group">
                                    <div class="group-title">支付信息</div>
                                    <div class="order-info-item">
                                        <span class="info-label">支付状态:</span>
                                        <el-tag size="small" :type="orderInfo.paymentStatus === 0 ? 'warning' : 'success'">
                                            {{orderInfo.paymentStatus === 0 ? '未支付' : '已支付'}}
                                        </el-tag>
                                    </div>
                                    <div class="order-info-item">
                                        <span class="info-label">支付方式:</span>
                                        <span>{{orderInfo.paymentWay || '暂无'}}</span>
                                    </div>
                                </div>
                            </el-col>
                            <el-col :xs="24" :sm="12">
                                <div class="order-info-group">
                                    <div class="group-title">时间信息</div>
                                    <div class="order-info-item">
                                        <span class="info-label">创建时间:</span>
                                        <span>{{orderInfo.createTime ? (orderInfo.createTime.substring(0, 10) + ' ' + orderInfo.createTime.substring(11, 19)) : ''}}</span>
                                    </div>
                                    <div class="order-info-item">
                                        <span class="info-label">支付时间:</span>
                                        <span>{{orderInfo.paymentTime ? (orderInfo.paymentTime.substring(0, 10) + ' ' + orderInfo.paymentTime.substring(11, 19)) : '暂无'}}</span>
                                    </div>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                </el-card>
                
                <el-card class="order-action-card" shadow="hover">
                    <div slot="header" class="order-action-header">
                        <span><i class="el-icon-s-operation"></i> 订单操作</span>
                    </div>
                    <div class="order-actions">
                        <el-button 
                            v-if="userId==orderInfo.userId&&orderInfo.orderStatus===0" 
                            type="danger" 
                            round 
                            icon="el-icon-close" 
                            @click="changeOrderStatus(4,orderInfo)">取消订单</el-button>
                        <el-button 
                            v-if="userId==orderInfo.userId&&orderInfo.orderStatus===0" 
                            type="primary" 
                            round 
                            icon="el-icon-wallet" 
                            @click="changeOrderStatus(1,orderInfo)">立即支付</el-button>
                        <el-button 
                            v-if="userId==orderInfo.idleItem.userId&&orderInfo.orderStatus===1" 
                            type="primary" 
                            round 
                            icon="el-icon-truck" 
                            @click="changeOrderStatus(2,orderInfo)">发货</el-button>
                        <el-button 
                            v-if="userId==orderInfo.userId&&orderInfo.orderStatus===2" 
                            type="success" 
                            round 
                            icon="el-icon-check" 
                            @click="changeOrderStatus(3,orderInfo)">确认收货</el-button>
                        <div v-if="orderInfo.orderStatus===3" class="order-completed">
                            <i class="el-icon-circle-check"></i> 订单已完成
                        </div>
                        <div v-if="orderInfo.orderStatus===4" class="order-canceled">
                            <i class="el-icon-circle-close"></i> 订单已取消
                        </div>
                    </div>
                </el-card>
            </div>
            <app-foot></app-foot>
        </app-body>
    </div>
</template>

<script>
    import AppHead from '../common/AppHeader.vue';
    import AppBody from '../common/AppPageBody.vue'
    import AppFoot from '../common/AppFoot.vue'

    export default {
        name: "order",
        components: {
            AppHead,
            AppBody,
            AppFoot
        },
        data() {
            return {
                addressDialogVisible:false,
                addressData: [],
                orderStatus: ['待付款', '待发货', '待收货', '已完成', '已取消'],
                orderInfo: {
                    createTime: "",
                    id: 0,
                    idleId: 0,
                    idleItem: {
                        id: '',
                        idleName: '',
                        idleDetails: '',
                        pictureList: [],
                        idlePrice: 0,
                        idlePlace: '',
                        idleLabel: '',
                        idleStatus: -1,
                        userId: '',
                        imgUrl:''
                    },
                    orderNumber: "",
                    orderPrice: 0,
                    orderStatus: 0,
                    paymentStatus: 0,
                    paymentTime: "",
                    paymentWay: "",
                    userId: 0
                },
                addressInfo: {
                    id:'',
                    update:false,
                    consigneeName: '',
                    consigneePhone: '',
                    detailAddress: ''
                },
                userId:''
            };
        },
        mounted(){
            this.$nextTick(()=>{
                this.userId=this.getCookie('shUserId');
                console.log('userId',this.userId,this.getCookie('shUserId'));
                let orderId = this.$route.query.id;
                console.log(orderId);
                this.$api.getOrder({
                    id: orderId
                }).then(res => {
                    console.log(res);
                    if (res.status_code === 1) {
                        if (res.data.idleItem) {
                            let imgList = JSON.parse(res.data.idleItem.pictureList);
                            if (imgList.length > 0) {
                                res.data.idleItem.imgUrl = imgList[0];
                            } else {
                                res.data.idleItem.imgUrl = '';
                            }
                        } else {
                            res.data.idleItem = {
                                idleName: '',
                                imgUrl: ''
                            }
                        }
                        this.orderInfo = res.data;
                        this.$api.getOrderAddress({
                            orderId:this.orderInfo.id
                        }).then(res=>{
                            if(res.data){
                                this.addressInfo= res.data;
                                this.addressInfo.update=true;
                            }else{
                                this.getAddressData();
                            }
                        })
                    }
                })
            })
        },
        created() {
            
            
        },
        methods: {
            getStatusType(status) {
                const types = ['warning', 'primary', 'info', 'success', 'danger'];
                return types[status] || 'info';
            },
            getCookie(cname){
                var name = cname + "=";
                var ca = document.cookie.split(';');
                for(var i=0; i<ca.length; i++)
                {
                    var c = ca[i].trim();
                    if (c.indexOf(name)===0) return c.substring(name.length,c.length);
                }
                return "0";
            },
            toDetails(id) {
                this.$router.replace({path: 'details', query: {id: id}});
            },
            selectAddressDialog(){
                if(this.orderInfo.userId==this.userId&&this.orderInfo.orderStatus===0){
                    this.addressDialogVisible=true;
                    if(this.addressData.length===0){
                        this.getAddressData();
                    }
                }
            },
            getAddressData(){
                this.$api.getAddress().then(res => {
                    if (res.status_code === 1) {
                        let data = res.data;
                        for (let i = 0; i < data.length; i++) {
                            data[i].detailAddressText = data[i].provinceName + data[i].cityName + data[i].regionName + data[i].detailAddress;
                        }
                        console.log(data);
                        this.addressData = data;
                        if(!this.addressInfo.update){
                            for(let i=0;i<data.length;i++){
                                if(data[i].defaultFlag){
                                    this.selectAddress(i,data[i]);
                                }
                            }
                        }
                    }
                })
            },
            selectAddress(i,item){
                this.addressDialogVisible=false;
                console.log(item,this.addressInfo);
                this.addressInfo.consigneeName=item.consigneeName;
                this.addressInfo.consigneePhone=item.consigneePhone;
                this.addressInfo.detailAddress=item.detailAddressText;
                if(this.addressInfo.update){
                    this.$api.updateOrderAddress({
                        id:this.addressInfo.id,
                        consigneeName:item.consigneeName,
                        consigneePhone:item.consigneePhone,
                        detailAddress:item.detailAddressText
                    })
                }else{
                    this.$api.addOrderAddress({
                        orderId:this.orderInfo.id,
                        consigneeName:item.consigneeName,
                        consigneePhone:item.consigneePhone,
                        detailAddress:item.detailAddressText
                    }).then(res=>{
                        if(res.status_code===1){
                            this.addressInfo.update=true;
                            this.addressInfo.id=res.data.id;
                        }else {
                            this.$message.error(res.msg)
                        }
                    })
                }

            },
            changeOrderStatus(orderStatus, orderInfo) {
                if (orderStatus === 1) {
                    console.log('开始支付流程:', orderInfo);
                    if(!this.addressInfo.detailAddress){
                        this.$message.error('请选择地址！')
                    }else{
                        this.$confirm('模拟支付宝支付，是否确认支付', '支付订单', {
                            confirmButtonText: '支付',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.$api.updateOrder({
                                id: orderInfo.id,
                                orderStatus: orderStatus,
                                paymentStatus: 1,
                                paymentWay: '支付宝',
                            }).then(res => {
                                console.log('订单更新返回结果:', res);
                                
                                // 获取订单数据
                                let orderId = orderInfo.id.toString();
                                let orderNo = orderInfo.orderNumber ? orderInfo.orderNumber.toString() : '';
                                let orderPrice = orderInfo.orderPrice ? orderInfo.orderPrice.toString() : '0';
                                
                                // 更新本地订单状态
                                if (res.status_code === 1) {
                                    this.orderInfo.orderStatus = orderStatus;
                                    this.orderInfo.paymentStatus = 1;
                                    this.orderInfo.paymentWay = '支付宝';
                                    this.orderInfo.paymentTime = res.data.paymentTime;
                                    
                                    // 显示支付成功消息
                                    this.$message({
                                        message: '订单状态已更新，正在跳转...',
                                        type: 'success'
                                    });
                                }
                                
                                // 构建更可靠的支付成功页面URL
                                const baseUrl = window.location.origin;
                                const hashPrefix = baseUrl.includes('8081') ? '/#' : '';

                                // 确保参数不包含前后不必要的空格
                                const cleanOrderId = String(orderId).trim();
                                const cleanOrderNo = String(orderNo).trim();
                                const cleanPrice = String(orderPrice).trim();

                                // 使用最原始的方式构建URL参数
                                const paySuccessUrl = `${baseUrl}${hashPrefix}/alipay/pay?name=${cleanOrderId}&no=${cleanOrderNo}&price=${cleanPrice}`;

                                console.log('最终跳转URL:', paySuccessUrl);
                                
                                // 使用延时确保状态更新后再跳转
                                setTimeout(() => {
                                    // 使用location.replace避免浏览器历史堆积
                                    window.location.replace(paySuccessUrl);
                                }, 500);
                                
                            }).catch(err => {
                                console.error('支付请求失败:', err);
                                this.$message.error('支付请求失败，请稍后重试');
                            });
                        }).catch(() => {
                            // 用户取消支付
                        });
                    }
                } else {
                    this.$api.updateOrder({
                        id: orderInfo.id,
                        orderStatus: orderStatus,
                    }).then(res => {
                        if (res.status_code === 1) {
                            this.$message({
                                message: '操作成功！',
                                type: 'success'
                            });
                            this.orderInfo.orderStatus = orderStatus;
                        }
                    })
                }
            },
        }

    }
</script>

<style scoped>
    .order-page-container {
        min-height: 85vh;
        padding: 20px;
        background-color: #f5f7fa;
    }
    
    .order-header {
        margin-bottom: 20px;
        background-color: #fff;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 2px 12px 0 rgba(0,0,0,0.05);
    }
    
    .order-status {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .order-id {
        color: #606266;
        font-size: 14px;
    }
    
    .product-card, .address-card, .order-info-card, .order-action-card {
        margin-bottom: 20px;
        border-radius: 8px;
        overflow: hidden;
    }
    
    .address-card-header, .order-info-header, .order-action-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-weight: 600;
    }
    
    .idle-info-container {
        display: flex;
        align-items: center;
        padding: 10px;
        cursor: pointer;
        transition: all 0.3s;
    }
    
    .idle-info-container:hover {
        background-color: #f5f7fa;
    }
    
    .product-image {
        width: 100px;
        height: 100px;
        border-radius: 4px;
        object-fit: cover;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        margin-right: 20px;
    }
    
    .product-info {
        flex: 1;
    }
    
    .idle-info-title {
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 10px;
        color: #303133;
        display: flex;
        align-items: center;
    }
    
    .idle-info-title i {
        margin-right: 5px;
        color: #409EFF;
    }
    
    .idle-info-price {
        font-size: 20px;
        color: #f56c6c;
        font-weight: 600;
    }
    
    .address-container {
        padding: 10px;
    }
    
    .clickable {
        cursor: pointer;
        transition: all 0.3s;
    }
    
    .clickable:hover {
        background-color: #f5f7fa;
    }
    
    .address-content {
        padding: 10px;
    }
    
    .address-person {
        margin-bottom: 10px;
    }
    
    .recipient-name {
        font-weight: 600;
        font-size: 16px;
        margin-right: 15px;
        color: #303133;
    }
    
    .recipient-phone {
        color: #606266;
    }
    
    .address-details {
        color: #606266;
        line-height: 1.5;
    }
    
    .empty-address {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 30px 0;
        color: #909399;
    }
    
    .empty-icon {
        font-size: 40px;
        color: #c0c4cc;
        margin-bottom: 10px;
    }
    
    .empty-text {
        margin-bottom: 15px;
    }
    
    .address-dialog {
        border-radius: 8px;
    }
    
    .order-info-container {
        padding: 10px;
    }
    
    .order-info-group {
        margin-bottom: 20px;
    }
    
    .group-title {
        font-size: 14px;
        font-weight: 600;
        color: #303133;
        margin-bottom: 10px;
        padding-bottom: 5px;
        border-bottom: 1px solid #ebeef5;
    }
    
    .order-info-item {
        margin: 10px 0;
        display: flex;
        align-items: center;
    }
    
    .info-label {
        color: #909399;
        width: 80px;
        margin-right: 10px;
    }
    
    .order-actions {
        padding: 15px;
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        align-items: center;
    }
    
    .order-completed, .order-canceled {
        font-size: 16px;
        display: flex;
        align-items: center;
    }
    
    .order-completed {
        color: #67c23a;
    }
    
    .order-canceled {
        color: #f56c6c;
    }
    
    .order-completed i, .order-canceled i {
        margin-right: 5px;
        font-size: 20px;
    }
    
    /* 响应式调整 */
    @media (max-width: 768px) {
        .order-page-container {
            padding: 10px;
        }
        
        .product-image {
            width: 80px;
            height: 80px;
            margin-right: 10px;
        }
        
        .idle-info-title {
            font-size: 14px;
        }
        
        .idle-info-price {
            font-size: 16px;
        }
        
        .order-actions {
            flex-wrap: wrap;
            justify-content: center;
        }
        
        .order-id {
            display: none;
        }
        
        .order-status {
            justify-content: center;
        }
    }
</style>