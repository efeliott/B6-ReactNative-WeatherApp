import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, StatusBar } from 'react-native';
import CurrentWeather from './components/CurrentWeather';
import HourlyWeather from './components/HourlyWeather';
import WeeklyWeather from './components/WeeklyWeather';
import * as Location from 'expo-location';

export default function App() {
  const [currentWeather, setCurrentWeather] = useState(null);

  useEffect(() => {
    const fetchCurrentWeather = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      const weather = await getCurrentWeather(location.coords); 
      setCurrentWeather(weather);
    };

    fetchCurrentWeather();
  }, []);

  const getBackgroundColor = (weather) => {
    if (!weather) return '#fff'; 
    const mapping = {
      Clear: '#FFD700', 
      Clouds: '#C0C0C0', 
      Rain: '#87CEEB',  
    };
    return mapping[weather] || '#fff';
  };

  return (
    <View style={[styles.container, { backgroundColor: getBackgroundColor(currentWeather) }]}>
      <StatusBar barStyle="dark-content" />
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        <CurrentWeather />
        <HourlyWeather />
        <WeeklyWeather />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    alignItems: 'center',
  },
});
