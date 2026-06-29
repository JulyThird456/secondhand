import request from '@/utils/request'

export const getOrderDetailPage = (params: any) =>
  request({ url: '/order/conditionSearch', method: 'get', params })

export const queryOrderDetailById = (params: any) =>
  request({ url: `/order/details/${params.orderId}`, method: 'get' })

export const deliveryOrder = (params: any) =>
  request({ url: `/order/delivery/${params.id}`, method: 'put' })

export const completeOrder = (params: any) =>
  request({ url: `/order/complete/${params.id}`, method: 'put' })

export const orderCancel = (params: any) =>
  request({ url: '/order/cancel', method: 'put', data: { ...params } })

export const orderAccept = (params: any) =>
  request({ url: '/order/confirm', method: 'put', data: { ...params } })

export const orderReject = (params: any) =>
  request({ url: '/order/rejection', method: 'put', data: { ...params } })

export const getOrderListBy = (params: any) =>
  request({ url: '/order/statistics', method: 'get' })
