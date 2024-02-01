import './style.css'
import { Component } from './lib/component'
import { getCity, getCityCoordinatesByName, getWeather } from './api'
import { loadList, saveList } from './storage'

type State = {
    citiesList: { label: string }[]
    cityName: string
    location: string
    temp: number
    description: string
    icon: string
}

class AppComponent extends Component<State> {
    state = {
        citiesList: [] as { label: string }[],
        cityName: '',
        location: '',
        temp: 0,
        description: '',
        icon: '',
    } as State

    onMount() {
        this.setCityName(this.state.cityName)
    }

    async setCityName(cityName: string) {
        if (cityName) {
            const location = await getCityCoordinatesByName(cityName)
            const weather = await getWeather(cityName)
            this.setState({ cityName, ...location, ...weather })
        }
    }

    onListClick(e: Event) {
        const target = e.target as HTMLElement
        if (target.dataset && target.dataset.city) {
            this.setCityName(target.dataset.city)
        }
    }

    async onAddCity() {
        const input = this.el.querySelector('#input') as HTMLInputElement
        const cityName = input.value
        input.value = ''
        // console.log(cityName);
        if (!(await getWeather(cityName))) return
        // console.log("++");
        const { citiesList } = this.state
        if (!citiesList.find(({ label }) => label === cityName)) {
            citiesList.push({ label: cityName })
            if (citiesList.length > 10) {
                citiesList.shift()
            }
            saveList(citiesList.map(({ label }) => label))
        }
        this.setCityName(cityName)
    }

    onInput(e: Event) {
        const ek = e as KeyboardEvent
        if (ek.key === 'Enter') {
            this.onAddCity()
        }
    }

    events = {
        'click@#list': this.onListClick,
        'click@#button': this.onAddCity,
        'keydown@#input': this.onInput,
    }

    render() {
        const tempInF = `${this.state.temp}`
        const numTempInF = Number(tempInF)
        const tempInC = Math.round(numTempInF - 273.15)
        return `
      <h1>Прогноз погоды</h1>
      <h2>Погода в вашем городе</h2>
      <div id="parent">
        <div>
          <h3 id="city">${this.state.cityName}</h3>
          {{if location}}
            <img alt="Icon of weather" id="img-weather" src="https://openweathermap.org/img/wn/{{icon}}@2x.png" />
          {{end if}}
          <p>${tempInC}</p>
          <p>${this.state.description}</p>
        </div>
        <div>
          {{if location}}
            <img alt="Maps Static API" id="img-map" src="https://static-maps.yandex.ru/v1?ll={{location}}&spn=0.016457,0.00619&apikey=220bcecd-2e57-4af8-9150-e82755be7199" />
          {{end if}}
        </div>
      </div>
      <div>
        <input type="text" placeholder="Введите название города" id="input" />
        <button id="button">Нажмите</button>
      </div>
      <ol id="list">
      {{for citiesList as item}}
        <li data-city="{{item.label}}">{{item.label}}</li>
      {{end for}}
      </ol>
    `
    }
}

export async function start() {
    const div = document.createElement('div')
    const app = new AppComponent(div, {
        citiesList: loadList().map((label) => ({ label })),
        ...(await getCity()),
    })
    document.body.append(div)
    return app
}
