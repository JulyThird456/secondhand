<template>
  <div class="dashboard-container">
    <div class="container">
      <div class="tableBar">
        <label style="margin-right: 5px">员工姓名：</label>
        <el-input v-model="input" placeholder="请输入员工姓名" style="width: 15%" clearable @clear="init" @keyup.enter="initFun" />
        <el-button class="normal-btn continue" @click="init(true)">查询</el-button>
        <el-button type="primary" style="float: right" @click="addEmployeeHandle('add')">+ 添加员工</el-button>
      </div>
      <el-table v-if="tableData.length" :data="tableData" stripe class="tableBox">
        <el-table-column prop="name" label="员工姓名" />
        <el-table-column prop="username" label="账号" />
        <el-table-column prop="phone" label="手机号" />
        <el-table-column label="账号状态">
          <template #default="scope">
            <div class="tableColumn-status" :class="{ 'stop-use': String(scope.row.status) === '0' }">{{ String(scope.row.status) === '0' ? '禁用' : '启用' }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="最后操作时间" />
        <el-table-column label="操作" width="160" align="center">
          <template #default="scope">
            <el-button type="text" size="small" class="blueBug" :class="{ 'disabled-text': scope.row.username === 'admin' }"
              :disabled="scope.row.username === 'admin'" @click="addEmployeeHandle(scope.row.id, scope.row.username)">修改</el-button>
            <el-button type="text" size="small" :disabled="scope.row.username === 'admin'" class="non"
              :class="{ 'disabled-text': scope.row.username === 'admin', blueBug: scope.row.status == '0', delBut: scope.row.status != '0' }"
              @click="statusHandle(scope.row)">{{ scope.row.status == '1' ? '禁用' : '启用' }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <Empty v-else :is-search="isSearch" />
      <el-pagination v-if="counts > 10" class="pageList" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper" :total="counts"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getEmployeeList, enableOrDisableEmployee } from '@/api/employee'
import Empty from '@/components/Empty/index.vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const input = ref('')
const counts = ref(0)
const page = ref(1)
const pageSize = ref(10)
const tableData = ref<any[]>([])
const isSearch = ref(false)

onMounted(() => { init() })

async function init(isSearchVal?: boolean) {
  isSearch.value = !!isSearchVal
  try {
    const res = await getEmployeeList({ page: page.value, pageSize: pageSize.value, name: input.value || undefined })
    if (String(res.data.code) === '1') { tableData.value = res.data.data.records; counts.value = res.data.data.total }
  } catch (err: any) { ElMessage.error('请求出错了：' + err.message) }
}

function initFun() { page.value = 1; init() }

function addEmployeeHandle(st: string, username?: string) {
  if (st === 'add') { router.push({ path: '/employee/add' }) }
  else if (username !== 'admin') { router.push({ path: '/employee/add', query: { id: st } }) }
}

function statusHandle(row: any) {
  if (row.username === 'admin') return
  ElMessageBox.confirm('确认调整该账号的状态？', '提示', {
    confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
  }).then(async () => {
    try {
      const res = await enableOrDisableEmployee({ id: row.id, status: !row.status ? 1 : 0 })
      if (String(res.status) === '200') { ElMessage.success('账号状态更改成功！'); init() }
    } catch (err: any) { ElMessage.error('请求出错了：' + err.message) }
  }).catch(() => {})
}

function handleSizeChange(val: number) { pageSize.value = val; init() }
function handleCurrentChange(val: number) { page.value = val; init() }
</script>
<style lang="scss" scoped>
.disabled-text { color: #bac0cd !important; }
.dashboard-container { margin: 30px; }
.container { background: #fff; position: relative; z-index: 1; padding: 30px 28px; border-radius: 4px; }
.container .tableBar { margin-bottom: 20px; }
.container .tableBox { width: 100%; border: 1px solid #f3f4f7; border-bottom: 0; }
.container .pageList { text-align: center; margin-top: 30px; }
.normal-btn { background: #333333; color: white; margin-left: 20px; }
</style>
