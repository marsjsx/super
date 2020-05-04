import React from "react";
import { Ionicons } from "@expo/vector-icons";
import Login from "../screens/Login";
import HomeScreen from "../screens/Home";
import SearchScreen from "../screens/Search";
import FilterScreen from "../screens/Filter";
import PostScreen from "../screens/Post";
import ActivityScreen from "../screens/Activity";
import ProfileScreen from "../screens/Profile";
// import CameraScreen from "../screens/Camera";
import CameraScreen from "../component/CameraView";
import Reset from "../screens/Reset";

import MapScreen from "../screens/Map";
import EditScreen from "../screens/Signup";
import DashScreen from "../screens/Dash";
import CommentScreen from "../screens/Comment";
import PostReportScreen from "../screens/PostReports";
import ChatScreen from "../screens/Chat";
import PayScreen from "../screens/Pay";
import MessagesScreen from "../screens/Messages";
import PostListScreen from "../screens/PostList";
import MyFollowersAndFollowing from "../screens/MyFollowersAndFollowing";
import { createStackNavigator, createAppContainer } from "react-navigation";
import { TouchableOpacity, Image } from "react-native";
import SignupScreen from "../screens/Signup";

import styles from "../styles";
import Add from "../screens/Add";
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
    Comment: {
      screen: CommentScreen,
      navigationOptions: ({ navigation }) => ({
        headerTransparent: true,
        title: "Comments",
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
        headerTransparent: true,
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
    Chat: {
      screen: ChatScreen,
      navigationOptions: ({ navigation }) => ({
        headerTransparent: true,
        title: "Chat",
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
        headerTransparent: true,
        headerLeft: (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons
              style={[styles.icon, { marginLeft: 20 }]}
              name={"ios-arrow-back"}
              color="white"
              size={30}
            />
          </TouchableOpacity>
        ),
      }),
    },
    PostDetail: {
      screen: PostScreen,
      navigationOptions: {
        headerTransparent: true,
        gesturesEnabled: false,
      },
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
        headerTitle: (
          <Image
            style={styles.profileLogo}
            source={require("../assets/logo-1.png")}
          />
        ),
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
  if (
    navigation.state.routes.some((route) => route.routeName === "PostReport")
  ) {
    tabBarVisible = false;
  }
  return {
    tabBarVisible,
  };
};

export const SearchNavigator = createAppContainer(
  createStackNavigator({
    Search: {
      screen: SearchScreen,
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
    Profile: {
      screen: ProfileScreen,
      navigationOptions: ({ navigation }) => ({
        headerTransparent: true,
        headerTitle: (
          <Image
            style={styles.profileLogo}
            source={require("../assets/logo-1.png")}
          />
        ),
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
      navigationOptions: {
        headerTransparent: true,
        title: null,
        headerTitle: (
          <Image
            style={styles.profileLogo}
            source={require("../assets/logo-1.png")}
          />
        ),
      },
    },
  })
);

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
    Profile: {
      screen: ProfileScreen,
      navigationOptions: ({ navigation }) => ({
        headerTransparent: true,
        headerTitle: (
          <Image
            style={styles.profileLogo}
            source={require("../assets/logo-1.png")}
          />
        ),
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
      navigationOptions: {
        headerTransparent: true,
        title: null,
        headerTitle: (
          <Image
            style={styles.profileLogo}
            source={require("../assets/logo-1.png")}
          />
        ),
      },
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
  if (navigation.state.routes.some((route) => route.routeName === "PostListScreen")
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
        title: null,
        headerTitle: (
          <Image
            style={styles.profileLogo}
            source={require("../assets/logo-1.png")}
          />
        ),
      },
    },
    PostListScreen: {
      screen: PostListScreen,
      navigationOptions: {
        headerTransparent: true,
        title: null,
        headerTitle: (
          <Image
            style={styles.profileLogo}
            source={require("../assets/logo-1.png")}
          />
        ),
      },
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

  return {
    tabBarVisible,
  };
};
