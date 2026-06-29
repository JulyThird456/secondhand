<template>
    <div>
        <app-head></app-head>
        <app-body>
            <div class="release-page-container">
                <el-card class="release-card" shadow="hover">
                    <div slot="header" class="release-header">
                        <h2 class="release-title">
                            <i class="el-icon-upload2"></i> 发布好物
                        </h2>
                        <p class="release-subtitle">在这里发布您想出售的好物</p>
                    </div>
                    
                    <el-form label-position="top" :model="idleItemInfo" class="release-form">
                        <!-- 基本信息区域 -->
                        <el-card class="form-section" shadow="never">
                            <div slot="header" class="section-header">
                                <i class="el-icon-document"></i> 基本信息
                            </div>
                            
                            <el-form-item label="标题">
                                <el-input 
                                    placeholder="请输入好物标题（简洁醒目更容易吸引买家）" 
                                    v-model="idleItemInfo.idleName"
                                    maxlength="30"
                                    prefix-icon="el-icon-edit"
                                    show-word-limit>
                                </el-input>
                            </el-form-item>
                            
                            <el-form-item label="详细描述">
                                <el-input
                                    class="release-idle-details"
                                    type="textarea"
                                    :rows="4"
                                    placeholder="请详细描述您的好物状况、新旧程度、购买渠道等信息"
                                    v-model="idleItemInfo.idleDetails"
                                    maxlength="1000"
                                    show-word-limit>
                                </el-input>
                            </el-form-item>
                        </el-card>
                        
                        <!-- 分类和价格区域 -->
                        <el-card class="form-section" shadow="never">
                            <div slot="header" class="section-header">
                                <i class="el-icon-s-grid"></i> 分类与价格
                            </div>
                            
                            <el-row :gutter="20">
                                <el-col :span="12">
                            <el-form-item label="好物类别">
                                        <el-select 
                                            v-model="idleItemInfo.idleLabel" 
                                            placeholder="请选择类别"
                                            style="width: 100%"
                                            class="category-select">
                                            <el-option
                                                v-for="item in options2"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                                <span class="category-icon">
                                                    <i :class="getCategoryIcon(item.value)"></i>
                                                </span>
                                                <span>{{ item.label }}</span>
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                
                                <el-col :span="12">
                                    <el-form-item label="价格" v-if="idleItemInfo.idleLabel !== 5">
                                        <el-input-number 
                                            v-model="idleItemInfo.idlePrice" 
                                            :precision="2" 
                                            :step="10" 
                                            :min="0"
                                            :max="10000000"
                                            style="width: 100%"
                                            class="price-input">
                                            <template slot="prepend">
                                                <i class="el-icon-price-tag"></i> ¥
                                            </template>
                                        </el-input-number>
                                    </el-form-item>
                                    <div v-else class="notice-hint">
                                        <i class="el-icon-info"></i> 公告类型无需设置价格
                                    </div>
                                </el-col>
                            </el-row>
                            
                            <el-form-item label="您的位置">
                                <el-cascader
                                    :options="options"
                                    v-model="selectedOptions"
                                    @change="handleChange"
                                    :separator="' '"
                                    placeholder="请选择您的位置，方便买家找到您"
                                    style="width: 100%;"
                                    class="location-select">
                                </el-cascader>
                            </el-form-item>
                        </el-card>
                        
                        <!-- 图片上传区域 -->
                        <el-card class="form-section" shadow="never">
                            <div slot="header" class="section-header">
                                <i class="el-icon-picture-outline"></i> 上传照片
                                <span class="upload-tip">（清晰的照片能提高成交率）</span>
                            </div>
                            
                            <el-upload
                                action="/file/"
                                :on-preview="fileHandlePreview"
                                :on-remove="fileHandleRemove"
                                :on-success="fileHandleSuccess"
                                :show-file-list="showFileList"
                                :limit="10"
                                :on-exceed="handleExceed"
                                accept="image/*"
                                drag
                                multiple
                                class="upload-area">
                                <i class="el-icon-upload"></i>
                                <div class="el-upload__text">拖拽图片到此处，或<em>点击上传</em></div>
                                <div class="el-upload__tip" slot="tip">支持JPG/PNG等格式，单张不超过5MB，最多10张</div>
                            </el-upload>
                            
                            <div v-if="imgList.length > 0" class="image-preview-section">
                                <div class="preview-title">已上传 {{imgList.length}} 张图片</div>
                                <div class="image-preview-list">
                                    <el-image 
                                        v-for="(img, index) in imgList" 
                                        :key="index"
                                        :src="img" 
                                        fit="cover"
                                        class="preview-image"
                                        :preview-src-list="imgList">
                                    </el-image>
                                </div>
                            </div>
                            
                            <el-dialog :visible.sync="imgDialogVisible">
                                <img width="100%" :src="dialogImageUrl" alt="">
                            </el-dialog>
                        </el-card>
                        
                        <!-- 提交按钮 -->
                        <div class="submit-section">
                            <el-button 
                                type="primary" 
                                round 
                                :icon="idleItemInfo.idleLabel === 5 ? 'el-icon-s-flag' : 'el-icon-shopping-bag-1'"
                                @click="releaseButton"
                                :loading="submitting"
                                class="submit-button">
                                {{ idleItemInfo.idleLabel === 5 ? '发布公告' : '发布好物' }}
                            </el-button>
                            <el-button 
                                round 
                                icon="el-icon-refresh-left"
                                @click="resetForm"
                                class="reset-button">
                                重置表单
                            </el-button>
                        </div>
                    </el-form>
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
        name: "release",
        components: {
            AppHead,
            AppBody,
            AppFoot
        },
        data() {
            return {
                imgDialogVisible: false,
                dialogImageUrl: '',
                showFileList: true,
                options: options,
                selectedOptions: [],
                submitting: false,
                options2: [{
                    value: 1,
                    label: '数码科技'
                }, {
                    value: 2,
                    label: '生活用品'
                }, {
                    value: 3,
                    label: '运动相关'
                }, {
                    value: 4,
                    label: '图书笔记'
                }, {
                    value: 5,
                    label: '公告展示'
                }],
                imgList: [],
                idleItemInfo: {
                    idleName: '',
                    idleDetails: '',
                    pictureList: '',
                    idlePrice: 0,
                    idlePlace: '',
                    idleLabel: ''
                }
            };
        },
        methods: {
            getCategoryIcon(categoryId) {
                const icons = {
                    1: 'el-icon-mobile-phone',
                    2: 'el-icon-box',
                    3: 'el-icon-football',
                    4: 'el-icon-reading',
                    5: 'el-icon-s-flag'
                };
                return icons[categoryId] || 'el-icon-goods';
            },
            handleChange(value) {
                console.log(value);
                this.idleItemInfo.idlePlace = value[1];
            },
            fileHandleRemove(file, fileList) {
                console.log(file, fileList);
                for (let i = 0; i < this.imgList.length; i++) {
                    if (this.imgList[i] === file.response.data) {
                        this.imgList.splice(i, 1);
                    }
                }
            },
            fileHandlePreview(file) {
                console.log(file);
                this.dialogImageUrl = file.response.data;
                this.imgDialogVisible = true;
            },
            fileHandleSuccess(response, file, fileList) {
                console.log("file:", response, file, fileList);
                this.imgList.push(response.data);
            },
            releaseButton() {
                // 验证表单
                if (!this.idleItemInfo.idleName) {
                    this.$message.error('请输入标题！');
                    return;
                }
                if (!this.idleItemInfo.idleDetails) {
                    this.$message.error('请输入详细描述！');
                    return;
                }
                if (!this.idleItemInfo.idlePlace) {
                    this.$message.error('请选择您的位置！');
                    return;
                }
                if (!this.idleItemInfo.idleLabel) {
                    this.$message.error('请选择闲置类别！');
                    return;
                }
                if (this.idleItemInfo.idleLabel !== 5 && (this.idleItemInfo.idlePrice <= 0)) {
                    this.$message.error('请设置合理的价格！');
                    return;
                }
                
                // 提交表单
                this.submitting = true;
                this.idleItemInfo.pictureList = JSON.stringify(this.imgList);
                
                this.$api.addIdleItem(this.idleItemInfo).then(res => {
                    this.submitting = false;
                    if (res.status_code === 1) {
                        this.$message({
                            message: '发布成功！',
                            type: 'success'
                        });
                        console.log(res.data);
                        this.$router.replace({ path: '/details', query: { id: res.data.id } });
                    } else {
                        this.$message.error('发布失败！' + res.msg);
                    }
                }).catch(e => {
                    this.submitting = false;
                    this.$message.error('网络错误，请稍后重试');
                });
            },
            handleExceed(files, fileList) {
                this.$message.warning(`限制10张图片，本次选择了 ${files.length} 张图，共选择了 ${files.length + fileList.length} 张图`);
            },
            resetForm() {
                this.$confirm('确定要重置表单吗？已填写的内容将会丢失', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.idleItemInfo = {
                        idleName: '',
                        idleDetails: '',
                        pictureList: '',
                        idlePrice: 0,
                        idlePlace: '',
                        idleLabel: ''
                    };
                    this.selectedOptions = [];
                    this.imgList = [];
                    this.$message({
                        type: 'success',
                        message: '表单已重置'
                    });
                }).catch(() => {});
            }
        }
    }
</script>

<style scoped>
    .release-page-container {
        min-height: 85vh;
        padding: 20px;
        background-color: #f5f7fa;
    }

    .release-card {
        max-width: 1000px;
        margin: 0 auto 40px;
        border-radius: 8px;
    }
    
    .release-header {
        text-align: center;
        padding-bottom: 10px;
    }
    
    .release-title {
        font-size: 24px;
        font-weight: 600;
        color: #303133;
        margin-bottom: 5px;
    }
    
    .release-subtitle {
        font-size: 14px;
        color: #909399;
        margin: 0;
    }
    
    .release-form {
        padding: 10px 0;
    }
    
    .form-section {
        margin-bottom: 20px;
        border-radius: 4px;
        border: 1px solid #ebeef5;
    }
    
    .section-header {
        font-size: 16px;
        font-weight: 600;
        color: #409EFF;
    }
    
    .release-idle-details {
        margin: 10px 0;
    }
    
    .category-select .category-icon {
        margin-right: 8px;
        color: #409EFF;
    }
    
    .price-input {
        width: 100%;
    }
    
    .location-select {
        width: 100%;
    }
    
    .notice-hint {
        padding: 20px 0;
        color: #909399;
        font-size: 14px;
    }
    
    .upload-tip {
        font-size: 12px;
        color: #909399;
        font-weight: normal;
        margin-left: 5px;
    }
    
    .upload-area {
        width: 100%;
    }
    
    .image-preview-section {
        margin-top: 20px;
    }
    
    .preview-title {
        margin-bottom: 10px;
        font-size: 14px;
        color: #606266;
    }
    
    .image-preview-list {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
    }
    
    .preview-image {
        width: 100px;
        height: 100px;
        object-fit: cover;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        transition: all 0.3s;
    }
    
    .preview-image:hover {
        transform: scale(1.05);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }
    
    .submit-section {
        display: flex;
        justify-content: center;
        margin-top: 30px;
        gap: 15px;
    }
    
    .submit-button {
        padding: 12px 30px;
        font-size: 16px;
    }
    
    .reset-button {
        padding: 12px 25px;
    }
    
    /* 响应式调整 */
    @media (max-width: 768px) {
        .release-page-container {
            padding: 10px;
        }
        
        .release-form {
            padding: 0;
        }
        
        .submit-section {
            flex-direction: column;
        }
        
        .submit-button, .reset-button {
            width: 100%;
            margin-bottom: 10px;
        }
    }
</style>
