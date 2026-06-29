import Cookies from 'js-cookie'

const sidebarStatusKey = 'sidebar_status'
export const getSidebarStatus = () => Cookies.get(sidebarStatusKey)
export const setSidebarStatus = (sidebarStatus: string) => Cookies.set(sidebarStatusKey, sidebarStatus)

const storeIdKey = 'storeId'
export const getStoreId = () => Cookies.get(storeIdKey)
export const setStoreId = (id: string) => Cookies.set(storeIdKey, id)
export const removeStoreId = () => Cookies.remove(storeIdKey)

const tokenKey = 'token'
export const getToken = () => Cookies.get(tokenKey)
export const setToken = (token: string) => Cookies.set(tokenKey, token)
export const removeToken = () => Cookies.remove(tokenKey)

const userInfoKey = 'userInfo'
export const getUserInfo = () => Cookies.get(userInfoKey)
export const setUserInfo = (userInfo: Object) => Cookies.set(userInfoKey, userInfo)
export const removeUserInfo = () => Cookies.remove(userInfoKey)

const printKey = 'print'
export const getPrint = () => Cookies.get(printKey)
export const setPrint = (val: Object) => Cookies.set(printKey, val)
export const removePrint = () => Cookies.remove(printKey)

const newDataKey = 'new'
export const getNewData = () => Cookies.get(newDataKey)
export const setNewData = (val: Object) => Cookies.set(newDataKey, val)
