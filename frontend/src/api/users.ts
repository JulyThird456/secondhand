import request from '@/utils/request'

export const editPassword = (data: any) =>
  request({ url: '/employee/editPassword', method: 'put', data })

export const getStatus = () =>
  request({ url: '/shop/status', method: 'get' })

export const setStatus = (data: any) =>
  request({ url: '/shop/' + data, method: 'put', data })
