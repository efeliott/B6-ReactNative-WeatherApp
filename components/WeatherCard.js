import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import * as Location from 'expo-location';

const WeatherCard = () => {
  const [city, setCity] = useState('');
  const [temperature, setTemperature] = useState(null);
  const [description, setDescription] = useState(null);
  const [icon, setIcon] = useState(null);

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
    const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=hourly,daily&lang=fr&appid=${apiKey}`;

  
    try {
      const response = await fetch(url);
      const data = await response.json();

      // Fonction pour imposer la majuscule à la première lettre de la description
      const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
      };

      // Température
      setTemperature(Math.round(data.current.temp - 273.15)); // Convertit de Kelvin en Celsius

      // Code de l'icon météo
      setIcon(data.current.weather[0].icon);
      
      // Description de la météo
      setDescription(capitalizeFirstLetter(data.current.weather[0].description));
    } catch (error) {
      setErrorMsg('Error fetching weather data');
    }
  };

  // URL de l'icône
  const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
  
  return (
    <View style={styles.card}>
      <Text style={styles.city}>{city}</Text>
      {temperature && <Text style={styles.temp}>{temperature}°C</Text>}
      <Image source={{ uri: iconUrl }} style={styles.weatherIcon} />
      <Text style={styles.desc}>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    minWidth: 300,
    minHeight: 200,
    marginTop: 60,
    padding: 20,
    borderRadius: 10,
    backgroundColor: 'lightblue',
    alignItems: 'center',
    justifyContent: 'center',
  },
  city: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  temp: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  weatherIcon: {
    width: 100,
    height: 100,
  },
  desc: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default WeatherCard;