import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SelectBestPhoto = ({ route }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const navigation = useNavigation();
  const selectedImages = route.params.selectedImages;

  const handleImageSelect = (index) => {
    setSelectedImage(index);
  };

  const confirmMainImage = () => {
    if (selectedImage !== null) {
      navigation.navigate('PhotoEditing', {
        mainImage: selectedImages[selectedImage],
      });
    }
  };

  return (
    <View>
      <ScrollView horizontal>
        {selectedImages.map((selectedImage, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleImageSelect(index)}
            style={{ opacity: selectedImage === index ? 0.5 : 1 }}
          >
            <Image
              source={selectedImage}
              style={{ width: 200, height: 200, marginRight: 10 }}
            />
            {selectedImage === index && (
              <View style={{ position: 'absolute', top: 10, right: 10 }}>
                <Image
                  source={require('../../assets/btn_check_on.webp')}
                  style={{ width: 50, height: 50 }}
                />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TouchableOpacity onPress={confirmMainImage} style={styles.button}>
        <Text>대표 사진 확정</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedImage: {
    width: 200,
    height: 200,
    marginRight: 10,
  },
  button: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    fontSize: 16,
  },
});

export default SelectBestPhoto;
