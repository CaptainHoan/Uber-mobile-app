const useTravelTime = (second: string) => {

    const time = Number(second)
    const hour = Math.floor(time / 3600)
    const minute = Math.floor(time % 3600 / 60);
    const hourDisplay = hour > 0 ? hour + (hour == 1 ? ' hour ' : ' hours ') : ""
    const minuteDisplay = minute > 0 ? minute + (minute == 1 ? ' minute' : ' minutes ') : ""

  return hourDisplay + minuteDisplay

}

export default useTravelTime