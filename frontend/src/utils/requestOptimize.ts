import md5 from 'md5'

const getRequestKey = (config: any) => {
  if (!config) {
    return md5(+new Date() + '')
  }
  const data = typeof config.data === 'string' ? config.data : JSON.stringify(config.data)
  return md5(config.url + '&' + config.method + '&' + data)
}

const pending: Record<string, boolean> = {}
const checkPending = (key: string) => !!pending[key]
const removePending = (key: string) => {
  delete pending[key]
}

export { getRequestKey, pending, checkPending, removePending }
