// API KEY
const apiKey = "03d80addf67b4f69569eeae03f49fda8";


const weatherIcon = document.querySelector('.weather-icon');
const tempValue = document.querySelector('.temperature-value p');
const desc = document.querySelector('.temperature-description p');
const locationElem = document.querySelector('.location p')
const countryElem = document.querySelector('.country p')
const setting = document.querySelector('#convert')
const notification = document.querySelector('.notification')
const dateOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
};
const dateNow = new Date(Date.now()).toLocaleString('en-US', dateOptions);
const timeNow = new Date(Date.now()).toLocaleTimeString();



const weather = {
    temperature: {
        unit: 'celsius',
    },
    date: {
        date: dateNow,
        time: timeNow,
    }
}


const Kelvin = 273;

if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(setPosition, showError);
} else {
    notification.style.display = "block";
    notification.innerHTML = "<p>Browser doesn't Support Geolocation</p>";
}

function setPosition(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    getWeather(latitude, longitude)
}



function showError(error) {
    notification.style.display = "block";
    notification.innerHTML = `<p>${error.message}</p>`;
}

const getWeather = (lat, long) => {
    let api = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}`;

    fetch(api)
        .then((response) => {
            let data = response.json();
            return data;
        })
        .then((data) => {
            weather.temperature.value = Math.floor(data.main.temp - Kelvin);
            weather.description = data.weather[0].description;
            weather.iconId = data.weather[0].icon;
            weather.city = data.name;
            weather.country = function() {
                if (data.sys.country === 'SO') {
                    return 'Somalia'
                } else {
                    return data.sys.country
                }
            };
        })
        .then(() => {
            displayWeather();
        })
}

// Display Weather into Dashboard
function displayWeather() {
    weatherIcon.innerHTML = `<img src="./image/icons/${weather.iconId}.png"/>`;
    // tempValue.innerHTML = `${weather.temperature.value}°<span>C</span>`;
    desc.innerHTML = weather.description;
    locationElem.innerHTML = `${weather.city}, `;
    countryElem.innerHTML = `${weather.country()}`
}

// Celcius to Fahrenheit
const celToFah = (temp) => {
    return (temp * 9 / 5) + 32;
}

tempValue.addEventListener('click', () => {
    convert()
})

setting.addEventListener('click', () => {
    convert()
})

function convert() {
    if (weather.temperature.value === undefined) return;
    if (weather.temperature.unit == 'celsius') {
        let fahrenheit = celToFah(weather.temperature.value);

        fahrenheit = Math.floor(fahrenheit);

        tempValue.innerHTML = `<span class='number'>${fahrenheit} </span><span>&deg;F</span>`;
        weather.temperature.unit = 'fahrenheit';
    } else {
        tempValue.innerHTML = `<span class='number'>${weather.temperature.value}</span><span>&deg;C</span>`;
        weather.temperature.unit = 'celsius'
    }
}