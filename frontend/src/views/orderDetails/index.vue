<template>
  <div class="dashboard-container">
    <TabChange :default-activity="defaultActivity" @tab-change="change" />
    <div class="container" :class="{ hContainer: tableData.length }">
      <div class="tableBar">
        <label>订单号：</label>
        <el-input v-model="input" placeholder="请填写订单号" style="width: 15%" clearable @clear="init(orderStatus)" @keyup.enter="initFun(orderStatus)" />
        <label style="margin-left: 20px">手机号：</label>
        <el-input v-model="phone" placeholder="请填写手机号" style="width: 15%" clearable @clear="init(orderStatus)" @keyup.enter="initFun(orderStatus)" />
        <label style="margin-left: 20px">下单时间：</label>
        <el-date-picker v-model="valueTime" clearable value-format="YYYY-MM-DD HH:mm:ss" range-separator="至"
          type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" style="width: 25%" @clear="init(orderStatus)" />
        <el-button class="normal-btn continue" @click="init(orderStatus, true)">查询</el-button>
      </div>
      <el-table v-if="tableData.length" :data="tableData" stripe class="tableBox">
        <el-table-column prop="number" label="订单号" />
        <el-table-column prop="consignee" label="用户名" />
        <el-table-column prop="phone" label="手机号" />
        <el-table-column label="状态">
          <template #default="{ row }"><span>{{ getOrderType(row.status) }}</span></template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template #default="{ row }">
            <el-button type="text" class="blueBug" @click="goDetail(row.id, row.status, row)">查看</el-button>
            <el-button v-if="row.status === 2" type="text" class="blueBug" @click="orderAccept(row)">接单</el-button>
            <el-button v-if="row.status === 3" type="text" class="blueBug" @click="deliveryOrComplete(3, row.id)">派送</el-button>
            <el-button v-if="row.status === 4" type="text" class="blueBug" @click="deliveryOrComplete(4, row.id)">完成</el-button>
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
import { useRoute } from 'vue-router'
import TabChange from './tabChange.vue'
import Empty from '@/components/Empty/index.vue'
import { getOrderDetailPage, orderAccept, deliveryOrder, completeOrder } from '@/api/order'
import { ElMessage } from 'element-plus'

const route = useRoute()
const defaultActivity = ref(0)
const input = ref('')
const phone = ref('')
const valueTime = ref<any[]>([])
const counts = ref(0)
const page = ref(1)
const pageSize = ref(10)
const tableData = ref<any[]>([])
const isSearch = ref(false)
const orderStatus = ref(0)

onMounted(() => {
  const status = Number(route.query.status) || 0
  defaultActivity.value = status
  init(status)
})

async function init(activeIndex = 0, search?: boolean) {
  isSearch.value = !!search
  orderStatus.value = activeIndex
  try {
    const res = await getOrderDetailPage({
      page: page.value, pageSize: pageSize.value,
      number: input.value || undefined, phone: phone.value || undefined,
      beginTime: valueTime.value?.[0], endTime: valueTime.value?.[1],
      status: activeIndex || undefined
    })
    if (res.data.code === 1) { tableData.value = res.data.data.records; counts.value = Number(res.data.data.total) }
  } catch (err: any) { ElMessage.error('请求出错了：' + err.message) }
}

function initFun(activeIndex: number) { page.value = 1; init(activeIndex) }
function change(activeIndex: number) { init(activeIndex); input.value = ''; phone.value = ''; valueTime.value = [] }
function getOrderType(status: number) {
  const map: Record<number, string> = { 1: '待付款', 2: '待接单', 3: '待派送', 4: '派送中', 5: '已完成', 6: '已取消' }
  return map[status] || '退款'
}
function goDetail(id: any, status: number, row: any) { /* TODO: implement detail dialog */ }
async function orderAccept(row: any) { /* TODO */ ElMessage.success('操作成功'); init(orderStatus.value) }
async function deliveryOrComplete(status: number, id: string) { /* TODO */ ElMessage.success('操作成功'); init(orderStatus.value) }
function handleSizeChange(val: number) { pageSize.value = val; init(orderStatus.value) }
function handleCurrentChange(val: number) { page.value = val; init(orderStatus.value) }
</script>
<style lang="scss" scoped>
.dashboard-container { margin: 30px; min-height: 700px; }
.container { background: #fff; padding: 30px 28px; border-radius: 4px;
  .normal-btn { background: #333; color: white; margin-left: 20px; }
  .tableBar { margin-bottom: 20px; } .tableBox { width: 100%; border: 1px solid #f3f4f7; border-bottom: 0; }
  .pageList { text-align: center; margin-top: 30px; }
}
.hContainer { height: auto !important; }
</style>
