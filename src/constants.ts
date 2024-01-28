export const idList = 'list'
export const citiesList: string[] = []

export const requestDomain = {
  openWeather: 'api.openweathermap.org',
  ipApi: 'ipapi.co',
}

export function callIfTrue(flag: boolean, call: () => void) {
  const _flag = Boolean(flag)
  return _flag ? call : () => {}
}
