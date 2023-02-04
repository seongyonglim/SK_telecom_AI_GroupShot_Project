import { useNavigation, useRoute } from '@react-navigation/native';
import { StyleSheet, Text, View, useWindowDimensions, Pressable, Alert, Platform, Image} from 'react-native';
import { GRAY, WHITE } from '../colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState, useLayoutEffect, useCallback } from 'react';
import { getLocalUri } from '../components/ImagePicker';
import ImageSwiper from '../components/ImageSwiper';
import PickerScreen from './PickerScreen';

const SelectHome = () => {
  const navigation = useNavigation();
  const { params } = useRoute();

  const width = useWindowDimensions().width;

  const [photos, setPhotos] = useState([]);
  const [disabled, setDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

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

  useLayoutEffect(() => {
    navigation.setOptions({
    //   headerRight: () => <HeaderRight disabled={disabled} onPress={onSubmit} />,
    });
  }, [navigation, disabled, onSubmit]);

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/selectadot.gif')} style={styles.selectadot} />
      {/* <Text style={styles.description}>
        이미지는 최대 4장까지 선택 가능합니다.
      </Text> */}
      <View style={{ width, height: width }}>
        {photos.length ? (
          <ImageSwiper photos={photos} />
        ) : (
          <Pressable
            style={styles.photoButton}
            onPress={() =>
              navigation.navigate(PickerScreen, { maxCount: 4 })
            }
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
  selectadot: {
    width: '100%',
    height: 250,
    marginTop: 20,
    marginBottom: -20,
  },
});

export default SelectHome;
