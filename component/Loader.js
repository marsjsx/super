import React from "react";
import {
  View,
  StyleSheet,
  Animated,
  ActivityIndicator,
  Text
} from "react-native";

const styles = StyleSheet.create({
  imageOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    top: 0
  },
  container: {
    backgroundColor: "#e1e4e8"
  }
});

class Loader extends React.Component {
  render() {
    const { message, style, ...props } = this.props;

    return (
      <View
        style={{
          flex: 1,
          padding: 20,
          backgroundColor: "transparent",
          position: "absolute",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <ActivityIndicator size="large" color="rgb(215, 80, 80)" />
        <Text
          style={{
            color: "rgb(215, 80, 80)",
            textAlign: "center",
            fontWeight: "bold"
          }}
        >
          {message}
        </Text>
      </View>
    );
  }
}

export default Loader;
