import { start } from '../src/app'
import { storageKey } from '../src/storage'
import { mockFetchFail, mockFetchSucces } from './api.test'

afterEach(() => {
    document.body.innerHTML = ''
    localStorage.clear()
})

test('app start empty', async () => {
    expect(document.body.innerHTML).toEqual('')
    await start()
    expect(document.body.innerHTML).toContain('Прогноз погоды')
})

test('app start with city', async () => {
    const city = 'MOSCOW'
    localStorage.setItem(storageKey, JSON.stringify([city]))
    await start()
    expect(document.body.innerHTML).toContain(city)
})

test('app onAddCity', async () => {
    const city = 'MOSCOW'
    const app = await start()

    // ошибка при проверке города
    mockFetchFail()
    input().value = city
    button().click()
    expect(app.state.citiesList.length).toEqual(0)
    expect(app.state.cityName).toEqual('')

    const temp = 10
    mockFetchWeather(temp)

    // добавление города
    input().value = city
    button().click()
    await timer()
    expect(app.state.citiesList.length).toEqual(1)
    expect(app.state.cityName).toEqual(city)
    expect(app.state.temp).toEqual(temp)

    // добавление города из списка
    input().value = city
    button().click()
    await timer()
    expect(app.state.citiesList.length).toEqual(1)

    // добавление более 10 городов
    for (let i = 0; i < 12; i++) {
        input().value = city + i
        button().click()
        await timer()
    }
    await timer()
    expect(app.state.citiesList.length).toEqual(10)
})

test('app onInput', async () => {
    const city = 'MOSCOW'
    const app = await start()
    const temp = -11
    mockFetchWeather(temp)

    // нажат не Enter
    input().value = city
    app.onInput({} as Event)
    expect(app.state.citiesList.length).toEqual(0)

    app.onInput({ key: 'Enter' } as KeyboardEvent)
    await timer()
    expect(app.state.citiesList.length).toEqual(1)
    expect(app.state.temp).toEqual(temp)
})

test('app onListClick', async () => {
    const city = 'MOSCOW'
    localStorage.setItem(storageKey, JSON.stringify([city]))

    const temp = -9
    mockFetchWeather(temp)

    const app = await start()
    expect(app.state.temp).toEqual(0)

    // кликаем на списке городов, но мимо города
    listElem(city).parentElement?.click()
    await timer()
    expect(app.state.temp).toEqual(0)

    // теперь на город
    listElem(city).click()
    await timer()
    expect(app.state.temp).toEqual(temp)
})

function listElem(city: string) {
    return document.querySelector(`[data-city=${city}]`) as HTMLButtonElement
}

function button() {
    return document.getElementById('button') as HTMLButtonElement
}

function input() {
    return document.getElementById('input') as HTMLInputElement
}

function mockFetchWeather(temp = 10) {
    mockFetchSucces({
        weather: [{ description: 'description', icon: 'icon' }],
        main: { temp },
    })
}

function timer() {
    return new Promise((r) => setTimeout(r, 0))
}
