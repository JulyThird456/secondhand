<template>
  <div class="chart-box">
    <div class="chart-title">营业额统计</div>
    <div ref="chartRef" style="width: 100%; height: 300px"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'
import * as echarts from 'echarts'

const props = defineProps<{ turnoverdata: any }>()
const chartRef = ref<HTMLDivElement>()
let chartInstance: echarts.ECharts | null = null

function initChart() {
  if (!chartRef.value) return
  chartInstance = echarts.init(chartRef.value)
  updateChart()
}

function updateChart() {
  if (!chartInstance || !props.turnoverdata?.dateList) return
  chartInstance.setOption({
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: props.turnoverdata.dateList, axisLabel: { rotate: 45, fontSize: 10 } },
    yAxis: { type: 'value', name: '营业额' },
    series: [{ type: 'line', data: props.turnoverdata.turnoverList, smooth: true, lineStyle: { color: '#FFC200' }, itemStyle: { color: '#FFC200' }, areaStyle: { color: 'rgba(255,194,0,0.1)' } }],
    grid: { left: '8%', right: '4%', bottom: '15%' }
  })
}

onMounted(initChart)
watch(() => props.turnoverdata, () => nextTick(updateChart), { deep: true })
</script>
<style lang="scss" scoped>
.chart-box { background: #fff; border-radius: 4px; padding: 20px; margin-right: 20px;
  .chart-title { font-size: 15px; font-weight: 500; margin-bottom: 16px; }
}
</style>
