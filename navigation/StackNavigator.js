import React from 'react';
import { Ionicons } from '@expo/vector-icons'
import Login from '../screens/Login'
import HomeScreen from '../screens/Home'
import SearchScreen from '../screens/Search'
import PostScreen from '../screens/Post'
import ActivityScreen from '../screens/Activity'
import ProfileScreen from '../screens/Profile'
import CameraScreen from '../screens/Camera'
import MapScreen from '../screens/Map'
import EditScreen from '../screens/Signup'
import CommentScreen from '../screens/Comment'
import ChatScreen from '../screens/Chat'
import MessagesScreen from '../screens/Messages'
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { TouchableOpacity, Image, } from 'react-native';
import styles from '../styles';

export const HomeNavigator = createAppContainer(createStackNavigator(
  {
    Home: {
      screen: HomeScreen,
      navigationOptions: ({ navigation }) => ({
        headerTransparent: true,
        headerTitle: <Image style={[styles.logoHeader,{ width: 125, height: 35 }]} source={require('../assets/logoW.png')} />,
        headerLeft: (
          <TouchableOpacity onPress={() => navigation.navigate('Camera')} >
            <Ionicons style={{ marginLeft: 10, color: 'rgb(255,255,255)' }} name={'ios-camera'} size={30} />
          </TouchableOpacity>
        ),
        headerRight: (
          <TouchableOpacity onPress={() => navigation.navigate('Messages')} >
            <Ionicons style={{ marginRight: 10, color: 'rgb(255,255,255)' }} name={'ios-send'} size={30} />
          </TouchableOpacity>
        ),
      })
    },
    Comment: {
      screen: CommentScreen,
      navigationOptions: ({ navigation }) => ({
        headerTransparent: true,
        title: 'Comments',
        headerLeft: (
          <TouchableOpacity onPress={() => navigation.goBack()} >
            <Ionicons style={styles.icon} name={'ios-arrow-back'} size={30} />
          </TouchableOpacity>
        )
      })
    },
    Map: {
      screen: MapScreen,
      navigationOptions: ({ navigation }) => ({
        headerTransparent: true,
        title: 'Map View',
        headerLeft: (
          <TouchableOpacity onPress={() => navigation.goBack()} >
            <Ionicons style={styles.icon} name={'ios-arrow-back'} size={30} />
          </TouchableOpacity>
        )
      })
    },
    Messages: {
      screen: MessagesScreen,
      navigationOptions: ({ navigation }) => ({
        headerTransparent: true,
        title: 'Messages',
        headerLeft: (
          <TouchableOpacity onPress={() => navigation.goBack()} >
            <Ionicons style={styles.icon} name={'ios-arrow-back'} size={30} />
          </TouchableOpacity>
        )
      })
    },
    Chat: {
      screen: ChatScreen,
      navigationOptions: ({ navigation }) => ({
        headerTransparent: true,
        title: 'Chat',
        headerLeft: (
          <TouchableOpacity onPress={() => navigation.goBack()} >
            <Ionicons style={styles.icon} name={'ios-arrow-back'} size={30} />
          </TouchableOpacity>
        )
      })
    },
    Camera: {
      screen: CameraScreen,
      navigationOptions: {
        header: null
      }
    }
  }
));

HomeNavigator.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true
  if (navigation.state.routes.some(route => route.routeName === 'Camera')) {
    tabBarVisible = false
  }
  if (navigation.state.routes.some(route => route.routeName === 'Map')) {
    tabBarVisible = false
  }
  if (navigation.state.routes.some(route => route.routeName === 'Comment')) {
    tabBarVisible = false
  }
  return {
    tabBarVisible,
  }
}

export const SearchNavigator = createAppContainer(createStackNavigator(
  {
    Search: {
      screen: SearchScreen,
      navigationOptions: {
        header: null
      }
    },
    Profile: {
      screen: ProfileScreen,
      navigationOptions: ({ navigation }) => ({
        headerTransparent: true,
        title: 'Profile',
        headerLeft: (
          <TouchableOpacity onPress={() => navigation.goBack()} >
            <Ionicons style={styles.icon} name={'ios-arrow-back'} size={30} />
          </TouchableOpacity>
        )
      })
    },
  }
));

export const PostNavigator = createAppContainer(createStackNavigator(
  {
    Post: {
      screen: PostScreen,
      navigationOptions: {
        title: 'Post'
      }
    }
  }
));

export const ActivityNavigator = createAppContainer(createStackNavigator(
  {
    Activity: {
      screen: ActivityScreen,
      navigationOptions: {
        title: 'Activity'
      }
    }
  }
));

export const ProfileNavigator = createAppContainer(createStackNavigator(
  {
    MyProfile: {
      screen: ProfileScreen,
      navigationOptions: {
        headerTransparent: true,
        title: null,
        headerTitle: <Image style={styles.profileLogo} source={require('../assets/logo-1.png')} />,
      }
    },
    Edit: {
      screen: EditScreen,
      navigationOptions: ({ navigation }) => ({
        headerTransparent: true,
        title: 'Edit Profile',
        headerLeft: (
          <TouchableOpacity onPress={() => navigation.goBack()} >
            <Ionicons style={styles.icon} name={'ios-arrow-back'} size={30} />
          </TouchableOpacity>
        )
      })
    }
  }
));
