<template>
  <div>
    <app-head></app-head>
    <app-body>
      <div class="payment-success-container">
        <div class="success-card">
          <div class="success-icon">
            <i class="el-icon-circle-check"></i>
          </div>
          <h1 class="success-title">支付成功</h1>
          <div class="order-info">
            <p class="order-number">订单号: {{ orderNo || '未知订单' }}</p>
            <p class="order-amount">支付金额: <span class="price">¥{{ price || '0.00' }}</span></p>
          </div>
          <div class="success-description">
            <p>您的订单已支付成功，感谢您的购买！</p>
            <p>卖家将尽快为您发货</p>
          </div>
          <div class="action-buttons">
            <el-button type="primary" round @click="goToOrder" icon="el-icon-document">查看订单</el-button>
            <el-button round @click="goToHome" icon="el-icon-s-home">返回首页</el-button>
          </div>
        </div>
      </div>
      <app-foot></app-foot>
    </app-body>
  </div>
</template>

<script>
import AppHead from '../common/AppHeader.vue';
import AppBody from '../common/AppPageBody.vue';
import AppFoot from '../common/AppFoot.vue';

export default {
  name: 'AlipaySuccess',
  components: {
    AppHead,
    AppBody,
    AppFoot
  },
  data() {
    return {
      orderNo: '',
      price: '',
      orderId: ''
    }
  },
  mounted() {
    // 在mounted钩子中解析参数，确保DOM已完全加载
    this.parseUrlParams();
  },
  methods: {
    parseUrlParams() {
      try {
        // 直接从URL获取完整查询字符串
        const fullUrl = window.location.href;
        console.log('完整URL:', fullUrl);
        
        // 手动解析URL参数
        let params = {};
        if (fullUrl.includes('?')) {
          const queryPart = fullUrl.split('?')[1];
          const queryParams = queryPart.split('&');
          
          for (let i = 0; i < queryParams.length; i++) {
            if (queryParams[i].includes('=')) {
              const [key, value] = queryParams[i].split('=');
              // 解码URL编码的参数
              params[key] = decodeURIComponent(value || '');
            }
          }
        }
        
        console.log('解析后的参数:', params);
        
        // 赋值给组件数据
        this.orderId = params.name || '';
        this.orderNo = params.no || '未知订单';
        this.price = params.price || '0';
        
        // 确保价格正确显示
        if (this.price && !isNaN(parseFloat(this.price))) {
          this.price = parseFloat(this.price).toFixed(2);
        } else {
          this.price = '0.00';
        }
        
        console.log('组件数据:', {
          orderId: this.orderId,
          orderNo: this.orderNo,
          price: this.price
        });
      } catch (error) {
        console.error('解析URL参数出错:', error);
        this.$message.error('解析订单信息出错，请返回重试');
      }
    },
    goToOrder() {
      if (!this.orderId) {
        this.$message.error('订单ID不存在，无法查看订单详情');
        return;
      }
      
      // 使用window.location直接跳转，避免路由问题
      window.location.href = `${window.location.origin}/#/order?id=${this.orderId}`;
    },
    goToHome() {
      window.location.href = `${window.location.origin}/#/`;
    }
  }
}
</script>

<style scoped>
.payment-success-container {
  min-height: 85vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa;
  padding: 20px;
}

.success-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 40px;
  text-align: center;
  width: 100%;
  max-width: 500px;
}

.success-icon {
  font-size: 80px;
  color: #67c23a;
  margin-bottom: 20px;
}

.success-title {
  font-size: 28px;
  color: #303133;
  margin-bottom: 20px;
}

.order-info {
  background-color: #f5f7fa;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
  border-left: 4px solid #67c23a;
}

.order-number, .order-amount {
  margin: 10px 0;
  color: #606266;
  font-size: 16px;
}

.price {
  color: #f56c6c;
  font-weight: bold;
  font-size: 18px;
}

.success-description {
  color: #606266;
  margin-bottom: 30px;
  line-height: 1.6;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
}

@media (max-width: 768px) {
  .success-card {
    padding: 30px 20px;
  }
  
  .success-icon {
    font-size: 60px;
  }
  
  .success-title {
    font-size: 24px;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 10px;
  }
}
</style> 