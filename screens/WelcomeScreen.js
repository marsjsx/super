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
import { PinchGestureHandler, State } from "react-native-gesture-handler";
const WINDOW_WIDTH = Dimensions.get("window").width;
const WINDOW_HEIGHT = Dimensions.get("window").height;
const BASE_PADDING = 10;
import constants from "../constants";
import Scale from "../helpers/Scale";
import { Button } from "native-base";

class WelcomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rate: 1,
    };
  }

  componentDidMount() {
    // add listener
    this.willBlurSubscription = this.props.navigation.addListener(
      "willBlur",
      this.willBlurAction
    );
  }

  componentWillUmount() {
    // remove listener
    this.willBlurSubscription.remove();
  }

  willBlurAction = async (payload) => {};

  render() {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: "black",
            alignItems: "center",
          },
        ]}
      >
        <Text style={styles.label}>Welcome to super</Text>

        {/* <Button block light>
          <Text>Light</Text>
        </Button> */}
        <TouchableOpacity
          style={{
            backgroundColor: constants.colors.warmGrey,
            width: WINDOW_WIDTH * 0.8,
            padding: Scale.moderateScale(10),
            alignItems: "center",
            borderRadius: Scale.moderateScale(8),
            position: "absolute",
            bottom: WINDOW_HEIGHT * 0.15,
          }}
          onPress={() => this.props.navigation.goBack()}
        >
          <Text
            style={{
              color: constants.colors.white,
              fontSize: Scale.moderateScale(14),
              fontWeight: "bold",
            }}
          >
            Ok
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}
export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  label: {
    color: constants.colors.white,
    fontSize: Scale.moderateScale(32),
    fontWeight: "bold",
    marginHorizontal: Scale.moderateScale(8),
    marginTop: WINDOW_HEIGHT * 0.3,
  },
});
