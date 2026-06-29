<template>
  <div class="dashboard-container">
    <HeadLable>
      <div class="headBut">
        <span :class="{ act: act === 'day' }" @click="dateAct('day')">日报</span>
        <span :class="{ act: act === 'week' }" @click="dateAct('week')">周报</span>
        <span :class="{ act: act === 'mouth' }" @click="dateAct('mouth')">月报</span>
      </div>
    </HeadLable>
    <div class="container">
      <el-date-picker v-model="dataTime" type="date" placeholder="选择日期" value-format="YYYY-MM-DD" @change="changeDate" />
      <div ref="chartRef" style="width: 100%; height: 400px; margin-top: 20px"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import { getChartsDataes } from '@/api/charts'
import HeadLable from '@/components/HeadLable/index.vue'

const act = ref('day')
const dataTime = ref('')
const chartRef = ref<HTMLDivElement>()
let chartInstance: echarts.ECharts | null = null

onMounted(() => {
  const now = new Date(); const y = now.getFullYear(); const m = String(now.getMonth()+1).padStart(2,'0'); const d = String(now.getDate()).padStart(2,'0')
  dataTime.value = `${y}-${m}-${d}`
  loadData()
})

function dateAct(val: string) { act.value = val; nextTick(loadData) }
function changeDate() { loadData() }

async function loadData() {
  if (!chartRef.value) return
  if (!chartInstance) chartInstance = echarts.init(chartRef.value)
  chartInstance.setOption({
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: ['00:00', '06:00', '12:00', '18:00', '24:00'] },
    yAxis: { type: 'value' },
    series: [{ type: 'line', data: [0, 0, 0, 0, 0], smooth: true, lineStyle: { color: '#FFC200' }, itemStyle: { color: '#FFC200' } }]
  })
}
</script>
<style lang="scss" scoped>
.dashboard-container { margin: 30px; }
.container { background: #fff; padding: 30px 28px; border-radius: 4px; }
.headBut span { display: inline-block; padding: 8px 20px; cursor: pointer; color: #666;
  &.act { background: #FFC200; color: #333; border-radius: 4px; }
}
</style>
