import React from 'react';
import { Text, View, Platform } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import { HomeNavigator, SearchNavigator, PostNavigator, ActivityNavigator, ProfileNavigator } from './StackNavigator'
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
const bgcolor = 'rgba(255,255,255,0.1)'
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
      headerTransparent: true,
      tabBarTransparent: true,
      style: {
        ...Platform.select({
          ios:{
            paddingBottom: 0,
            paddingTop: 5,
            height: 65,
          },
          android: {
            paddingTop: 15,
            height: 40,
          },
          backgroundColor:'rgba(3,3,3,0)'
        }),
      }
    }
  },
  
);

export default createAppContainer(TabNavigator);