export const checkProcessEnv = () => {
  return import.meta.env.VUE_APP_DELETE_PERMISSIONS === 'true'
}

export const debounce = (fn: Function, time = 200) => {
  let timer: ReturnType<typeof setTimeout> | null = null
  return function(this: any, ...args: any[]) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      timer = null
      fn.apply(this, args)
    }, time)
  }
}

export const throttle = (fn: Function, time = 1000) => {
  let timer: ReturnType<typeof setTimeout> | null = null
  return function(this: any, ...args: any[]) {
    if (timer) return
    timer = setTimeout(() => {
      timer = null
    }, time)
    fn.apply(this, args)
  }
}

export const strIncrease = (str: string) => {
  if (str.slice(0, 1) === '-') return true
}
