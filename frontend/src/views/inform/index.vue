<template>
  <div class="dashboard-container">
    <div class="informBox">
      <el-tabs v-model="activeTab" @tab-change="handleClass">
        <el-tab-pane label="全部消息" name="0" />
        <el-tab-pane label="未读消息" name="1" />
      </el-tabs>
      <el-button v-if="activeTab === '1' && tableData.length" @click="handleBatch">全部已读</el-button>
      <el-button v-else disabled>全部已读</el-button>
    </div>
    <div class="container">
      <div v-if="tableData.length" class="informList">
        <div v-for="item in tableData" :key="item.id" class="item" :class="{ unread: item.status === 0 }">
          <div class="tit">
            <span v-if="item.type === 1" class="badge">待接单</span>
            <span v-else class="badge urgent">催单</span>
            {{ item.content }}
            <span class="time">{{ item.createTime }}</span>
            <el-button v-if="item.status === 0" type="text" size="small" @click="handleSetStatus(item.id)">标为已读</el-button>
          </div>
        </div>
      </div>
      <Empty v-else />
      <el-pagination v-if="counts > 10" class="pageList" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper" :total="counts"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getInformData, batchMsg, setStatus as setMsgStatus } from '@/api/inform'
import Empty from '@/components/Empty/index.vue'
import { ElMessage } from 'element-plus'

const activeTab = ref('0')
const tableData = ref<any[]>([])
const counts = ref(0)
const page = ref(1)
const pageSize = ref(10)

onMounted(() => { init() })

async function init() {
  try {
    const { data } = await getInformData({ page: page.value, pageSize: pageSize.value, status: activeTab.value || undefined })
    if (data.code === 1) { tableData.value = data.data.records; counts.value = Number(data.data.total) }
  } catch {}
}

function handleClass(val: string) { activeTab.value = val; page.value = 1; init() }

async function handleBatch() {
  try {
    const unreadIds = tableData.value.filter(i => i.status === 0).map(i => i.id)
    const { data } = await batchMsg({ ids: unreadIds })
    if (data.code === 1) { ElMessage.success('操作成功'); init() }
  } catch {}
}

async function handleSetStatus(id: string) {
  try {
    const { data } = await setMsgStatus(id)
    if (data.code === 1) { ElMessage.success('已标为已读'); init() }
  } catch {}
}

function handleSizeChange(val: number) { pageSize.value = val; init() }
function handleCurrentChange(val: number) { page.value = val; init() }
</script>
<style lang="scss" scoped>
.dashboard-container { margin: 30px; }
.informBox { display: flex; justify-content: space-between; align-items: center; background: #fff; padding: 0 20px; border-radius: 4px 4px 0 0; }
.container { background: #fff; padding: 20px 28px; border-radius: 0 0 4px 4px; }
.item { padding: 16px 0; border-bottom: 1px solid #f0f0f0; }
.item.unread { background: #FFF8E7; margin: 0 -28px; padding: 16px 28px; }
.item .tit { display: flex; align-items: center; font-size: 14px; }
.badge { display: inline-block; background: #FFC200; color: #333; padding: 2px 8px; border-radius: 4px; font-size: 12px; margin-right: 8px; }
.badge.urgent { background: #F56C6C; color: #fff; }
.time { margin-left: auto; color: #999; font-size: 12px; }
.pageList { text-align: center; margin-top: 30px; }
</style>
