$(() => {
    "use strict";

// Base URL for forecast API
    const OPEN_WEATHER_URL = 'https://api.openweathermap.org/data/2.5/forecast';

// Simple way to create URL for request based on coordinates
    function getWeatherURL(lat, lon) {
        return `${OPEN_WEATHER_URL}?lat=${lat}&lon=${lon}&units=imperial&appid=${OPEN_WEATHER_APPID}`;
    }





// TODO: log various parts of the API

    function getWeatherInfo(lat, lon) {
        $.ajax(getWeatherURL(lat, lon)).done(data => {
            renderWeather(data)
            console.log(data);
            // TODO: log the city name
            console.log(data.city.name)
            // TODO: log the first three-hour forecast block
            console.log(data.list[0])
            // TODO: log the humidity for the first three-hour block
            console.log(data.list[0].main.humidity
            )
        }).fail(console.error);
    }



// Global
    const map = startMap();
    const marker = createMarker();
    const popup = createPopup();









//Functions

    function startMap() {
        mapboxgl.accessToken = MAPBOX_STEVE_TOKEN;

        const mapOptions = {
            container: 'map',
            style: 'mapbox://styles/mapbox/navigation-night-v1',
            zoom: 3,
            center: [-98.4916, 29.4252],
        }

        return new mapboxgl.Map(mapOptions);
    }



    function createMarker() {
        return new mapboxgl.Marker()
            .setLngLat([-98.4916, 29.4252])
            .addTo(map)

    }


    function createPopup() {
        return new mapboxgl.Popup()


    }


    function renderWeather(data) {
        $('div.weather-cards').empty();
        for (let i = 0; i < data.list.length; i += 8) {
            $('div.weather-cards').append(`
                <div class="card">
                <h5>Date: ${data.list[i].dt_txt}</h5>
                <p>Temp high: ${data.list[i].main.temp_min}/ Temp low: ${data.list[i].main.temp_max}</p>
                    <p>Description: ${data.list[i].weather[0].description}</p>
                    <p>Humidity: ${data.list[i].main.humidity}</p>
                    <p>Pressure: ${data.list[i].main.pressure}</p>
                    <p>Wind: ${data.list[i].wind.speed}</p>
                     <img src="http://openweathermap.org/img/w/${data.list[i].weather[0].icon}.png"
                </div>
            `)

        }
    }

    async function findAddress() {
        const coords = map.getCenter();
        let address = await reverseGeocode(coords, MAPBOX_STEVE_TOKEN)
        console.log(address);
        document.querySelector('#search-wrapper').value = `${address}`
    }



    $('#search-btn')
        .click(function () {
            const userInput = $('#search-input').val();
            geocode(userInput, MAPBOX_STEVE_TOKEN).then((data) => {
                console.log("user has searched. the coordinates are", data)
                const popup = new mapboxgl.Popup()
                marker
                    .setLngLat(data)
                    .setPopup(popup)
                    .addTo(map);
                popup.addTo(map);

                map.flyTo({
                    center: data,
                    zoom: 14,
                    speed: 2,
                    essential: true
                });
                getCurrentCity(data[0],data[1]);
                getWeatherInfo(data[1], data[0]);
            });

        })




    function getCurrentCity(lon, lat) {
        const url = getWeatherURL(lat, lon);
        $.get(url).done((data) => {
            const currentCity = data.city.name;
            $('#current-city').html(currentCity)
        });
    }


    $(document).keypress(function(event) {
        if (event.key === "Enter") {

        }
    });

// Events
// Set an event listener

    map.on('click', (e) => {
        console.log(`A click event has occurred at ${e.lngLat}`);
        const clickedLng = e.lngLat.lng;
        const clickedLat = e.lngLat.lat
        getWeatherInfo(e.lngLat.lat, e.lngLat.lng)
        marker.setLngLat([clickedLng, clickedLat])


    });





//Runs when program loads

// map.setZoom();
    getWeatherInfo(29.4252, -98.4916)
    marker.setPopup(popup);




})
