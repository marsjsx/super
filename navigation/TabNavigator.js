import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import Home from '../screens/Home.js';
import Search from '../screens/Search.js';
import Upload from '../screens/Upload';
import Activity from '../screens/Activity';
import Profile from '../screens/Profile';

import { createBottomTabNavigator, createAppContainer } from 'react-navigation';

const TabNavigator = createBottomTabNavigator({
  Home: {
    screen: Home,
    navigationOptions: {
      tabBarLabel: ' ',
      tabBarIcon: ({focused}) => (
        <Ionicons name={focused ? 'ios-home' : 'md-home'} size={32} />
      )
    }
  },
  Search: {
    screen: Search,
    navigationOptions: {
      tabBarLabel: ' ',
      tabBarIcon: ({focused}) => (
        <Ionicons name={focused ? 'md-search' : 'ios-search'} size={32} />
      )
    }
  },
  Upload: {
    screen: Upload,
    navigationOptions: {
      tabBarLabel: ' ',
      tabBarIcon: ({ focused }) => (
        <Ionicons name={focused ? 'ios-add-circle' : 'ios-add-circle-outline'} size={32} />
      )
    }
  },
  Activity: {
    screen: Activity,
    navigationOptions: {
      tabBarLabel: ' ',
      tabBarIcon: ({ focused }) => (
        <Ionicons name={focused ? 'ios-heart' : 'ios-heart-empty' } size={32} />
      )
    }
  },
  Profile: {
    screen: Profile,
    navigationOptions: {
      tabBarLabel: ' ',
      tabBarIcon: ({ focused }) => (
        <Ionicons name={focused ? 'md-person' : 'ios-person'} size={32} />
      )
    }
  },
});

export default createAppContainer(TabNavigator);
