import { createStackNavigator } from '@react-navigation/stack';

import Login from '../screens/Login';
import AlbumPicker from '../screens/AlbumPicker';
import SelectBestPhoto from '../screens/SelectBestPhoto';

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
      <Stack.Screen name="AlbumPicker" component={AlbumPicker} />
      <Stack.Screen name="SelectBestPhoto" component={SelectBestPhoto} />
    </Stack.Navigator>
  );
};

export default StackNavigator;
