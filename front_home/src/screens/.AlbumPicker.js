import { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';

const AlbumPicker = () => {
  const [selectedImages, setSelectedImages] = useState([]);
  const navigation = useNavigation();

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled) {
        setSelectedImages((prevSelectedImages) => [
          ...prevSelectedImages,
          { uri: result.uri },
        ]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const confirmImages = () => {
    navigation.navigate('SelectBestPhoto', { selectedImages });
  };

  const resetImages = () => {
    setSelectedImages([]);
  };

  return (
    <View style={styles.container}>
      <ScrollView vertical>
        {selectedImages.length > 0 ? (
          selectedImages.map((selectedImage, index) => (
            <Image
              key={index}
              source={selectedImage}
              style={styles.selectedImage}
            />
          ))
        ) : (
          <Text>No images selected</Text>
        )}
      </ScrollView>

      <TouchableOpacity onPress={pickImage} style={styles.button}>
        <Image
          source={require('../../assets/gallery.jpeg')}
          style={styles.image}
        />
      </TouchableOpacity>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={confirmImages} style={styles.button}>
          <Text style={styles.buttonText}>확정</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={resetImages} style={styles.button}>
          <Text style={styles.buttonText}>사진 초기화</Text>
        </TouchableOpacity>
      </View>
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
    width: 350,
    height: 300,
    marginBottom: 20,
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
  },
  image: {
    width: 50,
    height: 50,
  },
  confirmButton: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  confirmButtonText: {
    fontSize: 16,
  },
});

export default AlbumPicker;
