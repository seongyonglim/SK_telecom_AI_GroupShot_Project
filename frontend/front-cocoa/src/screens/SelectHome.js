import { useNavigation, useRoute } from '@react-navigation/native';
import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  Pressable,
  Alert,
  Platform,
  Image,
  Button,
} from 'react-native';
import { GRAY, WHITE } from '../colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState, useCallback, useLayoutEffect } from 'react';
import { getLocalUri } from '../components/ImagePicker';
import ImageSwiper from '../components/ImageSwiper';
import PickerScreen from './PickerScreen';
import { RNS3 } from 'react-native-s3-upload';
import { LogBox } from 'react-native';

// 맨날 뜨는 빡치는 오류 무시
LogBox.ignoreLogs([
  "No native splash screen registered for given view controller. Call 'SplashScreen.show' for given view controller first.",
  'Possible Unhandled Promise Rejection',
]);

// S3 업로드 옵션 지정
const options = {
  keyPrefix: 'uploads/',
  bucket: 'sktcroppedimage',
  region: 'ap-northeast-1',
  accessKey: 'AKIAZT5SCY34VBXE3YEU',
  secretKey: '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',
  successActionStatus: 201,
};

const SelectHome = () => {
  const navigation = useNavigation();
  const { params } = useRoute();

  const width = useWindowDimensions().width;

  const [photos, setPhotos] = useState([]);
  const [disabled, setDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // 선택된 사진을 S3에 업로드 하는 함수
  const uploadToS3 = () => {
    for (let cnt = 0; cnt <= photos.length; cnt++) {
      if (photos[cnt] != null) {
        // 업로드할 파일 정보 생성
        const file = {
          uri: photos[cnt].uri,
          name: photos[cnt].filename,
          type: 'image/jpg',
        };

        RNS3.put(file, options).then((photos) => {
          if (photos.status !== 201)
            throw new Error('Failed to upload image to S3');
          console.log(photos.body);
          console.log(cnt + '번 사진 저장 갑니당');
        });
      }
    }
  };

  useEffect(() => {
    if (params) {
      setPhotos(params.selectedPhotos ?? []);
    }
  }, [params]);

  useEffect(() => {
    setDisabled(isLoading || !photos.length);
  }, [isLoading, photos.length]);

  const onSubmit = useCallback(async () => {
    if (!disabled) {
      setIsLoading(true);
      try {
        const localUris = await Promise.all(
          photos.map((photo) =>
            Platform.select({
              ios: getLocalUri(photo.id),
              android: photo.uri,
            })
          )
        );
        navigation.replace(PickerScreen.WRITE_TEXT, {
          photoUris: localUris,
        });
      } catch (e) {
        Alert.alert('사진 정보 조회 실패', e.message);
        setIsLoading(false);
      }
    }
  }, [disabled, photos, navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.selectContainer}>
        <Text style={styles.selectTitle}>
          {'편집하고 싶은 사진을\n앨범에서 선택해줘!'}
        </Text>
        <Image
          source={require('../../assets/selectadot.gif')}
          style={styles.selectAdot}
        />
      </View>
      <Text style={styles.description}>유사한 이미지들을 선택하세요.</Text>
      <View style={{ width, height: width }}>
        {photos.length ? (
          <View>
            <ImageSwiper photos={photos} />
            <Button title="return" onPress={uploadToS3}>
              title
            </Button>
          </View>
        ) : (
          <Pressable
            style={styles.photoButton}
            onPress={() => navigation.navigate(PickerScreen, { maxCount: 10 })}
          >
            <MaterialCommunityIcons
              name="image-plus"
              size={80}
              color={GRAY.DEFAULT}
            />
          </Pressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  selectContainer: {
    flexDirection: 'row',
  },
  description: {
    color: GRAY.DARK,
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  photoButton: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: GRAY.LIGHT,
  },
  selectTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'left',
    marginLeft: 20,
    textAlignVertical: 'center',
  },
  selectAdot: {
    width: 200,
    height: 250,
  },
});

export default SelectHome;
