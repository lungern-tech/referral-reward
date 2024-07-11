export function format(date: Date, format: string) {
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  let hour = date.getHours()
  let minute = date.getMinutes()
  let second = date.getSeconds()

  const map = {
    year: /Y+/,
    month: /M+/,
    day: /D+/,
    hour: /h+/,
    minute: /m+/,
    second: /s+/,
  }

  const dateInfo = {
    year,
    month,
    day,
    hour,
    minute,
    second,
  }

  Object.keys(map).forEach((key) => {
    const reg = map[key]
    const value = `${dateInfo[key]}`
    format = format.replace(reg, value.padStart(2, '0'))
  })
  return format
}

export function firstOfDay(date: Date) {
  date.setHours(0)
  date.setMinutes(0)
  date.setSeconds(0)
  date.setMilliseconds(0)
  return date
}