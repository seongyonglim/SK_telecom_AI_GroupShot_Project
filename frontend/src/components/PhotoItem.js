import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import PropTypes from 'prop-types';
import { BlurView } from 'expo-blur';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { PRIMARY } from '../colors';
import { memo } from 'react';

const PhotoItem = memo(({ item, isSelected, togglePhoto }) => {
  const width = useWindowDimensions().width / 3;

  return (
    <Pressable
      onPress={() => togglePhoto(item)}
      style={{ width, height: width }}
    >
      <Image source={{ uri: item.uri }} style={styles.photo} />
      {isSelected && (
        <BlurView
          intensity={Platform.select({ ios: 10, android: 80 })}
          style={[StyleSheet.absoluteFillObject, styles.checkIcon]}
        >
          <MaterialCommunityIcons
            name="check-circle"
            size={40}
            color={PRIMARY.DEFAULT}
          />
        </BlurView>
      )}
    </Pressable>
  );
});
PhotoItem.displayName = 'PhotoItem';

PhotoItem.propTypes = {
  item: PropTypes.object,
  isSelected: PropTypes.bool,
  togglePhoto: PropTypes.func,
};

const styles = StyleSheet.create({
  photo: { width: '100%', height: '100%' },
  checkIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PhotoItem;
