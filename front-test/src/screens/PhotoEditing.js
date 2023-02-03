import React from 'react';
import { View, Image, ScrollView, StyleSheet } from 'react-native';

const PhotoEditing = ({ route }) => {
  const { mainImage, otherImages } = route.params;

  return (
    <View style={styles.container}>
      <Image source={mainImage} style={styles.mainImage} />

      <ScrollView horizontal>
        {otherImages.map((image, index) => (
          <Image key={index} source={image} style={styles.otherImage} />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainImage: {
    width: '100%',
    height: 300,
  },
  otherImage: {
    width: 200,
    height: 200,
    marginRight: 20,
    borderWidth: 1,
    borderColor: '#D9DBF1',
  },
});

export default PhotoEditing;
