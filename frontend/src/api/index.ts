import request from '@/utils/request'

export const getOrderData = () =>
  request({ url: '/workspace/overviewOrders', method: 'get' })

export const getOverviewDishes = () =>
  request({ url: '/workspace/overviewDishes', method: 'get' })

export const getSetMealStatistics = () =>
  request({ url: '/workspace/overviewSetmeals', method: 'get' })

export const getBusinessData = () =>
  request({ url: '/workspace/businessData', method: 'get' })

export const getTurnoverStatistics = (params: any) =>
  request({ url: '/report/turnoverStatistics', method: 'get', params })

export const getUserStatistics = (params: any) =>
  request({ url: '/report/userStatistics', method: 'get', params })

export const getOrderStatistics = (params: any) =>
  request({ url: '/report/ordersStatistics', method: 'get', params })

export const getTop = (params: any) =>
  request({ url: '/report/top10', method: 'get', params })

export const getDataOverView = (params: any) =>
  request({ url: '/report/dataOverView', method: 'get', params })

export function exportInfor() {
  return request({ url: '/report/export', method: 'get', responseType: 'blob' as any })
}
