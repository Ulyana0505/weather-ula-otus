import { Component } from '../src/lib/component'

type Test1State = { value: number }
class Test1 extends Component<Test1State> {
    state = { value: -1 }

    increaseCounter() {
        this.setState({
            value: this.state.value + 1,
        })
    }

    events = {
        'click@button': this.increaseCounter,
    }
    render(): string {
        return `<button>${this.state.value}</button>`
    }
}

test('Component', async () => {
    const div = document.createElement('div')
    const t1 = new Test1(div, { value: 0 })
    await Promise.resolve()
    expect(t1.state.value).toEqual(0)
    ;(div.querySelector('button') as HTMLButtonElement).click()
    expect(t1.state.value).toEqual(1)

    const t2 = new Test1(div)
    expect(t2.state.value).toEqual(-1)
})
