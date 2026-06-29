<template>
  <div class="login">
    <div class="login-box">
      <img src="@/assets/login/login-l.svg" alt="" style="width: 60%; height: auto;" />
      <div class="login-form">
        <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules">
          <div class="login-form-title">
            <img src="@/assets/login/icon_logo.svg" style="width: 200px; height: 44px" alt="" />
          </div>
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" type="text" placeholder="账号" />
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="loginForm.password" type="password" placeholder="密码" @keyup.enter="handleLogin" />
          </el-form-item>
          <el-form-item style="width: 100%">
            <el-button :loading="loading" class="login-btn" size="medium" type="primary" style="width: 100%" @click="handleLogin">
              <span v-if="!loading">登录</span>
              <span v-else>登录中...</span>
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import type { FormInstance } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()
const loginFormRef = ref<FormInstance>()
const loading = ref(false)

const loginForm = reactive({
  username: 'admin',
  password: '123456'
})

const validateUsername = (_rule: any, value: string, callback: Function) => {
  if (!value) { callback(new Error('请输入用户名')) }
  else { callback() }
}

const validatePassword = (_rule: any, value: string, callback: Function) => {
  if (value.length < 6) { callback(new Error('密码必须在6位以上')) }
  else { callback() }
}

const loginRules = {
  username: [{ validator: validateUsername, trigger: 'blur' }],
  password: [{ validator: validatePassword, trigger: 'blur' }]
}

function handleLogin() {
  loginFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      loading.value = true
      try {
        const res = await userStore.Login(loginForm as any)
        if (String(res.code) === '1') { router.push('/') }
      } catch {} finally { loading.value = false }
    }
  })
}
</script>

<style lang="scss">
.login { display: flex; justify-content: center; align-items: center; height: 100%; background-color: #333; }
.login-box { width: 1000px; height: 474.38px; border-radius: 8px; display: flex; }
.login-box img { width: 60%; height: auto; }
.login-form { background: #fff; width: 40%; border-radius: 0 8px 8px 0; display: flex; justify-content: center; align-items: center; }
.login-form .el-form { width: 214px; }
.login-form .el-form-item { margin-bottom: 30px; }
.login-form .el-input__inner { border: 0; border-bottom: 1px solid #e9e9e8; border-radius: 0; font-size: 12px; color: #333; height: 32px; line-height: 32px; }
.login-form .el-input__inner::placeholder { color: #aeb5c4; }
.login-btn { border-radius: 17px; padding: 11px 20px !important; margin-top: 10px; font-weight: 500; font-size: 12px; border: 0; color: #333; background-color: #ffc200; }
.login-btn:hover, .login-btn:focus { background-color: #ffc200; color: #fff; }
.login-form-title { height: 36px; display: flex; justify-content: center; align-items: center; margin-bottom: 40px; }
</style>
