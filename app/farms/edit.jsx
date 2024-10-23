import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Button, Alert, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker, Polygon } from 'react-native-maps';
import * as Linking from 'expo-linking';

const FarmLandCapture = () => {
  const [location, setLocation] = useState(null);
  const [boundaryPoints, setBoundaryPoints] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [plotSize, setPlotSize] = useState(0);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      // Initial position capture
      let initialLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });
      setLocation(initialLocation);
    })();
  }, []);

  // Function to capture current location
  const captureBoundaryPoint = async () => {
    try {
      let loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });
      setBoundaryPoints([...boundaryPoints, { latitude: loc.coords.latitude, longitude: loc.coords.longitude }]);
    } catch (error) {
      Alert.alert('Error', 'Unable to get location. Try again.');
    }
  };

  // Function to calculate the area using the boundary points
  const calculateArea = () => {
    if (boundaryPoints.length < 3) {
      Alert.alert('Insufficient Data', 'At least 3 points are needed to calculate the plot size.');
      return;
    }

    // Use Shoelace formula to calculate polygon area
    let area = 0;
    const points = [...boundaryPoints, boundaryPoints[0]]; // Close the polygon

    for (let i = 0; i < points.length - 1; i++) {
      const { latitude: x1, longitude: y1 } = points[i];
      const { latitude: x2, longitude: y2 } = points[i + 1];
      area += x1 * y2 - x2 * y1;
    }

    setPlotSize(Math.abs(area / 2) * 111.32 * 111.32); // Convert degrees to square meters (approximation)
  };

  // Function to launch Google Maps for directions
  const launchGoogleMaps = () => {
    if (!location) {
      Alert.alert('Error', 'Current location not available.');
      return;
    }
    const { latitude, longitude } = location.coords;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Farm Land Boundary Capture</Text>
      <View style={styles.mapContainer}>
        {location && (
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            {/* Mark boundary points */}
            {boundaryPoints.map((point, index) => (
              <Marker key={index} coordinate={point} />
            ))}

            {/* Draw polygon if more than 2 points */}
            {boundaryPoints.length > 2 && (
              <Polygon coordinates={boundaryPoints} strokeColor="#FF0000" fillColor="rgba(255,0,0,0.3)" />
            )}
          </MapView>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Capture Boundary Point" onPress={captureBoundaryPoint} />
        <Button title="Calculate Plot Size" onPress={calculateArea} />
        <Button title="Navigate to Farm" onPress={launchGoogleMaps} />
      </View>

      {plotSize > 0 && (
        <Text style={styles.areaText}>Estimated Plot Size: {plotSize.toFixed(2)} square meters</Text>
      )}

      {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 20,
    marginTop: 20,
  },
  mapContainer: {
    width: '90%',
    height: '50%',
    marginVertical: 20,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
  },
  areaText: {
    marginTop: 20,
    fontSize: 16,
    color: 'green',
  },
  errorText: {
    color: 'red',
    marginTop: 20,
  },
});

export default FarmLandCapture;
