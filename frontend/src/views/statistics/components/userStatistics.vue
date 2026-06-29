<template>
  <div class="chart-box">
    <div class="chart-title">用户统计</div>
    <div ref="chartRef" style="width: 100%; height: 300px"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'
import * as echarts from 'echarts'

const props = defineProps<{ userdata: any }>()
const chartRef = ref<HTMLDivElement>()
let chartInstance: echarts.ECharts | null = null

function initChart() {
  if (!chartRef.value) return
  chartInstance = echarts.init(chartRef.value)
  updateChart()
}

function updateChart() {
  if (!chartInstance || !props.userdata?.dateList) return
  chartInstance.setOption({
    tooltip: { trigger: 'axis' },
    legend: { data: ['新增用户', '总用户'] },
    xAxis: { type: 'category', data: props.userdata.dateList, axisLabel: { rotate: 45, fontSize: 10 } },
    yAxis: { type: 'value' },
    series: [
      { name: '新增用户', type: 'bar', data: props.userdata.newUserList, itemStyle: { color: '#FFC200' } },
      { name: '总用户', type: 'line', data: props.userdata.totalUserList, lineStyle: { color: '#409EFF' }, itemStyle: { color: '#409EFF' } }
    ],
    grid: { left: '8%', right: '4%', bottom: '15%' }
  })
}

onMounted(initChart)
watch(() => props.userdata, () => nextTick(updateChart), { deep: true })
</script>
<style lang="scss" scoped>
.chart-box { background: #fff; border-radius: 4px; padding: 20px;
  .chart-title { font-size: 15px; font-weight: 500; margin-bottom: 16px; }
}
</style>
