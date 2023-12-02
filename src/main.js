let cityName = "Moscow";

async function getWeather() {
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
};

getWeather();

const temperature = document.getElementById("temperature");
const weatherDescription = document.getElementById("weatherDescription");
const city = document.getElementById("city");
const weatherImage = document.getElementById("weatherImage");
const input = document.getElementById("input");
const button = document.getElementById("button");
const list = document.getElementById("list");

input.addEventListener("input", function () {

});

button.addEventListener("click", function () {
    cityName = input.value;
    input.value = "";
    getWeather();
    const li = document.createElement("li");
    li.innerHTML = cityName;
    list.append(li);
    console.log(list.length); //  пишет undef???
    if(list.length > 10) {
        list[0].remove();
    }
});