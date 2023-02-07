import React, {Component} from 'react';
import {View, Text, Button} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

export default class Homescreen extends Component{
    render(){
        return(
            <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                <Text>Homescreen</Text>
                <Button onPress={this.gotodeepscreen} title="Go to the Deeplearning Screen"></Button>
            </View>
        );
    }

    gotodeepscreen=()=>{
        const navigation = NavigationContainer();
        navigation.navigate('deepscreen', deepscreen)
    }
}