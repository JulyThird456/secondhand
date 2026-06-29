export const formatDate = () => {
  const now = new Date()
  let hour: string | number = now.getHours()
  let minute: string | number = now.getMinutes()
  let second: string | number = now.getSeconds()
  if (hour < 10) hour = `0${hour}`
  if (minute < 10) minute = `0${minute}`
  if (second < 10) second = `0${second}`
  return `${hour}:${minute}:${second}`
}

function dateFormat(fmt: string, time: any) {
  const date = new Date(time)
  let ret: RegExpExecArray | null
  const opt: Record<string, string> = {
    'Y+': date.getFullYear().toString(),
    'm+': (date.getMonth() + 1).toString(),
    'd+': date.getDate().toString()
  }
  for (const k in opt) {
    ret = new RegExp('(' + k + ')').exec(fmt)
    if (ret) {
      fmt = fmt.replace(ret[1], ret[1].length === 1 ? opt[k] : opt[k].padStart(ret[1].length, '0'))
    }
  }
  return fmt
}

export const get1stAndToday = () => {
  const today = new Date(new Date().toLocaleDateString()).getTime()
  const yesterdayStart = today - 3600 * 24 * 1000
  const yesterdayEnd = yesterdayStart + 24 * 60 * 60 * 1000 - 1
  return [dateFormat('YYYY-mm-dd', yesterdayStart), dateFormat('YYYY-mm-dd', yesterdayEnd)]
}

export const getday = () => {
  const today = new Date(new Date().toLocaleDateString()).getTime()
  const yesterday = dateFormat('YYYY.mm.dd', today - 3600 * 24 * 1000)
  const t = dateFormat('YYYY.mm.dd', today)
  return [yesterday, t]
}

export const past7Day = () => {
  const today = new Date(new Date().toLocaleDateString()).getTime()
  return [dateFormat('YYYY-mm-dd', today - 7 * 3600 * 24 * 1000), dateFormat('YYYY-mm-dd', today - 1)]
}

export const past30Day = () => {
  const today = new Date(new Date().toLocaleDateString()).getTime()
  return [dateFormat('YYYY-mm-dd', today - 30 * 3600 * 24 * 1000), dateFormat('YYYY-mm-dd', today - 1)]
}

export const pastWeek = () => {
  const today = new Date(new Date().toLocaleDateString()).getTime()
  const nowDayOfWeek = new Date().getDay()
  const weekStart = today - (nowDayOfWeek - 1) * 24 * 60 * 60 * 1000
  const weekEnd = today + (7 - nowDayOfWeek) * 24 * 60 * 60 * 1000
  return [dateFormat('YYYY-mm-dd', weekStart), dateFormat('YYYY-mm-dd', weekEnd)]
}

export const pastMonth = () => {
  const year = new Date().getFullYear()
  const month = new Date().getMonth()
  const monthStart = new Date(year, month, 1).getTime()
  const monthEnd = new Date(year, month + 1, 0).getTime() + 24 * 60 * 60 * 1000 - 1
  return [dateFormat('YYYY-mm-dd', monthStart), dateFormat('YYYY-mm-dd', monthEnd)]
}
