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
  TouchableOpacity,
} from 'react-native';
import { GRAY, WHITE } from '../colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState, useCallback } from 'react';
import { getLocalUri } from '../components/ImagePicker';
import PickerScreen from './PickerScreen';
import { RNS3 } from 'react-native-s3-upload';
import { LogBox } from 'react-native';

import Swiper from 'react-native-swiper';
import { BlurView } from 'expo-blur';
import { BLACK, PRIMARY } from '../colors';
import FastImage from '../components/FastImage';

LogBox.ignoreLogs([
  "No native splash screen registered for given view controller. Call 'SplashScreen.show' for given view controller first.",
  'Possible Unhandled Promise Rejection',
]);
///////// 이 사이에 main, select option을 넣으세요.

/////////

const SelectHome = () => {
  const navigation = useNavigation();
  const { params } = useRoute();

  const width = useWindowDimensions().width;

  const [photos, setPhotos] = useState([]);
  const [disabled, setDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const mainImage = photos[currentIndex];

  const uploadToS3 = () => {
    for (let cnt = 0; cnt <= photos.length; cnt++) {
      if (photos[cnt] != null) {
        const main_file = {
          uri: mainImage.uri,
          name: mainImage.filename,
          type: 'image/jpg',
        };

        const selected_file = {
          uri: photos[cnt].uri,
          name: photos[cnt].filename,
          type: 'image/jpg',
        };
        RNS3.put(main_file, main_options)
          .then((response) => {
            if (response.status !== 201)
              throw new Error('Failed to upload image to S3');
            console.log(main_file.name);
            console.log('성공적으로 main 업로드 되셨어요!');
          })
          .catch((err) =>
            console.error('not uploaded: ', main_file, main_options, err)
          );
        RNS3.put(selected_file, selected_options)
          .then((result) => {
            if (result.status !== 201)
              throw new Error('Failed to upload image to S3');
            console.log(selected_file.name);
            console.log(
              '이번엔 selected에 ' + (cnt + 1) + '번째 사진 넣기' + '성공!'
            );
          })
          .catch((err) => console.error('not uploaded: ', file, options, err));
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
      <View>
        {photos.length ? (
          <View style={{ width, height: width }}>
            {/* ImageSwiper 때려박음 */}
            <Swiper
              loop={false}
              dot={<View style={styles.dot} />}
              activeDot={<View style={styles.activeDot} />}
            >
              {photos.map((photo, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[
                    styles.photo,
                    currentIndex === idx && styles.photoSelected,
                  ]}
                  onPress={() => (
                    setCurrentIndex(idx),
                    console.log(
                      currentIndex +
                        1 +
                        '번째 사진을 클릭하고 있는거야 근데 다음 사진으로 넘어가서 누르면 한박자가 늦으니까 한번 더 눌러보아요'
                    )
                  )}
                >
                  <FastImage
                    source={{ uri: photo.uri ?? photo }}
                    style={StyleSheet.absoluteFill}
                    resizeMode="cover"
                  />
                  <BlurView
                    intensity={Platform.select({ ios: 10, android: 100 })}
                  >
                    <FastImage
                      source={{ uri: photo.uri ?? photo }}
                      style={styles.photo}
                      resizeMode="contain"
                    />
                  </BlurView>
                  {currentIndex === idx && (
                    <View style={styles.checkBoxContainer}>
                      <Image
                        source={require('../../assets/btn_check_on.webp')}
                        style={styles.checkBox}
                      />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </Swiper>
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
    height: '80%',
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
  photo: {
    width: '100%',
    height: '100%',
  },
  photoSelected: {
    opacity: 0.8,
  },
  dot: {
    backgroundColor: BLACK,
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 3,
  },
  activeDot: {
    backgroundColor: PRIMARY.DEFAULT,
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 3,
  },
});

export default SelectHome;
