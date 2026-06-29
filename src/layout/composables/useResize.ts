import { onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore, DeviceType } from '@/stores/app'

const WIDTH = 992

export function useResize() {
  const route = useRoute()
  const appStore = useAppStore()

  const isMobile = () => {
    const rect = document.body.getBoundingClientRect()
    return rect.width - 1 < WIDTH
  }

  const resizeHandler = () => {
    if (!document.hidden) {
      const mobile = isMobile()
      appStore.toggleDevice(mobile ? DeviceType.Mobile : DeviceType.Desktop)
      if (mobile) {
        appStore.closeSidebar(true)
      }
    }
  }

  onMounted(() => {
    const mobile = isMobile()
    if (mobile) {
      appStore.toggleDevice(DeviceType.Mobile)
      appStore.closeSidebar(true)
    }
    window.addEventListener('resize', resizeHandler)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', resizeHandler)
  })

  watch(route, () => {
    if (appStore.device === DeviceType.Mobile && appStore.sidebar.opened) {
      appStore.closeSidebar(false)
    }
  })

  return {
    device: appStore.device,
    sidebar: appStore.sidebar
  }
}
