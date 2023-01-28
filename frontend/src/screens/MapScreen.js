import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LocationPostList from '../components/LocationPostList';
import LocationSearch from '../components/LocationSearch';

const MapScreen = () => {
  const { top } = useSafeAreaInsets();

  const [location, setLocation] = useState({
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={location.latitude && location.longitude ? location : null}
      >
        {location.latitude && location.longitude && (
          <Marker coordinate={location} title={location.name} />
        )}
      </MapView>

      <LocationSearch
        styles={{
          container: {
            ...styles.location,
            // paddingTop: top,
            top,
          },
        }}
        iconVisible={false}
        onPress={(data, detail) => {
          const {
            geometry: {
              location: { lat, lng },
            },
          } = detail;

          setLocation((prev) => ({
            ...prev,
            latitude: lat,
            longitude: lng,
            name: data.description,
          }));
        }}
      />

      {location.name && (
        <View style={styles.list}>
          <LocationPostList location={location.name} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  location: {
    position: 'absolute',
    width: '90%',
    borderBottomWidth: 0,
  },
  list: {
    position: 'absolute',
    width: '100%',
    paddingHorizontal: 10,
    bottom: 40,
  },
});

export default MapScreen;
