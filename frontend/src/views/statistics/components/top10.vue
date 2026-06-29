<template>
  <div class="chart-box">
    <div class="chart-title">销量排名 TOP10</div>
    <div ref="chartRef" style="width: 100%; height: 300px"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'
import * as echarts from 'echarts'

const props = defineProps<{ top10data: any }>()
const chartRef = ref<HTMLDivElement>()
let chartInstance: echarts.ECharts | null = null

function initChart() {
  if (!chartRef.value) return
  chartInstance = echarts.init(chartRef.value)
  updateChart()
}

function updateChart() {
  if (!chartInstance || !props.top10data?.nameList) return
  chartInstance.setOption({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    xAxis: { type: 'value', name: '销量' },
    yAxis: { type: 'category', data: props.top10data.nameList, axisLabel: { fontSize: 11 } },
    series: [{ type: 'bar', data: props.top10data.numberList, itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{ offset: 0, color: '#FFC200' }, { offset: 1, color: '#FF8C00' }]) } }],
    grid: { left: '20%', right: '4%' }
  })
}

onMounted(initChart)
watch(() => props.top10data, () => nextTick(updateChart), { deep: true })
</script>
<style lang="scss" scoped>
.chart-box { background: #fff; border-radius: 4px; padding: 20px;
  .chart-title { font-size: 15px; font-weight: 500; margin-bottom: 16px; }
}
</style>
