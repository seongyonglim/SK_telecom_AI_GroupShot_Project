import { useNavigation, useRoute } from '@react-navigation/native';
import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  Pressable,
  Platform,
  Image,
  Button,
  TouchableOpacity,
  Modal,
  LogBox,
} from 'react-native';
import { GRAY, WHITE } from '../colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import PickerScreen from './PickerScreen';
import PhotoEditing from './PhotoEditing';
import { RNS3 } from 'react-native-s3-upload';

import Swiper from 'react-native-swiper';
import { BlurView } from 'expo-blur';
import { BLACK, PRIMARY } from '../colors';
import FastImage from '../components/FastImage';
import axios from 'axios';
import { AWS_KEY, flask_API } from '../AWS';

LogBox.ignoreLogs([
  "No native splash screen registered for given view controller. Call 'SplashScreen.show' for given view controller first.",
  'Possible Unhandled Promise Rejection',
]);
///////// 이 사이에 main, select option을 넣으세요.
const main_options = {
  keyPrefix: 'main_img/',
  bucket: AWS_KEY.bucket,
  region: AWS_KEY.region,
  accessKey: AWS_KEY.accessKey,
  secretKey: AWS_KEY.secretKey,
  successActionStatus: 201,
};

const selected_options = {
  keyPrefix: 'selected_imgs/',
  bucket: AWS_KEY.bucket,
  region: AWS_KEY.region,
  accessKey: AWS_KEY.accessKey,
  secretKey: AWS_KEY.secretKey,
  successActionStatus: 201,
};

/////////

const SelectHome = () => {
  var url = flask_API;
  const navigation = useNavigation();
  const { params } = useRoute();

  const width = useWindowDimensions().width;

  const [photos, setPhotos] = useState([]); // PickerScreen에서 골라온 사진 변수 지정
  const [disabled, setDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false); // Device에서 사진 파일 가져오는 동안 로딩하고 있는지를 변수로 지정
  const [isUploading, setIsUploading] = useState(false); // 이거는 S3 업로드 중일 때 로딩하고 있는지를 변수로 지정
  const [showModal, setShowModal] = useState(false); // 로딩화면은 Modal로 깔끔히 정리
  const [currentIndex, setCurrentIndex] = useState(0); // 선택한 사진(메인 사진) 인덱스 변수 지정

  const mainImage = photos[currentIndex]; // 골라온 사진 중에서 선택한 사진을 메인 사진으로 변수 지정

  // aws s3로 업로드하는 함수
  // 이 부분 파일 분리 하고 싶음
  async function uploadToS3() {
    setIsUploading(true);
    setShowModal(true);

    const main_file = {
      uri: mainImage.uri,
      name: mainImage.filename,
      type: 'image/jpg',
    };
    RNS3.put(main_file, main_options)
      .then((response) => {
        if (response.status !== 201)
          throw new Error('Failed to upload image to S3');
        console.log('대표사진:', main_file.name);
      })
      .catch((err) => console.error('not uploaded: ', err));

    newcnt = 0;

    for (let cnt = 0; cnt <= photos.length; cnt++) {
      if (photos[cnt] != null) {
        const selected_file = {
          uri: photos[cnt].uri,
          name: photos[cnt].filename,
          type: 'image/jpg',
        };
        RNS3.put(selected_file, selected_options)
          .then((result) => {
            if (result.status !== 201)
              throw new Error('Failed to upload image to S3');
            console.log(selected_file.name);
            newcnt += 1;
            if (newcnt == photos.length) {
              axios.get(url + '/crop_face'), console.log('업로드');
            }
          })
          .catch((err) => console.error('not uploaded: ', err));
      }
    }

    // 진짜 로딩 다 끝나고 다음화면으로 넘어가라니까 죽어도 안 되길래...
    // 그냥 강제로 3초룰 집어넣음
    // **여기서 잠깐, 3초 룰이란?**
    // 일단 로딩 다 끝나고 넘어가는 조건을 집어넣되, 그거랑 상관없이 무조건 로딩화면을 3초 더 보여줌
    return new Promise((resolve) => {
      setTimeout(() => {
        setIsUploading(false);
        setShowModal(false);
        resolve();
      }, 3500 * photos.length);
    });
  }

  const handleOnPress = async () => {
    uploadToS3().then(() => {
      navigation.navigate(PhotoEditing);
    });
  };

  useEffect(() => {
    if (params) {
      setPhotos(params.selectedPhotos ?? []);
    }
  }, [params]);

  useEffect(() => {
    setDisabled(isLoading || !photos.length);
  }, [isLoading, photos.length]);

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
        {/* 사진을 고른 뒤에는 ImageSwiper를 표출해줍니다. */}
        {photos.length ? (
          <View style={{ width, height: width }}>
            {/* ImageSwiper */}
            <Swiper
              loop={false}
              dot={<View style={styles.dot} />}
              activeDot={<View style={styles.activeDot} />}
            >
              {/* 대표사진 선택기능 */}
              {photos.map((photo, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[
                    styles.photo,
                    currentIndex === idx && styles.photoSelected,
                  ]}
                  onPress={() => setCurrentIndex(idx)}
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
                  {/* 선택한 것만 체크박스 처리하는 부분 */}
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
            {/* 버튼을 누르면 AWS S3 업로드 함
            ++ 다음 페이지로 navigate 되야함.
            ++ 로딩시간동안 지루하지 않게 로딩화면을 따로 띄워줘야 함 */}
            <Button
              title="대표사진확정"
              onPress={handleOnPress}
              disabled={isUploading}
            ></Button>
            {/* Modal 사용해서 강제 로딩창 실행 */}
            <Modal visible={showModal}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text style={styles.loadingTitle}>
                  멋진 단체 사진 만들어 볼까?
                </Text>
                <Image source={require('../../assets/loadingCharacter.gif')} />
              </View>
            </Modal>
            {/* ImageSwiper*/}
          </View>
        ) : (
          // 근데 사진을 안골랐으면 버튼을 보여줘요
          // 이 부분 Adot 따서 Adot 처럼 고쳐주기
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
  loadingTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlignVertical: 'center',
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