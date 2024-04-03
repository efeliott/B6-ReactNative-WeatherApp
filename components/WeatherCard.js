import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import * as Location from 'expo-location';

const WeatherCard = () => {
  const [city, setCity] = useState('');
  const [temperature, setTemperature] = useState(null);
  const [description, setDescription] = useState(null);
  const [icon, setIcon] = useState(null);
  const [hourlyForecast, setHourlyForecast] = useState([]);


  useEffect(() => {
    (async () => {
      // Demande de permission lors du lancement de l'app
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      // Recupération de la position et utilisation de la longitude et de la lattitude
      let location = await Location.getCurrentPositionAsync({});
      const latitude = location.coords.latitude;
      const longitude = location.coords.longitude;

      // Nom de la ville de la localisation
      const addresses = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (addresses.length > 0) {
        setCity(addresses[0].city);
      }

      // Envoie de la latitude et de la longitude 
      fetchWeatherData(latitude, longitude);
    })();
   }, []);

   const fetchWeatherData = async (lat, lon) => {
    const apiKey = '37f89087eef96126c43dea39aa61565d'; 
    const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&lang=fr&appid=${apiKey}`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
  
      setTemperature(Math.round(data.current.temp - 273.15));
      setIcon(data.current.weather[0].icon);
       // Fonction pour imposer la majuscule à la première lettre de la description
      const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
      };
      setDescription(capitalizeFirstLetter(data.current.weather[0].description));
  
      // Préparations pour les prévisions horaires
      const hourlyForecast = data.hourly.slice(0, 24 * 3).map((hour) => {
        return {
          time: hour.dt,
          temp: Math.round(hour.temp - 273.15),
          icon: hour.weather[0].icon,
        };
      });
  
      // Mettre à jour l'état avec les prévisions horaires
      setHourlyForecast(hourlyForecast);
    } catch (error) {
      console.error('Error fetching weather data', error);
    }
  };
  

  // URL de l'icône
  const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
  
  return (
    <View style={styles.container}>
      <View style={styles.currentWeather}>
        <Text style={styles.city}>{city}</Text>
        {temperature && <Text style={styles.temp}>{temperature}°C</Text>}
        <Image source={{ uri: iconUrl }} style={styles.weatherIcon} />
        <Text style={styles.desc}>{description}</Text>
      </View>
      <ScrollView horizontal={true} style={styles.scrollView}>
        {hourlyForecast.map((forecast, index) => (
          <View key={index} style={styles.forecastItem}>
            <Text style={styles.time}>{new Date(forecast.time * 1000).getHours()}:00</Text>
            <Image source={{ uri: `https://openweathermap.org/img/wn/${forecast.icon}@2x.png` }} style={styles.icon} />
            <Text style={styles.tempForecast}>{forecast.temp}°C</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    padding: 50,
  },
  currentWeather: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    marginTop: 50,
  },
  
  city: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  temp: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  weatherIcon: {
    width: 80,
    height: 80,
  },
  desc: {
    fontSize: 18,
  },
  scrollView: {
    flexDirection: 'row',
  },
  forecastItem: {
    alignItems: 'center',
    marginRight: 15,
  },
  time: {
    fontSize: 16,
  },
  icon: {
    width: 50,
    height: 50,
  },
  tempForecast: {
    fontSize: 16,
  },
});

export default WeatherCard;