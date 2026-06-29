<template>
  <div class="tab-change">
    <el-tabs v-model="activeName" @tab-change="handleTabChange">
      <el-tab-pane v-for="tab in tabs" :key="tab.value" :label="tab.label" :name="String(tab.value)" />
    </el-tabs>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
const props = defineProps<{ defaultActivity?: number }>()
const emit = defineEmits<{ (e: 'tabChange', val: number): void }>()
const tabs = ref([
  { label: '全部订单', value: 0 }, { label: '待付款', value: 1 }, { label: '待接单', value: 2 },
  { label: '待派送', value: 3 }, { label: '派送中', value: 4 }, { label: '已完成', value: 5 }, { label: '已取消', value: 6 }
])
const activeName = ref(String(props.defaultActivity || 0))
watch(() => props.defaultActivity, (v) => { if (v !== undefined) activeName.value = String(v) })
function handleTabChange(val: string) { emit('tabChange', Number(val)) }
</script>
<style lang="scss" scoped>
.tab-change { margin-bottom: 0; }
</style>
