import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import base64 from 'base-64';
import {LogBox} from 'react-native';

LogBox.ignoreLogs([
  "No native splash screen registered for given view controller. Call 'SplashScreen.show' for given view controller first.",
  "Possible Unhandled Promise Rejection",
])

function App() {
  const [image, setImage] = useState([]);

  const handlePress = async () => {
    try {
      const imgurl = "http://172.20.10.3:5000/deep"
      fetch(imgurl)
      .then(response => response.blob())
      .then(myBlob => {
      var urlCreator = window.URL || window.webkitURL;
      var imageUrl = urlCreator.createObjectURL(myBlob);
      const myImgElem = document.getElementById('my-img');
      myImgElem.src = imageUrl
      })

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePress}>
        <Text>누르면 파이썬 딥러닝이 동작합니다.</Text>
      </TouchableOpacity>
        {image && (
        <Image
        source={{url: 'http://172.20.10.3:5000/deep'}}
        style={styles.image}
        resizeMode="cover"
      />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 450,
    height: 450,
  },
});

export default App;