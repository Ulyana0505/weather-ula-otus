import './style.css'
import { callIfTrue, citiesList, idList } from './constants'
import { loadList, saveList } from './storage'
import { getCity, getCityCoordinatesByName, getWeather } from './api'
import { WeatherParams } from './types'

callIfTrue(!window.jest, startAll)()

async function initApp() {
  const city = await getCity()
  if (city) {
    mapStatic(city.ll)
    getWeather(city.cityName).then(showWeather);
  }
}

function mapStatic(ll?: string | null) {
  if (!ll) return
  const map = document.getElementById('map') as HTMLImageElement
  map.src = `https://static-maps.yandex.ru/v1?ll=${ll}&spn=0.016457,0.00619&apikey=220bcecd-2e57-4af8-9150-e82755be7199`
}

function showWeather(data: WeatherParams | null) {
  console.log(data)
  if (!data) return
  const tempInF = `${data.temp}`
  const numtempInF = Number(tempInF)
  const tempInC = Math.round(numtempInF - 273.15)

  const temperature = document.getElementById('temperature') as HTMLElement
  temperature.innerText = `${tempInC}°C`

  const weatherDescription = document.getElementById(
    'weatherDescription'
  ) as HTMLElement
  weatherDescription.textContent = data.description

  const city = document.getElementById('city') as HTMLElement
  city.innerText = `${data.name}`

  const weatherImage = document.getElementById(
    'weatherImage'
  ) as HTMLImageElement
  weatherImage.src = `https://openweathermap.org/img/wn/${data.icon}@2x.png`
}

function inputKeyDown(e: KeyboardEvent) {
  callIfTrue(e.key === 'Enter', addCityInList)()
}

async function addCityInList() {
  const list = document.getElementById(idList) as HTMLElement
  const input = document.getElementById('input') as HTMLInputElement
  const cityName = input.value
  input.value = ''
  const weather = await getWeather(cityName)
  if (weather) {
    showWeather(weather)
    getCityCoordinatesByName(cityName).then(mapStatic)
    const li = document.createElement('li')
    li.setAttribute('data-city', cityName)
    li.innerHTML = cityName
    list.append(li)
    citiesList.push(cityName)
    console.log(citiesList)
    if (list.childElementCount > 10) {
      list.childNodes[0].remove()
      citiesList.shift()
    }
    saveList()
  }
}

async function cityFromListClick(e: Event) {
  const target = e.target as HTMLElement
  if (target.dataset && target.dataset.city) {
    const city = target.dataset.city
    getWeather(city).then(showWeather)
    getCityCoordinatesByName(city).then(mapStatic)
  }
}

function initCityList() {
  const list = document.getElementById(idList) as HTMLElement
  for (const cityName of citiesList) {
    const li = document.createElement('li')
    li.setAttribute('data-city', cityName)
    li.innerHTML = cityName
    list.append(li)
  }
}

export async function startAll() {
  loadList()
  await initApp()
  initCityList()
  const button = document.getElementById('button') as HTMLButtonElement
  button.addEventListener('click', addCityInList)
  const input = document.getElementById('input') as HTMLInputElement
  input.addEventListener('keydown', inputKeyDown)
  const idListHTML = document.getElementById(idList) as HTMLElement
  idListHTML.addEventListener('click', cityFromListClick)
}
