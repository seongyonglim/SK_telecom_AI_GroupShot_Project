import { createStackNavigator } from '@react-navigation/stack';
import Login from '../screens/Login';
import PickerScreen from '../screens/PickerScreen';
import SelectHome from '../screens/SelectHome';
import PythonTestScreen from '../screens/PythonTestScreen';
//import { initFirebase } from '../api/firebase';
import { useEffect, useState } from 'react';
import { Asset } from 'expo-asset';

const ImageAssets = [
  require('../../assets/cover.png'),
  require('../../assets/home-clock.png'),
  require('../../assets/icon.png'),
  require('../../assets/selectadot.gif'),
];

const Stack = createStackNavigator();

const StackNavigator = () => {
  const [setIsReady] = useState(false);
  useEffect(() => {
    (async () => {
      try {
        await Promise.all(
          ImageAssets.map((image) => Asset.fromModule(image).downloadAsync())
        );

        //initFirebase();
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
      } finally {
        setIsReady(true);
      }
    })();
  }, []);

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
        name="SelectHome"
        component={SelectHome}
        options={{ title: '' }}
      />
      <Stack.Screen
      name="PickerScreen"
      component={PickerScreen}
      options={{ title: '' }}
      />
      <Stack.Screen
      name="PythonTestScreen"
      component={PythonTestScreen}
      options={{ title: '' }}
      />
    </Stack.Navigator>
  );
};

export default StackNavigator;
