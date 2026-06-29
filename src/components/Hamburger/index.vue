<template>
  <div class="hamburger-container" @click="toggleClick">
    <el-icon :size="20" :class="{ 'is-active': isActive }">
      <Fold />
    </el-icon>
  </div>
</template>

<script setup lang="ts">
defineProps<{ isActive: boolean }>()
const emit = defineEmits<{ (e: 'toggleClick'): void }>()
function toggleClick() {
  emit('toggleClick')
}
</script>

<style lang="scss" scoped>
.hamburger-container {
  line-height: 54px;
  .el-icon {
    transition: 0.3s;
    &.is-active {
      transform: rotate(180deg);
    }
  }
}
</style>
