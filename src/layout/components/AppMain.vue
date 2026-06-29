<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <router-view />
    </transition>
  </section>
</template>

<script setup lang="ts">
</script>

<style lang="scss" scoped>
.app-main {
  height: calc(100% - 64px);
  overflow-y: auto;
}
</style>
