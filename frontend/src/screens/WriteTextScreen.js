import { useNavigation, useRoute } from '@react-navigation/native';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { createPost, updatePost } from '../api/post';
import { uploadPhoto } from '../api/storage';
import { GRAY } from '../colors';
import FastImage from '../components/FastImage';
import HeaderRight from '../components/HeaderRight';
import LocationSearch from '../components/LocationSearch';
import event, { EventTypes } from '../event';

const MAX_TEXT_LENGTH = 60;

const WriteTextScreen = () => {
  const navigation = useNavigation();
  const { params } = useRoute();
  const width = useWindowDimensions().width / 4;

  const [photoUris, setPhotoUris] = useState([]);
  const [text, setText] = useState('');
  const [location, setLocation] = useState('');

  const [disabled, setDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const locationRef = useRef(null);

  useEffect(() => {
    setDisabled(isLoading || !text);
  }, [text, isLoading]);

  useEffect(() => {
    if (params) {
      const { photoUris, post } = params;

      if (photoUris) {
        setPhotoUris(params.photoUris);
      } else if (post) {
        setPhotoUris(post.photos);
        setText(post.text);
        setLocation(post.location);
        locationRef.current?.setAddressText(post.location);
      }
    }
  }, [params]);

  const onSubmit = useCallback(async () => {
    setIsLoading(true);
    try {
      if (params?.photoUris) {
        const photos = await Promise.all(
          photoUris.map((uri) => uploadPhoto(uri))
        );

        await createPost({ photos, location, text });
        event.emit(EventTypes.REFRESH);
      } else if (params?.post) {
        const { post } = params;
        const updatedPost = { ...post, text, location };
        await updatePost(updatedPost);
        event.emit(EventTypes.UPDATE, { post: updatedPost });
      }
      navigation.goBack();
    } catch (e) {
      Alert.alert(e.message, [
        {
          text: '확인',
          onPress: () => setIsLoading(false),
        },
      ]);
    }
  }, [location, photoUris, text, navigation, params]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <HeaderRight disabled={disabled} onPress={onSubmit} />,
    });
  }, [onSubmit, disabled, navigation]);

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row' }}>
        {photoUris.map((uri, idx) => (
          <FastImage
            key={idx}
            source={{ uri }}
            style={{ width, height: width }}
          />
        ))}
      </View>

      <LocationSearch
        ref={locationRef}
        onPress={({ description }) => setLocation(description)}
        isLoading={isLoading}
        isSelected={!!location}
      />

      <View>
        <TextInput
          value={text}
          onChangeText={(text) => setText(text)}
          style={styles.input}
          placeholder={'사진의 설명을 작성하세요.'}
          maxLength={MAX_TEXT_LENGTH}
          returnKeyType={'done'}
          autoCapitalize={'none'}
          autoCorrect={false}
          textContentType={'none'}
          keyboardAppearance={'light'}
          multiline={true}
          blurOnSubmit={true}
          editable={!isLoading}
        />
        <Text style={styles.inputLength}>
          {text.length} / {MAX_TEXT_LENGTH}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  inputLength: {
    alignSelf: 'flex-end',
    paddingHorizontal: 20,
    color: GRAY.DARK,
    fontSize: 12,
  },
});

export default WriteTextScreen;
