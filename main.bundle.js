(()=>{"use strict";const t="list",e=[],n={openWeather:"api.openweathermap.org",ipApi:"ipapi.co"};function c(t,e){return Boolean(t)?e:()=>{}}const a="cities";async function o(t){try{return(await fetch(t)).json()}catch(t){return null}}async function i(t){const e=`https://${n.openWeather}/data/2.5/weather?q=${t}&appid=6dac2d983c4b4bff9266414437d14d5e`,c=await o(e);return c&&c.coord?c.coord.lon+","+c.coord.lat:null}async function r(t){const e=`https://${n.openWeather}/data/2.5/weather?q=${t}&appid=6dac2d983c4b4bff9266414437d14d5e`,c=await o(e);return c&&c.weather?{description:c.weather[0].description,temp:c.main.temp,icon:c.weather[0].icon,name:c.name}:null}function d(t){t&&(document.getElementById("map").src=`https://static-maps.yandex.ru/v1?ll=${t}&spn=0.016457,0.00619&apikey=220bcecd-2e57-4af8-9150-e82755be7199`)}function s(t){if(!t)return;const e=`${t.temp}`,n=Number(e),c=Math.round(n-273.15);document.getElementById("temperature").innerText=`${c}°C`,document.getElementById("weatherDescription").textContent=t.description,document.getElementById("city").innerText=`${t.name}`,document.getElementById("weatherImage").src=`https://openweathermap.org/img/wn/${t.icon}@2x.png`}function u(t){c("Enter"===t.key,l)()}async function l(){const n=document.getElementById(t),c=document.getElementById("input"),o=c.value;c.value="";const u=await r(o);if(u){s(u),i(o).then(d);const t=document.createElement("li");t.setAttribute("data-city",o),t.innerHTML=o,n.append(t),e.push(o),console.log(e),n.childElementCount>10&&(n.childNodes[0].remove(),e.shift()),localStorage.setItem(a,JSON.stringify(e))}}async function m(t){if(t.target.dataset&&t.target.dataset.city){const e=t.target.dataset.city;r(e).then(s),i(e).then(d)}}c(!window.jest,(async function(){(function(){const t=localStorage.getItem(a);if(t)for(const n of JSON.parse(t))e.push(n)})(),await async function(){const t=await async function(){const t=await o(`https://${n.ipApi}/json/`);return t?{cityName:t.city,ll:t.longitude+","+t.latitude}:null}();t&&(d(t.ll),r(t.cityName).then(s))}(),function(){const n=document.getElementById(t);for(const t of e){const e=document.createElement("li");e.setAttribute("data-city",t),e.innerHTML=t,n.append(e)}}(),document.getElementById("button").addEventListener("click",l),document.getElementById("input").addEventListener("keydown",u),document.getElementById(t).addEventListener("click",m)}))()})();