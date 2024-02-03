import { getCity, getCityCoordinatesByName, getWeather } from '../src/api'

export function mockFetchSucces(result: object) {
    window.fetch = () =>
        Promise.resolve({
            json: () => Promise.resolve(result),
        } as Response)
}

export function mockFetchFail() {
    window.fetch = () => Promise.reject()
}

test('test getCity', async () => {
    mockFetchSucces({ city: 'city', longitude: '1', latitude: '2' })
    expect(await getCity()).toEqual({ cityName: 'city', location: '1,2' })
    mockFetchFail()
    expect(await getCity()).toBe(null)
})

test('test getCityCoordinatesByName', async () => {
    mockFetchSucces({ coord: { lon: 'lon', lat: 'lat' } })
    expect(await getCityCoordinatesByName('')).toEqual({ location: 'lon,lat' })
    mockFetchFail()
    expect(await getCityCoordinatesByName('')).toBe(null)
})

test('test getWeather', async () => {
    mockFetchSucces({
        main: { temp: 0 },
        weather: [{ description: 'description', icon: 'icon' }],
    })
    expect(await getWeather('')).toEqual({
        description: 'description',
        icon: 'icon',
        temp: 0,
    })
    mockFetchFail()
    expect(await getWeather('')).toBe(null)
})
