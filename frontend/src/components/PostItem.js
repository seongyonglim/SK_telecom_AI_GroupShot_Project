import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import { memo, useState } from 'react';
import ImageSwiper from './ImageSwiper';
import FastImage from './FastImage';
import { GRAY, PRIMARY, WHITE } from '../colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useUserState } from '../contexts/UserContext';
import { useActionSheet } from '@expo/react-native-action-sheet';
import DangerAlert, { AlertTypes } from './DangerAlert';
import { deletePost } from '../api/post';
import event, { EventTypes } from '../event';
import { useNavigation } from '@react-navigation/native';
import { MainRoutes } from '../navigations/routes';

const ActionSheetOptions = {
  options: ['삭제', '수정', '취소'],
  cancelButtonIndex: 2,
  destructiveButtonIndex: 0,
};

const PostItem = memo(({ post }) => {
  const width = useWindowDimensions().width;
  const [user] = useUserState();
  const { showActionSheetWithOptions } = useActionSheet();
  const navigation = useNavigation();

  const [visible, setVisible] = useState(false);

  const onPressActionSheet = (idx) => {
    if (idx === 0) {
      setVisible(true);
    } else if (idx === 1) {
      navigation.navigate(MainRoutes.WRITE_TEXT, { post });
    }
  };

  const onClose = () => setVisible(false);

  return (
    <>
      <DangerAlert
        alertType={AlertTypes.DELETE_POST}
        visible={visible}
        onClose={onClose}
        onConfirm={async () => {
          try {
            await deletePost(post.id);
            event.emit(EventTypes.DELETE, { id: post.id });
          } catch (e) {
            Alert.alert('글 삭제에 실패했습니다.');
            onClose();
          }
        }}
      />

      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.profile}>
            <FastImage
              source={{ uri: post.user.photoURL }}
              style={styles.profilePhoto}
            />
            <Text style={styles.nickname}>
              {post.user.displayName ?? 'nickname'}
            </Text>
          </View>

          {post.user.uid === user.uid && (
            <Pressable
              hitSlop={10}
              onPress={() =>
                showActionSheetWithOptions(
                  ActionSheetOptions,
                  onPressActionSheet
                )
              }
            >
              <MaterialCommunityIcons
                name="dots-horizontal"
                size={24}
                color={GRAY.DARK}
              />
            </Pressable>
          )}
        </View>

        <View style={{ width, height: width }}>
          <ImageSwiper photos={post.photos} />
        </View>

        <View style={styles.location}>
          <MaterialCommunityIcons
            name="map-marker"
            size={24}
            color={PRIMARY.DEFAULT}
          />
          <Text>{post.location}</Text>
        </View>

        <Text style={styles.text}>{post.text}</Text>
      </View>
    </>
  );
});
PostItem.displayName = 'PostItem';

PostItem.propTypes = {
  post: PropTypes.object,
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: WHITE,
    paddingVertical: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePhoto: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: GRAY.LIGHT,
  },
  nickname: {
    paddingHorizontal: 10,
    fontWeight: '600',
  },
  location: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    paddingHorizontal: 10,
  },
});

export default PostItem;
