import React from "react";
import { Text, View, Platform, StatusBar } from "react-native";
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

import {
  createBottomTabNavigator,
  createAppContainer,
  BottomTabBar,
} from "react-navigation";

import Add from "../screens/Add";

const TabBarComponent = (props) => <BottomTabBar {...props} />;

const TabNavigator = createBottomTabNavigator(
  {
    Home: {
      screen: HomeNavigator,
      navigationOptions: {
        headerTransparent: true,
        tabBarLabel: " ",
        tabBarIcon: ({ focused }) => (
          <MaterialCommunityIcons
            color={"white"}
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
          <Ionicons
            color={"white"}
            name={focused ? "md-search" : "ios-search"}
            size={32}
          />
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
            color={"white"}
            name={focused ? "ios-camera" : "ios-camera"}
            size={36}
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
            color={"white"}
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
          <FontAwesome
            color={"white"}
            name={focused ? "user" : "user-o"}
            size={32}
          />
        ),
      },
    },
  },
  {
    // tabBarComponent: (props) => {
    //   return (
    //     <View>
    //       <View
    //         style={{
    //           position: "absolute",
    //           left: 0,
    //           right: 0,
    //           opacity: 0,
    //           bottom: 0,
    //           height: 85,
    //           backgroundColor: "black",
    //         }}
    //       ></View>
    //       <View
    //         style={{
    //           position: "absolute",
    //           left: 0,
    //           right: 0,
    //           bottom: 0,
    //           backgroundColor: "transparent",
    //         }}
    //       >
    //         <TabBarComponent {...props} />
    //       </View>
    //     </View>
    //   );
    // },

    tabBarOptions: {
      // headerTransparent: true,
      tabBarTransparent: true,

      style: {
        backgroundColor: "transparent",
        borderTopWidth: 0,
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
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
          // backgroundColor: "rgba(3,3,3,0)",
        }),
      },
      // style: {
      //   ...Platform.select({
      //     ios: {
      //       paddingBottom: 0,
      //       paddingTop: 5,
      //     },
      //     android: {
      //       paddingTop: 15,
      //       paddingBottom: 0,
      //     },
      //     height: 65,
      //     backgroundColor: "rgba(3,3,3,0)",
      //   }),
      // },
    },
  }
);

export default createAppContainer(TabNavigator);
