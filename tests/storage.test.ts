import { loadList, saveList, storageKey } from '../src/storage'

test('test saveList', async () => {
    saveList(['1'])
    expect(localStorage.getItem(storageKey)).toBe(`["1"]`)
    localStorage.clear()
})

test('test loadList', async () => {
    expect(loadList().length).toEqual(0)
    saveList(['1'])
    expect(loadList().length).toEqual(1)
})
