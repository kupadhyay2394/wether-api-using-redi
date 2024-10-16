Weather Dashboard with Redis Caching
This project is a weather dashboard built using React for the frontend and Node.js with Express for the backend. It integrates with the OpenWeather API to fetch weather data and stores the results in Redis for faster subsequent responses. The app includes city-specific weather details like temperature, humidity, wind speed, and cloudiness.

Table of Contents
Features
Technologies
Installation
Environment Variables
API Routes
Usage
Redis Caching
Error Handling
Contributing
Features
Weather Search: Fetches real-time weather data for any city.
Data Caching: Uses Redis to cache weather data, reducing the need to call the API repeatedly.
City-Specific Data: Displays city temperature, humidity, wind speed, and other weather details.
Responsive UI: Built using React, making the app interactive and dynamic.
Error Handling: Handles cases when the city is not found or other errors occur while fetching data.
Technologies
Frontend:
React.js
Axios (for HTTP requests)
CSS (for styling)
Backend:
Node.js
Express.js
Redis (for caching)
Node-fetch (for making API requests)
External APIs:
OpenWeather API
Installation
Clone the repository:

bash
git clone https://github.com/your-username/weather-dashboard.git
cd weather-dashboard
Install frontend dependencies:

bash
cd frontend
npm install
Install backend dependencies:


cd ../backend
npm install


Start Redis: Ensure Redis is running locally or accessible from your backend. You can install Redis locally or use a Redis Cloud service.

Start the backend server:

bash
npm run dev
Start the frontend app:

bash
cd ../frontend
npm run dev


Open the application in your browser at http://localhost:3000.

Environment Variables
To run this project, you will need to add the following environment variables in the .env file in the backend folder:

swift
API=<YOUR_OPENWEATHER_API_KEY>
PORT=<PORT_NUMBER> # optional, default is 3000
REDIS_HOST=<REDIS_HOST> # optional, default is localhost
REDIS_PORT=<REDIS_PORT> # optional, default is 6379


API Routes
GET /api/v1/getWeather/:CITY

Description: Fetches weather information for the specified city.
Params:
:CITY (string): Name of the city.
Example Response:
json
{
  "coord": { "lon": -0.1257, "lat": 51.5085 },
  "weather": [
    {
      "id": 801,
      "main": "Clouds",
      "description": "few clouds",
      "icon": "02d"
    }
  ],
  "main": {
    "temp": 283.67,
    "feels_like": 282.63,
    "temp_min": 282.47,
    "temp_max": 284.69,
    "pressure": 1010,
    "humidity": 71
  },
  "wind": {
    "speed": 4.12,
    "deg": 340
  },
  "clouds": { "all": 20 },
  "sys": { "country": "GB" },
  "name": "London",
  "cod": 200
}
Usage
Enter a city name in the input field on the frontend and submit.
If the city is found, the weather data will be displayed including:
Temperature
Feels like temperature
Humidity
Wind speed
Cloudiness
If the data is available in Redis, it will be fetched from there. Otherwise, the backend will fetch it from the OpenWeather API and store it in Redis.
Redis Caching
The backend uses Redis to store weather data temporarily for faster access. This reduces the number of API calls to OpenWeather and speeds up response times.

Cache Expiry: Weather data is stored in Redis with a TTL (Time To Live) of 100 seconds. After this period, new data will be fetched from the OpenWeather API.
Example of setting data in Redis with an expiration:

javascript
await client.set(city, JSON.stringify(weatherData), {
    EX: 100 // 100 seconds expiration
});

Error Handling
If an error occurs (such as the city not being found), the app will display a friendly message like "City not found" to the user.

Common Error Scenarios:
City not found: If the entered city is not found by the OpenWeather API, a message will be displayed.
API errors: If the OpenWeather API returns an error or is unreachable, an error message will be displayed.
Contributing
Contributions are welcome! To contribute:

Fork the repository.
Create a new branch (git checkout -b feature/your-feature-name).
Make your changes.
Commit your changes (git commit -m 'Add some feature').
Push to the branch (git push origin feature/your-feature-name).
Open a pull request.
