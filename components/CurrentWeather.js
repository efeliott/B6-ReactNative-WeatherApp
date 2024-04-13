import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { fetchCurrentWeather } from '../WeatherAPI';

const CurrentWeather = () => {
    const [weatherData, setWeatherData] = useState({
        city: '',
        temperature: null,
        description: '',
        icon: null
    });
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const loadData = async () => {
            const result = await fetchCurrentWeather();
            if (result.error) {
                setErrorMessage(result.error);
            } else {
                setWeatherData({
                    city: result.name,
                    temperature: result.main.temp,
                    description: result.weather[0].description,
                    icon: result.weather[0].icon
                });
            }
        };

        loadData();
    }, []);

    return (
        <View style={styles.container}>
            {errorMessage ? (
                <Text>{errorMessage}</Text>
            ) : (
                <>
                    <Text style={styles.city}>{weatherData.city}</Text>
                    <Text style={styles.temp}>{weatherData.temperature ? `${weatherData.temperature}°C` : ''}</Text>
                    <Text style={styles.desc}>{weatherData.description}</Text>
                    {weatherData.icon && (
                        <Image
                            style={styles.weatherIcon}
                            source={{ uri: `http://openweathermap.org/img/w/${weatherData.icon}.png` }}
                        />
                    )}
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    city: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    temp: {
        fontSize: 16
    },
    desc: {
        fontSize: 14
    },
    weatherIcon: {
        width: 100,
        height: 100
    }
});

export default CurrentWeather;
