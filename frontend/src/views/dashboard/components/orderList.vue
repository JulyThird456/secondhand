<template>
  <div class="order-list-box">
    <div class="order-list-title">订单信息</div>
    <div class="order-badges">
      <div class="badge-item" :class="{ active: curStatus === 2 }" @click="$emit('getOrderListBy3Status')">
        <span class="badge-val">{{ orderStatics?.toBeConfirmed || 0 }}</span>
        <span class="badge-label">待处理</span>
      </div>
      <div class="badge-item" :class="{ active: curStatus === 3 }">
        <span class="badge-val">{{ orderStatics?.toBeDelivered || 0 }}</span>
        <span class="badge-label">待派送</span>
      </div>
      <div class="badge-item" :class="{ active: curStatus === 4 }">
        <span class="badge-val">{{ orderStatics?.delivering || 0 }}</span>
        <span class="badge-label">派送中</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
defineProps<{ orderStatics: any }>()
defineEmits<{ (e: 'getOrderListBy3Status'): void }>()
const curStatus = ref(2)
</script>

<style lang="scss" scoped>
.order-list-box { background: #fff; border-radius: 4px; padding: 20px 24px; margin-top: 22px;
  .order-list-title { font-size: 16px; font-weight: 500; color: #333; margin-bottom: 20px; }
  .order-badges { display: flex;
    .badge-item { flex: 1; text-align: center; padding: 16px; cursor: pointer; border-radius: 4px; margin-right: 16px; background: #FAFAFB;
      &:last-child { margin-right: 0; }
      &.active { background: #FFF8E7; }
      .badge-val { display: block; font-size: 26px; font-weight: bold; color: #FFC200; margin-bottom: 6px; }
      .badge-label { font-size: 14px; color: #666; }
    }
  }
}
</style>
