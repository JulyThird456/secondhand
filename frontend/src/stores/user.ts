import { defineStore } from 'pinia'
import { ref } from 'vue'
import { login, userLogout } from '@/api/employee'
import { getToken, setToken, removeToken, getStoreId, setStoreId, getUserInfo, removeUserInfo } from '@/utils/cookies'
import Cookies from 'js-cookie'
import { ElMessage } from 'element-plus'

export const useUserStore = defineStore('user', () => {
  const token = ref(getToken() || '')
  const name = ref('')
  const avatar = ref('')
  const storeId = ref(getStoreId() || '')
  const introduction = ref('')
  const userInfo = ref<any>({})
  const roles = ref<string[]>([])
  const username = ref(Cookies.get('username') || '')

  function SET_TOKEN(val: string) { token.value = val }
  function SET_NAME(val: string) { name.value = val }
  function SET_USERINFO(val: any) { userInfo.value = { ...val } }
  function SET_AVATAR(val: string) { avatar.value = val }
  function SET_INTRODUCTION(val: string) { introduction.value = val }
  function SET_ROLES(val: string[]) { roles.value = val }
  function SET_STOREID(val: string) { storeId.value = val }
  function SET_USERNAME(val: string) { username.value = val }

  async function Login(userInfo: { username: string; password: string }) {
    let { username: uname, password } = userInfo
    uname = uname.trim()
    SET_USERNAME(uname)
    Cookies.set('username', uname)
    const { data } = await login({ username: uname, password })
    if (String(data.code) === '1') {
      SET_TOKEN(data.data.token)
      setToken(data.data.token)
      SET_USERINFO(data.data)
      Cookies.set('user_info', JSON.stringify(data.data))
      return data
    } else {
      ElMessage.error(data.msg)
      return data
    }
  }

  function ResetToken() {
    removeToken()
    SET_TOKEN('')
    SET_ROLES([])
  }

  async function changeStore(data: any) {
    SET_STOREID(data.data)
    SET_TOKEN(data.authorization)
    setStoreId(data.data)
    setToken(data.authorization)
  }

  async function GetUserInfo() {
    if (token.value === '') {
      throw Error('GetUserInfo: token is undefined!')
    }
    const data = JSON.parse(<string>getUserInfo())
    if (!data) {
      throw Error('Verification failed, please Login again.')
    }
    const { roles: r, name: n, avatar: a, introduction: i, applicant, storeManagerName } = data
    if (!r || r.length <= 0) {
      throw Error('GetUserInfo: roles must be a non-null array!')
    }
    SET_ROLES(r)
    SET_USERINFO(data)
    SET_NAME(n || applicant || storeManagerName)
    SET_AVATAR(a)
    SET_INTRODUCTION(i)
  }

  async function LogOut() {
    await userLogout({})
    removeToken()
    SET_TOKEN('')
    SET_ROLES([])
    Cookies.remove('username')
    Cookies.remove('user_info')
    removeUserInfo()
  }

  return {
    token, name, avatar, storeId, introduction, userInfo, roles, username,
    SET_TOKEN, SET_NAME, SET_USERINFO, SET_AVATAR, SET_INTRODUCTION, SET_ROLES, SET_STOREID, SET_USERNAME,
    Login, ResetToken, changeStore, GetUserInfo, LogOut
  }
})
