import { createStackNavigator } from '@react-navigation/stack';

import Login from '../screens/Login';
import AlbumPicker from '../screens/AlbumPicker';

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
    </Stack.Navigator>
  );
};

export default StackNavigator;
