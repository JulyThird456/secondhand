<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="classObj.mobile && sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <sidebar class="sidebar-container" />
    <div class="main-container">
      <navbar />
      <app-main />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore, DeviceType } from '@/stores/app'
import { useResize } from '@/layout/composables/useResize'
import { AppMain, Navbar, Sidebar } from './components'

const appStore = useAppStore()
const { device, sidebar } = useResize()

const classObj = computed(() => ({
  hideSidebar: !sidebar.value.opened,
  openSidebar: sidebar.value.opened,
  withoutAnimation: sidebar.value.withoutAnimation,
  mobile: device.value === DeviceType.Mobile
}))

function handleClickOutside() {
  appStore.closeSidebar(false)
}
</script>

<style lang="scss" scoped>
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  min-width: 1366px;
  overflow-x: auto;
  overflow-y: hidden;
}

.main-container {
  height: 100%;
  background: #f3f4f7;
  position: relative;
  width: calc(100% - 190px);
  min-height: 100%;
  transition: margin-left 0.28s;
  margin-left: $sideBarWidth;
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.sidebar-container {
  transition: width 0.28s;
  width: $sideBarWidth !important;
  height: 100%;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 1001;
  overflow: hidden;
}

.hideSidebar {
  .main-container {
    margin-left: 80px;
    width: calc(100% - 80px) !important;
  }
  .sidebar-container {
    width: 80px !important;
  }
}

.mobile {
  .main-container {
    margin-left: 0px;
  }
  .sidebar-container {
    transition: transform 0.28s;
    width: $sideBarWidth !important;
  }
  &.openSidebar {
    position: fixed;
    top: 0;
  }
  &.hideSidebar {
    .sidebar-container {
      pointer-events: none;
      transition-duration: 0.3s;
      transform: translate3d(-$sideBarWidth, 0, 0);
    }
  }
}

.withoutAnimation {
  .main-container,
  .sidebar-container {
    transition: none;
  }
}
</style>
