import * as React from "react";
import {
  Button,
  Text,
  View,
  Platform,
  StatusBar,
  Image,
  TouchableOpacity,
} from "react-native";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Splash from "../../screens/Splash";
import Login from "../../screens/login";
import SignupScreen from "../../screens/signup";
import HomeScreen from "../../screens/Home";
import PostReportScreen from "../../screens/PostReports";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import SearchScreen from "../../screens/Search";
import SearchUsersScreen from "../../screens/SearchUsers";
import FilterScreen from "../../screens/Filter";
import PostScreen from "../../screens/Post";
import VideoCover from "../../screens/videocover";
import ChannelsScreen from "../../screens/Channels";

// import CropperPage from "../../screens/CropperPage";

import PostCaptions from "../../screens/PostCaption";

import ActivityScreen from "../../screens/Activity";
import ActivitiesTab from "../../screens/activitiestab";

import ProfileScreen from "../../screens/Profile";
import ViewProfileScreen from "../../screens/ViewProfile";

import BlockedUsers from "../../screens/BlockedUsers";

import CameraScreen from "../../component/CameraView";
import FullScreenImage from "../../component/FullScreenImage";
import Reset from "../../screens/Reset";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome,
  Feather,
} from "@expo/vector-icons";
import MapScreen from "../../screens/Map";
import EditScreen from "../../screens/signup";
import DashScreen from "../../screens/Dash";
import CommentScreen from "../../screens/Comment";
import NewMessage from "../../screens/NewMessage";
// import PostReportScreen from "../../screens/PostReports";
import ChatScreen from "../../screens/Chat";
import PayScreen from "../../screens/Pay";
import MessagesScreen from "../../screens/Messages";
import PostListScreen from "../../screens/PostList";
import MyFollowersAndFollowing from "../../screens/MyFollowersAndFollowing";
import LikersAndViewers from "../../screens/LikersAndViewers";
import WelcomeScreen from "../../screens/WelcomeScreen";
// import { createAppContainer, createStackNavigator } from "react-navigation";
import styles from "../../styles";
import Scale from "../../helpers/Scale";

import Add from "../../screens/Add";
import constants from "../../constants";

const AuthStack = createStackNavigator();
const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#ffffff",
  },
};
function AuthNavigator() {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen
        name="Splash"
        component={Splash}
        options={{ headerShown: false }}
      />
      <AuthStack.Screen
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
      <AuthStack.Screen
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
      <AuthStack.Screen
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
    </AuthStack.Navigator>
  );
}

const HomeStack = createStackNavigator();

function HomeNavigator({ navigation, route }) {
  // alert(JSON.stringify(route));
  var tabBarVisible = false;

  tabBarVisible = route.state ? (route.state.index > 0 ? false : true) : null;

  navigation.setOptions({
    tabBarVisible: tabBarVisible,
  });
  return (
    <HomeStack.Navigator>
      {/* <AuthStack.Screen
        name="Splash"
        component={Splash}
        options={{ headerShown: false }}
      /> */}
      <HomeStack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
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

      <HomeStack.Screen
        name="Comment"
        component={CommentScreen}
        options={({ navigation, route }) => ({
          title: route.params.username,
          headerShown: true,
          headerTransparent: true,
          headerTintColor: "#fff",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons
                style={[styles.icon, { marginLeft: 20, color: "#fff" }]}
                name={"ios-arrow-back"}
                size={30}
              />
            </TouchableOpacity>
          ),
        })}
      />

      <HomeStack.Screen
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

      <HomeStack.Screen
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

      <HomeStack.Screen
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

      <HomeStack.Screen
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

      <HomeStack.Screen
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

      <HomeStack.Screen
        name="Camera"
        component={CameraScreen}
        options={{
          headerShown: false,
        }}
      />

      <HomeStack.Screen
        name="PostDetail"
        component={PostScreen}
        options={PostScreen.navigationOptions}
      />

      <HomeStack.Screen name="PostCaption" component={PostCaptions} />

      <HomeStack.Screen
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

      <HomeStack.Screen
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

      <HomeStack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: false,
        }}
      />

      <HomeStack.Screen
        name="ViewProfile"
        component={ViewProfileScreen}
        options={ViewProfileScreen.navigationOptions}
        // options={({ navigation, route }) => ({
        //   headerLeft: () => (
        //     <TouchableOpacity onPress={() => navigation.goBack()}>
        //       <Ionicons
        //         style={[styles.icon, { marginLeft: 20, color: "#000" }]}
        //         name={"ios-arrow-back"}
        //         size={30}
        //       />
        //     </TouchableOpacity>
        //   ),
        // })}
      />

      <HomeStack.Screen
        name="PostListScreen"
        component={PostListScreen}
        options={{
          headerShown: false,
        }}
      />

      <HomeStack.Screen
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

      <HomeStack.Screen
        name="Login"
        component={Login}
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
      <AuthStack.Screen
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
      <HomeStack.Screen
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

      <HomeStack.Screen
        name="WelcomeScreen"
        component={WelcomeScreen}
        options={{
          headerShown: false,
        }}
      />
    </HomeStack.Navigator>
  );
}

const SearchStack = createStackNavigator();

function SearchNavigator({ navigation, route }) {
  // navigation.setOptions({
  //   tabBarVisible: route.state ? (route.state.index > 0 ? false : true) : null,
  // });
  const routeName = getFocusedRouteNameFromRoute(route);
  var tabBarVisible = false;

  tabBarVisible = route.state ? (route.state.index > 0 ? false : true) : null;

  // alert(routeName);
  if (routeName === "ChannelPostScreen") {
    tabBarVisible = true;
  }

  navigation.setOptions({
    tabBarVisible: tabBarVisible,
  });
  return (
    <SearchStack.Navigator>
      {/* <SearchStack.Screen
        name="Search"
        component={SearchScreen}
        options={({ navigation, route }) => ({
          headerTitle: (
            props // App Logo
          ) => (
            <Image
              style={[
                styles.logoHeader,
                {
                  width: 150,
                  height: 55,
                  transform: [{ rotate: "90deg" }],
                },
              ]}
              source={require("../../assets/logo-1.png")}
              resizeMode="contain"
            />
          ),
          // Center the header title on Android
          headerTitleAlign: "center",
          // headerTransparent: true,
        })}
      /> */}
      <SearchStack.Screen
        name="Search"
        component={ChannelsScreen}
        options={({ navigation, route }) => ({
          headerTitle: (
            props // App Logo
          ) => (
            <Image
              style={[
                styles.logoHeader,
                {
                  width: 150,
                  height: 55,
                  // transform: [{ rotate: "90deg" }],
                },
              ]}
              source={require("../../assets/logo.png")}
              resizeMode="contain"
            />
          ),
          // Center the header title on Android
          headerTitleAlign: "center",
          // headerTransparent: true,
        })}
      />
      <SearchStack.Screen
        name="SearchUsers"
        component={SearchUsersScreen}
        options={({ navigation, route }) => ({
          headerShown: false,
        })}
      />
      <SearchStack.Screen
        name="Channels"
        component={ChannelsScreen}
        options={({ navigation, route }) => ({
          headerTitle: (
            props // App Logo
          ) => (
            <Image
              style={[
                styles.logoHeader,
                {
                  width: 150,
                  height: 55,
                  transform: [{ rotate: "90deg" }],
                },
              ]}
              source={require("../../assets/logo-2.png")}
              resizeMode="contain"
            />
          ),
          // Center the header title on Android
          headerTitleAlign: "center",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons
                style={[styles.icon, { marginLeft: 20 }]}
                name={"ios-arrow-back"}
                size={30}
              />
            </TouchableOpacity>
          ),
          // headerTransparent: true,
        })}
      />
      <SearchStack.Screen
        name="Comment"
        component={CommentScreen}
        options={({ navigation, route }) => ({
          title: route.params.username,
          headerShown: true,
          headerTransparent: true,
          headerTintColor: "#fff",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons
                style={[styles.icon, { marginLeft: 20, color: "#fff" }]}
                name={"ios-arrow-back"}
                size={30}
              />
            </TouchableOpacity>
          ),
        })}
      />
      <SearchStack.Screen
        name="Profile"
        component={ProfileScreen}
        options={({ navigation, route }) => ({
          headerShown: false,
        })}
      />
      <SearchStack.Screen
        name="ViewProfile"
        component={ViewProfileScreen}
        options={ViewProfileScreen.navigationOptions}
      />
      <SearchStack.Screen
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
      <SearchStack.Screen
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
      <SearchStack.Screen
        name="PostListScreen"
        component={PostListScreen}
        options={({ navigation, route }) => ({
          headerShown: false,
        })}
      />
      <SearchStack.Screen
        name="ChannelPostScreen"
        component={PostListScreen}
        options={({ navigation, route }) => ({
          headerShown: false,
        })}
      />
      <SearchStack.Screen
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
      <SearchStack.Screen
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
      <SearchStack.Screen
        name="WelcomeScreen"
        component={WelcomeScreen}
        options={{
          headerShown: false,
        }}
      />
    </SearchStack.Navigator>
  );
}

const PostStack = createStackNavigator();

function PostNavigator() {
  return (
    <PostStack.Navigator>
      <PostStack.Screen
        name="Post"
        component={Add}
        options={({ navigation, route }) => ({
          headerShown: false,
          title: "",
        })}
      />
      <PostStack.Screen
        name="PostDetail"
        component={PostScreen}
        options={PostScreen.navigationOptions}

        // options={({ navigation, route }) => ({
        //   headerTransparent: true,
        // })}
      />
      <PostStack.Screen
        name="Comment"
        component={CommentScreen}
        options={({ navigation, route }) => ({
          title: route.params.username,
          headerShown: true,
          headerTransparent: true,
          headerTintColor: "#fff",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons
                style={[styles.icon, { marginLeft: 20, color: "#fff" }]}
                name={"ios-arrow-back"}
                size={30}
              />
            </TouchableOpacity>
          ),
        })}
      />
      <PostStack.Screen
        name="VideoCover"
        component={VideoCover}
        options={VideoCover.navigationOptions}
        // options={({ navigation, route }) => ({
        //   title: "Choose Video Cover",
        //   gesturesEnabled: false,
        // })}
      />

      <PostStack.Screen
        name="PostCaption"
        component={PostCaptions}
        options={({ navigation, route }) => ({
          title: "Post Caption",
          headerTintColor: constants.colors.superRed,
        })}
      />

      <PostStack.Screen
        name="Login"
        component={Login}
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
      <AuthStack.Screen
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
      <PostStack.Screen
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
      <PostStack.Screen
        name="WelcomeScreen"
        component={WelcomeScreen}
        options={{
          headerShown: false,
        }}
      />
    </PostStack.Navigator>
  );
}

const ActivityStack = createStackNavigator();

function ActivityNavigator({ navigation, route }) {
  navigation.setOptions({
    tabBarVisible: route.state ? (route.state.index > 0 ? false : true) : null,
  });
  return (
    <ActivityStack.Navigator>
      <ActivityStack.Screen
        name="ActivitiesTab"
        component={ActivitiesTab}
        options={({ navigation, route }) => ({
          title: "Activities",
          headerShown: false,
        })}
      />
      {/* <ActivityStack.Screen
        name="Activity"
        component={ActivityScreen}
        options={({ navigation, route }) => ({
          title: "Activities",
        })}
      /> */}
      <AuthStack.Screen
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
      <ActivityStack.Screen
        name="Login"
        component={Login}
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
      <ActivityStack.Screen
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
      <ActivityStack.Screen
        name="Comment"
        component={CommentScreen}
        options={({ navigation, route }) => ({
          title: route.params.username,
          headerShown: true,
          headerTransparent: true,
          headerTintColor: "#fff",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons
                style={[styles.icon, { marginLeft: 20, color: "#fff" }]}
                name={"ios-arrow-back"}
                size={30}
              />
            </TouchableOpacity>
          ),
        })}
      />
      <ActivityStack.Screen
        name="Profile"
        component={ProfileScreen}
        options={({ navigation, route }) => ({
          headerShown: false,
        })}
      />
      <ActivityStack.Screen
        name="ViewProfile"
        component={ViewProfileScreen}
        options={ViewProfileScreen.navigationOptions}
      />
      <ActivityStack.Screen
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
      <ActivityStack.Screen
        name="PostListScreen"
        component={PostListScreen}
        options={({ navigation, route }) => ({
          headerShown: false,
        })}
      />
      <ActivityStack.Screen
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

      <ActivityStack.Screen
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

      <ActivityStack.Screen
        name="WelcomeScreen"
        component={WelcomeScreen}
        options={{
          headerShown: false,
        }}
      />
    </ActivityStack.Navigator>
  );
}

const ProfileStack = createStackNavigator();

function ProfileNavigator({ navigation, route }) {
  navigation.setOptions({
    tabBarVisible: route.state ? (route.state.index > 0 ? false : true) : null,
  });
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        name="MyProfile"
        component={ProfileScreen}
        options={({ navigation, route }) => ({
          headerShown: false,
        })}
      />
      {/* <ProfileStack.Screen
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
      /> */}
      <ProfileStack.Screen
        name="Comment"
        component={CommentScreen}
        options={({ navigation, route }) => ({
          title: route.params.username,
          headerShown: true,
          headerTransparent: true,
          headerTintColor: "#fff",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons
                style={[styles.icon, { marginLeft: 20, color: "#fff" }]}
                name={"ios-arrow-back"}
                size={30}
              />
            </TouchableOpacity>
          ),
        })}
      />
      <ProfileStack.Screen
        name="PostListScreen"
        component={PostListScreen}
        options={({ navigation, route }) => ({
          headerShown: false,
        })}
      />
      <ProfileStack.Screen
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
      <ProfileStack.Screen
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
      <ProfileStack.Screen
        name="Edit"
        component={EditScreen}
        options={({ navigation, route }) => ({
          headerShown: false,
        })}
      />
      <ProfileStack.Screen
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
      <ProfileStack.Screen
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
      <ProfileStack.Screen
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
      <ProfileStack.Screen
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
      <ProfileStack.Screen
        name="Profile"
        component={ProfileScreen}
        options={({ navigation, route }) => ({
          headerShown: false,
        })}
      />

      <ProfileStack.Screen
        name="ViewProfile"
        component={ViewProfileScreen}
        options={ViewProfileScreen.navigationOptions}
      />

      <ProfileStack.Screen
        name="Login"
        component={Login}
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

      <ProfileStack.Screen
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
      <ProfileStack.Screen
        name="WelcomeScreen"
        component={WelcomeScreen}
        options={{
          headerShown: false,
        }}
      />
    </ProfileStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

function TabNavigator({ navigation, route }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            return (
              <MaterialCommunityIcons
                style={styles.iconshadowandroid}
                color={focused ? "#db565b" : "#fff"}
                name={focused ? "home" : "home-outline"}
                size={32}
              />
            );
          } else if (route.name === "Search") {
            return (
              <Feather
                style={styles.iconshadowandroid}
                color={focused ? "#db565b" : "#fff"}
                name={focused ? "tv" : "tv"}
                size={32}
              />
            );
          } else if (route.name === "Post") {
            return (
              <Image
                style={[styles.profileLogo, { transform: [{ scale: 1.2 }] }]}
                source={constants.images.appLogo}
              />
            );
          } else if (route.name === "Activity") {
            return (
              <Ionicons
                style={styles.iconshadowandroid}
                color={focused ? "#db565b" : "#fff"}
                name={focused ? "ios-heart" : "ios-heart-empty"}
                size={32}
              />
            );
          } else if (route.name === "MyProfile") {
            return (
              <FontAwesome
                style={styles.iconshadowandroid}
                color={focused ? "#db565b" : "#fff"}
                name={focused ? "user" : "user-o"}
                size={32}
              />
            );
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        style: {
          backgroundColor: "transparent",
          // opacity: 0.4,
          position: "absolute",
          activeTintColor: "#db565b",
          inactiveTintColor: "#fff",
          borderTopWidth: 0,
          shadowOpacity: 0.5,
          elevation: 0,
          ...Platform.select({
            ios: {
              height: Scale.moderateScale(95),
            },
            android: {
              // ...styles.androidshadow,
              height: Scale.moderateScale(75),
            },
          }),
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeNavigator}
        options={({ navigation, route }) => ({
          tabBarLabel: "",
        })}
      />
      <Tab.Screen
        name="Search"
        component={SearchNavigator}
        options={{
          tabBarLabel: "",
        }}
      />
      <Tab.Screen
        name="Post"
        component={PostNavigator}
        options={{
          tabBarLabel: "",
          tabBarVisible: false,
        }}
      />
      <Tab.Screen
        name="Activity"
        component={ActivityNavigator}
        options={{
          tabBarLabel: "",
        }}
      />
      <Tab.Screen
        name="MyProfile"
        component={ProfileNavigator}
        options={{
          tabBarLabel: "",
        }}
      />

      {/* <HomeNavigator /> */}
    </Tab.Navigator>
  );
}
const SwitchStack = createStackNavigator();

export default function RootNavigator() {
  return (
    <NavigationContainer theme={MyTheme}>
      {/* <TabNavigator /> */}
      <SwitchStack.Navigator screenOptions={{ headerShown: false }}>
        <SwitchStack.Screen name="Auth" component={AuthNavigator} />
        <SwitchStack.Screen name="Home" component={TabNavigator} />
      </SwitchStack.Navigator>
    </NavigationContainer>
  );
}
{
  /* <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator> */
}
// import React, { useState, useEffect } from "react";
// import { createStackNavigator } from "@react-navigation/stack";
// import { NavigationContainer } from "@react-navigation/native";
// import Splash from "../../screens/Splash";
// import Login from "../../screens/Login";
// import SignupScreen from "../../screens/Signup";

// import HomeScreen from "../../screens/Home";
// import SearchScreen from "../../screens/Search";
// import FilterScreen from "../../screens/Filter";
// import PostScreen from "../../screens/Post";
// import VideoCover from "../../screens/videocover";
// import CropperPage from "../../screens/CropperPage";

// import PostCaptions from "../../screens/PostCaption";

// import ActivityScreen from "../../screens/Activity";
// import ProfileScreen from "../../screens/Profile";
// import ViewProfileScreen from "../../screens/ViewProfile";

// import BlockedUsers from "../../screens/BlockedUsers";

// // import CameraScreen from "../screens/Camera";
// import CameraScreen from "../../component/CameraView";
// import FullScreenImage from "../../component/FullScreenImage";
// import Reset from "../../screens/Reset";

// import MapScreen from "../../screens/Map";
// import EditScreen from "../../screens/Signup";
// import DashScreen from "../../screens/Dash";
// import CommentScreen from "../../screens/Comment";
// import NewMessage from "../../screens/NewMessage";
// import PostReportScreen from "../../screens/PostReports";
// import ChatScreen from "../../screens/Chat";
// import PayScreen from "../../screens/Pay";
// import MessagesScreen from "../../screens/Messages";
// import PostListScreen from "../../screens/PostList";
// import MyFollowersAndFollowing from "../../screens/MyFollowersAndFollowing";
// import LikersAndViewers from "../../screens/LikersAndViewers";
// import WelcomeScreen from "../../screens/WelcomeScreen";
// // import { createAppContainer, createStackNavigator } from "react-navigation";

// import Add from "../../screens/Add";

// import {
//   Text,
//   View,
//   Platform,
//   StatusBar,
//   Image,
//   TouchableOpacity,
// } from "react-native";

// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// import {
//   Ionicons,
//   MaterialCommunityIcons,
//   FontAwesome,
// } from "@expo/vector-icons";
// import styles from "../../styles";

// const Stack = createStackNavigator();
// const Tab = createBottomTabNavigator();
// function RootNavigator() {
//   const [initialRoute, setInitialRoute] = useState("Home");

//   const AuthStack = () => {
//     return (
//       <Stack.Navigator>
//         <Stack.Screen
//           name="Splash"
//           component={Splash}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="login"
//           header={null}
//           component={Login}
//           options={({ navigation, route }) => ({
//             title: " ",
//             headerTransparent: true,
//             headerLeft: () => (
//               <TouchableOpacity onPress={() => navigation.goBack()}>
//                 <Ionicons
//                   style={[
//                     styles.icon,
//                     { marginLeft: 20, color: "rgb(255,255,255)" },
//                   ]}
//                   name={"ios-arrow-back"}
//                   size={30}
//                 />
//               </TouchableOpacity>
//             ),
//             headerStyle: { backgroundColor: "transparent" },
//           })}
//         />
//         <Stack.Screen
//           name="Signup"
//           header={null}
//           component={SignupScreen}
//           options={({ navigation, route }) => ({
//             title: " ",
//             headerTransparent: true,
//             headerLeft: () => (
//               <TouchableOpacity onPress={() => navigation.goBack()}>
//                 <Ionicons
//                   style={[
//                     styles.icon,
//                     { marginLeft: 20, color: "rgb(255,255,255)" },
//                   ]}
//                   name={"ios-arrow-back"}
//                   size={30}
//                 />
//               </TouchableOpacity>
//             ),
//             headerStyle: { backgroundColor: "transparent" },
//           })}
//         />
//         <Stack.Screen
//           name="Reset"
//           component={Reset}
//           options={({ navigation, route }) => ({
//             title: " ",
//             headerTransparent: true,
//             headerLeft: () => (
//               <TouchableOpacity onPress={() => navigation.goBack()}>
//                 <Ionicons
//                   style={[
//                     styles.icon,
//                     { marginLeft: 20, color: "rgb(255,255,255)" },
//                   ]}
//                   name={"ios-arrow-back"}
//                   size={30}
//                 />
//               </TouchableOpacity>
//             ),
//             headerStyle: { backgroundColor: "transparent" },
//           })}
//         />
//       </Stack.Navigator>
//     );
//   };

//   const HomeNavigator = () => {
//     return (
//       <Stack.Navigator>
//         <Stack.Screen
//           name="Splash"
//           component={HomeScreen}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="FullScreenImage"
//           header={null}
//           component={FullScreenImage}
//           options={({ navigation, route }) => ({
//             title: " ",
//             headerTransparent: true,
//             headerLeft: () => (
//               <TouchableOpacity onPress={() => navigation.goBack()}>
//                 <Ionicons
//                   style={[styles.icon, { marginLeft: 20 }]}
//                   name={"ios-close"}
//                   size={40}
//                   color="white"
//                 />
//               </TouchableOpacity>
//             ),
//           })}
//         />
//         <Stack.Screen
//           name="Comment"
//           component={CommentScreen}
//           options={({ navigation, route }) => ({
//             title: route.params.username,
//             headerLeft: () => (
//               <TouchableOpacity onPress={() => navigation.goBack()}>
//                 <Ionicons
//                   style={[styles.icon, { marginLeft: 20 }]}
//                   name={"ios-arrow-back"}
//                   size={30}
//                 />
//               </TouchableOpacity>
//             ),
//           })}
//         />
//         <Stack.Screen
//           name="PostReport"
//           component={PostReportScreen}
//           options={({ navigation, route }) => ({
//             title: "Post Reports",
//             headerTransparent: true,
//             headerLeft: () => (
//               <TouchableOpacity onPress={() => navigation.goBack()}>
//                 <Ionicons
//                   style={[styles.icon, { marginLeft: 20 }]}
//                   name={"ios-arrow-back"}
//                   size={30}
//                 />
//               </TouchableOpacity>
//             ),
//           })}
//         />
//         <Stack.Screen
//           name="Map"
//           component={MapScreen}
//           options={({ navigation, route }) => ({
//             title: "Map View",
//             headerTransparent: true,
//             headerLeft: () => (
//               <TouchableOpacity onPress={() => navigation.goBack()}>
//                 <Ionicons
//                   style={[styles.icon, { marginLeft: 20 }]}
//                   name={"ios-arrow-back"}
//                   size={30}
//                 />
//               </TouchableOpacity>
//             ),
//           })}
//         />
//         <Stack.Screen
//           name="Messages"
//           component={MessagesScreen}
//           options={({ navigation, route }) => ({
//             title: "Messages",
//             headerLeft: () => (
//               <TouchableOpacity onPress={() => navigation.goBack()}>
//                 <Ionicons
//                   style={[styles.icon, { marginLeft: 20 }]}
//                   name={"ios-arrow-back"}
//                   size={30}
//                 />
//               </TouchableOpacity>
//             ),
//           })}
//         />
//         <Stack.Screen
//           name="NewMessage"
//           component={NewMessage}
//           options={({ navigation, route }) => ({
//             title: "New Message",
//             headerLeft: () => (
//               <TouchableOpacity onPress={() => navigation.goBack()}>
//                 <Ionicons
//                   style={[styles.icon, { marginLeft: 20 }]}
//                   name={"ios-arrow-back"}
//                   size={30}
//                 />
//               </TouchableOpacity>
//             ),
//           })}
//         />
//         <Stack.Screen
//           name="Chat"
//           component={ChatScreen}
//           options={({ navigation, route }) => ({
//             title: route.params.title,
//             headerLeft: () => (
//               <TouchableOpacity onPress={() => navigation.goBack()}>
//                 <Ionicons
//                   style={[styles.icon, { marginLeft: 20 }]}
//                   name={"ios-arrow-back"}
//                   size={30}
//                 />
//               </TouchableOpacity>
//             ),
//           })}
//         />
//         <Stack.Screen
//           name="Camera"
//           component={CameraScreen}
//           options={{
//             headerShown: false,
//           }}
//         />
//         <Stack.Screen
//           name="PostDetail"
//           component={PostScreen}
//           options={{
//             headerTransparent: true,
//             gesturesEnabled: false,
//           }}
//         />
//         <Stack.Screen name="PostCaption" component={PostCaptions} />
//         <Stack.Screen
//           name="Pay"
//           component={PayScreen}
//           options={({ navigation, route }) => ({
//             headerTransparent: true,
//             headerLeft: () => (
//               <TouchableOpacity onPress={() => navigation.goBack()}>
//                 <Ionicons
//                   style={[styles.icon, { marginLeft: 20 }]}
//                   name={"ios-arrow-back"}
//                   size={30}
//                 />
//               </TouchableOpacity>
//             ),
//           })}
//         />
//         <Stack.Screen
//           name="MyFollowersAndFollowing"
//           component={MyFollowersAndFollowing}
//           options={({ navigation, route }) => ({
//             headerTransparent: true,
//             headerLeft: () => (
//               <TouchableOpacity onPress={() => navigation.goBack()}>
//                 <Ionicons
//                   style={[styles.icon, { marginLeft: 20 }]}
//                   name={"ios-arrow-back"}
//                   size={30}
//                 />
//               </TouchableOpacity>
//             ),
//           })}
//         />
//         <Stack.Screen
//           name="Profile"
//           component={ProfileScreen}
//           options={{
//             headerShown: false,
//           }}
//         />
//         <Stack.Screen
//           name="ViewProfile"
//           component={ViewProfileScreen}
//           options={({ navigation, route }) => ({
//             headerLeft: () => (
//               <TouchableOpacity onPress={() => navigation.goBack()}>
//                 <Ionicons
//                   style={[styles.icon, { marginLeft: 20, color: "#000" }]}
//                   name={"ios-arrow-back"}
//                   size={30}
//                 />
//               </TouchableOpacity>
//             ),
//           })}
//         />
//         <Stack.Screen
//           name="PostListScreen"
//           component={PostListScreen}
//           options={{
//             headerShown: false,
//           }}
//         />
//         <Stack.Screen
//           name="LikersAndViewers"
//           component={LikersAndViewers}
//           options={({ navigation, route }) => ({
//             title: route.params.title,
//             headerTransparent: true,
//             headerLeft: () => (
//               <TouchableOpacity onPress={() => navigation.goBack()}>
//                 <Ionicons
//                   style={[styles.icon, { marginLeft: 20 }]}
//                   name={"ios-arrow-back"}
//                   size={30}
//                 />
//               </TouchableOpacity>
//             ),
//           })}
//         />
//         <Stack.Screen
//           name="Login"
//           component={Login}
//           options={({ navigation, route }) => ({
//             headerTransparent: true,
//             title: " ",
//             headerLeft: () => (
//               <TouchableOpacity onPress={() => navigation.goBack()}>
//                 <Ionicons
//                   style={[styles.icon, { marginLeft: 20 }]}
//                   name={"ios-arrow-back"}
//                   size={30}
//                 />
//               </TouchableOpacity>
//             ),
//             headerStyle: { backgroundColor: "transparent" },
//           })}
//         />
//         <Stack.Screen
//           name="Signup"
//           component={SignupScreen}
//           options={({ navigation, route }) => ({
//             headerTransparent: true,
//             title: " ",
//             headerLeft: () => (
//               <TouchableOpacity onPress={() => navigation.goBack()}>
//                 <Ionicons
//                   style={[styles.icon, { marginLeft: 20, color: "#000" }]}
//                   name={"ios-arrow-back"}
//                   size={30}
//                 />
//               </TouchableOpacity>
//             ),
//             headerStyle: { backgroundColor: "transparent" },
//           })}
//         />
//         <Stack.Screen
//           name="WelcomeScreen"
//           component={WelcomeScreen}
//           options={{
//             headerShown: false,
//           }}
//         />
//       </Stack.Navigator>
//     );
//   };

//   const SearchNavigator = () => {
//     return (
//       <Stack.Navigator>
//         <Stack.Screen
//           name="Search"
//           component={SearchScreen}
//           options={({ navigation, route }) => ({
//             headerTitle: (
//               props // App Logo
//             ) => (
//               <Image
//                 style={[styles.logoHeader, { width: 150, height: 55 }]}
//                 source={require("../../assets/logo.png")}
//                 resizeMode="contain"
//               />
//             ),
//             headerTransparent: true,
//           })}
//         />

//         <Stack.Screen
//           name="Comment"
//           component={CommentScreen}
//           options={({ navigation, route }) => ({
//             headerTransparent: true,
//             title: route.params.username,
//             headerLeft: () => (
//               <TouchableOpacity onPress={() => navigation.goBack()}>
//                 <Ionicons
//                   style={[styles.icon, { marginLeft: 20 }]}
//                   name={"ios-arrow-back"}
//                   size={30}
//                 />
//               </TouchableOpacity>
//             ),
//           })}
//         />
//         <Stack.Screen
//           name="Profile"
//           component={ProfileScreen}
//           options={({ navigation, route }) => ({
//             headerShown: false,
//           })}
//         />
//         <Stack.Screen
//           name="ViewProfile"
//           component={ViewProfileScreen}
//           options={({ navigation, route }) => ({
//             title: "Post Reports",
//             headerTransparent: true,
//             headerLeft: () => (
//               <TouchableOpacity onPress={() => navigation.goBack()}>
//                 <Ionicons
//                   style={[styles.icon, { marginLeft: 20, color: "#000" }]}
//                   name={"ios-arrow-back"}
//                   size={30}
//                 />
//               </TouchableOpacity>
//             ),
//           })}
//         />
//         <Stack.Screen
//           name="MyFollowersAndFollowing"
//           component={MyFollowersAndFollowing}
//           options={({ navigation, route }) => ({
//             headerTransparent: true,
//             headerLeft: () => (
//               <TouchableOpacity onPress={() => navigation.goBack()}>
//                 <Ionicons
//                   style={[styles.icon, { marginLeft: 20 }]}
//                   name={"ios-arrow-back"}
//                   size={30}
//                 />
//               </TouchableOpacity>
//             ),
//           })}
//         />
//         <Stack.Screen
//           name="Filter"
//           component={FilterScreen}
//           options={({ navigation, route }) => ({
//             headerTransparent: true,
//             headerLeft: () => (
//               <TouchableOpacity onPress={() => navigation.goBack()}>
//                 <Ionicons
//                   style={[styles.icon, { marginLeft: 20 }]}
//                   name={"ios-arrow-back"}
//                   size={30}
//                 />
//               </TouchableOpacity>
//             ),
//           })}
//         />
//         <Stack.Screen
//           name="PostListScreen"
//           component={PostListScreen}
//           options={({ navigation, route }) => ({
//             headerShown: false,
//           })}
//         />
//         <Stack.Screen
//           name="LikersAndViewers"
//           component={LikersAndViewers}
//           options={({ navigation, route }) => ({
//             title: route.params.title,
//             headerLeft: () => (
//               <TouchableOpacity onPress={() => navigation.goBack()}>
//                 <Ionicons
//                   style={[styles.icon, { marginLeft: 20 }]}
//                   name={"ios-arrow-back"}
//                   size={30}
//                 />
//               </TouchableOpacity>
//             ),
//           })}
//         />
//         <Stack.Screen
//           name="FullScreenImage"
//           component={FullScreenImage}
//           options={{
//             headerTransparent: true,
//             headerLeft: () => (
//               <TouchableOpacity onPress={() => navigation.goBack()}>
//                 <Ionicons
//                   style={[styles.icon, { marginLeft: 20 }]}
//                   name={"ios-close"}
//                   size={40}
//                   color="white"
//                 />
//               </TouchableOpacity>
//             ),
//           }}
//         />
//         <Stack.Screen
//           name="WelcomeScreen"
//           component={WelcomeScreen}
//           options={{
//             headerShown: false,
//           }}
//         />
//       </Stack.Navigator>
//     );
//   };

//   const PostNavigator = () => {
//     return (
//       <Stack.Navigator>
//         <Stack.Screen
//           name="Post"
//           component={Add}
//           options={({ navigation, route }) => ({
//             headerShown: false,
//           })}
//         />
//         <Stack.Screen
//           name="PostDetail"
//           component={PostScreen}
//           options={({ navigation, route }) => ({
//             headerTransparent: true,
//           })}
//         />
//         <Stack.Screen
//           name="Comment"
//           component={CommentScreen}
//           options={({ navigation, route }) => ({
//             title: route.params.username,
//             headerLeft: () => (
//               <TouchableOpacity onPress={() => navigation.goBack()}>
//                 <Ionicons
//                   style={[styles.icon, { marginLeft: 20 }]}
//                   name={"ios-close"}
//                   size={40}
//                   color="white"
//                 />
//               </TouchableOpacity>
//             ),
//           })}
//         />
//         <Stack.Screen
//           name="VideoCover"
//           component={VideoCover}
//           options={({ navigation, route }) => ({
//             title: "Choose Video Cover",
//             gesturesEnabled: false,
//           })}
//         />
//         <Stack.Screen
//           name="PostCaption"
//           component={PostCaptions}
//           options={({ navigation, route }) => ({
//             title: "Post Caption",
//           })}
//         />
//         <Stack.Screen
//           name="Login"
//           component={Login}
//           options={({ navigation, route }) => ({
//             headerTransparent: true,
//             title: " ",
//             headerLeft: () => (
//               <TouchableOpacity onPress={() => navigation.goBack()}>
//                 <Ionicons
//                   style={[styles.icon, { marginLeft: 20 }]}
//                   name={"ios-arrow-back"}
//                   size={30}
//                 />
//               </TouchableOpacity>
//             ),
//             headerStyle: { backgroundColor: "transparent" },
//           })}
//         />
//         <Stack.Screen
//           name="Signup"
//           component={SignupScreen}
//           options={({ navigation, route }) => ({
//             headerTransparent: true,
//             title: " ",
//             headerLeft: () => (
//               <TouchableOpacity onPress={() => navigation.goBack()}>
//                 <Ionicons
//                   style={[styles.icon, { marginLeft: 20, color: "#000" }]}
//                   name={"ios-arrow-back"}
//                   size={30}
//                 />
//               </TouchableOpacity>
//             ),
//             headerStyle: { backgroundColor: "transparent" },
//           })}
//         />
//         <Stack.Screen
//           name="WelcomeScreen"
//           component={WelcomeScreen}
//           options={{
//             headerShown: false,
//           }}
//         />
//       </Stack.Navigator>
//     );
//   };

//   const ActivityNavigator = () => {
//     return (
//       <Stack.Navigator>
//         <Stack.Screen
//           name="Activity"
//           component={ActivityScreen}
//           options={({ navigation, route }) => ({
//             title: "Activity",
//           })}
//         />
//         <Stack.Screen
//           name="Login"
//           component={Login}
//           options={({ navigation, route }) => ({
//             headerTransparent: true,
//             title: " ",
//             headerLeft: () => (
//               <TouchableOpacity onPress={() => navigation.goBack()}>
//                 <Ionicons
//                   style={[styles.icon, { marginLeft: 20 }]}
//                   name={"ios-arrow-back"}
//                   size={30}
//                 />
//               </TouchableOpacity>
//             ),
//             headerStyle: { backgroundColor: "transparent" },
//           })}
//         />
//         <Stack.Screen
//           name="Signup"
//           component={SignupScreen}
//           options={({ navigation, route }) => ({
//             headerTransparent: true,
//             title: " ",
//             headerLeft: () => (
//               <TouchableOpacity onPress={() => navigation.goBack()}>
//                 <Ionicons
//                   style={[styles.icon, { marginLeft: 20, color: "#000" }]}
//                   name={"ios-arrow-back"}
//                   size={30}
//                 />
//               </TouchableOpacity>
//             ),
//             headerStyle: { backgroundColor: "transparent" },
//           })}
//         />
//         <Stack.Screen
//           name="Comment"
//           component={CommentScreen}
//           options={({ navigation, route }) => ({
//             title: route.params.username,
//             headerLeft: () => (
//               <TouchableOpacity onPress={() => navigation.goBack()}>
//                 <Ionicons
//                   style={[styles.icon, { marginLeft: 20 }]}
//                   name={"ios-close"}
//                   size={40}
//                   color="white"
//                 />
//               </TouchableOpacity>
//             ),
//           })}
//         />
//         <Stack.Screen
//           name="Profile"
//           component={ProfileScreen}
//           options={({ navigation, route }) => ({
//             headerShown: false,
//           })}
//         />
//         <Stack.Screen
//           name="ViewProfile"
//           component={ViewProfileScreen}
//           options={({ navigation, route }) => ({
//             headerLeft: () => (
//               <TouchableOpacity onPress={() => navigation.goBack()}>
//                 <Ionicons
//                   style={[styles.icon, { marginLeft: 20 }]}
//                   name={"ios-close"}
//                   size={40}
//                   color="white"
//                 />
//               </TouchableOpacity>
//             ),
//           })}
//         />
//         <Stack.Screen
//           name="MyFollowersAndFollowing"
//           component={MyFollowersAndFollowing}
//           options={({ navigation, route }) => ({
//             headerTransparent: true,
//             headerLeft: () => (
//               <TouchableOpacity onPress={() => navigation.goBack()}>
//                 <Ionicons
//                   style={[styles.icon, { marginLeft: 20 }]}
//                   name={"ios-close"}
//                   size={40}
//                   color="white"
//                 />
//               </TouchableOpacity>
//             ),
//           })}
//         />
//         <Stack.Screen
//           name="PostListScreen"
//           component={PostListScreen}
//           options={({ navigation, route }) => ({
//             headerShown: false,
//           })}
//         />
//         <Stack.Screen
//           name="LikersAndViewers"
//           component={LikersAndViewers}
//           options={({ navigation, route }) => ({
//             title: route.params.title,
//             headerTransparent: true,
//             headerLeft: () => (
//               <TouchableOpacity onPress={() => navigation.goBack()}>
//                 <Ionicons
//                   style={[styles.icon, { marginLeft: 20 }]}
//                   name={"ios-close"}
//                   size={40}
//                   color="white"
//                 />
//               </TouchableOpacity>
//             ),
//           })}
//         />
//         <Stack.Screen
//           name="FullScreenImage"
//           component={FullScreenImage}
//           options={({ navigation, route }) => ({
//             headerTransparent: true,
//             headerLeft: () => (
//               <TouchableOpacity onPress={() => navigation.goBack()}>
//                 <Ionicons
//                   style={[styles.icon, { marginLeft: 20 }]}
//                   name={"ios-close"}
//                   size={40}
//                   color="white"
//                 />
//               </TouchableOpacity>
//             ),
//           })}
//         />
//         <Stack.Screen
//           name="WelcomeScreen"
//           component={WelcomeScreen}
//           options={{
//             headerShown: false,
//           }}
//         />
//       </Stack.Navigator>
//     );
//   };

//   const ProfileNavigator = () => {
//     return (
//       <Stack.Navigator>
//         <Stack.Screen
//           name="MyProfile"
//           component={ProfileScreen}
//           options={({ navigation, route }) => ({
//             headerShown: false,
//           })}
//         />
//         <Stack.Screen
//           name="ViewProfile"
//           component={ViewProfileScreen}
//           options={({ navigation, route }) => ({
//             headerLeft: () => (
//               <TouchableOpacity onPress={() => navigation.goBack()}>
//                 <Ionicons
//                   style={[styles.icon, { marginLeft: 20 }]}
//                   name={"ios-close"}
//                   size={40}
//                   color="white"
//                 />
//               </TouchableOpacity>
//             ),
//           })}
//         />
//         <Stack.Screen
//           name="Comment"
//           component={CommentScreen}
//           options={({ navigation, route }) => ({
//             title: route.params.username,
//             headerLeft: () => (
//               <TouchableOpacity onPress={() => navigation.goBack()}>
//                 <Ionicons
//                   style={[styles.icon, { marginLeft: 20 }]}
//                   name={"ios-close"}
//                   size={40}
//                   color="white"
//                 />
//               </TouchableOpacity>
//             ),
//           })}
//         />
//         <Stack.Screen
//           name="PostListScreen"
//           component={PostListScreen}
//           options={({ navigation, route }) => ({
//             headerShown: false,
//           })}
//         />
//         <Stack.Screen
//           name="LikersAndViewers"
//           component={LikersAndViewers}
//           options={({ navigation, route }) => ({
//             title: route.params.title,
//             headerTransparent: true,
//             headerLeft: () => (
//               <TouchableOpacity onPress={() => navigation.goBack()}>
//                 <Ionicons
//                   style={[styles.icon, { marginLeft: 20 }]}
//                   name={"ios-close"}
//                   size={40}
//                   color="white"
//                 />
//               </TouchableOpacity>
//             ),
//           })}
//         />
//         <Stack.Screen
//           name="FullScreenImage"
//           component={FullScreenImage}
//           options={({ navigation, route }) => ({
//             headerTransparent: true,
//             headerLeft: () => (
//               <TouchableOpacity onPress={() => navigation.goBack()}>
//                 <Ionicons
//                   style={[styles.icon, { marginLeft: 20 }]}
//                   name={"ios-close"}
//                   size={40}
//                   color="white"
//                 />
//               </TouchableOpacity>
//             ),
//           })}
//         />
//         <Stack.Screen
//           name="Edit"
//           component={EditScreen}
//           options={({ navigation, route }) => ({
//             headerShown: false,
//           })}
//         />
//         <Stack.Screen
//           name="BlockedUsers"
//           component={BlockedUsers}
//           options={({ navigation, route }) => ({
//             title: "Blocked accounts",
//             headerLeft: () => (
//               <TouchableOpacity onPress={() => navigation.goBack()}>
//                 <Ionicons
//                   style={[styles.icon, { marginLeft: 20 }]}
//                   name={"ios-arrow-back"}
//                   size={30}
//                 />
//               </TouchableOpacity>
//             ),
//           })}
//         />
//         <Stack.Screen
//           name="Reset"
//           component={Reset}
//           options={({ navigation, route }) => ({
//             headerTransparent: true,
//             title: " ",
//             headerLeft: () => (
//               <TouchableOpacity onPress={() => navigation.goBack()}>
//                 <Ionicons
//                   style={[
//                     styles.icon,
//                     { marginLeft: 20, color: "rgb(255,255,255)" },
//                   ]}
//                   name={"ios-arrow-back"}
//                   size={30}
//                 />
//               </TouchableOpacity>
//             ),
//             headerStyle: { backgroundColor: "transparent" },
//           })}
//         />
//         <Stack.Screen
//           name="Dash"
//           component={DashScreen}
//           options={({ navigation, route }) => ({
//             headerTransparent: true,
//             headerLeft: () => (
//               <TouchableOpacity onPress={() => navigation.goBack()}>
//                 <Ionicons
//                   style={[styles.icon, { marginLeft: 20 }]}
//                   name={"ios-arrow-back"}
//                   size={30}
//                 />
//               </TouchableOpacity>
//             ),
//           })}
//         />
//         <Stack.Screen
//           name="MyFollowersAndFollowing"
//           component={MyFollowersAndFollowing}
//           options={({ navigation, route }) => ({
//             headerTransparent: true,
//             headerLeft: () => (
//               <TouchableOpacity onPress={() => navigation.goBack()}>
//                 <Ionicons
//                   style={[styles.icon, { marginLeft: 20 }]}
//                   name={"ios-arrow-back"}
//                   size={30}
//                 />
//               </TouchableOpacity>
//             ),
//           })}
//         />
//         <Stack.Screen
//           name="Profile"
//           component={ProfileScreen}
//           options={({ navigation, route }) => ({
//             headerShown: false,
//           })}
//         />
//         <Stack.Screen
//           name="ViewProfile"
//           component={ViewProfileScreen}
//           options={({ navigation, route }) => ({
//             headerLeft: () => (
//               <TouchableOpacity onPress={() => navigation.goBack()}>
//                 <Ionicons
//                   style={[styles.icon, { marginLeft: 20, color: "#000" }]}
//                   name={"ios-arrow-back"}
//                   size={30}
//                 />
//               </TouchableOpacity>
//             ),
//           })}
//         />
//         <Stack.Screen
//           name="Login"
//           component={Login}
//           options={({ navigation, route }) => ({
//             headerTransparent: true,
//             title: " ",
//             headerLeft: () => (
//               <TouchableOpacity onPress={() => navigation.goBack()}>
//                 <Ionicons
//                   style={[styles.icon, { marginLeft: 20 }]}
//                   name={"ios-arrow-back"}
//                   size={30}
//                 />
//               </TouchableOpacity>
//             ),
//             headerStyle: { backgroundColor: "transparent" },
//           })}
//         />
//         <Stack.Screen
//           name="Signup"
//           component={SignupScreen}
//           options={({ navigation, route }) => ({
//             headerTransparent: true,
//             title: " ",
//             headerLeft: () => (
//               <TouchableOpacity onPress={() => navigation.goBack()}>
//                 <Ionicons
//                   style={[styles.icon, { marginLeft: 20, color: "#000" }]}
//                   name={"ios-arrow-back"}
//                   size={30}
//                 />
//               </TouchableOpacity>
//             ),
//             headerStyle: { backgroundColor: "transparent" },
//           })}
//         />

//         <Stack.Screen
//           name="WelcomeScreen"
//           component={WelcomeScreen}
//           options={{
//             headerShown: false,
//           }}
//         />
//       </Stack.Navigator>
//     );
//   };

//   const TabNavigator = () => {
//     return (
//       <Tab.Navigator>
//         <Tab.Screen
//           screenOptions={({ route }) => ({
//             headerTransparent: true,
//             tabBarLabel: " ",
//             tabBarIcon: ({ focused, color, size }) => (
//               <MaterialCommunityIcons
//                 color={"white"}
//                 name={focused ? "home" : "home-outline"}
//                 size={32}
//               />
//             ),
//           })}
//           name="Home"
//           component={HomeNavigator}
//         />
//         <Tab.Screen
//           screenOptions={({ route }) => ({
//             headerTransparent: true,
//             tabBarLabel: " ",
//             tabBarIcon: ({ focused, color, size }) => (
//               <Ionicons
//                 color={"white"}
//                 name={focused ? "md-search" : "ios-search"}
//                 size={32}
//               />
//             ),
//           })}
//           name="Search"
//           component={SearchNavigator}
//         />
//         <Tab.Screen
//           screenOptions={({ route }) => ({
//             headerTransparent: true,
//             tabBarLabel: " ",
//             tabBarIcon: ({ focused, color, size }) => (
//               <Image
//                 style={[
//                   styles.profileLogo,
//                   { transform: [{ rotate: "90deg" }, { scale: 1.2 }] },
//                 ]}
//                 source={require("../../assets/logo-3.png")}
//               />
//             ),
//           })}
//           name="Post"
//           component={PostNavigator}
//         />
//         <Tab.Screen
//           screenOptions={({ route }) => ({
//             headerTransparent: true,
//             tabBarLabel: " ",
//             tabBarIcon: ({ focused, color, size }) => (
//               <Ionicons
//                 color={"white"}
//                 name={focused ? "ios-heart" : "ios-heart-empty"}
//                 size={32}
//               />
//             ),
//           })}
//           name="Activity"
//           component={ActivityNavigator}
//         />
//         {/* <Tab.Screen
//           screenOptions={({ route }) => ({
//             headerTransparent: true,
//             tabBarLabel: " ",
//             tabBarIcon: ({ focused, color, size }) => (
//               <Ionicons
//                 color={"white"}
//                 name={focused ? "ios-heart" : "ios-heart-empty"}
//                 size={32}
//               />
//             ),
//           })}
//           name="MyProfile"
//           component={MyProfile}
//         /> */}
//       </Tab.Navigator>
//     );
//   };

//   return (
//     <NavigationContainer>
//       <Stack.Navigator screenOptions={{ headerShown: false }}>
//         <Stack.Screen name="Auth" component={AuthStack} />
//         <Stack.Screen name="Home" component={TabNavigator} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

// export default RootNavigator;
