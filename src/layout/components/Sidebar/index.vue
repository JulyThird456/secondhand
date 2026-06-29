<template>
  <div>
    <div class="logo">
      <div v-if="!isCollapse" class="sidebar-logo">
        <img src="@/assets/login/logo.svg" style="width: 120px; height: 31px" />
      </div>
      <div v-else class="sidebar-logo-mini">
        <img src="@/assets/login/mini-logo.svg" />
      </div>
    </div>
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-openeds="defOpen"
        :default-active="defAct"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :active-text-color="variables.menuActiveText"
        :unique-opened="false"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" :is-collapse="isCollapse" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import SidebarItem from './SidebarItem.vue'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()

const variables = {
  menuBg: '#343744',
  menuText: '#bfcbd9',
  menuActiveText: '#FFC200'
}

const routes = computed(() => {
  const layoutRoute = router.getRoutes().find(r => r.path === '/')
  return layoutRoute?.children || []
})

const defOpen = computed(() => ['/'])
const defAct = computed(() => route.path)
const sidebar = computed(() => appStore.sidebar)
const isCollapse = computed(() => !sidebar.value.opened)
</script>

<style lang="scss" scoped>
.logo { text-align: center; background-color: #ffc100; padding: 15px 0 0; height: 60px; img { display: inline-block; } }
.sidebar-logo-mini img { width: 30px; height: 30px; }
.el-scrollbar { height: 100%; background-color: rgb(52, 55, 68); }
.el-menu { border: none; height: calc(95vh - 23px); width: 100% !important; padding: 47px 15px 0; }
</style>
