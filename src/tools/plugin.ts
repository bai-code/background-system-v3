/**
 自定义节流时间间隔
 */
export const _throttle = (t: number = 500/*节流时间间隔*/) => {
  let timer: number | null = null
  return (callback?: () => void) => {
    if (timer) {
      return
    }
    timer = setTimeout(() => {
      callback && callback()
      timer = null
    }, t);
  }

}

// 默认 500 ms 时间间隔
export const throttle = _throttle(500)