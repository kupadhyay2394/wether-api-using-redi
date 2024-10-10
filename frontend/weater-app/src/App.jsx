import React, { useState } from "react"; 
import './App.css';
import axios from "axios";

function App() {
  const [city, setCity] = useState(""); 
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);

  const [loading, setLoading] = useState(false);

  const fetchWeatherData = async (cityName) => {
    setLoading(true);
    setError(null);
  
    try {
      // Use the cityName passed to the function
      const response = await axios.get(`http://localhost:8000/api/v1/getWether/${cityName}`)
      console.log("Response Data:", response.data); // Log the response data
      return setWeatherData(response.data);
    } catch (error) {
      // Log the error message to the console
      console.error('Error fetching weather data:', error);
      setError(error.response ? error.response.data.message : "City not found");
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchWeatherData(city); // Pass the city to fetchWeatherData
  };

  return (
    <div className="container">
      <h1>Weather App</h1>
      <form onSubmit={handleSubmit}>
        <input
          className="input-field"
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name"
          required
        />
        <br />
        <button className='submit-button' type="submit">Get Weather</button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      {weatherData && (
        <div>
          <h2>Weather in {weatherData.name}</h2>
          {weatherData.weather && weatherData.weather.length > 0 && (
            <>
              <p><strong>Condition:</strong> {weatherData.weather[0].main} ({weatherData.weather[0].description})</p>
              <p><strong>Temperature:</strong> {(weatherData.main.temp - 273.15).toFixed(2)}°C</p>
              <p><strong>Feels like:</strong> {(weatherData.main.feels_like - 273.15).toFixed(2)}°C</p>
              <p><strong>Humidity:</strong> {weatherData.main.humidity}%</p>
              <p><strong>Wind Speed:</strong> {weatherData.wind.speed} m/s</p>
              <p><strong>Clouds:</strong> {weatherData.clouds.all}%</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default App; 
