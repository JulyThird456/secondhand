<template>
  <div class="dashboard-container">
    <div class="container">
      <div class="nav">
        <el-button text @click="$router.back()"><el-icon><ArrowLeft /></el-icon> 返回</el-button>
        <span class="title">{{ isEdit ? '编辑员工' : '添加员工' }}</span>
      </div>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px" style="max-width: 500px; margin-top: 30px;">
        <el-form-item label="员工姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="账号" prop="username">
          <el-input v-model="form.username" placeholder="请输入账号" :disabled="isEdit" />
        </el-form-item>
        <el-form-item v-if="!isEdit" label="密码" prop="password">
          <el-input v-model="form.password" type="password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">保存</el-button>
          <el-button @click="$router.back()">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { addEmployee, editEmployee, queryEmployeeById } from '@/api/employee'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'

const route = useRoute()
const router = useRouter()
const formRef = ref<FormInstance>()
const isEdit = ref(!!route.query.id)

const form = reactive({ name: '', username: '', password: '', phone: '' })

const rules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: !isEdit.value, message: '请输入密码', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }]
}

onMounted(async () => {
  if (route.query.id) {
    const { data } = await queryEmployeeById(route.query.id as string)
    if (data.code === 1) Object.assign(form, data.data)
  }
})

async function submitForm() {
  formRef.value?.validate(async (valid) => {
    if (!valid) return
    try {
      const res = isEdit.value ? await editEmployee(form) : await addEmployee(form)
      if (res.data.code === 1) { ElMessage.success(isEdit.value ? '修改成功' : '添加成功'); router.back() }
      else ElMessage.error(res.data.msg)
    } catch (err: any) { ElMessage.error('请求出错了：' + err.message) }
  })
}
</script>
<style lang="scss" scoped>
.dashboard-container { margin: 30px; }
.container { background: #fff; padding: 30px; border-radius: 4px; }
.nav { display: flex; align-items: center; .title { font-size: 16px; font-weight: 500; margin-left: 12px; } }
</style>
