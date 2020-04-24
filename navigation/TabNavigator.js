import React from "react";
import { Text, View, Platform } from "react-native";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome,
} from "@expo/vector-icons";
import {
  HomeNavigator,
  SearchNavigator,
  PostNavigator,
  ActivityNavigator,
  ProfileNavigator,
} from "./StackNavigator";
import { createBottomTabNavigator, createAppContainer } from "react-navigation";

import Add from "../screens/Add";

const TabNavigator = createBottomTabNavigator(
  {
    Home: {
      screen: HomeNavigator,
      navigationOptions: {
        headerTransparent: true,
        tabBarLabel: " ",
        tabBarIcon: ({ focused }) => (
          <MaterialCommunityIcons
            name={focused ? "home" : "home-outline"}
            size={32}
          />
        ),
      },
    },
    Search: {
      screen: SearchNavigator,
      navigationOptions: {
        headerTransparent: true,
        tabBarLabel: " ",
        tabBarIcon: ({ focused }) => (
          <Ionicons name={focused ? "md-search" : "ios-search"} size={32} />
        ),
      },
    },
    // Post: {
    //   screen: Add,
    //   navigationOptions: {
    //     tabBarIcon: ({ tintColor }) => (
    //       <Ionicons name="ios-add-circle-outline" size={32} />
    //     ),
    //   },
    // },
    Post: {
      screen: PostNavigator,
      navigationOptions: {
        header: null,
        tabBarLabel: " ",
        tabBarIcon: ({ focused }) => (
          <Ionicons
            name={focused ? "ios-add-circle" : "ios-add-circle-outline"}
            size={32}
          />
        ),
      },
    },
    Activity: {
      screen: ActivityNavigator,
      navigationOptions: {
        headerTransparent: true,
        tabBarLabel: " ",
        tabBarIcon: ({ focused }) => (
          <Ionicons
            name={focused ? "ios-heart" : "ios-heart-empty"}
            size={32}
          />
        ),
      },
    },
    MyProfile: {
      screen: ProfileNavigator,
      navigationOptions: {
        headerTransparent: true,
        tabBarLabel: " ",
        tabBarIcon: ({ focused }) => (
          <FontAwesome name={focused ? "user" : "user-o"} size={32} />
        ),
      },
    },
  },
  {
    tabBarOptions: {
      headerTransparent: true,
      tabBarTransparent: true,
      style: {
        ...Platform.select({
          ios: {
            paddingBottom: 0,
            paddingTop: 5,
          },
          android: {
            paddingTop: 15,
            paddingBottom: 0,
          },
          height: 65,
          backgroundColor: "rgba(3,3,3,0)",
        }),
      },
    },
  }
);

export default createAppContainer(TabNavigator);
