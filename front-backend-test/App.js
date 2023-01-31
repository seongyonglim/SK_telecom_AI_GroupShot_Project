import React, { useState, useEffect } from "react";
import { Image, View, Text, StyleSheet } from "react-native";

const App = () => {
  const [base64Image, setBase64Image] = useState(null);

  useEffect(() => {
    fetch("http://172.30.1.16:19000/user_img", {
      method: "GET",
    })
      .then((response) => response.text())
      .then((data) => {
        console.log("Base64 Image: ", data);
        setBase64Image(data);
      })
      .catch((error) => {
        console.log("Error: ", error);
      });
  }, []);

  return (
    <View style={styles.container}>
      {base64Image ? (
        <Image
          source={{ uri: `data:image/png;base64,${base64Image}` }}
          style={styles.image}
        />
      ) : (
        <View style={styles.placeholder}>
          <Text>No Image Preview</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  placeholder: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default App;
