/**
 * Allows for adding a countdown to your page. Useful for event pages. To
 * create a countdown, dedicate an element setting `id=countdown` as well as
 * set the end of the coundown using the `data-countdown-date-ms` attribute.
 *
 * `data-countdown-date-ms` - This is the time of your event (end of countdown)
 * in milliseconds. Easiest way to get this is with the Date.getTime() function
 * (i.e. `new Date('Oct 27, 2021 8:30').getTime()`)
 *
 * @example
 * <p id="countdown" data-countdown-date-ms="1635348600000"></p>
 */

document.addEventListener('DOMContentLoaded', eventListener)

export function eventListener() {
  const countdownContainer = <HTMLElement>document.getElementById('countdown')

  if (countdownContainer) {
    const countdownDateMs = parseInt(
      countdownContainer.dataset.countdownDateMs || '0'
    )

    if (countdownDateMs === 0) return console.error('Invalid countdown date')

    const updateCounter = (): number => {
      const currentDateMs = new Date().getTime()
      const delta = Math.max(countdownDateMs - currentDateMs, 0)

      countdownContainer.innerHTML = formatCounter(delta)

      return delta
    }

    updateCounter()

    const countdownInterval = setInterval(() => {
      const delta = updateCounter()

      if (delta <= 0) {
        console.info('Countdown date has come or passed.')
        clearInterval(countdownInterval)
        return
      }
    }, 500)
  }
}

//  Calculate remaining days, hours, minutes, seconds until end of countdown
export function formatCounter(delta: number) {
  const days = formatTime(Math.floor(delta / (1000 * 60 * 60 * 24)))
  const hours = formatTime(
    Math.floor((delta % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  )
  const minutes = formatTime(
    Math.floor((delta % (1000 * 60 * 60)) / (1000 * 60))
  )
  const seconds = formatTime(Math.floor((delta % (1000 * 60)) / 1000))

  return `${days}d ${hours}h ${minutes}m ${seconds}s`
}

//  Format to two digits and mono font
function formatTime(num: number) {
  const formattedNum = num.toLocaleString('en-US', {
    minimumIntegerDigits: 2,
    useGrouping: false
  })
  return `<span class="text-mono">${formattedNum}</span>`
}
