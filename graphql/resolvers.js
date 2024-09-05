const Weather = require('../models/Weather');
const { fetchWeatherData, fetchHistoricalWeatherData } = require('../utils/weatherApi');

const resolvers = {
  Query: {
    currentWeather: async (_, { location }) => {
      const weatherData = await fetchWeatherData(location);
      return {
        id: null,
        location,
        temperature: weatherData.main.temp,
        description: weatherData.weather[0].description,
        icon: weatherData.weather[0].icon,
        date: new Date().toISOString(),
      };
    },
    historicalWeather: async (_, { location, from, to }) => {
      const fromDate = new Date(from);
      const toDate = new Date(to);

      const daysDifference = (toDate - fromDate) / (1000 * 60 * 60 * 24);
      if (daysDifference > 30) {
        throw new Error('Date range cannot exceed 30 days');
      }
      if (daysDifference < 0) {
        throw new Error('From date must be before To date');
      }

      let weatherData = await Weather.find({
        location,
        date: { $gte: fromDate, $lte: toDate },
      }).sort({ date: 1 });

      if (weatherData.length === 0) {
        const historicalData = await fetchHistoricalWeatherData(location, fromDate, toDate);
        weatherData = await Promise.all(historicalData.map(async (data) => {
          const weather = new Weather({
            location,
            temperature: data.temperature,
            description: data.description,
            icon: data.icon,
            date: new Date(data.date),
          });
          await weather.save();
          return weather;
        }));
      }

      return weatherData;
    },
  },
  Mutation: {
    saveWeather: async (_, { location, temperature, description, icon }) => {
      const weather = new Weather({
        location,
        temperature,
        description,
        icon,
        date: new Date(),
      });
      await weather.save();
      return weather;
    },
  },
};

module.exports = resolvers;