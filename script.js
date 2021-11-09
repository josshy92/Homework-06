/*  Link JS to HTML
1 get access to input field
 b) get access to button (make button)
*/

/* To get current temperature
1. Make variable to save last city searched
2. Make function using Openweathermap API
    b. create variables to selected input field, api key, and url
3. Fetch data from URL
4. Access data and append to page
5. Create button for previously searched cities
6. Re render the cities that were looked up
*/
var inputField = document.querySelector("#city")
var button = document.querySelector("#getWeather")
var container = document.querySelector("#container")
var forecast = document.querySelector("#forecast")
var currentDate = moment().format('dddd, MMMM Do, YYYY')
console.log(currentDate)


var savedContainer = document.querySelector('.savedContainer')
getCurrentHistory()

function getCity() {
    var cityName = inputField.value
    fetchData(cityName)
    createHistory(cityName)
}

function getCurrentHistory() {
    var storage = JSON.parse(localStorage.getItem('savedCities'))
    if (storage === null) {
        storage = []
    }
    for (var i = 0; i < storage.length; i++) {
        var savedLi = document.createElement('button')
        savedLi.textContent = storage[i]
        savedLi.setAttribute('id', storage[i])
        savedContainer.prepend(savedLi)
        savedLi.addEventListener('click', function (event) {
            var clickedCity = event.target.id
            fetchData(clickedCity)
        })
    }
}

function createHistory(cityName) {
    var searchedCity = inputField.value
    savedContainer.textContent = ""
    if (searchedCity === "") {
        alert("You must type a city")
        getCurrentHistory()
        return
    }
    var storage = JSON.parse(localStorage.getItem('savedCities'))
    if (storage === null) {
        storage = []
    }
    storage.push(searchedCity)
    localStorage.setItem('savedCities', JSON.stringify(storage))
    for (var i = 0; i < storage.length; i++) {
        var savedLi = document.createElement('button')
        savedLi.textContent = storage[i]
        savedLi.setAttribute('id', cityName)
        savedContainer.prepend(savedLi)
    }

}

function fetchData(city) {
    var apiKey = "f30dc0b71f772a037a522282770190be"
    var requestUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + apiKey
    container.innerHTML = ""
    forecast.innerHTML = ""

    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (weatherData) {

            console.log(weatherData);
            var cityName = document.createElement("h2");
            var cityTemp = document.createElement("h2");
            var wind = document.createElement("h2");
            var humidity = document.createElement("h2");
            var iconValue = weatherData.weather[0].icon;
            var icon = "http://openweathermap.org/img/wn/" + iconValue + ".png"

            var lat = weatherData.coord.lat;
            var lon = weatherData.coord.lon;


            cityName.textContent = weatherData.name + " (" + currentDate + ")"
            container.append(cityName);

            cityTemp.textContent = "Temp: " + Math.round((weatherData.main.temp - 273.15) * 9 / 5 + 32) + "\xB0" + "F";
            container.append(cityTemp);

            wind.textContent = "Wind: " + weatherData.wind.speed + " Mph";
            container.append(wind);

            humidity.textContent = "Humidity: " + weatherData.main.humidity + "%"
            container.append(humidity)


            // Add different api website for UV

            var requestUv = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude={part}&appid=f30dc0b71f772a037a522282770190be";
            fetch(requestUv)
                .then(function (response) {
                    return response.json();
                })
                .then(function (uvData) {
                    console.log(uvData)
                    var uv = document.createElement("h2")
                    uv.textContent = "UV Index: " + uvData.current.uvi

                    if (uvData.current.uvi < 2) {
                        uv.classList.add("uvlow");
                    }

                    else if (uvData.current.uvi > 2 && uvData.current.uvi < 5) {
                        uv.classList.add("uvmoderate")
                    }

                    else if (uvData.current.uvi > 5 && uvData.current.uvi < 7) {
                        uv.classList.add("uvhigh")
                    }

                    else if (uvData.current.uvi > 7 && uvData.current.uvi < 10) {
                        uv.classList.add("uvhigh2")
                    }

                    else if (10 < uvData.current.uvi) {
                        uv.classList.add("uvextreme")
                    }
                    container.append(uv);


                    // Loop through the next five days of the week
                    for (var i = 1; i < 6; i++) {


                        var fiveDay = document.createElement("div")


                        var fiveDayDate = document.createElement('h4')
                        fiveDayDate.textContent = moment().add(i, 'days').format('dddd, MMMM Do')
                        fiveDay.append(fiveDayDate)

                        fiveDay.setAttribute("class", "card")
                        var fiveDaytemp = document.createElement("h5")
                        fiveDaytemp.textContent = "Temp: " + Math.round((uvData.daily[i].temp.day - 273.15) * 9 / 5 + 32) + "\xB0" + "F"
                        fiveDay.append(fiveDaytemp)
                        forecast.append(fiveDay)


                        var iconValue = uvData.daily[i].weather[0].icon;
                        var icon = "http://openweathermap.org/img/wn/" + iconValue + ".png"
                        var fiveDayIcon = document.createElement("IMG");
                        fiveDayIcon.setAttribute("src", icon);
                        fiveDayIcon.classList.add("resize")
                        fiveDay.append(fiveDayIcon);

                        var fiveDayWind = document.createElement("h5")
                        fiveDayWind.textContent = "Wind: " + uvData.daily[i].wind_speed + "MPH"
                        fiveDay.append(fiveDayWind)


                        var fiveDayHumidity = document.createElement("h5")
                        fiveDayHumidity.textContent = "Humidity: " + uvData.daily[i].humidity + "%"
                        fiveDay.append(fiveDayHumidity)


                        /* Optional UV Index for every day
                        var fiveDayUv = document.createElement("h5")
                        fiveDayUv.textContent = "UV: " + uvData.daily[i].uvi
                        fiveDay.append(fiveDayUv)
                        console.log(uvData.daily[i].uvi)
                        */
                    }


                    myFunction()
                    function myFunction() {
                        var x = document.createElement("IMG");
                        x.setAttribute("src", icon);
                        cityName.append(x);


                    }
                    renderBorder()
                    function renderBorder() {
                        container.classList.add("container")

                        inputField.value = ""
                    }


                })

        })

}


button.addEventListener("click", getCity)