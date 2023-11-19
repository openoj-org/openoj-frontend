import { t } from 'i18next'

export function characterTranslate(type: number): string {
  if (type == 0) return t('root')
  else if (type == 1) return t('manager')
  else if (type == 2) return t('trustedUser')
  else if (type == 3) return t('commonUser')
  return t('bannedUser')
}

export function timeIntToString(time: number): string {
  const date = new Date(time)
  return t('timeFormat', {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    hour: date.getHours().toString().padStart(2, '0'),
    minute: date.getMinutes().toString().padStart(2, '0'),
    second: date.getSeconds().toString().padStart(2, '0')
  })
}

export function timeDeltaIntToString(time: number): string {
  const days = Math.floor(time / (1000 * 60 * 60 * 24))
  const hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor(((time % (1000 * 60 * 60 * 24)) % (1000 * 60 * 60)) / (1000 * 60))
  if (days > 0) {
    return days.toString() + t('remainDay')
  } else if (hours > 0) {
    return hours.toString() + t('remainHour')
  } else return minutes.toString() + t('remainMinute')
}

export function getScoreType(score: number) {
  if (score == 100) return 'success'
  else if (score >= 60) return 'warning'
  else return 'danger'
}
