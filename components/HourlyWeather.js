import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import * as Location from 'expo-location';
import { fetchHourlyWeather } from '../WeatherAPI';

const HourlyWeather = () => {
  const [hourlyForecast, setHourlyForecast] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMessage('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const result = await fetchHourlyWeather(location.coords.latitude, location.coords.longitude);
      if (result.success) {
        const forecasts = result.data.list.slice(0, 24).map(item => ({
          hour: new Date(item.dt * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
          temp: `${Math.round(item.main.temp)}°C`,
          icon: item.weather[0].icon
        }));
        setHourlyForecast(forecasts);
      } else {
        setErrorMessage(result.error);
      }
    })();
  }, []);

  return (
    <ScrollView horizontal={true} style={styles.container}>
      {hourlyForecast.map((forecast, index) => (
        <View key={index} style={styles.hourlyItem}>
          <Text style={styles.hour}>{forecast.hour}</Text>
          <Text style={styles.temp}>{forecast.temp}</Text>
          <Image source={{ uri: `http://openweathermap.org/img/w/${forecast.icon}.png` }} style={styles.icon} />
        </View>
      ))}
      {errorMessage ? <Text>{errorMessage}</Text> : null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 10
  },
  hourlyItem: {
    marginHorizontal: 10,
    alignItems: 'center'
  },
  hour: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  temp: {
    fontSize: 14
  },
  icon: {
    width: 40,
    height: 40
  }
});

export default HourlyWeather;
