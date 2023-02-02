import { createStackNavigator } from '@react-navigation/stack';

import Login from '../screens/Login';
import AlbumPicker from '../screens/AlbumPicker';
import SelectBestPhoto from '../screens/SelectBestPhoto';
import PhotoEditing from '../screens/PhotoEditing';

const Stack = createStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={Login}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AlbumPicker"
        component={AlbumPicker}
        options={{ title: '앨범선택' }}
      />
      <Stack.Screen
        name="SelectBestPhoto"
        component={SelectBestPhoto}
        options={{ title: '대표사진선택' }}
      />
      <Stack.Screen
        name="PhotoEditing"
        component={PhotoEditing}
        options={{ title: '사진편집' }}
      />
    </Stack.Navigator>
  );
};

export default StackNavigator;
