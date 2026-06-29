<template>
  <div class="dashboard-container">
    <div class="container">
      <div class="nav">
        <el-button text @click="$router.back()"><el-icon><ArrowLeft /></el-icon> 返回</el-button>
        <span class="title">{{ isEdit ? '编辑菜品' : '添加菜品' }}</span>
      </div>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px" style="max-width: 600px; margin-top: 30px;">
        <el-form-item label="菜品名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入菜品名称" />
        </el-form-item>
        <el-form-item label="菜品分类" prop="categoryId">
          <el-select v-model="form.categoryId" placeholder="请选择分类" style="width: 100%">
            <el-option v-for="item in categoryOptions" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="菜品价格" prop="price">
          <el-input-number v-model="form.price" :min="0" :precision="2" style="width: 200px" />
        </el-form-item>
        <el-form-item label="菜品图片">
          <el-upload action="#" list-type="picture-card" :auto-upload="false">
            <el-icon><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="菜品描述">
          <el-input v-model="form.description" type="textarea" rows="3" />
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
import { addDish, editDish, queryDishById, getCategoryList } from '@/api/dish'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'

const route = useRoute()
const router = useRouter()
const formRef = ref<FormInstance>()
const isEdit = ref(!!route.query.id)
const categoryOptions = ref<any[]>([])

const form = reactive({ name: '', categoryId: '', price: 0, description: '' })

const rules = {
  name: [{ required: true, message: '请输入菜品名称', trigger: 'blur' }],
  categoryId: [{ required: true, message: '请选择分类', trigger: 'change' }],
  price: [{ required: true, message: '请输入价格', trigger: 'blur' }]
}

onMounted(async () => {
  const { data } = await getCategoryList({ type: 1 })
  if (data.code === 1) categoryOptions.value = data.data
  if (route.query.id) {
    const res = await queryDishById(route.query.id as string)
    if (res.data.code === 1) Object.assign(form, res.data.data)
  }
})

async function submitForm() {
  formRef.value?.validate(async (valid) => {
    if (!valid) return
    try {
      const res = isEdit.value ? await editDish(form) : await addDish(form)
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
