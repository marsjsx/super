import React, { useState, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import Splash from "../../screens/Splash";
import Login from "../../screens/Login";
import SignupScreen from "../../screens/Signup";

import HomeScreen from "../../screens/Home";
import SearchScreen from "../../screens/Search";
import FilterScreen from "../../screens/Filter";
import PostScreen from "../../screens/Post";
import VideoCover from "../../screens/videocover";
import CropperPage from "../../screens/CropperPage";

import PostCaptions from "../../screens/PostCaption";

import ActivityScreen from "../../screens/Activity";
import ProfileScreen from "../../screens/Profile";
import ViewProfileScreen from "../../screens/ViewProfile";

import BlockedUsers from "../../screens/BlockedUsers";

// import CameraScreen from "../screens/Camera";
import CameraScreen from "../../component/CameraView";
import FullScreenImage from "../../component/FullScreenImage";
import Reset from "../../screens/Reset";

import MapScreen from "../../screens/Map";
import EditScreen from "../../screens/Signup";
import DashScreen from "../../screens/Dash";
import CommentScreen from "../../screens/Comment";
import NewMessage from "../../screens/NewMessage";
import PostReportScreen from "../../screens/PostReports";
import ChatScreen from "../../screens/Chat";
import PayScreen from "../../screens/Pay";
import MessagesScreen from "../../screens/Messages";
import PostListScreen from "../../screens/PostList";
import MyFollowersAndFollowing from "../../screens/MyFollowersAndFollowing";
import LikersAndViewers from "../../screens/LikersAndViewers";
import WelcomeScreen from "../../screens/WelcomeScreen";
// import { createAppContainer, createStackNavigator } from "react-navigation";

import Add from "../../screens/Add";

import {
  Text,
  View,
  Platform,
  StatusBar,
  Image,
  TouchableOpacity,
} from "react-native";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome,
} from "@expo/vector-icons";
import styles from "../../styles";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const RootNavigator = (props) => {
  const [initialRoute, setInitialRoute] = useState("Home");

  const AuthStack = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Splash"
          component={Splash}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="login"
          header={null}
          component={Login}
          options={({ navigation, route }) => ({
            title: " ",
            headerTransparent: true,
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons
                  style={[
                    styles.icon,
                    { marginLeft: 20, color: "rgb(255,255,255)" },
                  ]}
                  name={"ios-arrow-back"}
                  size={30}
                />
              </TouchableOpacity>
            ),
            headerStyle: { backgroundColor: "transparent" },
          })}
        />
        <Stack.Screen
          name="Signup"
          header={null}
          component={SignupScreen}
          options={({ navigation, route }) => ({
            title: " ",
            headerTransparent: true,
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons
                  style={[
                    styles.icon,
                    { marginLeft: 20, color: "rgb(255,255,255)" },
                  ]}
                  name={"ios-arrow-back"}
                  size={30}
                />
              </TouchableOpacity>
            ),
            headerStyle: { backgroundColor: "transparent" },
          })}
        />
        <Stack.Screen
          name="Reset"
          component={Reset}
          options={({ navigation, route }) => ({
            title: " ",
            headerTransparent: true,
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons
                  style={[
                    styles.icon,
                    { marginLeft: 20, color: "rgb(255,255,255)" },
                  ]}
                  name={"ios-arrow-back"}
                  size={30}
                />
              </TouchableOpacity>
            ),
            headerStyle: { backgroundColor: "transparent" },
          })}
        />
      </Stack.Navigator>
    );
  };

  const HomeNavigator = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Splash"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="FullScreenImage"
          header={null}
          component={FullScreenImage}
          options={({ navigation, route }) => ({
            title: " ",
            headerTransparent: true,
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons
                  style={[styles.icon, { marginLeft: 20 }]}
                  name={"ios-close"}
                  size={40}
                  color="white"
                />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="Comment"
          component={CommentScreen}
          options={({ navigation, route }) => ({
            title: route.params.username,
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons
                  style={[styles.icon, { marginLeft: 20 }]}
                  name={"ios-arrow-back"}
                  size={30}
                />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="PostReport"
          component={PostReportScreen}
          options={({ navigation, route }) => ({
            title: "Post Reports",
            headerTransparent: true,
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons
                  style={[styles.icon, { marginLeft: 20 }]}
                  name={"ios-arrow-back"}
                  size={30}
                />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="Map"
          component={MapScreen}
          options={({ navigation, route }) => ({
            title: "Map View",
            headerTransparent: true,
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons
                  style={[styles.icon, { marginLeft: 20 }]}
                  name={"ios-arrow-back"}
                  size={30}
                />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="Messages"
          component={MessagesScreen}
          options={({ navigation, route }) => ({
            title: "Messages",
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons
                  style={[styles.icon, { marginLeft: 20 }]}
                  name={"ios-arrow-back"}
                  size={30}
                />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="NewMessage"
          component={NewMessage}
          options={({ navigation, route }) => ({
            title: "New Message",
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons
                  style={[styles.icon, { marginLeft: 20 }]}
                  name={"ios-arrow-back"}
                  size={30}
                />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="Chat"
          component={ChatScreen}
          options={({ navigation, route }) => ({
            title: route.params.title,
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons
                  style={[styles.icon, { marginLeft: 20 }]}
                  name={"ios-arrow-back"}
                  size={30}
                />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="Camera"
          component={CameraScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="PostDetail"
          component={PostScreen}
          options={{
            headerTransparent: true,
            gesturesEnabled: false,
          }}
        />
        <Stack.Screen name="PostCaption" component={PostCaptions} />
        <Stack.Screen
          name="Pay"
          component={PayScreen}
          options={({ navigation, route }) => ({
            headerTransparent: true,
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons
                  style={[styles.icon, { marginLeft: 20 }]}
                  name={"ios-arrow-back"}
                  size={30}
                />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="MyFollowersAndFollowing"
          component={MyFollowersAndFollowing}
          options={({ navigation, route }) => ({
            headerTransparent: true,
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons
                  style={[styles.icon, { marginLeft: 20 }]}
                  name={"ios-arrow-back"}
                  size={30}
                />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="ViewProfile"
          component={ViewProfileScreen}
          options={({ navigation, route }) => ({
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons
                  style={[styles.icon, { marginLeft: 20, color: "#000" }]}
                  name={"ios-arrow-back"}
                  size={30}
                />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="PostListScreen"
          component={PostListScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="LikersAndViewers"
          component={LikersAndViewers}
          options={({ navigation, route }) => ({
            title: route.params.title,
            headerTransparent: true,
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons
                  style={[styles.icon, { marginLeft: 20 }]}
                  name={"ios-arrow-back"}
                  size={30}
                />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={({ navigation, route }) => ({
            headerTransparent: true,
            title: " ",
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons
                  style={[styles.icon, { marginLeft: 20 }]}
                  name={"ios-arrow-back"}
                  size={30}
                />
              </TouchableOpacity>
            ),
            headerStyle: { backgroundColor: "transparent" },
          })}
        />
        <Stack.Screen
          name="Signup"
          component={SignupScreen}
          options={({ navigation, route }) => ({
            headerTransparent: true,
            title: " ",
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons
                  style={[styles.icon, { marginLeft: 20, color: "#000" }]}
                  name={"ios-arrow-back"}
                  size={30}
                />
              </TouchableOpacity>
            ),
            headerStyle: { backgroundColor: "transparent" },
          })}
        />
        <Stack.Screen
          name="WelcomeScreen"
          component={WelcomeScreen}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    );
  };

  const SearchNavigator = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Search"
          component={SearchScreen}
          options={({ navigation, route }) => ({
            headerTitle: (
              props // App Logo
            ) => (
              <Image
                style={[styles.logoHeader, { width: 150, height: 55 }]}
                source={require("../../assets/logo.png")}
                resizeMode="contain"
              />
            ),
            headerTransparent: true,
          })}
        />

        <Stack.Screen
          name="Comment"
          component={CommentScreen}
          options={({ navigation, route }) => ({
            headerTransparent: true,
            title: route.params.username,
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons
                  style={[styles.icon, { marginLeft: 20 }]}
                  name={"ios-arrow-back"}
                  size={30}
                />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={({ navigation, route }) => ({
            headerShown: false,
          })}
        />
        <Stack.Screen
          name="ViewProfile"
          component={ViewProfileScreen}
          options={({ navigation, route }) => ({
            title: "Post Reports",
            headerTransparent: true,
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons
                  style={[styles.icon, { marginLeft: 20, color: "#000" }]}
                  name={"ios-arrow-back"}
                  size={30}
                />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="MyFollowersAndFollowing"
          component={MyFollowersAndFollowing}
          options={({ navigation, route }) => ({
            headerTransparent: true,
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons
                  style={[styles.icon, { marginLeft: 20 }]}
                  name={"ios-arrow-back"}
                  size={30}
                />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="Filter"
          component={FilterScreen}
          options={({ navigation, route }) => ({
            headerTransparent: true,
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons
                  style={[styles.icon, { marginLeft: 20 }]}
                  name={"ios-arrow-back"}
                  size={30}
                />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="PostListScreen"
          component={PostListScreen}
          options={({ navigation, route }) => ({
            headerShown: false,
          })}
        />
        <Stack.Screen
          name="LikersAndViewers"
          component={LikersAndViewers}
          options={({ navigation, route }) => ({
            title: route.params.title,
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons
                  style={[styles.icon, { marginLeft: 20 }]}
                  name={"ios-arrow-back"}
                  size={30}
                />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="FullScreenImage"
          component={FullScreenImage}
          options={{
            headerTransparent: true,
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons
                  style={[styles.icon, { marginLeft: 20 }]}
                  name={"ios-close"}
                  size={40}
                  color="white"
                />
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen
          name="WelcomeScreen"
          component={WelcomeScreen}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    );
  };

  const PostNavigator = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Post"
          component={Add}
          options={({ navigation, route }) => ({
            headerShown: false,
          })}
        />
        <Stack.Screen
          name="PostDetail"
          component={PostScreen}
          options={({ navigation, route }) => ({
            headerTransparent: true,
          })}
        />
        <Stack.Screen
          name="Comment"
          component={CommentScreen}
          options={({ navigation, route }) => ({
            title: route.params.username,
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons
                  style={[styles.icon, { marginLeft: 20 }]}
                  name={"ios-close"}
                  size={40}
                  color="white"
                />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="VideoCover"
          component={VideoCover}
          options={({ navigation, route }) => ({
            title: "Choose Video Cover",
            gesturesEnabled: false,
          })}
        />
        <Stack.Screen
          name="PostCaption"
          component={PostCaptions}
          options={({ navigation, route }) => ({
            title: "Post Caption",
          })}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={({ navigation, route }) => ({
            headerTransparent: true,
            title: " ",
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons
                  style={[styles.icon, { marginLeft: 20 }]}
                  name={"ios-arrow-back"}
                  size={30}
                />
              </TouchableOpacity>
            ),
            headerStyle: { backgroundColor: "transparent" },
          })}
        />
        <Stack.Screen
          name="Signup"
          component={SignupScreen}
          options={({ navigation, route }) => ({
            headerTransparent: true,
            title: " ",
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons
                  style={[styles.icon, { marginLeft: 20, color: "#000" }]}
                  name={"ios-arrow-back"}
                  size={30}
                />
              </TouchableOpacity>
            ),
            headerStyle: { backgroundColor: "transparent" },
          })}
        />
        <Stack.Screen
          name="WelcomeScreen"
          component={WelcomeScreen}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    );
  };

  const ActivityNavigator = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Activity"
          component={ActivityScreen}
          options={({ navigation, route }) => ({
            title: "Activity",
          })}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={({ navigation, route }) => ({
            headerTransparent: true,
            title: " ",
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons
                  style={[styles.icon, { marginLeft: 20 }]}
                  name={"ios-arrow-back"}
                  size={30}
                />
              </TouchableOpacity>
            ),
            headerStyle: { backgroundColor: "transparent" },
          })}
        />
        <Stack.Screen
          name="Signup"
          component={SignupScreen}
          options={({ navigation, route }) => ({
            headerTransparent: true,
            title: " ",
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons
                  style={[styles.icon, { marginLeft: 20, color: "#000" }]}
                  name={"ios-arrow-back"}
                  size={30}
                />
              </TouchableOpacity>
            ),
            headerStyle: { backgroundColor: "transparent" },
          })}
        />
        <Stack.Screen
          name="Comment"
          component={CommentScreen}
          options={({ navigation, route }) => ({
            title: route.params.username,
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons
                  style={[styles.icon, { marginLeft: 20 }]}
                  name={"ios-close"}
                  size={40}
                  color="white"
                />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={({ navigation, route }) => ({
            headerShown: false,
          })}
        />
        <Stack.Screen
          name="ViewProfile"
          component={ViewProfileScreen}
          options={({ navigation, route }) => ({
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons
                  style={[styles.icon, { marginLeft: 20 }]}
                  name={"ios-close"}
                  size={40}
                  color="white"
                />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="MyFollowersAndFollowing"
          component={MyFollowersAndFollowing}
          options={({ navigation, route }) => ({
            headerTransparent: true,
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons
                  style={[styles.icon, { marginLeft: 20 }]}
                  name={"ios-close"}
                  size={40}
                  color="white"
                />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="PostListScreen"
          component={PostListScreen}
          options={({ navigation, route }) => ({
            headerShown: false,
          })}
        />
        <Stack.Screen
          name="LikersAndViewers"
          component={LikersAndViewers}
          options={({ navigation, route }) => ({
            title: route.params.title,
            headerTransparent: true,
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons
                  style={[styles.icon, { marginLeft: 20 }]}
                  name={"ios-close"}
                  size={40}
                  color="white"
                />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="FullScreenImage"
          component={FullScreenImage}
          options={({ navigation, route }) => ({
            headerTransparent: true,
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons
                  style={[styles.icon, { marginLeft: 20 }]}
                  name={"ios-close"}
                  size={40}
                  color="white"
                />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="WelcomeScreen"
          component={WelcomeScreen}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    );
  };

  const ProfileNavigator = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="MyProfile"
          component={ProfileScreen}
          options={({ navigation, route }) => ({
            headerShown: false,
          })}
        />
        <Stack.Screen
          name="ViewProfile"
          component={ViewProfileScreen}
          options={({ navigation, route }) => ({
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons
                  style={[styles.icon, { marginLeft: 20 }]}
                  name={"ios-close"}
                  size={40}
                  color="white"
                />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="Comment"
          component={CommentScreen}
          options={({ navigation, route }) => ({
            title: route.params.username,
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons
                  style={[styles.icon, { marginLeft: 20 }]}
                  name={"ios-close"}
                  size={40}
                  color="white"
                />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="PostListScreen"
          component={PostListScreen}
          options={({ navigation, route }) => ({
            headerShown: false,
          })}
        />
        <Stack.Screen
          name="LikersAndViewers"
          component={LikersAndViewers}
          options={({ navigation, route }) => ({
            title: route.params.title,
            headerTransparent: true,
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons
                  style={[styles.icon, { marginLeft: 20 }]}
                  name={"ios-close"}
                  size={40}
                  color="white"
                />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="FullScreenImage"
          component={FullScreenImage}
          options={({ navigation, route }) => ({
            headerTransparent: true,
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons
                  style={[styles.icon, { marginLeft: 20 }]}
                  name={"ios-close"}
                  size={40}
                  color="white"
                />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="Edit"
          component={EditScreen}
          options={({ navigation, route }) => ({
            headerShown: false,
          })}
        />
        <Stack.Screen
          name="BlockedUsers"
          component={BlockedUsers}
          options={({ navigation, route }) => ({
            title: "Blocked accounts",
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons
                  style={[styles.icon, { marginLeft: 20 }]}
                  name={"ios-arrow-back"}
                  size={30}
                />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="Reset"
          component={Reset}
          options={({ navigation, route }) => ({
            headerTransparent: true,
            title: " ",
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons
                  style={[
                    styles.icon,
                    { marginLeft: 20, color: "rgb(255,255,255)" },
                  ]}
                  name={"ios-arrow-back"}
                  size={30}
                />
              </TouchableOpacity>
            ),
            headerStyle: { backgroundColor: "transparent" },
          })}
        />
        <Stack.Screen
          name="Dash"
          component={DashScreen}
          options={({ navigation, route }) => ({
            headerTransparent: true,
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons
                  style={[styles.icon, { marginLeft: 20 }]}
                  name={"ios-arrow-back"}
                  size={30}
                />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="MyFollowersAndFollowing"
          component={MyFollowersAndFollowing}
          options={({ navigation, route }) => ({
            headerTransparent: true,
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons
                  style={[styles.icon, { marginLeft: 20 }]}
                  name={"ios-arrow-back"}
                  size={30}
                />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={({ navigation, route }) => ({
            headerShown: false,
          })}
        />
        <Stack.Screen
          name="ViewProfile"
          component={ViewProfileScreen}
          options={({ navigation, route }) => ({
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons
                  style={[styles.icon, { marginLeft: 20, color: "#000" }]}
                  name={"ios-arrow-back"}
                  size={30}
                />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={({ navigation, route }) => ({
            headerTransparent: true,
            title: " ",
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons
                  style={[styles.icon, { marginLeft: 20 }]}
                  name={"ios-arrow-back"}
                  size={30}
                />
              </TouchableOpacity>
            ),
            headerStyle: { backgroundColor: "transparent" },
          })}
        />
        <Stack.Screen
          name="Signup"
          component={SignupScreen}
          options={({ navigation, route }) => ({
            headerTransparent: true,
            title: " ",
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons
                  style={[styles.icon, { marginLeft: 20, color: "#000" }]}
                  name={"ios-arrow-back"}
                  size={30}
                />
              </TouchableOpacity>
            ),
            headerStyle: { backgroundColor: "transparent" },
          })}
        />

        <Stack.Screen
          name="WelcomeScreen"
          component={WelcomeScreen}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    );
  };

  const TabNavigator = () => {
    return (
      <Tab.Navigator>
        <Tab.Screen
          screenOptions={({ route }) => ({
            headerTransparent: true,
            tabBarLabel: " ",
            tabBarIcon: ({ focused, color, size }) => (
              <MaterialCommunityIcons
                color={"white"}
                name={focused ? "home" : "home-outline"}
                size={32}
              />
            ),
          })}
          name="Home"
          component={HomeNavigator}
        />
        <Tab.Screen
          screenOptions={({ route }) => ({
            headerTransparent: true,
            tabBarLabel: " ",
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons
                color={"white"}
                name={focused ? "md-search" : "ios-search"}
                size={32}
              />
            ),
          })}
          name="Search"
          component={SearchNavigator}
        />
        <Tab.Screen
          screenOptions={({ route }) => ({
            headerTransparent: true,
            tabBarLabel: " ",
            tabBarIcon: ({ focused, color, size }) => (
              <Image
                style={[
                  styles.profileLogo,
                  { transform: [{ rotate: "90deg" }, { scale: 1.2 }] },
                ]}
                source={require("../../assets/logo-3.png")}
              />
            ),
          })}
          name="Post"
          component={PostNavigator}
        />
        <Tab.Screen
          screenOptions={({ route }) => ({
            headerTransparent: true,
            tabBarLabel: " ",
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons
                color={"white"}
                name={focused ? "ios-heart" : "ios-heart-empty"}
                size={32}
              />
            ),
          })}
          name="Activity"
          component={ActivityNavigator}
        />
        <Tab.Screen
          screenOptions={({ route }) => ({
            headerTransparent: true,
            tabBarLabel: " ",
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons
                color={"white"}
                name={focused ? "ios-heart" : "ios-heart-empty"}
                size={32}
              />
            ),
          })}
          name="MyProfile"
          component={MyProfile}
        />
      </Tab.Navigator>
    );
  };

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Auth" component={AuthStack} />
        <Stack.Screen name="Home" component={TabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default connect()(RootNavigator);
