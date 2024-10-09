import dotenv from "dotenv";
import { createClient } from 'redis';
import fetch from "node-fetch";

// Load environment variables from the .env file
dotenv.config({ path: './.env' });

async function main() {
    const client = createClient();
    await client.connect();

    client.on('error', (err) => console.log('Redis Client Error', err));

    let city = "London";
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
        }
    }

    try {
        // Try to retrieve the 'temp' field from Redis for key 'city'
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
            }
        } else {
            console.log(`Temperature for ${city} from Redis:`, redisData);
        }
    } catch (error) {
        // Handle any unexpected errors
        console.error('Redis operation failed:', error);
    } finally {
        // Always close the Redis connection after operations
        await client.quit();
    }
}

// Call the main function
main().then(() => {
    console.log('Operation completed.');
}).catch((err) => {
    console.error('Error in main:', err);
});
