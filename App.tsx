import { useState, useEffect, useRef } from 'react';
import { View } from 'react-native';
import { requestForegroundPermissionsAsync, getCurrentPositionAsync, LocationObject, watchPositionAsync, LocationAccuracy } from 'expo-location';
import MapView, { Marker } from 'react-native-maps';

import { styles } from './styles';

export default function App() {

  const [location, setLocation] = useState<LocationObject | null>(null);

  const mapRef = useRef<MapView>(null);

  const  requestLocationPermission = async () => {
    const { granted } = await requestForegroundPermissionsAsync();

    console.log(granted ? 'Permission granted' : 'Permission denied');

    if(granted) {
      const currentPosition = await getCurrentPositionAsync();
      setLocation(currentPosition);
      console.log('Current position: ', currentPosition);
    }
  }

  useEffect(() => {
    requestLocationPermission();
  }, []);

  useEffect(() => {
    watchPositionAsync({
      accuracy: LocationAccuracy.Highest,
      timeInterval: 1000,
      distanceInterval: 1
    }, (response) => {
      setLocation(response);
      mapRef.current?.animateCamera({
        pitch : 0,  // perspective
        center: response.coords
      })
    });
  }, []);
  

  return (
    <View style={styles.container}>
      {
        location &&
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          <Marker 
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
          />
        </MapView>
      }
    </View>
  );
}
