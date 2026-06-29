import request from '@/utils/request'

export const login = (data: any) =>
  request({ url: '/employee/login', method: 'post', data })

export const userLogout = (params: any) =>
  request({ url: '/employee/logout', method: 'post', params })

export const getEmployeeList = (params: any) =>
  request({ url: '/employee/page', method: 'get', params })

export const enableOrDisableEmployee = (params: any) =>
  request({ url: `/employee/status/${params.status}`, method: 'post', params: { id: params.id } })

export const addEmployee = (params: any) =>
  request({ url: '/employee', method: 'post', data: { ...params } })

export const editEmployee = (params: any) =>
  request({ url: '/employee', method: 'put', data: { ...params } })

export const queryEmployeeById = (id: string | (string | null)[]) =>
  request({ url: `/employee/${id}`, method: 'get' })
