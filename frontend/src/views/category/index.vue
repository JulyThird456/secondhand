<template>
  <div class="dashboard-container">
    <div class="container">
      <div class="tableBar">
        <label>分类名称：</label>
        <el-input v-model="name" placeholder="请填写分类名称" style="width: 15%" clearable @clear="init" @keyup.enter="init" />
        <label style="margin-left: 20px">分类类型：</label>
        <el-select v-model="categoryType" placeholder="请选择" clearable style="width: 15%" @clear="init">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <div style="float: right">
          <el-button type="primary" class="continue" @click="addClass('class')">+ 新增菜品分类</el-button>
          <el-button type="primary" style="margin-left:20px" @click="addClass('meal')">+ 新增套餐分类</el-button>
        </div>
        <el-button class="normal-btn continue" @click="init(true)">查询</el-button>
      </div>
      <el-table v-if="tableData.length" :data="tableData" stripe class="tableBox">
        <el-table-column prop="name" label="分类名称" />
        <el-table-column prop="type" label="分类类型">
          <template #default="scope"><span>{{ scope.row.type == '1' ? '菜品分类' : '套餐分类' }}</span></template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" />
        <el-table-column label="状态">
          <template #default="scope">
            <div class="tableColumn-status" :class="{ 'stop-use': String(scope.row.status) === '0' }">
              {{ String(scope.row.status) === '0' ? '禁用' : '启用' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="操作时间" />
        <el-table-column label="操作" width="200" align="center">
          <template #default="scope">
            <el-button type="text" size="small" class="blueBug" @click="editHandle(scope.row)">修改</el-button>
            <el-button type="text" size="small" class="delBut" @click="deleteHandle(scope.row.id)">删除</el-button>
            <el-button type="text" size="small" class="non" :class="{ blueBug: scope.row.status == '0', delBut: scope.row.status != '0' }"
              @click="statusHandle(scope.row)">{{ scope.row.status == '1' ? '禁用' : '启用' }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <Empty v-else :is-search="isSearch" />
      <el-pagination v-if="counts > 10" class="pageList" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper" :total="counts"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
    <el-dialog :title="classData.title" v-model="classData.dialogVisible" width="30%" :before-close="handleClose">
      <el-form ref="classDataRef" :model="classData" :rules="rules" label-width="100px">
        <el-form-item label="分类名称：" prop="name">
          <el-input v-model="classData.name" placeholder="请输入分类名称" maxlength="20" />
        </el-form-item>
        <el-form-item label="排序：" prop="sort">
          <el-input v-model="classData.sort" placeholder="请输入排序" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleClose()">取消</el-button>
        <el-button type="primary" :class="{ continue: actionType === 'add' }" @click="submitForm()">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { getCategoryPage, deleCategory, editCategory, addCategory, enableOrDisableEmployee } from '@/api/category'
import Empty from '@/components/Empty/index.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance } from 'element-plus'

const classDataRef = ref<FormInstance>()
const options = ref([{ value: 1, label: '菜品分类' }, { value: 2, label: '套餐分类' }])
const categoryType = ref<number | null>(null)
const name = ref('')
const counts = ref(0)
const page = ref(1)
const pageSize = ref(10)
const tableData = ref<any[]>([])
const type = ref('')
const isSearch = ref(false)
const action = ref('')
const actionType = ref('')

const classData = reactive({ title: '添加菜品分类', dialogVisible: false, id: '', name: '', sort: '' })

const rules = {
  name: [{ required: true, trigger: 'blur',
    validator: (_rule: any, value: string, callback: Function) => {
      const reg = /^[A-Za-z\u4e00-\u9fa5]+$/
      if (!value) callback(new Error('分类名称不能为空'))
      else if (value.length < 2) callback(new Error('分类名称输入不符，请输入2-20个字符'))
      else if (!reg.test(value)) callback(new Error('分类名称包含特殊字符'))
      else callback()
    }
  }],
  sort: [{ required: true, trigger: 'blur',
    validator: (_rule: any, value: string, callback: Function) => {
      if (value || String(value) === '0') {
        if (!/^\d+$/.test(value)) callback(new Error('排序只能输入数字类型'))
        else if (Number(value) > 99) callback(new Error('排序只能输入0-99数字'))
        else callback()
      } else callback(new Error('排序不能为空'))
    }
  }]
}

onMounted(() => { init() })

async function init(isSearchVal?: boolean) {
  isSearch.value = !!isSearchVal
  try {
    const res = await getCategoryPage({ page: page.value, pageSize: pageSize.value, name: name.value || undefined, type: categoryType.value || undefined })
    if (String(res.data.code) === '1') { tableData.value = res.data.data.records; counts.value = Number(res.data.data.total) }
    else ElMessage.error(res.data.desc)
  } catch (err: any) { ElMessage.error('请求出错了：' + err.message) }
}

function addClass(st: string) {
  classData.title = st === 'class' ? '新增菜品分类' : '新增套餐分类'
  type.value = st === 'class' ? '1' : '2'
  action.value = 'add'; actionType.value = 'add'
  classData.name = ''; classData.sort = ''; classData.dialogVisible = true
}

function editHandle(dat: any) {
  classData.title = '修改分类'; action.value = 'edit'; actionType.value = 'edit'
  classData.name = dat.name; classData.sort = dat.sort; classData.id = dat.id; classData.dialogVisible = true
}

function handleClose() { classData.dialogVisible = false; classDataRef.value?.resetFields() }

function statusHandle(row: any) {
  ElMessageBox.confirm('确认调整该分类的状态?', '提示', {
    confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
  }).then(async () => {
    try {
      const res = await enableOrDisableEmployee({ id: row.id, status: !row.status ? 1 : 0 })
      if (String(res.status) === '200') { ElMessage.success('分类状态更改成功！'); init() }
    } catch (err: any) { ElMessage.error('请求出错了：' + err.message) }
  }).catch(() => {})
}

function deleteHandle(id: any) {
  ElMessageBox.confirm('此操作将永久删除该分类，是否继续？', '确定删除', {
    confirmButtonText: '删除', cancelButtonText: '取消', type: 'warning'
  }).then(async () => {
    try {
      const res = await deleCategory(id)
      if (res.data.code === 1) { ElMessage.success('删除成功！'); init() }
      else ElMessage.error(res.data.msg)
    } catch (err: any) { ElMessage.error('请求出错了：' + err.message) }
  }).catch(() => {})
}

function submitForm() {
  classDataRef.value?.validate(async (valid: boolean) => {
    if (!valid) return
    try {
      let res
      if (action.value === 'add') res = await addCategory({ name: classData.name, type: type.value, sort: classData.sort })
      else res = await editCategory({ id: classData.id, name: classData.name, sort: classData.sort })
      if (res.data.code === 1) {
        ElMessage.success(action.value === 'add' ? '分类添加成功！' : '分类修改成功！')
        classDataRef.value?.resetFields(); classData.dialogVisible = false; init()
      } else ElMessage.error(res.data.desc || res.data.msg)
    } catch (err: any) { ElMessage.error('请求出错了：' + err.message) }
  })
}

function handleSizeChange(val: number) { pageSize.value = val; init() }
function handleCurrentChange(val: number) { page.value = val; init() }
</script>
<style lang="scss" scoped>
.dashboard-container { margin: 30px; }
.container { background: #fff; padding: 30px 28px; border-radius: 4px; }
.container .normal-btn { background: #333; color: white; margin-left: 20px; }
.container .tableBar { display: flex; margin-bottom: 20px; justify-content: space-between; }
.container .tableBox { width: 100%; border: 1px solid #f3f4f7; border-bottom: 0; }
.container .pageList { text-align: center; margin-top: 30px; }
</style>
