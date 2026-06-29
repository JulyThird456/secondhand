import request from '@/utils/request'

export const getSetmealPage = (params: any) =>
  request({ url: '/setmeal/page', method: 'get', params })

export const deleteSetmeal = (ids: string) =>
  request({ url: '/setmeal', method: 'delete', params: { ids } })

export const editSetmeal = (params: any) =>
  request({ url: '/setmeal', method: 'put', data: { ...params } })

export const addSetmeal = (params: any) =>
  request({ url: '/setmeal', method: 'post', data: { ...params } })

export const querySetmealById = (id: string | (string | null)[]) =>
  request({ url: `/setmeal/${id}`, method: 'get' })

export const setmealStatusByStatus = (params: any) =>
  request({ url: `/setmeal/status/${params.status}`, method: 'post', params: { id: params.ids } })

export const dishCategoryList = (params: any) =>
  request({ url: '/category/list', method: 'get', params: { ...params } })
