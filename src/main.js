const temperature = document.getElementById("temperature");
const weatherDescription = document.getElementById("weatherDescription");
const city = document.getElementById("city");
const weatherImage = document.getElementById("weatherImage");
const input = document.getElementById("input");
const button = document.getElementById("button");
const list = document.getElementById("list");
const map = document.getElementById("map");

const citiesList = [];

startAll();

async function initApp(){
    const ip = await getIP();
    const {cityName, ll} = await getCoordinates(ip);
    getWeather(cityName);
    mapStatic(ll);
}

async function getWeather(cityName) {
    const link = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=6dac2d983c4b4bff9266414437d14d5e`;
    const result = await fetch(link);
    const data = await result.json();
    console.log(data.weather[0].description, data.main.temp, data.weather[0].icon);

    const tempInF = `${data.main.temp}`;
    const numtempInF = Number(tempInF);
    const tempInC = Math.round(numtempInF - 273.15);

    temperature.innerText = `${tempInC}°C`;
    weatherDescription.textContent = data.weather[0].description;
    city.innerText = `${data.name}`;
    weatherImage.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
}

async function getIP() {
    const res = await fetch('https://ipapi.co/json/');
    const data = await res.json();
    let ip = data.ip;
    console.log(ip);
    return ip;
}

async function getCoordinates(ip) {
    const res = await fetch(`http://api.sypexgeo.net/json/${ip}`);
    const data = await res.json();
    console.log(data.city.lat, data.city.lon, data.city.name_ru);
    let cityName = data.city.name_ru;
    let ll = data.city.lon + "," + data.city.lat;
    console.log(ll);
    return {cityName, ll};
}

function mapStatic(ll) {
    map.src = `https://static-maps.yandex.ru/v1?ll=${ll}&spn=0.016457,0.00619&apikey=220bcecd-2e57-4af8-9150-e82755be7199`;
}

async function cityCoordinatesByName(cityName) {
    const link = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=6dac2d983c4b4bff9266414437d14d5e`;
    const result = await fetch(link);
    const data = await result.json();
    console.log(data.coord.lon, data.coord.lat, data.name);
    let ll = data.coord.lon + "," + data.coord.lat;
    return ll;
}

button?.addEventListener("click", addCityInList);

list?.addEventListener("click", cityFromListClick);

async function addCityInList(){
    const cityName = input.value;
    input.value = "";
    await getWeather(cityName);
    cityCoordinatesByName(cityName).then((ll)=>mapStatic(ll));
    const li = document.createElement("li");
    li.setAttribute("data-city", cityName);
    li.innerHTML = cityName;
    list.append(li);
    citiesList.push(cityName);
    console.log(citiesList);
    localStorage.setItem("cities", JSON.stringify(citiesList));
    if(list.childElementCount > 10) {
        list.childNodes[0].remove();
        citiesList.shift();
        localStorage.setItem("cities", JSON.stringify(citiesList));
    }

}

async function cityFromListClick(e){
    if(e.target.dataset && e.target.dataset.city){
        const city = e.target.dataset.city;
        await getWeather(city);
        cityCoordinatesByName(city).then((ll)=>mapStatic(ll));
    }
}

async function startAll() {
    if (localStorage.getItem("cities") === null) {
        initApp();
    } else {
        initApp();
        citiesFromStorage();
    }
}

async function citiesFromStorage() {
    const allCitiesFromStorage = JSON.parse(localStorage.getItem("cities"));
    console.log(allCitiesFromStorage);
    for(let i = 0; i < allCitiesFromStorage.length; i++) {
        const cityName = allCitiesFromStorage[i];
        const li = document.createElement("li");
        li.setAttribute("data-city", cityName);
        li.innerHTML = cityName;
        list.append(li);
        citiesList.push(cityName);
    }
}

module.exports = {initApp, getWeather, getIP, 
    getCoordinates, mapStatic, cityCoordinatesByName, 
    addCityInList, cityFromListClick, startAll, citiesFromStorage}; // или тут просто export??