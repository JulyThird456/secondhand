import request from '@/utils/request'

export const getDataes = (params: any) =>
  request({ url: `/report/amountCollect/${params.date}`, method: 'get' })

export const getChartsDataes = (params: any) =>
  request({ url: `/report/dayCollect/${params.start}/${params.end}`, method: 'get' })

export const getDayDataes = (params: any) =>
  request({ url: `/report/hourCollect/${params.type}/${params.date}`, method: 'get' })

export const getDayPayType = (params: any) =>
  request({ url: `/report/payTypeCollect/${params.date}`, method: 'get' })

export const getprivilege = (params: any) =>
  request({ url: `/report/privilegeCollect/${params.date}`, method: 'get' })

export const getSalesRanking = (params: any) =>
  request({ url: `/report/categoryCollect/${params.type}/${params.date}`, method: 'get' })

export const getDayRanking = (params: any) =>
  request({ url: `/report/currentDishRank/${params.date}`, method: 'get' })

export const getTimeQuantumDataes = (params: any) =>
  request({ url: `/report/dayAmountCollect/${params.type}/${params.start}/${params.end}`, method: 'get' })

export const getTimeQuantumReceivables = (params: any) =>
  request({ url: `/report/datePayTypeCollect/${params.start}/${params.end}`, method: 'get' })

export const getTimeQuantumType = (params: any) =>
  request({ url: `/report/dateCategoryCollect/${params.type}/${params.start}/${params.end}`, method: 'get' })

export const getTimeQuantumDishes = (params: any) =>
  request({ url: `/report/dishRankForDate/${params.start}/${params.end}`, method: 'get' })

export const getTimeQuantumDiscount = (params: any) =>
  request({ url: `/report/privilegeByDate/${params.start}/${params.end}`, method: 'get' })
