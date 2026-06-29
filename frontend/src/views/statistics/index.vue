<template>
  <div class="dashboard-container home">
    <TitleIndex @send-title-ind="getTitleNum" />
    <div class="homeMain">
      <TurnoverStatistics :turnoverdata="turnoverData" />
      <UserStatistics :userdata="userData" />
    </div>
    <div class="homeMain homecon">
      <OrderStatistics :orderdata="orderData" :overview-data="overviewData" />
      <Top :top10data="top10Data" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { get1stAndToday, past7Day, past30Day, pastWeek, pastMonth } from '@/utils/formValidate'
import { getTurnoverStatistics, getUserStatistics, getOrderStatistics, getTop } from '@/api/index'
import TitleIndex from './components/titleIndex.vue'
import TurnoverStatistics from './components/turnoverStatistics.vue'
import UserStatistics from './components/userStatistics.vue'
import OrderStatistics from './components/orderStatistics.vue'
import Top from './components/top10.vue'

const turnoverData = ref<any>({})
const userData = ref<any>({})
const orderData = ref<any>({ data: {} })
const top10Data = ref<any>({})
const overviewData = ref<any>({})

function getTitleNum(data: number) {
  let tateData: string[] = []
  switch (data) {
    case 1: tateData = get1stAndToday(); break
    case 2: tateData = past7Day(); break
    case 3: tateData = past30Day(); break
    case 4: tateData = pastWeek(); break
    case 5: tateData = pastMonth(); break
    default: tateData = past7Day(); break
  }
  init(tateData[0], tateData[1])
}

function init(begin: string, end: string) {
  getTurnoverStatisticsData(begin, end)
  getUserStatisticsData(begin, end)
  getOrderStatisticsData(begin, end)
  getTopData(begin, end)
}

async function getTurnoverStatisticsData(begin: string, end: string) {
  const { data } = await getTurnoverStatistics({ begin, end })
  const d = data.data
  turnoverData.value = { dateList: d.dateList.split(','), turnoverList: d.turnoverList.split(',') }
}

async function getUserStatisticsData(begin: string, end: string) {
  const { data } = await getUserStatistics({ begin, end })
  const d = data.data
  userData.value = { dateList: d.dateList.split(','), totalUserList: d.totalUserList.split(','), newUserList: d.newUserList.split(',') }
}

async function getOrderStatisticsData(begin: string, end: string) {
  const { data } = await getOrderStatistics({ begin, end })
  const d = data.data
  orderData.value = {
    data: { dateList: d.dateList.split(','), orderCountList: d.orderCountList.split(','), validOrderCountList: d.validOrderCountList.split(',') },
    totalOrderCount: d.totalOrderCount, validOrderCount: d.validOrderCount, orderCompletionRate: d.orderCompletionRate
  }
  overviewData.value = { totalOrderCount: d.totalOrderCount, validOrderCount: d.validOrderCount, orderCompletionRate: d.orderCompletionRate }
}

async function getTopData(begin: string, end: string) {
  const { data } = await getTop({ begin, end })
  const d = data.data
  top10Data.value = { nameList: d.nameList.split(',').reverse(), numberList: d.numberList.split(',').reverse() }
}
</script>
<style lang="scss" scoped>
.home { margin-top: -25px; margin-left: -25px; margin-right: -25px; padding: 24px; }
.homeMain { display: flex; margin: 22px 0; > div { flex: 1; &:first-child { margin-right: 20px; } } }
.homecon { margin-top: 0; }
</style>
