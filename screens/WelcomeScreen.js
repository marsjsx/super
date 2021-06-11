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
const WINDOW_WIDTH = Dimensions.get("window").width;
const WINDOW_HEIGHT = Dimensions.get("window").height;
const BASE_PADDING = 10;
import constants from "../constants";
import Scale from "../helpers/Scale";
import { Ionicons } from "@expo/vector-icons";

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
      "blur",
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
        <Image
          style={{
            marginTop: Scale.moderateScale(60),
            resizeMode: "contain",
            width: Scale.moderateScale(200),
            height: Scale.moderateScale(80),
          }}
          source={require("../assets/logo.png")}
        />
        <Text style={styles.label}>
          Welcome to our lllsuperlll social platform
        </Text>

        <View
          style={{
            flexDirection: "row",
            marginTop: Scale.moderateScale(30),
            marginHorizontal: Scale.moderateScale(20),
            alignItems: "center",
          }}
        >
          <Ionicons name="md-checkmark" size={24} color="white" />
          <Text style={styles.text}>
            Scroll our lllsuperllll feed of awesome people.
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            marginTop: Scale.moderateScale(10),
            alignItems: "center",
            marginHorizontal: Scale.moderateScale(20),
          }}
        >
          <Ionicons name="md-checkmark" size={24} color="white" />
          <Text style={styles.text}>
            Post your favorite , photos , videos and panorama shots.
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            marginTop: Scale.moderateScale(10),
            alignItems: "center",
            marginHorizontal: Scale.moderateScale(20),
          }}
        >
          <Ionicons name="md-checkmark" size={24} color="white" />
          <Text style={styles.text}>
            Meet new friends from around the world.
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            marginTop: Scale.moderateScale(10),
            alignItems: "center",
            marginHorizontal: Scale.moderateScale(20),
          }}
        >
          <Ionicons name="md-checkmark" size={24} color="white" />
          <Text style={styles.text}>
            Enjoy a fresh new start to social media!
          </Text>
        </View>

        {/* <Button block light>
          <Text>Light</Text>
        </Button> */}
        <TouchableOpacity
          style={{
            backgroundColor: constants.colors.white,
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
              color: constants.colors.black,
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
    fontSize: Scale.moderateScale(20),
    fontWeight: "500",
    textAlign: "center",
    marginTop: Scale.moderateScale(30),
    marginHorizontal: Scale.moderateScale(8),
    // marginTop: WINDOW_HEIGHT * 0.3,
  },
  text: {
    color: constants.colors.white,
    fontSize: Scale.moderateScale(14),
    flex: 1,
    marginHorizontal: Scale.moderateScale(8),
    // marginTop: WINDOW_HEIGHT * 0.3,
  },
});
