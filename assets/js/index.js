const timeTitle = document.querySelector('#time__title');
timeTitle.textContent = moment().format('LLL');


window.onload = function() {
    // Select the form element
    // const form = document.querySelector('form');
  
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const apiUrl = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=533db0fe660967a689d19e1ed590c056`;
            fetch(apiUrl)
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                displayData(data);
            })
            .catch(function(error) {
                console.log(error);
            });
        });
    }
    // Select the form element
    const form = document.querySelector('form');
    // Add a submit event listener to the form
    form.addEventListener('submit', function(event) {
        // Prevent the default form submit behavior
        event.preventDefault();
        // Get the city name from the input field
        const cityName = document.querySelector('#city_name').value;
        if (!cityName || cityName.trim() === '' || cityName.trim().length < 3 || cityName.trim().length > 20 || !cityName.match(/^[a-zA-Z]+$/)) {
            // Show an alert to the user
            const alert = document.createElement('div');
            alert.classList.add('alert', 'alert-danger', 'mt-3');
            alert.textContent = 'Please enter a valid city name';
            form.appendChild(alert);
            setTimeout(function() {
                alert.style.display = 'none';
              }, 3000);
            return;
        } else {

        }


        // Add the city name to the storage
        addCityToHistory(cityName);
        // Create the API url with the city name
        const apiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=533db0fe660967a689d19e1ed590c056`;
        // Fetch the data from the API
        fetch(apiUrl)
        .then(function(response) {
            // Convert the response to JSON
            return response.json();
        })
        .then(function(data) {
            // Display the data on the page
            displayData(data);
            console.log(data);
        })
        .catch(function(error) {
            console.log(error);
            // Show an alert to the user
            const alert = document.querySelector('.alert');
            alert.textContent = 'Please enter a valid city name.';
            alert.classList.add('alert-danger');
            alert.style.display = 'block';
            // Hide the alert after 3 seconds
            setTimeout(function() {
            alert.style.display = 'none';
            }, 3000);
        });
    });
    function fetchWeatherData(city) {
            // Create the API url with the city name
            const apiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=533db0fe660967a689d19e1ed590c056`;
            // Fetch the data from the API
            fetch(apiUrl)
            .then(function(response) {
                // Convert the response to JSON
                return response.json();
            })
            .then(function(data) {
                // Display the data on the page
                displayData(data);
            })
            .catch(function(error) {
                console.log(error);
            });
        }
    // Function to add a city to the storage
    function addCityToHistory(city) {
        // Get the current city history from the storage
        let cityHistory = JSON.parse(localStorage.getItem('cityHistory')) || [];
        // Add the new city to the beginning of the array
        cityHistory.unshift(city);

        // Keep only the last six cities
        cityHistory = cityHistory.slice(0, 6);

        // Save the updated city history to the storage
        localStorage.setItem('cityHistory', JSON.stringify(cityHistory));

        // Update the history buttons
        updateHistoryButtons(cityHistory);
    }

   
      

    // Function to update the history buttons
    // Function to update the history buttons
    function updateHistoryButtons(cityHistory) {
        // Get the history button element
        const historyButton = document.querySelector('#history');
    
        // Clear the current content of the history button
        historyButton.innerHTML = '';

        if (cityHistory.length > 6) {
            cityHistory = cityHistory.slice(0, 6);
          }
          
    
        // Add a button for each city in the history
        for (let i = 0; i < cityHistory.length; i++) {
        const city = cityHistory[i];
        const cityButton = document.createElement('button');
        cityButton.classList.add('btn', 'my-1','btn-secondary', 'input-block-level', 'form-control');
        cityButton.textContent = city;
        cityButton.addEventListener('click', function() {
            // Fetch the data for the clicked city
            fetchWeatherData(city);
        });
        historyButton.appendChild(cityButton);
        }
    }
    
    // Function to display the data on the page
    function displayData(data) {
      // Select the elements where you want to display the data
      const cityName = document.querySelector('.city__name');
      const cityTemp = document.querySelector('.city__temp');
      const cityHumidity = document.querySelector('.city__humidity');
      const cityWind = document.querySelector('.city__wind');
      
      
      // Update the elements with the data from the AP
      
      /* Setting the text content of the city name to the data.name. */
      //   cityName.textContent = data.name;  
      cityName.textContent = data.name + " " + moment().format('DD/MM/YYYY');
      const icon = data.weather[0].icon;
      const img = `<img src="http://openweathermap.org/img/wn/${icon}@2x.png">`;
      cityName.innerHTML += img;
      cityTemp.textContent = `  
        Temp: ${data.main.temp} C`;
      cityHumidity.textContent = `
        Humidity: ${data.main.humidity}%`;
      cityWind.textContent = `
        Wind: ${data.wind.speed} m/s`;
    }
  }
  