import { startAll } from '../src/main'
import { requestDomain } from '../src/constants'
import { storageKey } from '../src/storage'

const city1 = 'city-1'
const resultWeather = { description: 'description', temp: 0 }
const ll1 = '1, 2'

function setFetchResult() {
  window.fetch = (path = '') =>
    Promise.resolve({
      json: () => {
        if ((path as string).startsWith('https://' + requestDomain.ipApi)) {
          return Promise.resolve({ city1, ll1 })
        }
        if (
          (path as string).startsWith('https://' + requestDomain.openWeather)
        ) {
          return Promise.resolve({
            weather: [{ description: resultWeather.description, icon: 'icon' }],
            main: { temp: resultWeather.temp },
            // ---
            name: '',
            coord: {
              lon: '',
              lat: '',
            },
          })
        }
        return ''
      },
    } as Response)
}

function initTemplate(initInput = '') {
  document.body.innerHTML =
    "<div id='temperature'></div>" +
    "<div id='weatherDescription'></div>" +
    '<div id=city></div>' +
    '<div id=weatherImage></div>' +
    '<ol id=list></ol>' +
    "<input id=input value='" +
    initInput +
    "'/>" +
    '<img  id=map>' +
    '<button id=button>Нажмите</button>'
}

setFetchResult()
initTemplate()

const button = document.getElementById('button') as HTMLButtonElement
const input = document.getElementById('input') as HTMLInputElement
const events: Record<string, (e: Event | KeyboardEvent) => void> = {
  keydown: () => {},
}
input.addEventListener = jest.fn((event: string, cb: (e: Event) => void) => {
  events[event] = cb
})

test('test startAll', async () => {
  localStorage.setItem(storageKey, JSON.stringify([city1]))
  const weatherDescription = document.getElementById(
    'weatherDescription'
  ) as HTMLElement
  expect(weatherDescription.innerHTML).toBe('')
  await startAll()
  localStorage.setItem(storageKey, JSON.stringify([city1]))
  expect(document.body.innerHTML).toContain(
    `<ol id="list"><li data-city="${city1}">${city1}</li></ol>`
  )
})

test('test addCityInList', async () => {
  for (let i = 0; i < 12; i++) {
    const city = 'city' + i
    input.value = city
    button.click()
    await wait(0)
    expect(document.body.innerHTML).toContain(
      `<li data-city="${city}">${city}</li>`
    )
  }
})

test('test cityFromListClick', async () => {
  const city = 'city10'
  const elem = document.querySelector(`[data-city="${city}"]`) as HTMLElement
  const impMap = document.getElementById('map') as HTMLImageElement
  impMap.removeAttribute('src')
  expect(impMap.src).toBe('')
  elem.click()
  await wait(0)
  expect(impMap.src).toContain('static-maps.yandex.ru/')
})

test('test KeyboardEvent', async () => {
  const city = 'city-keydown'
  input.value = city
  events.keydown({ key: 'Enter' } as KeyboardEvent)
  await wait(0)
  expect(document.body.innerHTML).toContain(
    `<li data-city="${city}">${city}</li>`
  )
  expect(input.value).toBe('')
})

async function wait(ms: number) {
  return new Promise((res) => setTimeout(res, ms))
}
