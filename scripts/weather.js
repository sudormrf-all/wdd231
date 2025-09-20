// select HTML elements in the document
const currentTemp = document.querySelector('#current-temp');
const weatherIcon = document.querySelector('#weather-icon');
const captionDesc = document.querySelector('figcaption');

// Porto coordinates (rounded to 2 decimals)
const lat = 41.15;   // Porto latitude
const lon = -8.61;   // Porto longitude

// choose units: 'metric' for °C, 'imperial' for °F
const units = 'metric';

// IMPORTANT: replace with personal API key
const apiKey = '2d593f141e8c2984f1badf3947478857';

// Current Weather API endpoint with query string
// https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&units={units}&appid={API key}
const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;

async function apiFetch() {
    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            console.log(data); // testing only
            displayResults(data);
        } else {
            throw Error(await response.text());
        }
    } catch (error) {
        console.error(error);
    }
}

function displayResults(data) {
    // temperature
    const temp = Math.round(data.main.temp);
    const unitLabel = units === 'imperial' ? 'F' : 'C';
    currentTemp.innerHTML = `${temp}&deg;${unitLabel}`;

    // icon and description
    const iconCode = data.weather[0].icon;
    const desc = data.weather[0].description;

    // Use official OWM icon CDN with @2x sizing
    const iconsrc = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    weatherIcon.setAttribute('src', iconsrc);
    weatherIcon.setAttribute('alt', desc);

    // caption
    captionDesc.textContent = desc;
}

// invoke
apiFetch();
