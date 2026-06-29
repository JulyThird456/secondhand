<template>
  <div class="overview-box">
    <div class="overview-title">营业数据</div>
    <div class="overview-content">
      <div class="overview-item">
        <div class="item-label">营业额</div>
        <div class="item-value">¥{{ overviewData?.turnover || '0.00' }}</div>
      </div>
      <div class="overview-item">
        <div class="item-label">订单量</div>
        <div class="item-value">{{ overviewData?.validOrderCount || 0 }}</div>
      </div>
      <div class="overview-item">
        <div class="item-label">平均客单价</div>
        <div class="item-value">¥{{ overviewData?.unitPrice || '0.00' }}</div>
      </div>
      <div class="overview-item">
        <div class="item-label">新增用户</div>
        <div class="item-value">{{ overviewData?.newUsers || 0 }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ overviewData: any }>()
</script>

<style lang="scss" scoped>
.overview-box {
  background: #fff;
  border-radius: 4px;
  padding: 20px 24px;
  margin-bottom: 22px;
  .overview-title { font-size: 16px; font-weight: 500; color: #333; margin-bottom: 20px; }
  .overview-content { display: flex; justify-content: space-between; }
  .overview-item {
    flex: 1;
    text-align: center;
    border-right: 1px solid #f0f0f0;
    &:last-child { border-right: none; }
    .item-label { font-size: 14px; color: #666; margin-bottom: 10px; }
    .item-value { font-size: 28px; font-weight: bold; color: #333; }
  }
}
</style>
