<template>
    <div class="footer">
        <div class="footer-content">
            <div class="footer-logo">
                <i :class="projectMode==='space'?'el-icon-user-solid':'el-icon-s-shop'"></i>
            <span v-if="projectMode==='space'">个人空间</span>
            <span v-else>校园二手集市</span>
            </div>


        </div>
    </div>
</template>

<script>
    export default {
        computed: {
            projectMode() {
                return this.$projectMode || (this.$route.query && this.$route.query.project) || '';
            }
        },
        name: "app-foot"
    }
</script>

<style scoped>
    .footer {
        background-color: #f5f7fa;
        color: #606266;
        padding: 30px 0 20px;
        width: 100%;
        border-top: 1px solid #e6e6e6;
    }

    .footer-content {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 20px;
        text-align: center;
    }

    .footer-logo {
        display: flex;
        align-items: center;
        justify-content: center;
        color: #409EFF;
        font-size: 20px;
        font-weight: 600;
        margin-bottom: 20px;
    }

    .footer-logo i {
        font-size: 24px;
        margin-right: 10px;
    }

    .footer-divider {
        height: 1px;
        background-color: #e6e6e6;
        margin-bottom: 20px;
    }

    .footer-bottom {
        text-align: center;
    }

    .footer-bottom p {
        margin: 5px 0;
        font-size: 14px;
        color: #909399;
    }

    /* 响应式调整 */
    @media (max-width: 768px) {
        .footer {
            padding: 25px 0 15px;
        }
        
        .footer-logo {
            font-size: 18px;
        }
        
        .footer-logo i {
            font-size: 22px;
        }
        
        .footer-bottom p {
            font-size: 13px;
        }
    }
</style>
