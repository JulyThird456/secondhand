<template>
  <div class="empty-box">
    <div class="empty-content">
      <img v-if="!isSearch" src="@/assets/table_empty.svg" />
      <img v-else src="@/assets/search_table_empty.svg" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ isSearch?: boolean }>()
</script>

<style lang="scss" scoped>
.empty-box {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  .empty-content {
    text-align: center;
    img {
      max-width: 200px;
    }
  }
}
</style>
