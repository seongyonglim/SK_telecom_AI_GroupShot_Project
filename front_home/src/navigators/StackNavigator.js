import { createStackNavigator } from '@react-navigation/stack';
import Login from '../screens/Login';
import PickerScreen from '../screens/PickerScreen';
import SelectHome from '../screens/SelectHome';
import SelectBestPhoto from '../screens/.SelectBestPhoto';
import PhotoEditing from '../screens/.PhotoEditing';
import { initFirebase } from '../api/firebase';
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
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    (async () => {
      try {
        await Promise.all(
          ImageAssets.map((image) => Asset.fromModule(image).downloadAsync())
        );

        initFirebase();
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
        options={{ title: 'SelectHome' }}
      />
      <Stack.Screen
      name="PickerScreen"
      component={PickerScreen}
      options={{ title: 'PickerScreen' }}
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
