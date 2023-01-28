import { useNavigation, useRoute } from '@react-navigation/native';
import {
  Alert,
  Keyboard,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import FastImage from '../components/FastImage';
import { useUserState } from '../contexts/UserContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GRAY, WHITE } from '../colors';
import HeaderRight from '../components/HeaderRight';
import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { updateUserInfo } from '../api/auth';
import SafeInputView from '../components/SafeInputView';
import { MainRoutes } from '../navigations/routes';
import { getLocalUri } from '../components/ImagePicker';
import { uploadPhoto } from '../api/storage';

const UpdateProfileScreen = () => {
  const navigation = useNavigation();
  const { params } = useRoute();

  const [user, setUser] = useUserState();

  const [photo, setPhoto] = useState({ uri: user.photoURL });
  const [displayName, setDisplayName] = useState(user.displayName);
  const [disabled, setDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (params) {
      const { selectedPhotos } = params;
      if (selectedPhotos?.length) {
        setPhoto(selectedPhotos[0]);
      }
    }
  }, [params]);

  const onSubmit = useCallback(async () => {
    Keyboard.dismiss();
    if (!disabled) {
      setIsLoading(true);
      try {
        const localUri = photo.id
          ? Platform.select({
              ios: await getLocalUri(photo.id),
              android: photo.uri,
            })
          : photo.uri;
        const photoURL = await uploadPhoto(localUri);

        const userInfo = { displayName, photoURL };

        await updateUserInfo(userInfo);
        setUser((prev) => ({ ...prev, ...userInfo }));

        navigation.goBack();
      } catch (e) {
        Alert.alert('사용자 수정 실패', e.message);
        setIsLoading(false);
      }
    }
  }, [disabled, displayName, navigation, setUser, photo.id, photo.uri]);

  useEffect(() => {
    setDisabled(!displayName || isLoading);
  }, [displayName, isLoading]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <HeaderRight disabled={disabled} onPress={onSubmit} />,
    });
  }, [navigation, disabled, onSubmit]);

  return (
    <SafeInputView>
      <View style={styles.container}>
        <View>
          <FastImage source={{ uri: photo.uri }} style={styles.photo} />
          <Pressable
            onPress={() => navigation.navigate(MainRoutes.IMAGE_PICKER)}
            style={styles.imageButton}
          >
            <MaterialCommunityIcons name="image" size={20} color={WHITE} />
          </Pressable>
        </View>

        <View>
          <TextInput
            value={displayName}
            onChangeText={(text) => setDisplayName(text.trim())}
            style={styles.input}
            placeholder={'Nickname'}
            textAlign={'center'}
            maxLength={10}
            returnKeyType={'done'}
            autoCapitalize={'none'}
            autoCorrect={false}
            textContentType={'none'}
          />
        </View>
      </View>
    </SafeInputView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photo: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: GRAY.LIGHT,
  },
  imageButton: {
    position: 'absolute',
    bottom: 0,
    right: 20,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: GRAY.DARK,
  },
  input: {
    marginTop: 20,
    paddingHorizontal: 10,
    paddingVertical: 8,
    width: 200,
    fontSize: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: GRAY.DEFAULT,
  },
});

export default UpdateProfileScreen;
