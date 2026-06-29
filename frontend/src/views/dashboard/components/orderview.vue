<template>
  <div class="orderview-box">
    <div class="orderview-title">今日订单</div>
    <div class="orderview-content">
      <div class="orderview-item">
        <div class="order-num">{{ orderviewData?.allOrders || 0 }}</div>
        <div class="order-label">总订单</div>
      </div>
      <div class="orderview-item">
        <div class="order-num pending">{{ orderviewData?.pendingOrders || 0 }}</div>
        <div class="order-label">待处理</div>
      </div>
      <div class="orderview-item">
        <div class="order-num delivering">{{ orderviewData?.deliveredOrders || 0 }}</div>
        <div class="order-label">待派送</div>
      </div>
      <div class="orderview-item">
        <div class="order-num completed">{{ orderviewData?.completedOrders || 0 }}</div>
        <div class="order-label">已完成</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ orderviewData: any }>()
</script>

<style lang="scss" scoped>
.orderview-box {
  background: #fff; border-radius: 4px; padding: 20px 24px; margin-bottom: 22px;
  .orderview-title { font-size: 16px; font-weight: 500; color: #333; margin-bottom: 20px; }
  .orderview-content { display: flex; justify-content: space-between; }
  .orderview-item { flex: 1; text-align: center;
    .order-num { font-size: 32px; font-weight: bold; color: #FFC200; margin-bottom: 8px;
      &.pending { color: #F56C6C; }
      &.delivering { color: #409EFF; }
      &.completed { color: #67C23A; }
    }
    .order-label { font-size: 14px; color: #666; }
  }
}
</style>
