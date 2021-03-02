import React from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import Video from "react-native-video";
import { Ionicons, MaterialCommunityIcons, Entypo } from "@expo/vector-icons";
import ProgressiveImage from "./ProgressiveImage";
import * as Animatable from "react-native-animatable";
import Icon from "react-native-vector-icons/AntDesign";
const { width } = Dimensions.get("window");
import { PinchGestureHandler, State } from "react-native-gesture-handler";
import styles from "../styles";
import * as ScreenOrientation from "expo-screen-orientation";
const WINDOW_WIDTH = Dimensions.get("window").width;
const WINDOW_HEIGHT = Dimensions.get("window").height;
const BASE_PADDING = 10;
import {
  InstagramProvider,
  ElementContainer,
} from "instagram-zoom-react-native";

class FullScreenImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rate: 1,
    };
  }

  componentDidMount() {
    // add listener
    this.willBlurSubscription = this.props.navigation.addListener(
      "blur",
      this.willBlurAction
    );
    // ScreenOrientation.unlockAsync();
  }

  componentWillUmount() {
    // remove listener
    this.willBlurSubscription.remove();
  }

  willBlurAction = async (payload) => {
    // ScreenOrientation.unlockAsync();
    // await ScreenOrientation.lockAsync(
    //   ScreenOrientation.OrientationLock.PORTRAIT
    // );
  };

  async changeScreenOrientation() {
    // await ScreenOrientation.lockAsync(
    //   ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT
    // );
  }

  render() {
    const { data } = this.props.route.params;

    return (
      <View
        style={[
          styles.MainContainer,
          { backgroundColor: "black", justifyContent: "center" },
        ]}
      >
        <InstagramProvider>
          <ElementContainer>
            <ProgressiveImage
              thumbnailSource={{
                uri: data.preview,
              }}
              source={{ uri: data.source }}
              style={{
                width: Dimensions.get("window").width,
                height: Dimensions.get("window").height,
              }}
              resizeMode="cover"
            />
          </ElementContainer>
        </InstagramProvider>
      </View>
    );
  }
}
export default FullScreenImage;
