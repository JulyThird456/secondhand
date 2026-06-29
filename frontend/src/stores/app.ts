import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import { getSidebarStatus, setSidebarStatus } from '@/utils/cookies'

export enum DeviceType {
  Mobile,
  Desktop
}

export const useAppStore = defineStore('app', () => {
  const sidebar = reactive({
    opened: getSidebarStatus() !== 'closed',
    withoutAnimation: false
  })
  const device = ref<DeviceType>(DeviceType.Desktop)
  const statusNumber = ref(0)

  function toggleSidebar(withoutAnimation: boolean) {
    sidebar.opened = !sidebar.opened
    sidebar.withoutAnimation = withoutAnimation
    setSidebarStatus(sidebar.opened ? 'opened' : 'closed')
  }

  function closeSidebar(withoutAnimation: boolean) {
    sidebar.opened = false
    sidebar.withoutAnimation = withoutAnimation
    setSidebarStatus('closed')
  }

  function toggleDevice(val: DeviceType) {
    device.value = val
  }

  function setStatusNumber(val: number) {
    statusNumber.value = val
  }

  return {
    sidebar,
    device,
    statusNumber,
    toggleSidebar,
    closeSidebar,
    toggleDevice,
    setStatusNumber
  }
})
