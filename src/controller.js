import fetch from "node-fetch";
import { createClient } from 'redis';

async function Weather(city) {
    const client = createClient();
    
    // Handle Redis connection errors
    client.on('error', (err) => console.log('Redis Client Error', err));
    await client.connect();

    let API = process.env.API; 
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API}`;
    console.log('Constructed URL:', url);

    async function getData() {
        try {
            const response = await fetch(url); // Fetch data from the API
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`); // Handle non-200 responses
            }
            const data = await response.json(); // Parse the JSON response
            return data;
        } catch (error) {
            console.error('Fetch error:', error); // Handle errors
            throw error; // Re-throw to handle it later
        }
    }

    try {
        // Try to retrieve the 'temp' field from Redis for the key 'city'
        const redisData = await client.hGet(city, 'temp');

        // If Redis returns null, the key or field does not exist
        if (redisData === null) {
            console.log(`No data in Redis for city: ${city}, fetching from API...`);
            const weatherData = await getData(); // Fetch data from the API
            if (weatherData) {
                // Store weather data in Redis
                await client.hSet(city, {
                    temp: weatherData.main.temp.toString(),
                    feels_like: weatherData.main.feels_like.toString(),
                    humidity: weatherData.main.humidity.toString(),
                    description: weatherData.weather[0].description
                });
                console.log(`Weather data for ${city} stored in Redis.`);
                console.log('Temperature:', weatherData.main.temp);
                return weatherData; // Return the weather data
            }
        } else {
            console.log(`Temperature for ${city} from Redis:`, redisData);
            // Retrieve and return full data instead of just temp
            return {
                temp: redisData,
                // Add other Redis fields if necessary, or simply return as is
            };
        }
    } catch (error) {
        // Handle any unexpected errors
        console.error('Redis operation failed:', error);
        throw error; // Re-throw to handle it later
    } finally {
        // Always close the Redis connection after operations
        await client.quit();
    }
}

async function getWeather(req, res) {
    const city = req.params.CITY;
    try {
        const weatherData = await Weather(city); // Await the Weather function
        return res.send(weatherData); // Send the weather data as response
    } catch (error) {
        // Handle any errors that occurred in Weather function
        return res.status(500).send({ message: "An error occurred while fetching weather data.", error: error.message });
    }
}

export { getWeather };
