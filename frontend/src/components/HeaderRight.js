import { Pressable } from 'react-native';
import PropTypes from 'prop-types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GRAY, PRIMARY } from '../colors';

const HeaderRight = ({ onPress, disabled }) => {
  return (
    <Pressable onPress={onPress} disabled={disabled} hitSlop={10}>
      <MaterialCommunityIcons
        name="check"
        size={24}
        color={disabled ? GRAY.DEFAULT : PRIMARY.DEFAULT}
      />
    </Pressable>
  );
};

HeaderRight.defaultProps = {
  disabled: false,
};

HeaderRight.propTypes = {
  onPress: PropTypes.func,
  disabled: PropTypes.bool,
};

export default HeaderRight;
