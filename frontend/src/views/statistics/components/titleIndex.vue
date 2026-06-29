<template>
  <div class="title-index">
    <el-tabs v-model="activeTab" @tab-change="handleChange">
      <el-tab-pane label="昨日" name="1" />
      <el-tab-pane label="近7日" name="2" />
      <el-tab-pane label="近30日" name="3" />
      <el-tab-pane label="本周" name="4" />
      <el-tab-pane label="本月" name="5" />
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const emit = defineEmits<{ (e: 'sendTitleInd', val: number): void }>()
const activeTab = ref('2')
function handleChange(val: string) { emit('sendTitleInd', Number(val)) }
</script>
<style lang="scss" scoped>
.title-index { background: #fff; border-radius: 4px; padding: 0 20px; margin-bottom: 22px; }
</style>
