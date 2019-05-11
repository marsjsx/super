import React from 'react';
import Login from '../screens/Login'
import SignupScreen from '../screens/Signup'
import { createStackNavigator, createAppContainer } from 'react-navigation';

const StackNavigator = createStackNavigator(
  {
    Login: {
      screen: Login,
      navigationOptions: {
        header: null
      }
    },
    Signup: {
      screen: SignupScreen,
      navigationOptions: {
        title: 'Signup'
      }
    }
  }
);

export default createAppContainer(StackNavigator);