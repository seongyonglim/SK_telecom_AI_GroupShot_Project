import React, { useState } from 'react';
import {
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { RNS3 } from 'react-native-s3-upload';
import {LogBox} from 'react-native';

LogBox.ignoreLogs([
  "No native splash screen registered for given view controller. Call 'SplashScreen.show' for given view controller first.",
  "Possible Unhandled Promise Rejection",
])
 
const options = {
  keyPrefix: "uploads/",
  bucket: "sktcroppedimage",
  region: "ap-northeast-1",
  accessKey: "AKIAZT5SCY34VBXE3YEU",
  secretKey: "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",
  successActionStatus: 201
}

const numColumns = 3;

const AlbumPicker = () => {
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
      // 이미지만 선택 쌉가능
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      // 편집 기능 막음, 열고싶으면 아래 주석 풀면 됨
      // allowsEditing: true,
      // 다중 선택 허용
      allowsMultipleSelection: true,
      // 최대 선택 가능 개수 10개
      selectionLimit: 10,
      // 가로 비율 4:3
      aspect: [4, 3],
      // 이미지 품질 1
      quality: 1,
    });
    setIsLoading(false);
    
    if (!result.cancelled) {
      // 선택된 이미지들을 state에 저장
      setImages(result.uri ? [result.uri] : result.selected);
    }

    console.log(result)

    console.log(result.selected.length)
    
    for(let cnt=0; cnt<=result.selected.length; cnt++)
    {
      const file = {
        uri : result.selected[cnt].uri,
        name : result.selected[cnt].fileName,
        type : result.selected[cnt].type,
      };

      RNS3.put(file, options).then(result => {
        if (result.status !== 201)
          throw new Error("Failed to upload image to S3");
        console.log(result.body);
      })
    }

  };
 
  return (
    <View style = {{flex:1}}>
    <FlatList style = {{maxHeight:'90%'}}
      data={images}
      renderItem={({ item }) => (
        // 이미지를 화면의 절반 크기로 렌더링
        <Image
          source={{ uri: item.uri }}
          style={{ width: width / numColumns, height: 200, width: 200, margin:10 }}
          
        />
      )}
      numColumns={numColumns}
      keyExtractor={(item) => item.uri}
      // 이미지 선택버튼이 안눌려서 설정
      // 그냥 style 적용하면 에러뜨는데 이거 하니까 에러 안 뜸
      contentContainerStyle={styles.contentContainerStyle}
      // 로딩 중일 때는 로딩 상태를 보여주고, 아니면 이미지 선택 버튼을 보여줌
      ListHeaderComponent={
        isLoading ? (
          <View>
            <Text style={styles.loadingText}>로딩 중이에요...</Text>
            <ActivityIndicator size={'large'} />
          </View>
        ) : (
          <TouchableOpacity onPress={pickImages} style={styles.button}>
            <Image
              source={require('./assets/gallery.jpeg')}
              style={styles.image}
            />
          </TouchableOpacity>
        )
      }
    />
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainerStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 300,
    height: 300,
  },
});

export default AlbumPicker;