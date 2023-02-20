import { createStackNavigator } from '@react-navigation/stack';
import Login from '../screens/Login';
import PickerScreen from '../screens/PickerScreen';
import SelectHome from '../screens/SelectHome';
//import { initFirebase } from '../api/firebase';
import { useEffect, useState } from 'react';
import { Asset } from 'expo-asset';
import PhotoEditing from '../screens/PhotoEditing';
import Ending from '../screens/Ending';

const ImageAssets = [
  require('../../assets/cover.png'),
  require('../../assets/home-clock.png'),
  require('../../assets/icon.png'),
  require('../../assets/selectadot.gif'),
  require('../../assets/endingdot.gif'),
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
        options={{ title: '', headerLeft: false }}
      />
      <Stack.Screen
        name="PickerScreen"
        component={PickerScreen}
        options={{ title: '' }}
      />
      <Stack.Screen
        name="PhotoEditing"
        component={PhotoEditing}
        options={{ title: '' }}
      />
      <Stack.Screen name="Ending" component={Ending} options={{ title: '' }} />
    </Stack.Navigator>
  );
};

export default StackNavigator;
