import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import Login from './Login';
import AlbumPicker from './AlbumPicker';

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
