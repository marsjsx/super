import React from "react";
import { Ionicons } from "@expo/vector-icons";
import Login from "../screens/Login";
import HomeScreen from "../screens/Home";
import SearchScreen from "../screens/Search";
import FilterScreen from "../screens/Filter";
import PostScreen from "../screens/Post";
import VideoCover from "../screens/videocover";
import CropperPage from "../screens/CropperPage";

import PostCaptions from "../screens/PostCaption";

import ActivityScreen from "../screens/Activity";
import ProfileScreen from "../screens/Profile";
import ViewProfileScreen from "../screens/ViewProfile";

import BlockedUsers from "../screens/BlockedUsers";

// import CameraScreen from "../screens/Camera";
import CameraScreen from "../component/CameraView";
import FullScreenImage from "../component/FullScreenImage";
import Reset from "../screens/Reset";

import MapScreen from "../screens/Map";
import EditScreen from "../screens/Signup";
import DashScreen from "../screens/Dash";
import CommentScreen from "../screens/Comment";
import NewMessage from "../screens/NewMessage";
import PostReportScreen from "../screens/PostReports";
import ChatScreen from "../screens/Chat";
import PayScreen from "../screens/Pay";
import MessagesScreen from "../screens/Messages";
import PostListScreen from "../screens/PostList";
import MyFollowersAndFollowing from "../screens/MyFollowersAndFollowing";
import LikersAndViewers from "../screens/LikersAndViewers";
import WelcomeScreen from "../screens/WelcomeScreen";
import { createAppContainer, createStackNavigator } from "react-navigation";

import { TouchableOpacity, Image } from "react-native";
import SignupScreen from "../screens/Signup";

import styles from "../styles";
import Add from "../screens/Add";
import { Text, View, Platform, StatusBar } from "react-native";
import {
  Container,
  Header,
  Left,
  Body,
  Right,
  Button,
  Icon,
  Title,
  Subtitle,
  Footer,
} from "native-base";

// import Add from "../screens/Post-Old";

export const HomeNavigator = createAppContainer(
  createStackNavigator({
    Home: {
      screen: HomeScreen,
      navigationOptions: ({ navigation }) => ({
        header: null,

        //   headerTransparent: false,
        //   headerTitle: (
        //     <Image
        //       style={[styles.logoHeader, { width: 150, height: 45 }]}
        //       source={require("../assets/logo-1.png")}
        //       resizeMode="contain"
        //     />
        //   ),
        //   headerLeft: (
        //     <TouchableOpacity onPress={() => navigation.navigate("Camera")}>
        //       <Ionicons
        //         style={{ marginLeft: 10, color: "#000000" }}
        //         name={"ios-camera"}
        //         size={32}
        //       />
        //     </TouchableOpacity>
        //   ),
        //   headerRight: (
        //     <TouchableOpacity onPress={() => navigation.navigate("Messages")}>
        //       <Ionicons
        //         style={{ marginRight: 10, color: "#000000" }}
        //         name={"ios-send"}
        //         size={32}
        //       />
        //     </TouchableOpacity>
        //   )
      }),
    },

    FullScreenImage: {
      screen: FullScreenImage,
      navigationOptions: ({ navigation }) => ({
        headerTransparent: true,
        headerLeft: (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons
              style={[styles.icon, { marginLeft: 20 }]}
              name={"ios-close"}
              size={40}
              color="white"
            />
          </TouchableOpacity>
        ),
      }),
    },

    Comment: {
      screen: CommentScreen,
      navigationOptions: ({ navigation }) => ({
        headerTransparent: true,
        // title: "Comments",
        headerLeft: (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons
              style={[styles.icon, { marginLeft: 20 }]}
              name={"ios-arrow-back"}
              size={30}
            />
          </TouchableOpacity>
        ),
      }),
    },
    PostReport: {
      screen: PostReportScreen,
      navigationOptions: ({ navigation }) => ({
        headerTransparent: true,
        title: "Post Reports",
        headerLeft: (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons
              style={[styles.icon, { marginLeft: 20 }]}
              name={"ios-arrow-back"}
              size={30}
            />
          </TouchableOpacity>
        ),
      }),
    },
    Map: {
      screen: MapScreen,
      navigationOptions: ({ navigation }) => ({
        headerTransparent: true,
        title: "Map View",
        headerLeft: (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons
              style={[styles.icon, { marginLeft: 20 }]}
              name={"ios-arrow-back"}
              size={30}
            />
          </TouchableOpacity>
        ),
      }),
    },
    Messages: {
      screen: MessagesScreen,
      navigationOptions: ({ navigation }) => ({
        // headerTransparent: true,
        title: "Messages",
        headerLeft: (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons
              style={[styles.icon, { marginLeft: 20 }]}
              name={"ios-arrow-back"}
              size={30}
            />
          </TouchableOpacity>
        ),
      }),
    },
    NewMessage: {
      screen: NewMessage,
      navigationOptions: ({ navigation }) => ({
        // headerTransparent: true,
        title: "New Message",
        headerLeft: (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons
              style={[styles.icon, { marginLeft: 20 }]}
              name={"ios-arrow-back"}
              size={30}
            />
          </TouchableOpacity>
        ),
      }),
    },

    Chat: {
      screen: ChatScreen,
      navigationOptions: ({ navigation }) => ({
        // headerTransparent: true,
        // title: "Chat",
        headerLeft: (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons
              style={[styles.icon, { marginLeft: 20 }]}
              name={"ios-arrow-back"}
              size={30}
            />
          </TouchableOpacity>
        ),
      }),
    },
    Camera: {
      screen: CameraScreen,
      navigationOptions: ({ navigation }) => ({
        //  headerTransparent: true,
        header: null,
        // headerLeft: (
        //   <TouchableOpacity onPress={() => navigation.goBack()}>
        //     <Ionicons
        //       style={[styles.icon, { marginLeft: 20 }]}
        //       name={"ios-arrow-back"}
        //       color="white"
        //       size={30}
        //     />
        //   </TouchableOpacity>
        // ),
      }),
    },
    PostDetail: {
      screen: PostScreen,
      navigationOptions: {
        headerTransparent: true,
        gesturesEnabled: false,
      },
    },
    PostCaption: {
      screen: PostCaptions,
      // navigationOptions: {
      //   headerTransparent: true,
      //   gesturesEnabled: false,
      // },
    },
    Pay: {
      screen: PayScreen,
      navigationOptions: ({ navigation }) => ({
        headerTransparent: true,
        headerLeft: (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons
              style={[styles.icon, { marginLeft: 20 }]}
              name={"ios-arrow-back"}
              size={30}
            />
          </TouchableOpacity>
        ),
      }),
    },

    Profile: {
      screen: ProfileScreen,
      navigationOptions: ({ navigation }) => ({
        headerTransparent: true,
        headerTintColor: "#fff",
        // headerTitle: (
        //   <Image
        //     style={[styles.profileLogo, { transform: [{ rotate: "90deg" }] }]}
        //     source={require("../assets/logo-1.png")}
        //   />
        // ),
        headerLeft: (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons
              style={[
                styles.icon,
                { marginLeft: 20, color: "white", shadowOpacity: 0.5 },
              ]}
              name={"ios-arrow-back"}
              size={40}
            />
          </TouchableOpacity>
        ),
      }),
    },
    ViewProfile: {
      screen: ViewProfileScreen,
      navigationOptions: ({ navigation }) => ({
        headerTransparent: true,
        // title: "Chat",

        // headerTitle: (
        //   <Image
        //     style={[styles.profileLogo, { transform: [{ rotate: "90deg" }] }]}
        //     source={require("../assets/logo-1.png")}
        //   />
        // ),
        headerLeft: (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons
              style={[
                styles.icon,
                { marginLeft: 20, color: "white", shadowOpacity: 0.5 },
              ]}
              name={"ios-arrow-back"}
              size={40}
            />
          </TouchableOpacity>
        ),
      }),
    },
    MyFollowersAndFollowing: {
      screen: MyFollowersAndFollowing,
      navigationOptions: ({ navigation }) => ({
        headerTransparent: true,
        headerLeft: (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons
              style={[styles.icon, { marginLeft: 20 }]}
              name={"ios-arrow-back"}
              size={30}
            />
          </TouchableOpacity>
        ),
      }),
    },
    PostListScreen: {
      screen: PostListScreen,
      navigationOptions: ({ navigation }) => ({
        header: null,
        // headerRight: (
        //   <TouchableOpacity onPress={() => navigation.goBack()}>
        //     <Ionicons
        //       style={[styles.icon, { marginRight: 20 }]}
        //       name="ios-close"
        //       color="#fff"
        //       size={40}
        //     ></Ionicons>
        //   </TouchableOpacity>
        // ),
        // headerTransparent: true,
        // headerLeft: null,
      }),
    },
    // LikersAndViewers: {
    //   screen: LikersAndViewers,
    //   navigationOptions: {
    //     headerTransparent: true,
    //     title: "LikersAndViewers",
    //   },
    // },
    LikersAndViewers: {
      screen: LikersAndViewers,
      navigationOptions: ({ navigation }) => ({
        headerTransparent: false,
        headerVisible: true,

        headerLeft: (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons
              style={[styles.icon, { marginLeft: 20 }]}
              name={"ios-arrow-back"}
              size={30}
            />
          </TouchableOpacity>
        ),
      }),
    },
    Login: {
      screen: Login,
      navigationOptions: ({ navigation }) => ({
        headerTransparent: true,
        title: " ",
        headerLeft: (
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
      }),
    },
    Signup: {
      screen: SignupScreen,
      navigationOptions: ({ navigation }) => ({
        headerTransparent: true,
        title: " ",
        headerLeft: (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons
              style={[styles.icon, { marginLeft: 20 }]}
              name={"ios-arrow-back"}
              size={30}
            />
          </TouchableOpacity>
        ),
        headerStyle: { backgroundColor: "transparent" },
      }),
    },
    WelcomeScreen: {
      screen: WelcomeScreen,
      navigationOptions: ({ navigation }) => ({
        header: null,
      }),
    },
  })
);

HomeNavigator.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.routes.some((route) => route.routeName === "Camera")) {
    tabBarVisible = false;
  }
  if (navigation.state.routes.some((route) => route.routeName === "Map")) {
    tabBarVisible = false;
  }
  if (navigation.state.routes.some((route) => route.routeName === "Comment")) {
    tabBarVisible = false;
  }
  if (navigation.state.routes.some((route) => route.routeName === "Filter")) {
    tabBarVisible = false;
  }
  if (navigation.state.routes.some((route) => route.routeName === "Messages")) {
    tabBarVisible = false;
  }
  if (navigation.state.routes.some((route) => route.routeName === "Chat")) {
    tabBarVisible = false;
  }
  if (navigation.state.routes.some((route) => route.routeName === "Login")) {
    tabBarVisible = false;
  }
  if (navigation.state.routes.some((route) => route.routeName === "Signup")) {
    tabBarVisible = false;
  }
  if (navigation.state.routes.some((route) => route.routeName === "Profile")) {
    tabBarVisible = false;
  }
  if (
    navigation.state.routes.some((route) => route.routeName === "WelcomeScreen")
  ) {
    tabBarVisible = false;
  }
  if (
    navigation.state.routes.some((route) => route.routeName === "ViewProfile")
  ) {
    tabBarVisible = false;
  }
  if (
    navigation.state.routes.some(
      (route) => route.routeName === "MyFollowersAndFollowing"
    )
  ) {
    tabBarVisible = false;
  }
  if (
    navigation.state.routes.some(
      (route) => route.routeName === "LikersAndViewers"
    )
  ) {
    tabBarVisible = false;
  }
  if (
    navigation.state.routes.some((route) => route.routeName === "PostReport")
  ) {
    tabBarVisible = false;
  }
  if (
    navigation.state.routes.some(
      (route) => route.routeName === "FullScreenImage"
    )
  ) {
    tabBarVisible = false;
  }

  return {
    tabBarVisible,
  };
};

export const SearchNavigator = createAppContainer(
  createStackNavigator(
    {
      Search: {
        screen: SearchScreen,
        headerTransparent: true,
        navigationOptions: {
          // header: null,
          headerTitle: (
            <Image
              style={[styles.logoHeader, { width: 150, height: 45 }]}
              source={require("../assets/logo.png")}
              resizeMode="contain"
            />
          ),
        },
      },
      Comment: {
        screen: CommentScreen,
        navigationOptions: ({ navigation }) => ({
          headerTransparent: true,
          // title: "Comments",
          headerLeft: (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons
                style={[styles.icon, { marginLeft: 20 }]}
                name={"ios-arrow-back"}
                size={30}
              />
            </TouchableOpacity>
          ),
        }),
      },
      Profile: {
        screen: ProfileScreen,
        navigationOptions: ({ navigation }) => ({
          headerTransparent: true,
          headerTintColor: "#fff",

          headerLeft: (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons
                style={[
                  styles.icon,
                  { marginLeft: 20, color: "white", shadowOpacity: 0.5 },
                ]}
                name={"ios-arrow-back"}
                size={40}
              />
            </TouchableOpacity>
          ),
        }),
      },
      ViewProfile: {
        screen: ViewProfileScreen,
        navigationOptions: ({ navigation }) => ({
          headerTransparent: true,
          // headerTitle: (
          //   <Image
          //     style={[styles.profileLogo, { transform: [{ rotate: "90deg" }] }]}
          //     source={require("../assets/logo-1.png")}
          //   />
          // ),
          headerLeft: (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons
                style={[
                  styles.icon,
                  { marginLeft: 20, color: "white", shadowOpacity: 0.5 },
                ]}
                name={"ios-arrow-back"}
                size={40}
              />
            </TouchableOpacity>
          ),
        }),
      },
      MyFollowersAndFollowing: {
        screen: MyFollowersAndFollowing,
        navigationOptions: ({ navigation }) => ({
          headerTransparent: true,
          headerLeft: (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons
                style={[styles.icon, { marginLeft: 20 }]}
                name={"ios-arrow-back"}
                size={30}
              />
            </TouchableOpacity>
          ),
        }),
      },
      Filter: {
        screen: FilterScreen,
        navigationOptions: ({ navigation }) => ({
          headerTransparent: true,
          headerLeft: (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons
                style={[styles.icon, { marginLeft: 20 }]}
                name={"ios-arrow-back"}
                size={30}
              />
            </TouchableOpacity>
          ),
        }),
      },
      PostListScreen: {
        screen: PostListScreen,
        navigationOptions: ({ navigation }) => ({
          header: null,
          // headerRight: (
          //   <TouchableOpacity onPress={() => navigation.goBack()}>
          //     <Ionicons
          //       style={[styles.icon, { marginRight: 20 }]}
          //       name="ios-close"
          //       color="#fff"
          //       size={40}
          //     ></Ionicons>
          //   </TouchableOpacity>
          // ),
          // headerTransparent: true,
          // headerLeft: null,
        }),
      },
      LikersAndViewers: {
        screen: LikersAndViewers,
        navigationOptions: ({ navigation }) => ({
          headerTransparent: false,
          headerVisible: true,

          headerLeft: (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons
                style={[styles.icon, { marginLeft: 20 }]}
                name={"ios-arrow-back"}
                size={30}
              />
            </TouchableOpacity>
          ),
        }),
      },
      FullScreenImage: {
        screen: FullScreenImage,
        navigationOptions: ({ navigation }) => ({
          headerTransparent: true,
          headerLeft: (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons
                style={[styles.icon, { marginLeft: 20 }]}
                name={"ios-close"}
                size={40}
                color="white"
              />
            </TouchableOpacity>
          ),
        }),
      },
      WelcomeScreen: {
        screen: WelcomeScreen,
        navigationOptions: ({ navigation }) => ({
          header: null,
        }),
      },
    },
    {
      headerLayoutPreset: "center", // default is 'left'
    }
  )
);

SearchNavigator.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (
    navigation.state.routes.some(
      (route) => route.routeName === "FullScreenImage"
    )
  ) {
    tabBarVisible = false;
  }
  if (
    navigation.state.routes.some(
      (route) => route.routeName === "PostListScreen"
    )
  ) {
    tabBarVisible = false;
  }
  if (navigation.state.routes.some((route) => route.routeName === "Profile")) {
    tabBarVisible = false;
  }
  if (
    navigation.state.routes.some((route) => route.routeName === "ViewProfile")
  ) {
    tabBarVisible = false;
  }
  if (
    navigation.state.routes.some(
      (route) => route.routeName === "MyFollowersAndFollowing"
    )
  ) {
    tabBarVisible = false;
  }
  if (
    navigation.state.routes.some((route) => route.routeName === "WelcomeScreen")
  ) {
    tabBarVisible = false;
  }
  return {
    tabBarVisible,
  };
};

export const PostNavigator = createAppContainer(
  createStackNavigator({
    Post: {
      screen: Add,
      navigationOptions: {
        header: null,
        tabBarIcon: ({ tintColor }) => (
          <Ionicons name="ios-add-circle-outline" size={32} />
        ),
      },
    },
    PostDetail: {
      screen: PostScreen,
      navigationOptions: {
        headerTransparent: true,
        gesturesEnabled: false,
      },
    },
    Comment: {
      screen: CommentScreen,
      navigationOptions: ({ navigation }) => ({
        headerTransparent: true,
        // title: "Comments",
        headerLeft: (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons
              style={[styles.icon, { marginLeft: 20 }]}
              name={"ios-arrow-back"}
              size={30}
            />
          </TouchableOpacity>
        ),
      }),
    },
    VideoCover: {
      screen: VideoCover,
      navigationOptions: {
        // headerTransparent: true,
        title: "Choose Video Cover",
        gesturesEnabled: false,
      },
    },
    // CropperPage: {
    //   screen: CropperPage,
    //   // header: null,
    //   navigationOptions: {
    //     headerTransparent: true,
    //     title: "Crop Image",
    //     gesturesEnabled: false,
    //   },
    // },
    PostCaption: {
      screen: PostCaptions,
      navigationOptions: {
        // headerTransparent: true,
        // gesturesEnabled: false,
        title: "Post Caption",
      },
    },
    Login: {
      screen: Login,
      navigationOptions: ({ navigation }) => ({
        headerTransparent: true,
        title: " ",
        headerLeft: (
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
      }),
    },
    Signup: {
      screen: SignupScreen,
      navigationOptions: ({ navigation }) => ({
        headerTransparent: true,
        title: " ",
        headerLeft: (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons
              style={[styles.icon, { marginLeft: 20 }]}
              name={"ios-arrow-back"}
              size={30}
            />
          </TouchableOpacity>
        ),
        headerStyle: { backgroundColor: "transparent" },
      }),
    },
    WelcomeScreen: {
      screen: WelcomeScreen,
      navigationOptions: ({ navigation }) => ({
        header: null,
      }),
    },
  })
);

PostNavigator.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.routes.some((route) => route.routeName === "Post")) {
    tabBarVisible = false;
  }
  if (navigation.state.routes.some((route) => route.routeName === "Login")) {
    tabBarVisible = false;
  }
  if (navigation.state.routes.some((route) => route.routeName === "Signup")) {
    tabBarVisible = false;
  }
  if (
    navigation.state.routes.some((route) => route.routeName === "WelcomeScreen")
  ) {
    tabBarVisible = false;
  }
  return {
    tabBarVisible,
  };
};

export const ActivityNavigator = createAppContainer(
  createStackNavigator({
    Activity: {
      screen: ActivityScreen,
      navigationOptions: {
        headerTransparent: true,
        title: "Activity",
      },
    },
    Login: {
      screen: Login,
      navigationOptions: ({ navigation }) => ({
        headerTransparent: true,
        title: " ",
        headerLeft: (
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
      }),
    },
    Signup: {
      screen: SignupScreen,
      navigationOptions: ({ navigation }) => ({
        headerTransparent: true,
        title: " ",
        headerLeft: (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons
              style={[styles.icon, { marginLeft: 20 }]}
              name={"ios-arrow-back"}
              size={30}
            />
          </TouchableOpacity>
        ),
        headerStyle: { backgroundColor: "transparent" },
      }),
    },
    Comment: {
      screen: CommentScreen,
      navigationOptions: ({ navigation }) => ({
        headerTransparent: true,
        // title: "Comments",
        headerLeft: (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons
              style={[styles.icon, { marginLeft: 20 }]}
              name={"ios-arrow-back"}
              size={30}
            />
          </TouchableOpacity>
        ),
      }),
    },
    Profile: {
      screen: ProfileScreen,
      navigationOptions: ({ navigation }) => ({
        headerTransparent: true,
        headerTintColor: "#fff",

        headerLeft: (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons
              style={[
                styles.icon,
                { marginLeft: 20, color: "white", shadowOpacity: 0.5 },
              ]}
              name={"ios-arrow-back"}
              size={40}
            />
          </TouchableOpacity>
        ),
      }),
    },
    ViewProfile: {
      screen: ViewProfileScreen,
      navigationOptions: ({ navigation }) => ({
        headerTransparent: true,
        // headerTitle: (
        //   <Image
        //     style={[styles.profileLogo, { transform: [{ rotate: "90deg" }] }]}
        //     source={require("../assets/logo-1.png")}
        //   />
        // ),
        headerLeft: (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons
              style={[
                styles.icon,
                { marginLeft: 20, color: "white", shadowOpacity: 0.5 },
              ]}
              name={"ios-arrow-back"}
              size={40}
            />
          </TouchableOpacity>
        ),
      }),
    },
    MyFollowersAndFollowing: {
      screen: MyFollowersAndFollowing,
      navigationOptions: ({ navigation }) => ({
        headerTransparent: true,
        headerLeft: (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons
              style={[styles.icon, { marginLeft: 20 }]}
              name={"ios-arrow-back"}
              size={30}
            />
          </TouchableOpacity>
        ),
      }),
    },
    PostListScreen: {
      screen: PostListScreen,
      navigationOptions: ({ navigation }) => ({
        header: null,
        // headerRight: (
        //   <TouchableOpacity onPress={() => navigation.goBack()}>
        //     <Ionicons
        //       style={[styles.icon, { marginRight: 20 }]}
        //       name="ios-close"
        //       color="#fff"
        //       size={40}
        //     ></Ionicons>
        //   </TouchableOpacity>
        // ),
        // headerTransparent: true,
        // headerLeft: null,
      }),
    },
    LikersAndViewers: {
      screen: LikersAndViewers,
      navigationOptions: ({ navigation }) => ({
        headerTransparent: false,
        headerVisible: true,

        headerLeft: (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons
              style={[styles.icon, { marginLeft: 20 }]}
              name={"ios-arrow-back"}
              size={30}
            />
          </TouchableOpacity>
        ),
      }),
    },
    FullScreenImage: {
      screen: FullScreenImage,
      navigationOptions: ({ navigation }) => ({
        headerTransparent: true,
        headerLeft: (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons
              style={[styles.icon, { marginLeft: 20 }]}
              name={"ios-close"}
              size={40}
              color="white"
            />
          </TouchableOpacity>
        ),
      }),
    },
    WelcomeScreen: {
      screen: WelcomeScreen,
      navigationOptions: ({ navigation }) => ({
        header: null,
      }),
    },
  })
);

ActivityNavigator.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.routes.some((route) => route.routeName === "Signup")) {
    tabBarVisible = false;
  }
  if (navigation.state.routes.some((route) => route.routeName === "Login")) {
    tabBarVisible = false;
  }
  if (navigation.state.routes.some((route) => route.routeName === "Profile")) {
    tabBarVisible = false;
  }
  if (
    navigation.state.routes.some((route) => route.routeName === "ViewProfile")
  ) {
    tabBarVisible = false;
  }
  if (
    navigation.state.routes.some(
      (route) => route.routeName === "PostListScreen"
    )
  ) {
    tabBarVisible = false;
  }
  if (
    navigation.state.routes.some((route) => route.routeName === "WelcomeScreen")
  ) {
    tabBarVisible = false;
  }

  return {
    tabBarVisible,
  };
};

export const ProfileNavigator = createAppContainer(
  createStackNavigator({
    MyProfile: {
      screen: ProfileScreen,
      navigationOptions: {
        headerTransparent: true,
        headerTintColor: "#fff",

        // title: null,
      },
    },
    ViewProfile: {
      screen: ViewProfileScreen,
      navigationOptions: ({ navigation }) => ({
        headerTransparent: true,
        // headerTitle: (
        //   <Image
        //     style={[styles.profileLogo, { transform: [{ rotate: "90deg" }] }]}
        //     source={require("../assets/logo-1.png")}
        //   />
        // ),
        headerLeft: (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons
              style={[
                styles.icon,
                { marginLeft: 20, color: "white", shadowOpacity: 0.5 },
              ]}
              name={"ios-arrow-back"}
              size={40}
            />
          </TouchableOpacity>
        ),
      }),
    },
    Comment: {
      screen: CommentScreen,
      navigationOptions: ({ navigation }) => ({
        headerTransparent: true,
        // title: "Comments",
        headerLeft: (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons
              style={[styles.icon, { marginLeft: 20 }]}
              name={"ios-arrow-back"}
              size={30}
            />
          </TouchableOpacity>
        ),
      }),
    },
    PostListScreen: {
      screen: PostListScreen,
      navigationOptions: ({ navigation }) => ({
        header: null,
        // headerRight: (
        //   <TouchableOpacity onPress={() => navigation.goBack()}>
        //     <Ionicons
        //       style={[styles.icon, { marginRight: 20 }]}
        //       name="ios-close"
        //       color="#fff"
        //       size={40}
        //     ></Ionicons>
        //   </TouchableOpacity>
        // ),
        // headerTransparent: true,
        // headerLeft: null,
      }),
    },
    LikersAndViewers: {
      screen: LikersAndViewers,
      navigationOptions: ({ navigation }) => ({
        headerTransparent: false,
        headerVisible: true,

        headerLeft: (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons
              style={[styles.icon, { marginLeft: 20 }]}
              name={"ios-arrow-back"}
              size={30}
            />
          </TouchableOpacity>
        ),
      }),
    },
    FullScreenImage: {
      screen: FullScreenImage,
      navigationOptions: ({ navigation }) => ({
        headerTransparent: true,
        headerLeft: (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons
              style={[styles.icon, { marginLeft: 20 }]}
              name={"ios-close"}
              size={40}
              color="white"
            />
          </TouchableOpacity>
        ),
      }),
    },
    Edit: {
      screen: EditScreen,
      navigationOptions: ({ navigation }) => ({
        header: null,
        // headerLeft: (
        //   <TouchableOpacity onPress={() => navigation.goBack()}>
        //     <Ionicons
        //       style={[styles.icon, { marginLeft: 20 }]}
        //       name={"ios-arrow-back"}
        //       size={30}
        //     />
        //   </TouchableOpacity>
        // ),
      }),
    },
    BlockedUsers: {
      screen: BlockedUsers,
      navigationOptions: ({ navigation }) => ({
        headerTransparent: false,
        headerVisible: true,
        title: "Blocked accounts",
        headerLeft: (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons
              style={[styles.icon, { marginLeft: 20 }]}
              name={"ios-arrow-back"}
              size={30}
            />
          </TouchableOpacity>
        ),
      }),
    },
    Reset: {
      screen: Reset,
      navigationOptions: ({ navigation }) => ({
        headerTransparent: true,
        title: " ",
        headerLeft: (
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
      }),
    },
    Dash: {
      screen: DashScreen,
      navigationOptions: ({ navigation }) => ({
        headerTransparent: true,
        headerLeft: (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons
              style={[styles.icon, { marginLeft: 20 }]}
              name={"ios-arrow-back"}
              size={30}
            />
          </TouchableOpacity>
        ),
      }),
    },
    MyFollowersAndFollowing: {
      screen: MyFollowersAndFollowing,
      navigationOptions: ({ navigation }) => ({
        headerTransparent: true,
        headerLeft: (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons
              style={[styles.icon, { marginLeft: 20 }]}
              name={"ios-arrow-back"}
              size={30}
            />
          </TouchableOpacity>
        ),
      }),
    },
    Profile: {
      screen: ProfileScreen,
      navigationOptions: ({ navigation }) => ({
        headerTransparent: true,
        headerTintColor: "#fff",

        headerLeft: (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons
              style={[
                styles.icon,
                { marginLeft: 20, color: "white", shadowOpacity: 0.5 },
              ]}
              name={"ios-arrow-back"}
              size={40}
            />
          </TouchableOpacity>
        ),
      }),
    },
    ViewProfile: {
      screen: ViewProfileScreen,
      navigationOptions: ({ navigation }) => ({
        headerTransparent: true,
        // headerTitle: (
        //   <Image
        //     style={[styles.profileLogo, { transform: [{ rotate: "90deg" }] }]}
        //     source={require("../assets/logo-1.png")}
        //   />
        // ),
        headerLeft: (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons
              style={[
                styles.icon,
                { marginLeft: 20, color: "white", shadowOpacity: 0.5 },
              ]}
              name={"ios-arrow-back"}
              size={40}
            />
          </TouchableOpacity>
        ),
      }),
    },
    Login: {
      screen: Login,
      navigationOptions: ({ navigation }) => ({
        headerTransparent: true,
        title: " ",
        headerLeft: (
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
      }),
    },
    Signup: {
      screen: SignupScreen,
      navigationOptions: ({ navigation }) => ({
        headerTransparent: true,
        title: " ",
        headerLeft: (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons
              style={[styles.icon, { marginLeft: 20 }]}
              name={"ios-arrow-back"}
              size={30}
            />
          </TouchableOpacity>
        ),
        headerStyle: { backgroundColor: "transparent" },
      }),
    },
    WelcomeScreen: {
      screen: WelcomeScreen,
      navigationOptions: ({ navigation }) => ({
        header: null,
      }),
    },
  })
);

ProfileNavigator.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.routes.some((route) => route.routeName === "Signup")) {
    tabBarVisible = false;
  }
  if (navigation.state.routes.some((route) => route.routeName === "Login")) {
    tabBarVisible = false;
  }
  if (navigation.state.routes.some((route) => route.routeName === "Reset")) {
    tabBarVisible = false;
  }

  if (navigation.state.routes.some((route) => route.routeName === "Edit")) {
    tabBarVisible = false;
  }
  if (
    navigation.state.routes.some((route) => route.routeName === "ViewProfile")
  ) {
    tabBarVisible = false;
  }
  if (
    navigation.state.routes.some(
      (route) => route.routeName === "MyFollowersAndFollowing"
    )
  ) {
    tabBarVisible = false;
  }
  if (
    navigation.state.routes.some(
      (route) => route.routeName === "PostListScreen"
    )
  ) {
    tabBarVisible = false;
  }
  if (
    navigation.state.routes.some((route) => route.routeName === "WelcomeScreen")
  ) {
    tabBarVisible = false;
  }
  return {
    tabBarVisible,
  };
};
