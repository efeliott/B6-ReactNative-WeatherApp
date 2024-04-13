import * as Location from 'expo-location';

const API_KEY = '37f89087eef96126c43dea39aa61565d';

const fetchWeatherData = async (url) => {
    try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            return { error: 'Permission to access location was denied' };
        }

        let location = await Location.getCurrentPositionAsync({});
        const response = await fetch(`${url}?lat=${location.coords.latitude}&lon=${location.coords.longitude}&appid=${API_KEY}&lang=fr`);
        const result = await response.json();
        return result;
    } catch (error) {
        return { error: error.message };
    }
};

export const fetchHourlyWeather = async (lat, lon) => {
    const HOURLY_WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/forecast';
    try {
      const response = await fetch(`${HOURLY_WEATHER_API_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
      const data = await response.json();
      if (response.ok) {
        return { success: true, data };
      } else {
        throw new Error('Failed to fetch hourly weather data');
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
  


export const fetchWeeklyWeather = async (lat, lon) => {
    const WEEKLY_WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/forecast'; // Vérifiez l'URL pour les prévisions hebdomadaires
    try {
      const response = await fetch(`${WEEKLY_WEATHER_API_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
      const data = await response.json();
      if (response.ok) {
        // Retourner directement les données pour simplifier la gestion dans le composant
        return { success: true, data: data.list };
      } else {
        throw new Error('Failed to fetch weekly weather data');
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
  

export const fetchCurrentWeather = async () => {
    const result = await fetchWeatherData('https://api.openweathermap.org/data/2.5/weather');
    if (result.main) {
        result.main.temp = Math.round(result.main.temp - 273.15);
    }
    return result;
};

