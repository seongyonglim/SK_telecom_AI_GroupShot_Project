import { Provider } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Button,
  FlatList,
  Image,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function App() {
  // 선택된 이미지들을 관리하는 state
  const [images, setImages] = useState([]);
  // 이미지 로딩 상태를 관리하는 state
  const [isLoading, setIsLoading] = useState(false);
  // 화면 너비를 가져오는 hook
  const { width } = useWindowDimensions();

  // 이미지 선택 함수, 갤러리를 열어주기 위해 사용
  const pickImages = async () => {
    // 이미지 라이브러리 열기에는 허가 요청이 필요 없음
    setIsLoading(true);
    let result = await ImagePicker.launchImageLibraryAsync({
      // 이미지만 선택 가능
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      // 편집 허용 안함
      // allowsEditing: true,
      // 다중 선택 허용
      allowsMultipleSelection: true,
      // 최대 10개 선택 가능
      selectionLimit: 10,
      // 가로 비율 4:3
      aspect: [4, 3],
      // 이미지 품질 1
      quality: 1,
    });
    setIsLoading(false);
    console.log(result);
    if (!result.cancelled) {
      // 선택된 이미지들을 state에 저장
      setImages(result.uri ? [result.uri] : result.selected);
    }
  };

  return (
    <FlatList
      data={images}
      renderItem={({ item }) => (
        // 이미지를 화면의 절반 크기로 렌더링
        <Image
          source={{ uri: item.uri }}
          style={{ width: width / 2, height: 250 }}
        />
      )}
      numColumns={2}
      keyExtractor={(item) => item.uri}
      contentContainerStyle={{ marginVertical: 50, paddingBottom: 100 }}
      // 로딩 중일 때는 로딩 상태를 보여주고, 아니면 이미지 선택 버튼을 보여줌
      ListHeaderComponent={
        isLoading ? (
          <View>
            <Text
              style={{ fontSize: 20, fontWeight: "bold", textAlign: "center" }}
            >
              로딩 중...
            </Text>
            <ActivityIndicator size={"large"} />
          </View>
        ) : (
          <Button title="이미지 선택" onPress={pickImages} />
        )
      }
    />
  );
}
