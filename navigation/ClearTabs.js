import React from 'react';
import { Text, View, Platform } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import { HomeNavigator, SearchNavigator, PostNavigator, ActivityNavigator, ProfileNavigator } from './StackNavigator'
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';

const TabNavigator = createBottomTabNavigator(
  {
    Home: {
      screen: HomeNavigator,
      navigationOptions: {
        headerTransparent: true,
        tabBarLabel: ' ',
        tabBarIcon: ({ focused }) => (
          <MaterialCommunityIcons name={focused ? 'home' : 'home-outline'} size={32} />
        )
      }
    },
    Search: {
      screen: SearchNavigator,
      navigationOptions: {
        headerTransparent: true,
        tabBarLabel: ' ',
        tabBarIcon: ({ focused }) => (
          <Ionicons name={focused ? 'md-search' : 'ios-search'} size={32} />
        )
      }
    },
    Post: {
      screen: PostNavigator,
      navigationOptions: {
        headerTransparent: true,
        tabBarLabel: ' ',
        tabBarIcon: ({ focused }) => (
          <Ionicons name={focused ? 'ios-add-circle' : 'ios-add-circle-outline'} size={32} />
        )
      }
    },
    Activity: {
      screen: ActivityNavigator,
      navigationOptions: {
        headerTransparent: true,
        tabBarLabel: ' ',
        tabBarIcon: ({ focused }) => (
          <Ionicons name={focused ? 'ios-heart' : 'ios-heart-empty'} size={32} />
        )
      }
    },
    MyProfile: {
      screen: ProfileNavigator,
      navigationOptions: {
        headerTransparent: true,
        tabBarLabel: ' ',
        tabBarIcon: ({ focused }) => (
          <FontAwesome name={focused ? 'user' : 'user-o'} size={32} />
        )
      }
    }
  },
  {
    tabBarOptions: {
      showIcon: true,
      showLabel: false,
      lazyLoad: true,
      style: {
        ...Platform.select({
          ios: {
            borderTopWidth: 0,
            backgroundColor: 'transparent',
            position: 'absolute',
            bottom: 0,
            left: 0,
            paddingBottom: 0,
            paddingTop: 5,
            height: 65,
            width: '100%'
          },
          android: {
            borderTopWidth: 0,
            backgroundColor: 'transparent',
            position: 'absolute',
            bottom: 0,
            left:0,
            paddingTop: 15,
            paddingBottom: 10,
            height: 40,
            width: '100%'
          },
        }),
      }
    }
  },

);

export default createAppContainer(TabNavigator);