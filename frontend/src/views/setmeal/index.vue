<template>
  <div class="dashboard-container">
    <div class="container">
      <div class="tableBar">
        <label>套餐名称：</label>
        <el-input v-model="input" placeholder="请填写套餐名称" style="width: 14%" clearable @clear="init" @keyup.enter="initFun" />
        <label style="margin-left: 20px">套餐分类：</label>
        <el-select v-model="categoryId" style="width: 14%" placeholder="请选择" clearable @clear="init">
          <el-option v-for="item in dishCategoryList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <label style="margin-left: 20px">售卖状态：</label>
        <el-select v-model="dishStatus" style="width: 14%" placeholder="请选择" clearable @clear="init">
          <el-option v-for="item in saleStatus" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-button class="normal-btn continue" @click="init(true)">查询</el-button>
        <div class="tableLab" style="float: right">
          <span class="delBut non" @click="deleteHandle('batch', null)">批量删除</span>
          <el-button type="primary" style="margin-left: 15px" @click="addSetMeal('add')">+ 新建套餐</el-button>
        </div>
      </div>
      <el-table v-if="tableData.length" :data="tableData" stripe class="tableBox" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="25" />
        <el-table-column prop="name" label="套餐名称" />
        <el-table-column prop="image" label="图片">
          <template #default="{ row }">
            <el-image style="width: 80px; height: 40px" :src="row.image">
              <template #error><img src="@/assets/noImg.svg" style="height: 40px" /></template>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="categoryName" label="套餐分类" />
        <el-table-column label="套餐价">
          <template #default="scope"><span>¥{{ (scope.row.price).toFixed(2) }}</span></template>
        </el-table-column>
        <el-table-column label="售卖状态">
          <template #default="scope">
            <div class="tableColumn-status" :class="{ 'stop-use': String(scope.row.status) === '0' }">
              {{ String(scope.row.status) === '0' ? '停售' : '启售' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="最后操作时间" />
        <el-table-column label="操作" width="250" align="center">
          <template #default="scope">
            <el-button type="text" size="small" class="blueBug" @click="addSetMeal(scope.row)">修改</el-button>
            <el-button type="text" size="small" class="delBut" @click="deleteHandle('single', scope.row.id)">删除</el-button>
            <el-button type="text" size="small" class="non" :class="{ blueBug: scope.row.status == '0', delBut: scope.row.status != '0' }"
              @click="statusHandle(scope.row)">{{ scope.row.status == '0' ? '启售' : '停售' }}</el-button>
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
import { getSetmealPage, deleteSetmeal, setmealStatusByStatus, dishCategoryList } from '@/api/setMeal'
import Empty from '@/components/Empty/index.vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const input = ref('')
const counts = ref(0)
const page = ref(1)
const pageSize = ref(10)
const checkList = ref<any[]>([])
const tableData = ref<any[]>([])
const dishCategoryList = ref<any[]>([])
const categoryId = ref('')
const dishStatus = ref('')
const isSearch = ref(false)
const saleStatus = ref([{ value: 0, label: '停售' }, { value: 1, label: '启售' }])

onMounted(() => { init(); getDishCategoryListData() })

async function init(isSearchVal?: boolean) {
  isSearch.value = !!isSearchVal
  try {
    const res = await getSetmealPage({ page: page.value, pageSize: pageSize.value, name: input.value || undefined, categoryId: categoryId.value || undefined, status: dishStatus.value })
    if (res.data.code === 1) { tableData.value = res.data.data.records; counts.value = Number(res.data.data.total) }
    else ElMessage.error(res.data.msg)
  } catch (err: any) { ElMessage.error('请求出错了：' + err.message) }
}

function initFun() { page.value = 1; init() }

function addSetMeal(st: any) {
  if (st === 'add') router.push({ path: '/setmeal/add' })
  else router.push({ path: '/setmeal/add', query: { id: st.id } })
}

function deleteHandle(type: string, id?: any) {
  if (type === 'batch' && checkList.value.length === 0) return ElMessage.error('请选择删除对象')
  ElMessageBox.confirm('确定删除该套餐?', '确定删除', {
    confirmButtonText: '删除', cancelButtonText: '取消', type: 'warning'
  }).then(async () => {
    try {
      const res = await deleteSetmeal(type === 'batch' ? checkList.value.join(',') : id)
      if (res.data.code === 1) { ElMessage.success('删除成功！'); init() }
      else ElMessage.error(res.data.msg)
    } catch (err: any) { ElMessage.error('请求出错了：' + err.message) }
  }).catch(() => {})
}

async function getDishCategoryListData() {
  try {
    const res = await dishCategoryList({ type: 2 })
    if (res.data.code === 1) dishCategoryList.value = res.data.data.map((item: any) => ({ value: item.id, label: item.name }))
  } catch {}
}

function statusHandle(row: any) {
  let params: any = {}
  if (typeof row === 'string') {
    if (checkList.value.length === 0) return ElMessage.error('批量操作，请先勾选操作菜品！')
    params = { ids: checkList.value.join(','), status: row }
  } else {
    params = { ids: row.id, status: row.status ? '0' : '1' }
  }
  ElMessageBox.confirm('确认修改该套餐状态?', '提示', {
    confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
  }).then(async () => {
    try {
      const res = await setmealStatusByStatus(params)
      if (res.data.code === 1) { ElMessage.success('套餐状态已经更改成功！'); init() }
      else ElMessage.error(res.data.msg)
    } catch (err: any) { ElMessage.error('请求出错了：' + err.message) }
  }).catch(() => {})
}

function handleSelectionChange(val: any[]) { checkList.value = val.map((n: any) => n.id) }
function handleSizeChange(val: number) { pageSize.value = val; init() }
function handleCurrentChange(val: number) { page.value = val; init() }
</script>
<style lang="scss" scoped>
.dashboard-container { margin: 30px; }
.container { background: #fff; padding: 30px 28px; border-radius: 4px;
  .normal-btn { background: #333; color: white; margin-left: 20px; }
  .tableBar { margin-bottom: 20px; .tableLab { float: right; } }
  .tableBox { width: 100%; border: 1px solid #f3f4f7; border-bottom: 0; }
  .pageList { text-align: center; margin-top: 30px; }
}
</style>
