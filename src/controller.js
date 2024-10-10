import fetch from "node-fetch";
import { createClient } from 'redis';

async function Weather(city) {
    const client = createClient();
    
    client.on('error', (err) => console.log('Redis Client Error', err));
    await client.connect();

    const API = process.env.API; 
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
        // Try to retrieve the weather data from Redis for the specified city
        const redisData = await client.get(city);

        // If Redis returns null, the key does not exist
        if (redisData === null) {
            console.log(`No data in Redis for city: ${city}, fetching from API...`);
            const weatherData = await getData(); // Fetch data from the API
            if (weatherData) {
                // Store weather data in Redis as a stringified JSON
                await client.set(city, JSON.stringify(weatherData), {
                    EX: 100 // Set expiration time (in seconds)
                });
                console.log(`Weather data for ${city} stored in Redis.`);
                return weatherData; // Return the weather data
            }
        } else {
            // Parse the data from Redis and log it
            const parsedData = JSON.parse(redisData);
            console.log(`Weather data for ${city} retrieved from Redis:`, parsedData);

            return parsedData; // Return the parsed data from Redis
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
    const city = req.params.CITY; // Get the city from the request parameters
    try {
        const weatherData = await Weather(city); // Get the weather data
        return res.send(weatherData); // Send the weather data as the response
    } catch (error) {
        return res.status(500).send({ message: "An error occurred while fetching weather data.", error: error.message });
    }
}

export { getWeather };
