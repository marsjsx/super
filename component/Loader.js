import React from "react";
import {
  View,
  StyleSheet,
  Animated,
  ActivityIndicator,
  Text,
  Easing,
} from "react-native";
import constants from "../constants";
import Scale from "../helpers/Scale";

const styles = StyleSheet.create({
  imageOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  },
  profileLogo: {
    width: 70,
    height: 70,
  },
  container: {
    backgroundColor: "#e1e4e8",
  },
});

class Loader extends React.Component {
  constructor(props) {
    super(props);
    this.state = { spinAnim: new Animated.Value(0) };
  }

  componentDidMount() {
    Animated.loop(
      Animated.timing(this.state.spinAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }

  render() {
    const spin = this.state.spinAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "360deg"],
    });
    const { message, style, bgColor, ...props } = this.props;
    const backgroundColor = bgColor ? bgColor : "transparent";
    return (
      <View
        style={{
          width: "100%",
          height: "100%",
          padding: 20,
          zIndex: 100,
          backgroundColor: constants.colors.appBackgroundColor,
          position: "absolute",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Animated.Image
          style={[styles.profileLogo, { transform: [{ rotate: spin }] }]}
          source={require("../assets/applogo.png")}
        />

        {/* <Animated.Image
          style={{ height: 100, width: 100, transform: [{ rotate: spin }] }}
          source={{
            uri:
              "https://cdn.pixabay.com/photo/2013/07/13/10/51/football-157930_960_720.png",
          }}
        /> */}

        {/* <ActivityIndicator size="large" color="rgb(215, 80, 80)" /> */}
        <Text
          style={{
            color: constants.colors.primaryColor,
            textAlign: "center",
            fontWeight: "bold",
            marginTop: Scale.moderateScale(20),
          }}
        >
          {message}
        </Text>
      </View>
    );
  }
}

export default Loader;
