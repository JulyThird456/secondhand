<template>
  <div v-if="!item.meta || !item.meta.hidden" :class="['menu-wrapper', 'full-mode', { 'first-level': isFirstLevel }]">
    <template v-if="theOnlyOneChild && !theOnlyOneChild.children">
      <sidebar-item-link v-if="theOnlyOneChild.meta" :to="resolvePath(theOnlyOneChild.path)">
        <el-menu-item :index="resolvePath(theOnlyOneChild.path)" :class="{ 'submenu-title-noDropdown': isFirstLevel }">
          <i v-if="theOnlyOneChild.meta.icon" :class="theOnlyOneChild.meta.icon" />
          <span>{{ theOnlyOneChild.meta.title }}</span>
        </el-menu-item>
      </sidebar-item-link>
    </template>
    <el-sub-menu v-else :index="resolvePath(item.path)">
      <template #title>
        <i v-if="item.meta && item.meta.icon" :class="item.meta.icon" />
        <span v-if="item.meta && item.meta.title">{{ item.meta.title }}</span>
      </template>
      <template v-if="item.children">
        <sidebar-item
          v-for="child in item.children"
          :key="child.path"
          :item="child"
          :is-first-level="false"
          :base-path="resolvePath(child.path)"
          class="nest-menu"
        />
      </template>
    </el-sub-menu>
  </div>
</template>

<script setup lang="ts">
import path from 'path'
import { isExternal } from '@/utils/validate'
import SidebarItemLink from './SidebarItemLink.vue'
import type { RouteRecordRaw } from 'vue-router'

const props = withDefaults(defineProps<{
  item: RouteRecordRaw
  isCollapse?: boolean
  isFirstLevel?: boolean
  basePath?: string
}>(), {
  isCollapse: false,
  isFirstLevel: true,
  basePath: ''
})

const showingChildNumber = () => {
  if (props.item.children) {
    return props.item.children.filter((item: RouteRecordRaw) => {
      return !(item.meta && item.meta.hidden)
    }).length
  }
  return 0
}

const theOnlyOneChild = () => {
  const num = showingChildNumber()
  if (num > 0) return null
  if (props.item.children) {
    for (const child of props.item.children) {
      if (!child.meta || !child.meta.hidden) {
        return child
      }
    }
  }
  return { ...props.item, path: '' }
}

function resolvePath(routePath: string) {
  if (isExternal(routePath)) return routePath
  if (isExternal(props.basePath)) return props.basePath
  return path.resolve(props.basePath, routePath)
}
</script>
