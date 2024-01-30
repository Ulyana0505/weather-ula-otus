export declare class Component<State = {}> {
    private el;
    state: State;
    events: {
        [key: string]: (ev: Event) => void;
    };
    constructor(el: HTMLElement, initialState?: Partial<State>);
    setState(patch: any): void;
    onMount(el: HTMLElement): void;
    render(): string;
}
// тупо скопировано