import React from 'react';
import { Ionicons } from '@expo/vector-icons'
import Splash from '../screens/Splash'
import Login from '../screens/Login'
import SignupScreen from '../screens/Signup'
import Reset from '../screens/Reset'
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
      navigationOptions: ({ navigation }) => ({
        headerTransparent: true,
        title: ' ',
        headerLeft: (
          <TouchableOpacity onPress={() => navigation.goBack()} >
            <Ionicons style={[styles.icon,{marginLeft:20}]} name={'ios-arrow-back'} size={30} />
          </TouchableOpacity>
        ),
        headerStyle: { backgroundColor: 'transparent' }
      })
    },
    Signup: {
      screen: SignupScreen,
      navigationOptions: ({ navigation }) => ({
        headerTransparent: true,
        title: ' ',
        headerLeft: (
          <TouchableOpacity onPress={() => navigation.goBack()} >
            <Ionicons style={[styles.icon,{marginLeft:20}]} name={'ios-arrow-back'} size={30} />
          </TouchableOpacity>
        ),
        headerStyle: { backgroundColor: 'transparent' }
      })
    },
    Reset: {
      screen: Reset,
      navigationOptions: ({ navigation }) => ({
        headerTransparent: true,
        title: ' ',
        headerLeft: (
          <TouchableOpacity onPress={() => navigation.goBack()} >
            <Ionicons style={[styles.icon, { marginLeft: 20 }]} name={'ios-arrow-back'} size={30} />
          </TouchableOpacity>
        ),
        headerStyle: { backgroundColor: 'transparent' }
      })
    },
  }
);

export default createAppContainer(StackNavigator);