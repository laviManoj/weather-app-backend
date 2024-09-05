const axios = require('axios');
const dotenv = require('dotenv');


const OPENWEATHER_API_KEY = '40e61410714ace3f4877dc84e705b184'; 
const VISUALCROSSING_API_KEY = 'ZB7JANGMPMFQN2RBA5QPBNRDP';
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
const VISUALCROSSING_BASE_URL = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline';

async function fetchWeatherData(location) {
  try {
    const response = await axios.get(OPENWEATHER_BASE_URL, {
      params: {
        q: location,
        appid: OPENWEATHER_API_KEY,
        units: 'metric',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw new Error('Failed to fetch weather data');
  }
}

function formatDate(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = (`0${d.getMonth() + 1}`).slice(-2);
  const day = (`0${d.getDate()}`).slice(-2);
  return `${year}-${month}-${day}`;
}

async function fetchHistoricalWeatherData(location, fromDate, toDate) {
  try {
    const formattedFromDate = formatDate(fromDate);
    const formattedToDate = formatDate(toDate);

    const response = await axios.get(`${VISUALCROSSING_BASE_URL}/${location}/${formattedFromDate}/${formattedToDate}`, {
      params: {
        key: VISUALCROSSING_API_KEY,
        unitGroup: 'metric',
        include: 'days',
      },
    });

    const historicalData = response.data.days.map(day => ({
      temperature: day.temp,
      description: day.conditions,
      icon: day.icon, 
      date: day.datetime,
    }));

    return historicalData;
  } catch (error) {
    console.error('Error fetching historical weather data:', error);
    throw new Error('Failed to fetch historical weather data');
  }
}


module.exports = { fetchWeatherData, fetchHistoricalWeatherData };
