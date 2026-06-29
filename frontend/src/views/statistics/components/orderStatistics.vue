<template>
  <div class="chart-box">
    <div class="chart-title">
      订单统计
      <span class="summary">总订单: {{ overviewData?.totalOrderCount || 0 }} | 有效订单: {{ overviewData?.validOrderCount || 0 }} | 完成率: {{ overviewData?.orderCompletionRate || '0%' }}</span>
    </div>
    <div ref="chartRef" style="width: 100%; height: 300px"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'
import * as echarts from 'echarts'

const props = defineProps<{ orderdata: any; overviewData: any }>()
const chartRef = ref<HTMLDivElement>()
let chartInstance: echarts.ECharts | null = null

function initChart() {
  if (!chartRef.value) return
  chartInstance = echarts.init(chartRef.value)
  updateChart()
}

function updateChart() {
  if (!chartInstance || !props.orderdata?.data?.dateList) return
  chartInstance.setOption({
    tooltip: { trigger: 'axis' },
    legend: { data: ['订单数', '有效订单'] },
    xAxis: { type: 'category', data: props.orderdata.data.dateList, axisLabel: { rotate: 45, fontSize: 10 } },
    yAxis: { type: 'value' },
    series: [
      { name: '订单数', type: 'bar', data: props.orderdata.data.orderCountList, itemStyle: { color: '#FFC200' } },
      { name: '有效订单', type: 'bar', data: props.orderdata.data.validOrderCountList, itemStyle: { color: '#67C23A' } }
    ],
    grid: { left: '8%', right: '4%', bottom: '15%' }
  })
}

onMounted(initChart)
watch(() => props.orderdata, () => nextTick(updateChart), { deep: true })
</script>
<style lang="scss" scoped>
.chart-box { background: #fff; border-radius: 4px; padding: 20px; margin-right: 20px;
  .chart-title { font-size: 15px; font-weight: 500; margin-bottom: 16px; }
  .summary { font-size: 12px; color: #999; margin-left: 16px; font-weight: normal; }
}
</style>
