import request from '@/utils/request'

export const getDishPage = (params: any) =>
  request({ url: '/dish/page', method: 'get', params })

export const deleteDish = (ids: string) =>
  request({ url: '/dish', method: 'delete', params: { ids } })

export const editDish = (params: any) =>
  request({ url: '/dish', method: 'put', data: { ...params } })

export const addDish = (params: any) =>
  request({ url: '/dish', method: 'post', data: { ...params } })

export const queryDishById = (id: string | (string | null)[]) =>
  request({ url: `/dish/${id}`, method: 'get' })

export const getCategoryList = (params: any) =>
  request({ url: '/category/list', method: 'get', params })

export const queryDishList = (params: any) =>
  request({ url: '/dish/list', method: 'get', params })

export const commonDownload = (params: any) =>
  request({ url: '/common/download', method: 'get', params,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } })

export const dishStatusByStatus = (params: any) =>
  request({ url: `/dish/status/${params.status}`, method: 'post', params: { id: params.id } })

export const dishCategoryList = (params: any) =>
  request({ url: '/category/list', method: 'get', params: { ...params } })
