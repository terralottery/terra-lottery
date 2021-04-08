import { useEffect, useState } from "react"

function getRemaining(end: Date) {
  const _second = 1000
  const _minute = _second * 60
  const _hour = _minute * 60
  const _day = _hour * 24
  const now = new Date()

  const endSeconds = end.getTime()
  const nowSeconds = now.getTime()
  const distance = endSeconds - nowSeconds
  const days = Math.floor(distance / _day)
  const hours = Math.floor((distance % _day) / _hour)
  const minutes = Math.floor((distance % _hour) / _minute)
  const seconds = Math.floor((distance % _minute) / _second)

  return { days: days, hours: hours, minutes: minutes, seconds: seconds }
}

export function getNextDraw(lottery: string) {
  let days = 7
  let weekday = 1

  switch (lottery) {
    case "14d":
      days = 14
      weekday = 2
      break
    case "21d":
      days = 21
      weekday = 3
  }

  const draw = new Date()
  draw.setUTCDate(
    draw.getUTCDate() + ((days - draw.getUTCDay()) % days) + weekday
  )

  return new Date(
    Date.UTC(draw.getFullYear(), draw.getMonth(), draw.getDate(), 0, 0, 0)
  )
}

export function Countdown(end: any) {
  const [remaining, setRemaining] = useState(getRemaining(end.end))
  const timer: any = setInterval(function () {
    setRemaining(getRemaining(end.end))
  }, 1000)

  const checkRemaining = () => {
    setRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 })
    clearInterval(timer)
  }

  useEffect(() => {
    checkRemaining()
    return () => {
      setRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 })
    }
  }, [])
  return (
    <>{`${remaining.days}d ${remaining.hours}h ${remaining.minutes}m ${remaining.seconds}s`}</>
  )
}
