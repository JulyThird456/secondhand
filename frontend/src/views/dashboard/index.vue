<template>
  <div class="dashboard-container home">
    <Overview :overview-data="overviewData" />
    <Orderview :orderview-data="orderviewData" />
    <div class="homeMain">
      <CuisineStatistics :dishes-data="dishesData" />
      <SetMealStatistics :set-meal-data="setMealData" />
    </div>
    <OrderList :order-statics="orderStatics" @get-order-list-by3-status="getOrderListBy3Status" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getBusinessData, getOrderData, getOverviewDishes, getSetMealStatistics } from '@/api/index'
import { getOrderListBy } from '@/api/order'
import Overview from './components/overview.vue'
import Orderview from './components/orderview.vue'
import CuisineStatistics from './components/cuisineStatistics.vue'
import SetMealStatistics from './components/setMealStatistics.vue'
import OrderList from './components/orderList.vue'

const overviewData = ref<any>({})
const orderviewData = ref<any>({})
const dishesData = ref<any>({})
const setMealData = ref<any>({})
const orderStatics = ref<any>({})

onMounted(() => { init() })

function init() {
  getBusinessDataAction()
  getOrderStatisticsDataAction()
  getOverStatisticsDataAction()
  getSetMealStatisticsDataAction()
  getOrderListBy3Status()
}

async function getBusinessDataAction() {
  const { data } = await getBusinessData()
  overviewData.value = data.data
}

async function getOrderStatisticsDataAction() {
  const { data } = await getOrderData()
  orderviewData.value = data.data
}

async function getOverStatisticsDataAction() {
  const { data } = await getOverviewDishes()
  dishesData.value = data.data
}

async function getSetMealStatisticsDataAction() {
  const { data } = await getSetMealStatistics()
  setMealData.value = data.data
}

async function getOrderListBy3Status() {
  try {
    const { data } = await getOrderListBy({})
    if (data.code === 1) orderStatics.value = data.data
  } catch {}
}
</script>

<style lang="scss" scoped>
.home { margin-top: -25px; margin-left: -25px; margin-right: -25px; padding: 24px; }
.homeMain { display: flex; margin: 22px 0; > div { flex: 1; &:first-child { margin-right: 20px; } } }
</style>
