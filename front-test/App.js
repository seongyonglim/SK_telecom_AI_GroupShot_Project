import React, { useState } from "react";
import { View, Button, Image, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";

function MyComponent() {
  // 이미지를 저장할 state 변수 선언
  const [images, setImages] = useState([]);

  // 이미지 선택 함수
  const selectImages = async () => {
    // 이미지 피커를 열고 선택된 이미지를 result 변수에 저장
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      // 다중 선택 허용
      allowsMultipleSelection: true,
    });
    // 선택이 취소되지 않았다면
    if (!result.canceled) {
      // state 변수에 선택된 이미지 저장
      setImages(result.assets);
    }
  };

  return (
    <View style={styles.container}>
      <Button
        title="Select Images"
        onPress={selectImages}
        style={styles.button}
      />
      {images.map((image, index) => (
        <Image key={index} source={{ uri: image.uri }} style={styles.image} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    marginTop: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 20,
  },
});

export default MyComponent;
