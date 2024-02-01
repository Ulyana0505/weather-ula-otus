export const storageKey = 'cities'
export function saveList(list: string[]) {
    return localStorage.setItem(storageKey, JSON.stringify(list))
}

export function loadList(): string[] {
    const dataStr = localStorage.getItem(storageKey)
    if (dataStr) {
        return JSON.parse(dataStr)
    }
    return []
}
