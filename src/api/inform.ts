import request from '@/utils/request'

export const getInformData = (params: any) =>
  request({ url: '/messages/page', method: 'get', params })

export const getCountUnread = () =>
  request({ url: '/messages/countUnread', method: 'get' })

export const batchMsg = (data: any) =>
  request({ url: '/messages/batch', method: 'put', data })

export const setStatus = (params: any) =>
  request({ url: `/messages/${params}`, method: 'PUT' })
