import { requestDomain } from './constants'
import { WeatherParams } from './types'

async function fetchData(path: string) {
  try {
    const result = await fetch(path)
    return result.json()
  } catch (e) {
    return null
  }
}

type CityResult = { city: string; longitude: string; latitude: string }

export async function getCity() {
  const data: CityResult | null = await fetchData(
    `https://${requestDomain.ipApi}/json/`
  )
  if (data) {
    const cityName = data.city
    const ll = data.longitude + ',' + data.latitude
    return { cityName, ll }
  }
  return null
}

export async function getCityCoordinatesByName(cityName?: string) {
  const link = `https://${requestDomain.openWeather}/data/2.5/weather?q=${cityName}&appid=6dac2d983c4b4bff9266414437d14d5e`
  const data = await fetchData(link)
  if (data && data.coord) {
    return data.coord.lon + ',' + data.coord.lat
  }
  return null
}

export async function getWeather(cityName?: string) {
  const link = `https://${requestDomain.openWeather}/data/2.5/weather?q=${cityName}&appid=6dac2d983c4b4bff9266414437d14d5e`
  const data = await fetchData(link)
  if (data && data.weather) {
    return {
      description: data.weather[0].description,
      temp: data.main.temp,
      icon: data.weather[0].icon,
      name: data.name,
    } as WeatherParams
  }
  return null
}
