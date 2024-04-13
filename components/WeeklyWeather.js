import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import * as Location from 'expo-location';
import { fetchWeeklyWeather } from '../WeatherAPI';

const WeeklyWeather = () => {
  const [weeklyForecast, setWeeklyForecast] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMessage('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const result = await fetchWeeklyWeather(location.coords.latitude, location.coords.longitude);
      if (result.success) {
        // Création d'un objet Map pour garantir l'unicité des entrées par jour
        const forecastMap = new Map();
        result.data.forEach(item => {
          const day = new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'long' });
          // Si le jour n'est pas encore dans la carte, l'ajouter
          if (!forecastMap.has(day)) {
            forecastMap.set(day, {
              temp: `${Math.round(item.main.temp)}°C`,
              icon: item.weather[0].icon
            });
          }
        });
        // Conversion de la carte en un tableau pour l'état
        const forecasts = Array.from(forecastMap, ([day, value]) => ({ day, ...value }));
        setWeeklyForecast(forecasts);
      } else {
        setErrorMessage(result.error);
      }
    })();
  }, []);

  return (
    <ScrollView style={styles.container}>
      {weeklyForecast.map((forecast, index) => (
        <View key={index} style={styles.weeklyItem}>
          <Text style={styles.day}>{forecast.day}</Text>
          <Text style={styles.temp}>{forecast.temp}</Text>
          <Image source={{ uri: `http://openweathermap.org/img/w/${forecast.icon}.png` }} style={styles.icon} />
        </View>
      ))}
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingVertical: 20
  },
  weeklyItem: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 10, 
    borderBottomWidth: 1, 
    borderBottomColor: '#DDD' 
  },
  day: {
    fontSize: 20, 
    fontWeight: 'bold'
  },
  temp: {
    fontSize: 18 
  },
  icon: {
    width: 50, 
    height: 50
  },
  error: {
    color: 'red',
    fontSize: 16, 
    textAlign: 'center',
    marginTop: 20
  }
});

export default WeeklyWeather;
