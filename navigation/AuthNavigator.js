import React from 'react';
import { Ionicons } from '@expo/vector-icons'
import Splash from '../screens/Splash'
import Login from '../screens/Login'
import SignupScreen from '../screens/Signup'
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { TouchableOpacity } from 'react-native'

const StackNavigator = createStackNavigator(
  {
    Splash: {
      screen: Splash,
      navigationOptions: {
        header: null
      }
    },
    Login: {
      screen: Login,
      navigationOptions: {
        header: null
      }
    },
    Signup: {
      screen: SignupScreen,
      navigationOptions: ({ navigation }) => ({
        headerTransparent: true,
        title: ' ',
        headerLeft: (
          <TouchableOpacity onPress={() => navigation.goBack()} >
            <Ionicons style={[styles.icon,{marginLeft:10}]} name={'ios-arrow-back'} size={30} />
          </TouchableOpacity>
        ),
        headerStyle: { backgroundColor: 'transparent' }
      })
    }
  }
);

export default createAppContainer(StackNavigator);