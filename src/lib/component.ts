import { templater } from './templater'

export abstract class Component<State extends Record<string, unknown>> {
    private subscriptions = [] as [Element, string, (ev: Event) => void][]
    protected state = {} as State
    protected events = {} as Record<string, (ev: Event) => void>

    constructor(
        protected el: HTMLElement,
        initialState: Partial<State> = {}
    ) {
        Promise.resolve().then(() => {
            this.setState(initialState)
            this.onMount()
        })
    }

    onMount(): void {}

    abstract render(): string

    protected setState(patch: Partial<State>) {
        this.state = { ...this.state, ...patch }
        this.subscriptions.forEach(([target, eventName, callFn]) => {
            target.removeEventListener(eventName, callFn)
        })
        this.el.innerHTML = templater(this.render(), this.state)
        this.initEvents()
    }

    private initEvents() {
        this.subscriptions = []
        for (const [key, call] of Object.entries(this.events)) {
            const [eventName, query] = key.split('@')
            for (const target of [...this.el.querySelectorAll(query)]) {
                const callFn = (e: Event) => {
                    call.call(this, e)
                }
                target.addEventListener(eventName, callFn)
                this.subscriptions.push([target, eventName, callFn])
            }
        }
    }
}
