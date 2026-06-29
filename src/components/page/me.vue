<template>
    <div>
        <app-head :nickname-value="userInfo.nickname"
                  :avatarValue="userInfo.avatar"></app-head>
        <app-body>
            <div v-show="!eidtAddress" class="profile-container">
                <el-card class="user-profile-card" shadow="hover">
                    <div class="user-info-container">
                        <div class="user-info-details">
                            <el-upload
                            action="/file/"
                                    :on-success="fileHandleSuccess"
                                    :file-list="imgFileList"
                                    :show-file-list="false"
                                    accept="image/*"
                                    class="avatar-uploader"
                            >
                                <el-avatar 
                                    :size="120" 
                                    :src="userInfo.avatar" 
                                    class="user-avatar">
                                    <i class="el-icon-plus avatar-uploader-icon"></i>
                                </el-avatar>
                                <div class="avatar-hint">点击更换头像</div>
                            </el-upload>
                            <div class="user-info-details-text">
                                <div class="user-info-details-text-nickname">{{userInfo.nickname}}</div>
                                <div class="user-info-details-text-time">
                                    <i class="el-icon-time"></i> {{userInfo.signInTime}} 加入平台
                                </div>
                                <div class="user-info-details-text-edit">
                                    <el-button type="primary" icon="el-icon-edit" round @click="userInfoDialogVisible = true">编辑个人信息</el-button>
                                    <el-button type="warning" icon="el-icon-location" round @click="eidtAddress=true">管理收货地址</el-button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <el-dialog
                            @close="finishEdit"
                            title="编辑个人信息"
                            :visible.sync="userInfoDialogVisible"
                            width="400px"
                            center>
                        <div class="edit-form">
                            <div class="edit-form-item">
                                <div class="edit-tip">昵称</div>
                                <el-input
                                        v-model="userInfo.nickname"
                                        :disabled="notUserNicknameEdit"
                                        placeholder="请输入昵称"
                                        prefix-icon="el-icon-user"
                                        @change="saveUserNickname">
                                    <el-button slot="append" type="warning" icon="el-icon-edit"
                                            @click="notUserNicknameEdit = false">编辑
                                    </el-button>
                                </el-input>
                            </div>

                            <div class="edit-form-item" v-if="userPasswordEdit">
                                <div class="edit-tip">原密码</div>
                                <el-input v-model="userPassword1" placeholder="请输入原密码" prefix-icon="el-icon-lock" show-password></el-input>
                                <div class="edit-tip">新密码</div>
                                <el-input v-model="userPassword2" placeholder="请输入新密码" prefix-icon="el-icon-lock" show-password></el-input>
                                <div class="edit-tip">确认新密码</div>
                                <el-input v-model="userPassword3" placeholder="请再次输入新密码" prefix-icon="el-icon-lock" show-password></el-input>
                                <div class="edit-actions">
                                    <el-button type="primary" icon="el-icon-check" @click="savePassword">确认修改</el-button>
                                    <el-button icon="el-icon-close" @click="userPasswordEdit = false">取消</el-button>
                                </div>
                            </div>
                            <div class="edit-form-item" v-else>
                                <div class="edit-tip">密码</div>
                                <el-input
                                        value="******"
                                        :disabled="true"
                                        prefix-icon="el-icon-lock"
                                        show-password>
                                    <el-button slot="append" type="warning" icon="el-icon-edit"
                                            @click="userPasswordEdit = true">修改密码
                                    </el-button>
                                </el-input>
                            </div>
                        </div>
                        <span slot="footer" class="dialog-footer">
                            <el-button type="primary" @click="userInfoDialogVisible=false">完成</el-button>
                        </span>
                    </el-dialog>
                </el-card>

                <el-card class="user-content-card" shadow="hover">
                    <div class="idle-container">
                        <el-tabs v-model="activeName" @tab-click="handleClick" type="border-card" class="custom-tabs">
                            <el-tab-pane label="刚刚发布" name="1">
                                <i class="el-icon-upload tab-icon"></i> 刚刚发布
                            </el-tab-pane>
                            <el-tab-pane label="已经下架" name="2">
                                <i class="el-icon-download tab-icon"></i> 已经下架
                            </el-tab-pane>
                            <el-tab-pane label="我的购物车" name="3">
                                <i class="el-icon-shopping-cart-full tab-icon"></i> 我的购物车
                            </el-tab-pane>
                            <el-tab-pane label="出售记录" name="4">
                                <i class="el-icon-sold-out tab-icon"></i> 出售记录
                            </el-tab-pane>
                            <el-tab-pane label="购买记录" name="5">
                                <i class="el-icon-shopping-bag-1 tab-icon"></i> 购买记录
                            </el-tab-pane>
                        </el-tabs>
                        
                        <div class="idle-container-list">
                            <div v-for="(item,index) in dataList[activeName-1]" class="idle-container-list-item">
                                <div class="idle-container-list-item-detile" @click="toDetails(activeName,item)">
                                    <el-image
                                            style="width: 100px; height: 100px;"
                                            :src="item.imgUrl"
                                            fit="cover">
                                        <div slot="error" class="image-slot">
                                            <i class="el-icon-picture-outline">无图</i>
                                        </div>
                                    </el-image>
                                    <div class="idle-container-list-item-text">
                                        <div class="idle-container-list-title">
                                            {{item.idleName}}
                                        </div>
                                        <div class="idle-container-list-idle-details" v-html="item.idleDetails">
                                            {{item.idleDetails}}
                                        </div>
                                        <div class="idle-container-list-idle-time">{{item.timeStr}}</div>

                                        <div class="idle-item-foot">
                                            <div class="idle-prive">￥{{item.idlePrice}}
                                                {{(activeName==='4'||activeName==='5')?orderStatus[item.orderStatus]:''}}
                                            </div>
                                            <el-button v-if="activeName!=='4'&&activeName!=='5'" type="danger" size="mini" slot="reference"
                                                    plain @click.stop="handle(activeName,item,index)">{{handleName[activeName-1]}}
                                            </el-button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div v-if="dataList[activeName-1].length === 0" class="empty-state">
                                <i :class="getEmptyIcon(activeName)" class="empty-icon"></i>
                                <p class="empty-text">{{getEmptyText(activeName)}}</p>
                            </div>
                        </div>
                    </div>
                </el-card>
            </div>
            
            <div v-show="eidtAddress" class="address-container">
                <el-card class="address-card" shadow="hover">
                    <div slot="header" class="address-header">
                        <el-page-header @back="eidtAddress=false" content="收货地址管理"></el-page-header>
                    </div>
                    
                    <el-card class="new-address-card" shadow="hover">
                        <div slot="header" class="new-address-header">
                            <span><i class="el-icon-plus"></i> 新增收货地址</span>
                            <span class="address-limit-hint">最多添加5个地址</span>
                        </div>
                        
                        <el-form label-position="top" :model="addressInfo" class="address-form">
                            <el-row :gutter="20">
                                <el-col :xs="24" :sm="12">
                                    <el-form-item label="收货人姓名">
                                        <el-input 
                                            placeholder="请输入收货人姓名" 
                                            v-model="addressInfo.consigneeName" 
                                            maxlength="10"
                                            prefix-icon="el-icon-user"
                                            show-word-limit>
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="24" :sm="12">
                                    <el-form-item label="手机号码">
                                        <el-input 
                                            placeholder="请输入收货人手机号" 
                                            v-model="addressInfo.consigneePhone"
                                            prefix-icon="el-icon-mobile-phone"
                                            onkeyup="this.value=this.value.replace(/[^\d.]/g,'');" 
                                            maxlength="11" 
                                            show-word-limit>
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            
                            <el-form-item label="宿舍区域信息">
                                <el-cascader
                                    placeholder="请选择宿舍类型/楼号/楼层"
                                    :options="options"
                                    v-model="selectedOptions"
                                    @change="handleAddressChange"
                                    :separator="' '"
                                    style="width: 100%"
                                >
                                </el-cascader>
                            </el-form-item>
                            
                            <el-form-item label="详细地址">
                                <el-input 
                                    type="textarea"
                                    :rows="2"
                                    placeholder="宿舍号 + 在楼道东侧还是西侧还是中间位置" 
                                    v-model="addressInfo.detailAddress"
                                    maxlength="50" 
                                    show-word-limit>
                                </el-input>
                            </el-form-item>
                            
                            <el-form-item>
                                <el-checkbox v-model="addressInfo.defaultFlag">设置为默认地址</el-checkbox>
                            </el-form-item>
                            
                            <el-form-item class="address-actions">
                                <el-button type="primary" icon="el-icon-check" @click="saveAddress">保存地址</el-button>
                                <el-button icon="el-icon-refresh" @click="resetAddressForm">重置</el-button>
                            </el-form-item>
                        </el-form>
                    </el-card>
                    
                    <div class="address-list-section">
                        <div class="address-list-header">
                            <i class="el-icon-location"></i> 已保存的地址
                            <span class="address-count">共 {{addressData.length}} 个</span>
                        </div>
                        
                        <div v-if="addressData.length === 0" class="empty-address">
                            <i class="el-icon-map-location"></i>
                            <p>您还没有添加任何收货地址</p>
                        </div>
                        
                        <el-row :gutter="20" v-else>
                            <el-col :xs="24" :sm="12" v-for="(address, index) in addressData" :key="index">
                                <el-card class="address-item" :class="{'default-address': address.defaultFlag}" shadow="hover">
                                    <div class="address-item-header">
                                        <span class="address-name">{{address.consigneeName}}</span>
                                        <span class="address-phone">{{address.consigneePhone}}</span>
                                        <el-tag v-if="address.defaultFlag" size="small" type="success">默认</el-tag>
                                    </div>
                                    
                                    <div class="address-item-content">
                                        <i class="el-icon-location-information"></i>
                                        <span class="address-detail">{{address.detailAddressText}}</span>
                                    </div>
                                    
                                    <div class="address-item-actions">
                                        <el-button 
                                            size="mini" 
                                            type="primary" 
                                            plain
                                            icon="el-icon-edit"
                                            @click="handleEdit(index, address)">
                                            编辑
                                        </el-button>
                                        <el-button 
                                            v-if="!address.defaultFlag"
                                            size="mini" 
                                            type="success" 
                                            plain
                                            icon="el-icon-star-off"
                                            @click="handleSetDefault(index, address)">
                                            设为默认
                                        </el-button>
                                        <el-button 
                                            size="mini" 
                                            type="danger" 
                                            plain
                                            icon="el-icon-delete"
                                            @click="handleDelete(index, address)">
                                            删除
                                        </el-button>
                                    </div>
                                </el-card>
                            </el-col>
                        </el-row>
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
    import options from '../common/country-data.js'

    export default {
        name: "me",
        components: {
            AppHead,
            AppBody,
            AppFoot
        },
        data() {
            return {
                imgFileList: [],
                addressInfo: {
                    consigneeName: '',
                    consigneePhone: '',
                    provinceName: '',
                    cityName: '',
                    regionName: '',
                    detailAddress: '',
                    defaultFlag: false
                },
                activeName: '1',
                handleName: ['下架', '删除', '取消购物车', '', ''],
                dataList: [
                    [],
                    [],
                    [],
                    [],
                    [],
                    [],
                    [],
                    [],
                ],
                orderStatus: ['待付款', '待发货', '待收货', '已完成', '已取消'],
                userInfoDialogVisible: false,
                notUserNicknameEdit: true,
                userPasswordEdit: false,
                userPassword1: '',
                userPassword2: '',
                userPassword3: '',
                eidtAddress: false,
                selectedOptions: [],//存放默认值
                options: options,   //存放城市数据,
                userInfo: {
                    accountNumber: "",
                    avatar: "",
                    nickname: "",
                    signInTime: "",
                },
                addressData: []
            };
        },
        created() {
            if (!this.$globalData.userInfo.nickname) {
                this.$api.getUserInfo().then(res => {
                    if (res.status_code === 1) {
                        res.data.signInTime = res.data.signInTime.substring(0, 10);
                        console.log(res.data);
                        this.$globalData.userInfo = res.data;
                        this.userInfo = this.$globalData.userInfo;
                    }
                })
            } else {
                this.userInfo = this.$globalData.userInfo;
                console.log(this.userInfo);
            }
            this.getAddressData();
            this.getIdleItemData();
            this.getMyOrder();
            this.getMySoldIdle();
            this.getMyFavorite();
        },
        methods: {
            getEmptyIcon(tabName) {
                const icons = {
                    '1': 'el-icon-upload',
                    '2': 'el-icon-download',
                    '3': 'el-icon-shopping-cart-full',
                    '4': 'el-icon-sold-out',
                    '5': 'el-icon-shopping-bag-1'
                };
                return icons[tabName] || 'el-icon-document';
            },
            getEmptyText(tabName) {
                const texts = {
                    '1': '您还没有发布任何商品',
                    '2': '没有已下架的商品',
                    '3': '您的购物车是空的',
                    '4': '您还没有出售记录',
                    '5': '您还没有购买记录'
                };
                return texts[tabName] || '暂无数据';
            },
            getMyFavorite(){
                this.$api.getMyFavorite().then(res=>{
                    console.log('getMyFavorite',res);
                    if (res.status_code === 1){
                        for (let i = 0; i < res.data.length; i++) {
                            let pictureList = JSON.parse(res.data[i].idleItem.pictureList);
                            this.dataList[2].push({
                                favoriteId:res.data[i].id,
                                id:res.data[i].idleItem.id,
                                imgUrl:pictureList.length > 0 ? pictureList[0] : '',
                                idleName:res.data[i].idleItem.idleName,
                                idleDetails:res.data[i].idleItem.idleDetails,
                                timeStr:res.data[i].createTime.substring(0, 10) + " " + res.data[i].createTime.substring(11, 19),
                                idlePrice:res.data[i].idleItem.idlePrice
                            });
                        }
                    }
                })
            },
            getMySoldIdle(){
                this.$api.getMySoldIdle().then(res=>{
                    if (res.status_code === 1){
                        console.log('getMySoldIdle',res.data);
                        for (let i = 0; i < res.data.length; i++) {
                            let pictureList = JSON.parse(res.data[i].idleItem.pictureList);
                            this.dataList[3].push({
                                id:res.data[i].id,
                                imgUrl:pictureList.length > 0 ? pictureList[0] : '',
                                idleName:res.data[i].idleItem.idleName,
                                idleDetails:res.data[i].idleItem.idleDetails,
                                timeStr:res.data[i].createTime.substring(0, 10) + " " + res.data[i].createTime.substring(11, 19),
                                idlePrice:res.data[i].orderPrice,
                                orderStatus:res.data[i].orderStatus
                            });
                        }
                    }
                })
            },
            getMyOrder(){
                this.$api.getMyOrder().then(res=>{
                    if (res.status_code === 1){
                        console.log('getMyOrder',res.data);
                        for (let i = 0; i < res.data.length; i++) {
                            let pictureList = JSON.parse(res.data[i].idleItem.pictureList);
                            this.dataList[4].push({
                                id:res.data[i].id,
                                imgUrl:pictureList.length > 0 ? pictureList[0] : '',
                                idleName:res.data[i].idleItem.idleName,
                                idleDetails:res.data[i].idleItem.idleDetails,
                                timeStr:res.data[i].createTime.substring(0, 10) + " " + res.data[i].createTime.substring(11, 19),
                                idlePrice:res.data[i].orderPrice,
                                orderStatus:res.data[i].orderStatus
                            });
                        }
                    }
                })
            },
            getIdleItemData() {
                this.$api.getAllIdleItem().then(res => {
                    console.log(res);
                    if (res.status_code === 1) {
                        for (let i = 0; i < res.data.length; i++) {
                            res.data[i].timeStr = res.data[i].releaseTime.substring(0, 10) + " " + res.data[i].releaseTime.substring(11, 19);
                            let pictureList = JSON.parse(res.data[i].pictureList);
                            res.data[i].imgUrl = pictureList.length > 0 ? pictureList[0] : '';
                            if (res.data[i].idleStatus === 1) {
                                this.dataList[0].push(res.data[i]);
                            } else if (res.data[i].idleStatus === 2) {
                                this.dataList[1].push(res.data[i]);
                            }
                        }
                    }
                })
            },
            getAddressData() {
                this.$api.getAddress().then(res => {
                    if (res.status_code === 1) {
                        let data = res.data;
                        for (let i = 0; i < data.length; i++) {
                            data[i].detailAddressText = data[i].provinceName + data[i].cityName + data[i].regionName + data[i].detailAddress;
                            data[i].defaultAddress = data[i].defaultFlag ? '默认地址' : '设为默认';
                        }
                        console.log(data);
                        this.addressData = data;
                    }
                })
            },
            handleClick(tab, event) {
                console.log(this.activeName);
            },
            saveUserNickname() {
                this.notUserNicknameEdit = true;
                this.$api.updateUserPublicInfo({
                    nickname: this.userInfo.nickname
                }).then(res => {
                    console.log(res);
                    this.$globalData.userInfo.nickname = this.userInfo.nickname;
                })
            },
            savePassword() {
                if (!this.userPassword1 || !this.userPassword2) {
                    this.$message.error('密码为空！');
                } else if (this.userPassword2 === this.userPassword3) {
                    this.$api.updatePassword({
                        oldPassword: this.userPassword1,
                        newPassword: this.userPassword2
                    }).then(res => {
                        if (res.status_code === 1) {
                            this.userPasswordEdit = false;
                            this.$message({
                                message: '修改成功！',
                                type: 'success'
                            });
                            this.userPassword1 = '';
                            this.userPassword2 = '';
                            this.userPassword3 = '';
                        } else {
                            this.$message.error('旧密码错误，修改失败！');
                        }
                    })
                } else {
                    this.$message.error('两次输入的密码不一致！');
                }
            },
            finishEdit() {
                this.notUserNicknameEdit = true;
                this.userInfoDialogVisible = false;
                this.userPasswordEdit = false;
            },
            handleAddressChange(value) {
                console.log(value);
                this.addressInfo.provinceName = value[0];
                this.addressInfo.cityName = value[1];
                this.addressInfo.regionName = value[2];
            },
            handleEdit(index, row) {
                console.log(index, row);
                this.addressInfo = JSON.parse(JSON.stringify(row));
                this.selectedOptions = ['', '', ''];
                this.selectedOptions[0] = row.provinceName;
                this.selectedOptions[1] = row.cityName;
                this.selectedOptions[2] = row.regionName;
            },
            handleDelete(index, row) {
                console.log(index, row);
                this.$confirm('是否确定删除该地址?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$api.deleteAddress(row).then(res => {
                        if (res.status_code === 1) {
                            this.$message({
                                message: '删除成功！',
                                type: 'success'
                            });
                            this.addressData.splice(index, 1);
                            if (row.defaultFlag && this.addressData.length > 0) {
                                this.addressData[0].defaultFlag = true;
                                this.addressData[0].defaultAddress = '默认地址';
                                this.update({
                                    id: this.addressData[0].id,
                                    defaultFlag: true
                                });
                            }
                        } else {
                            this.$message.error('系统异常，删除失败！')
                        }
                    }).catch(() => {
                        this.$message.error('网络异常！')
                    });
                }).catch(() => {
                });
            },
            handleSetDefault(index, row) {
                console.log(index, row);
                row.defaultFlag = true;
                this.update(row);
            },
            toDetails(activeName, item) {
                if (activeName === '4'||activeName === '5') {
                    this.$router.push({path: '/order', query: {id: item.id}});
                } else {
                    this.$router.push({path: '/details', query: {id: item.id}});
                }
            },
            handle(activeName,item,index) {
                console.log(activeName,item,index);
                this.$confirm('是否确认？', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    if(activeName==='1'){
                        this.$api.updateIdleItem({
                            id:item.id,
                            idleStatus:2
                        }).then(res=>{
                            console.log(res);
                            if(res.status_code===1){
                                this.dataList[0].splice(index,1);
                                item.idleStatus=2;
                                this.dataList[1].unshift(item);
                            }else {
                                this.$message.error(res.msg)
                            }
                        });
                    }else if(activeName==='2'){
                        this.$api.updateIdleItem({
                            id:item.id,
                            idleStatus:0
                        }).then(res=>{
                            console.log(res);
                            if(res.status_code===1){
                                this.dataList[1].splice(index,1);
                            }else {
                                this.$message.error(res.msg)
                            }
                        });
                    }else if(activeName==='3'){
                        this.$api.deleteFavorite({
                            id: item.favoriteId
                        }).then(res=>{
                            console.log(res);
                            if(res.status_code===1){
                                this.$message({
                                    message: '已取消购物车！',
                                    type: 'success'
                                });
                                this.dataList[2].splice(index,1);
                            }else {
                                this.$message.error(res.msg)
                            }
                        }).catch(e=>{
                        })
                    }
                }).catch(() => {
                });
            },
            fileHandleSuccess(response, file, fileList) {
                console.log("file:", response, file, fileList);
                let imgUrl = response.data;
                this.imgFileList = [];
                this.$api.updateUserPublicInfo({
                    avatar: imgUrl
                }).then(res => {
                    console.log(res);
                    this.userInfo.avatar = imgUrl;
                    this.$globalData.userInfo.avatar = imgUrl;
                })
            },
            update(data) {
                this.$api.updateAddress(data).then(res => {
                    if (res.status_code === 1) {
                        this.getAddressData();
                        this.$message({
                            message: '修改成功！',
                            type: 'success'
                        });
                    } else {
                        this.$message.error('系统异常，修改失败！')
                    }
                }).catch(() => {
                    this.$message.error('网络异常！')
                })
            },
            saveAddress() {
                if (this.addressInfo.id) {
                    console.log('update:', this.addressInfo);
                    this.update(this.addressInfo);
                    this.addressInfo = {
                        consigneeName: '',
                        consigneePhone: '',
                        provinceName: '',
                        cityName: '',
                        regionName: '',
                        detailAddress: '',
                        defaultFlag: false
                    };
                    this.selectedOptions = [];
                } else {
                    if (this.addressData.length >= 5) {
                        this.$message.error('已达到最大地址数量！')
                    } else {
                        console.log(this.addressInfo);
                        this.$api.addAddress(this.addressInfo).then(res => {
                            if (res.status_code === 1) {
                                this.getAddressData();
                                this.$message({
                                    message: '新增成功！',
                                    type: 'success'
                                });
                                this.selectedOptions = [];
                                this.addressInfo = {
                                    consigneeName: '',
                                    consigneePhone: '',
                                    provinceName: '',
                                    cityName: '',
                                    regionName: '',
                                    detailAddress: '',
                                    defaultFlag: false
                                };
                            } else {
                                this.$message.error('系统异常，新增失败！')
                            }
                        }).catch(e => {
                            this.$message.error('网络异常！')
                        })
                    }
                }
            },
            resetAddressForm() {
                this.addressInfo = {
                    consigneeName: '',
                    consigneePhone: '',
                    provinceName: '',
                    cityName: '',
                    regionName: '',
                    detailAddress: '',
                    defaultFlag: false
                };
                this.selectedOptions = [];
            }
        }
    }
</script>

<style scoped>
    .profile-container {
        padding: 20px;
    }
    
    .user-profile-card, .user-content-card {
        margin-bottom: 20px;
        border-radius: 8px;
        overflow: hidden;
    }
    
    .user-info-container {
        width: 100%;
        padding: 20px 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .user-info-details {
        display: flex;
        align-items: center;
        width: 100%;
    }
    
    .avatar-uploader {
        position: relative;
        cursor: pointer;
        transition: all 0.3s;
    }
    
    .avatar-uploader:hover {
        transform: scale(1.05);
    }
    
    .user-avatar {
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        border: 2px solid #fff;
    }
    
    .avatar-hint {
        position: absolute;
        bottom: -5px;
        left: 50%;
        transform: translateX(-50%);
        font-size: 12px;
        color: #909399;
        opacity: 0;
        transition: opacity 0.3s;
    }
    
    .avatar-uploader:hover .avatar-hint {
        opacity: 1;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 120px;
        height: 120px;
        line-height: 120px;
        text-align: center;
    }

    .user-info-details-text {
        margin-left: 30px;
        width: calc(100% - 150px);
    }

    .user-info-details-text-nickname {
        font-size: 26px;
        font-weight: 600;
        margin: 10px 0;
        color: #303133;
    }

    .user-info-details-text-time {
        font-size: 14px;
        margin-bottom: 16px;
        color: #909399;
        display: flex;
        align-items: center;
    }
    
    .user-info-details-text-time i {
        margin-right: 5px;
    }

    .user-info-details-text-edit {
        display: flex;
        gap: 10px;
    }
    
    .edit-form {
        padding: 10px;
    }
    
    .edit-form-item {
        margin-bottom: 20px;
    }
    
    .edit-tip {
        font-size: 14px;
        margin: 10px 5px;
        color: #606266;
    }
    
    .edit-actions {
        margin-top: 15px;
        display: flex;
        justify-content: flex-end;
        gap: 10px;
    }
    
    .custom-tabs {
        margin-bottom: 20px;
        border-radius: 4px;
        overflow: hidden;
    }
    
    .tab-icon {
        margin-right: 5px;
    }
    
    .empty-state {
        padding: 60px 0;
        text-align: center;
        color: #909399;
    }
    
    .empty-icon {
        font-size: 60px;
        color: #c0c4cc;
        margin-bottom: 10px;
    }
    
    .empty-text {
        font-size: 14px;
    }
    
    .idle-container-list {
        min-height: 55vh;
    }

    .idle-container-list-item {
        border-bottom: 1px solid #eeeeee;
        cursor: pointer;
        transition: background-color 0.3s;
    }
    
    .idle-container-list-item:hover {
        background-color: #f5f7fa;
    }
    
    .idle-container-list-item:last-child {
        border-bottom: none;
    }

    .idle-container-list-item-detile {
        height: 120px;
        display: flex;
        align-items: center;
        padding: 10px;
    }

    .idle-container-list-item-text {
        margin-left: 15px;
        height: 100px;
        max-width: 800px;
        flex: 1;
    }

    .idle-container-list-title {
        font-weight: 600;
        font-size: 18px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        color: #303133;
    }

    .idle-container-list-idle-details {
        font-size: 14px;
        color: #606266;
        padding-top: 5px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .idle-container-list-idle-time {
        font-size: 13px;
        padding-top: 5px;
        color: #909399;
    }

    .idle-item-foot {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .idle-prive {
        font-size: 16px;
        padding-top: 5px;
        color: #f56c6c;
        font-weight: 600;
    }
    
    .address-container {
        padding: 10px 20px;
    }

    .address-container-back {
        margin-bottom: 10px;
    }

    .address-container-add-title {
        font-size: 15px;
        color: #409EFF;
        padding: 10px;
    }

    .address-container-add-item {
        margin-bottom: 20px;
    }

    .demonstration {
        color: #666666;
        font-size: 14px;
        padding: 10px;
    }

    .address-container-add {
        padding: 0 200px;
    }

    .address-container-list {
        padding: 30px 100px;
    }
    
    @media (max-width: 768px) {
        .user-info-details {
            flex-direction: column;
            align-items: center;
            text-align: center;
        }
        
        .user-info-details-text {
            margin-left: 0;
            margin-top: 20px;
            width: 100%;
        }
        
        .user-info-details-text-edit {
            justify-content: center;
        }
        
        .address-container-add {
            padding: 0 20px;
        }
        
        .address-container-list {
            padding: 20px 10px;
        }
    }

    .address-card {
        margin-bottom: 20px;
        border-radius: 8px;
        overflow: hidden;
    }

    .address-header {
        padding: 10px 0;
        font-weight: 600;
    }

    .new-address-card {
        margin-bottom: 30px;
    }

    .new-address-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .address-limit-hint {
        font-size: 12px;
        color: #909399;
    }

    .address-form {
        padding: 10px 0;
    }

    .address-actions {
        display: flex;
        justify-content: flex-end;
        margin-top: 10px;
    }

    .address-list-section {
        margin-top: 20px;
    }

    .address-list-header {
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 20px;
        color: #303133;
        padding-bottom: 10px;
        border-bottom: 1px solid #f0f0f0;
    }

    .address-count {
        font-size: 13px;
        color: #909399;
        margin-left: 10px;
        font-weight: normal;
    }

    .empty-address {
        text-align: center;
        padding: 40px 0;
        color: #909399;
    }

    .empty-address i {
        font-size: 60px;
        color: #c0c4cc;
        margin-bottom: 10px;
    }

    .address-item {
        margin-bottom: 20px;
        transition: all 0.3s;
    }

    .address-item:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
    }

    .default-address {
        border: 1px solid #67c23a;
    }

    .address-item-header {
        display: flex;
        align-items: center;
        margin-bottom: 15px;
    }

    .address-name {
        font-weight: 600;
        color: #303133;
        margin-right: 10px;
    }

    .address-phone {
        color: #606266;
        margin-right: 10px;
    }

    .address-item-content {
        padding: 10px 0;
        display: flex;
        align-items: flex-start;
    }

    .address-item-content i {
        color: #409EFF;
        margin-right: 5px;
        font-size: 16px;
        margin-top: 2px;
    }

    .address-detail {
        color: #606266;
        line-height: 1.5;
        word-break: break-all;
    }

    .address-item-actions {
        margin-top: 15px;
        display: flex;
        justify-content: flex-end;
        gap: 5px;
    }
</style>
