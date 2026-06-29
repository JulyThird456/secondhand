<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in levelList" :key="item.path">
        <span v-if="item.redirect === 'noRedirect' || index === levelList.length - 1" class="no-redirect">
          {{ item.meta.title }}
        </span>
        <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { RouteLocationMatched } from 'vue-router'

const route = useRoute()
const router = useRouter()
const levelList = ref<RouteLocationMatched[]>([])

function getBreadcrumb() {
  const matched = route.matched.filter((item) => item.meta && item.meta.title)
  levelList.value = matched
}

watch(route, getBreadcrumb, { immediate: true })

function handleLink(item: any) {
  const { redirect, path } = item
  if (redirect) {
    router.push(redirect)
    return
  }
  router.push(path)
}
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  line-height: 50px;
  margin-left: 8px;
  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
