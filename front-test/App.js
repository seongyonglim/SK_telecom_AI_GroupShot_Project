import React, { useState, useEffect } from "react";
import { View, Image, Text } from "react-native";

const App = () => {
  const [imageData, setImageData] = useState({});

  useEffect(() => {
    fetch("./json_image/image_data.json")
      .then((response) => response.json())
      .then((data) => setImageData(data))
      .catch((error) => console.error(error));
  }, []);

  return (
    <View>
      {imageData.image ? (
        <Image
          source={{ uri: `data:image/png;base64,${imageData.image}` }}
          style={{ width: 200, height: 200 }}
        />
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
};

export default App;
