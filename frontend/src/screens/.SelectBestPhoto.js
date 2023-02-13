import { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';

const SelectBestPhoto = ({ navigation, route }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const { selectedImages } = route.params;

  const confirmMainImage = () => {
    if (selectedImageIndex === null) {
      alert('Please select an image first.');
      return;
    }

    const mainImage = selectedImages[selectedImageIndex];
    const otherImages = selectedImages.filter(
      (_, i) => i !== selectedImageIndex
    );

    navigation.navigate('PhotoEditing', { mainImage, otherImages });
  };

  return (
    <View style={styles.container}>
      <ScrollView vertical>
        {selectedImages.map((selectedImage, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setSelectedImageIndex(index)}
            style={[
              styles.selectedImageContainer,
              selectedImageIndex === index &&
                styles.selectedImageContainerSelected,
            ]}
          >
            <Image source={selectedImage} style={styles.selectedImage} />
            {selectedImageIndex === index && (
              <View style={styles.checkBoxContainer}>
                <Image
                  source={require('../../assets/btn_check_on.webp')}
                  style={styles.checkBox}
                />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity onPress={confirmMainImage} style={styles.confirmButton}>
        <Text style={styles.confirmButtonText}>대표 사진 확정</Text>
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
  selectedImageContainer: {
    width: 350,
    height: 300,
    position: 'relative',
  },
  selectedImageContainerSelected: {
    opacity: 0.5,
  },
  selectedImage: {
    width: '100%',
    height: '100%',
    marginBottom: 30,
    borderWidth: 3,
    borderColor: '#D9DBF1',
  },
  checkBoxContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
  },
  checkBox: {
    position: 'absolute',
    top: 10,
    right: 10,
    opacity: 1.0,
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

export default SelectBestPhoto;
