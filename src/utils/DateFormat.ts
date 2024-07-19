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

export function formatCountdown(countdown: number) {
  const secondUnit = 1000
  const minuteUnit = secondUnit * 60;
  const hourUnit = minuteUnit * 60;
  const dayUnit = hourUnit * 24;

  const day = Math.floor(countdown / dayUnit)
  const hour = Math.floor((countdown % dayUnit) / hourUnit)
  const minute = Math.floor((countdown % hourUnit) / minuteUnit)
  const second = Math.floor((countdown % minuteUnit) / secondUnit)
  
  return {
    day,
    hour,
    minute,
    second, 
  }
}

export function simpleCountdown(countdown: number) {
  const { day, hour, minute, second } = formatCountdown(countdown)
  return `${String(day).padStart(2, '0')}Days ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`
}