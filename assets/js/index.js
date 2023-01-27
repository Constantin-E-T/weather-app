// This is the main JavaScript file for the weather app
window.onload = function () {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const apiUrl = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=533db0fe660967a689d19e1ed590c056`;
      fetch(apiUrl)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          displayData(data);
          // call the function to display the forecast for the current city automatically
          console.log(data);
          displayForecast(data.name);
        })
        .catch(function (error) {
          console.log(error);
        });
    });
  }
  // Select the form element
  const form = document.querySelector("form");
  // Add a submit event listener to the form
  form.addEventListener("submit", function (event) {
    // Prevent the default form submit behavior
    event.preventDefault();
    // Get the city name from the input field
    const cityName = document.querySelector("#city_name").value;
    if (cityName === "" || cityName === null || cityName === undefined) {
      // Show an alert to the user
      const alert = document.createElement("div");
      alert.classList.add("alert", "alert-danger", "mt-3");
      alert.textContent = "Please enter a valid city name";
      form.appendChild(alert);
      setTimeout(function () {
        alert.style.display = "none";
      }, 3000);
      return;
    } else {
      // call the function to display the forecast for the current city automatically

      displayForecast(cityName);
    }

    // Add the city name to the storage
    addCityToHistory(cityName);
    // Create the API url with the city name
    const apiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=533db0fe660967a689d19e1ed590c056`;
    // Fetch the data from the API
    fetch(apiUrl)
      .then(function (response) {
        // Convert the response to JSON
        return response.json();
      })
      .then(function (data) {
        // Display the data on the page
        displayData(data);
        console.log(data);
      })
      .catch(function (error) {
        console.log(error);
        // Show an alert to the user
        const alert = document.querySelector(".alert");
        alert.textContent =
          "City Not Fund 404 (Not Found). Please enter a valid city name.";
        alert.classList.add("alert-danger");
        alert.style.display = "block";
        // Hide the alert after 5 seconds
        setTimeout(function () {
          alert.style.display = "none";
        }, 5000);
      });
  });

  function fetchWeatherData(city) {
    let apiCalls = 0;
    let lastCallTime = Date.now();

    if (apiCalls >= 60 && Date.now() - lastCallTime < 60000) {
      alert("Too many requests. Please wait and try again.");
      return;
    }

    // Create the API url with the city name
    const apiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=533db0fe660967a689d19e1ed590c056`;
    // Fetch the data from the API
    fetch(apiUrl)
      .then(function (response) {
        // Convert the response to JSON
        return response.json();
      })
      .then(function (data) {
        // Display the data on the page
        displayData(data);
      })
      .catch(function (error) {
        console.log(error);
      });

    apiCalls++;
    lastCallTime = Date.now();
  }

  // Function to add a city to the storage
  function addCityToHistory(city) {
    // Get the current city history from the storage
    let cityHistory = JSON.parse(localStorage.getItem("cityHistory")) || [];
    let index = cityHistory.indexOf(city);
    if (index != -1) {
      cityHistory.splice(index, 1);
    }
    // Add the new city to the beginning of the array
    cityHistory.unshift(city);

    // Keep only the last six cities
    cityHistory = cityHistory.slice(0, 6);
    // Update the history buttons
    updateHistoryButtons(cityHistory);
    localStorage.setItem("cityHistory", JSON.stringify(cityHistory));
  }
  // Function to update the history buttons
  function updateHistoryButtons(cityHistory) {
    // Get the history button element
    const historyButton = document.querySelector("#history");

    // Clear the current content of the history button
    historyButton.innerHTML = "";

    if (cityHistory.length > 6) {
      cityHistory = cityHistory.slice(0, 6);
    }

    // Add a button for each city in the history
    for (let i = 0; i < cityHistory.length; i++) {
      const city = cityHistory[i];
      const cityButton = document.createElement("button");
      cityButton.classList.add(
        "btn",
        "my-1",
        "btn-secondary",
        "input-block-level",
        "form-control"
      );
      cityButton.textContent = city;
      cityButton.addEventListener("click", function () {
        // Fetch the data for the clicked city
        fetchWeatherData(city);
      });
      historyButton.appendChild(cityButton);
    }
  }

  // Function to display the data on the page
  function displayData(data) {
    // Select the elements where you want to display the data
    const cityCloudDesc = document.querySelector(".city__cloud__desc");
    const cityName = document.querySelector(".city__name");
    const cityTemp = document.querySelector(".city__temp");
    const cityHumidity = document.querySelector(".city__humidity");
    const cityWind = document.querySelector(".city__wind");
    // Display the data
    cityName.textContent = data.name + " " + moment().format("Do MMMM, dddd");
    const icon = data.weather[0].icon;
    const img = `<img src="http://openweathermap.org/img/wn/${icon}@2x.png">`;
    cityCloudDesc.textContent = `Cloud Condition: ${data.weather[0].description}`;
    cityName.innerHTML += img;
    cityTemp.textContent = `Temp: ${Math.round(
      data.main.temp
    )} C H: ${Math.round(data.main.temp_max)} C L: ${Math.round(
      data.main.temp_min
    )} C`;
    cityHumidity.textContent = `Humidity: ${data.main.humidity} %`;
    cityWind.textContent = `Wind: ${data.wind.speed} m/s`;
  }
  // Function to display 5 days forecast
  function displayForecast(city) {
    // Create the API url with the city name
    const apiUrl = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=533db0fe660967a689d19e1ed590c056`;
    // Fetch the data from the API
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        // Get the 5-day forecast by filtering the data for only the 3-hour intervals
        var fiveDayForecast = data.list.filter(function (forecast) {
          return forecast.dt_txt.includes("12:00:00");
        });

        // Now you can loop through the 5-day forecast array and update the HTML template
        fiveDayForecast.forEach(function (forecast, index) {
          var forecastCard = document.querySelectorAll(".card")[index];
          // change the date order to be more readable
          var date = new Date(forecast.dt * 1000);
          forecastCard.querySelector(".card-title").textContent =
            moment(date).format("dddd, MMMM Do");
          forecastCard.querySelector(
            ".city__temp__forecast"
          ).textContent = `Temp: ${Math.round(forecast.main.temp)} C`;
          forecastCard.querySelector(
            ".city__humidity__forecast"
          ).textContent = `Humidity: ${forecast.main.humidity} %`;
          forecastCard.querySelector(
            ".city__wind__forecast"
          ).textContent = `Wind: ${forecast.wind.speed} m/s`;
          forecastCard.querySelector(
            "img"
          ).src = `http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`;
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }
};
