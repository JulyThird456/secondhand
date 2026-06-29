<template>
  <div class="stat-box">
    <div class="stat-title">菜品总览</div>
    <div class="stat-list">
      <div class="stat-item">
        <span class="stat-name">在售菜品</span>
        <span class="stat-val">{{ dishesData?.sold || 0 }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-name">停售菜品</span>
        <span class="stat-val">{{ dishesData?.unsold || 0 }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ dishesData: any }>()
</script>

<style lang="scss" scoped>
.stat-box { background: #fff; border-radius: 4px; padding: 20px; margin-right: 20px;
  .stat-title { font-size: 15px; font-weight: 500; color: #333; margin-bottom: 16px; }
  .stat-item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f5f5f5;
    &:last-child { border-bottom: none; }
    .stat-name { color: #666; }
    .stat-val { font-weight: 500; color: #333; }
  }
}
</style>
