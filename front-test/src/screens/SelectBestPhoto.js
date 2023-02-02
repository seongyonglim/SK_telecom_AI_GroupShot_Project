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

const SelectBestPhoto = ({ route }) => {
  const navigation = useNavigation();
  const [selectedImages, setSelectedImages] = useState(
    route.params.selectedImages
  );

  const confirmSelection = () => {
    // logic to confirm selection
    // ...
    // navigate back to previous screen
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal>
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
      <TouchableOpacity onPress={confirmSelection} style={styles.button}>
        <Text style={styles.buttonText}>대표 사진 확정</Text>
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
