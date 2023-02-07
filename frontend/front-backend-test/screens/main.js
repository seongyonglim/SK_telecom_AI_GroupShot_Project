import React, {Component} from 'react';
import {View, Text} from 'react-native';

import {createStackNavigator} from 'react-navigation-stack'
import homescreen from './homescreen'
import deepscreen from './deepscreen'

import {createAppContainer} from 'react-navigation'

const stackNav = createStackNavigator(
    {
        home : {screen:homescreen},
        deepscreen : {screen:deepscreen},
    }
);

const Container = createAppContainer(stackNav);

export default class Main extends Component{
    render(){
        return <Container theme="light"></Container>
    }
}
        