<template>
  <div class="navbar">
    <div class="statusBox">
      <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggle-click="toggleSideBar" />
      <span v-if="status===1" class="businessBtn">营业中</span>
      <span v-else class="businessBtn closing">打烊中</span>
    </div>
    <div class="right-menu">
      <div class="rightStatus">
        <span class="navicon operatingState" @click="handleStatus"><i></i>营业状态设置</span>
      </div>
      <div class="avatar-wrapper">
        <el-dropdown trigger="click" @command="handleCommand">
          <el-button type="primary">
            {{ name }}<el-icon><ArrowDown /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="pwd">修改密码</el-dropdown-item>
              <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'
import Hamburger from '@/components/Hamburger/index.vue'
import { getStatus } from '@/api/users'

const router = useRouter()
const appStore = useAppStore()
const userStore = useUserStore()

const status = ref(1)
const sidebar = appStore.sidebar
const name = ref('')

onMounted(async () => {
  const { data } = await getStatus()
  status.value = data.data
  const info = userStore.userInfo
  name.value = info?.name || ''
})

function toggleSideBar() {
  appStore.toggleSidebar(false)
}

function handleCommand(command: string) {
  if (command === 'logout') {
    userStore.LogOut().then(() => {
      router.replace({ path: '/login' })
    })
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 60px;
  position: relative;
  background: #ffc100;
}
.statusBox { float: left; height: 100%; align-items: center; display: flex; }
.hamburger-container { padding: 0 12px 0 20px; cursor: pointer; transition: background 0.3s; }
.right-menu { float: right; margin-right: 20px; color: #333; font-size: 14px; display: flex; align-items: center; height: 100%; }
.rightStatus { height: 100%; line-height: 60px; display: flex; align-items: center; float: left; }
.avatar-wrapper { margin-left: 18px; float: right; }
.businessBtn { height: 22px; line-height: 20px; background: #fd3333; border: 1px solid #fff; border-radius: 4px; display: inline-block; padding: 0 6px; color: #fff; }
.closing { background: #6a6a6a; }
.navicon i { display: inline-block; width: 18px; height: 18px; vertical-align: sub; margin: 0 4px 0 0; }
.operatingState i { background: url(@/assets/icons/time.svg) no-repeat; background-size: contain; }
</style>
