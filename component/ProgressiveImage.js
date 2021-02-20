import React from "react";
import {
  View,
  StyleSheet,
  Animated,
  ActivityIndicator,
  Image,
  Text,
  Dimensions,
  ImageBackground,
} from "react-native";
import FastImage from "react-native-fast-image";
import { PinchGestureHandler, State } from "react-native-gesture-handler";
const { width } = Dimensions.get("window");

import {
  InstagramProvider,
  ElementContainer,
} from "instagram-zoom-react-native";

const styles = StyleSheet.create({
  imageOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  },
  container: {
    backgroundColor: "#e1e4e8",
  },
  containerTransParent: {
    backgroundColor: "transparent",
  },
});

class ProgressiveImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      opacity: 0,
    };
  }

  scale = new Animated.Value(1);

  onZoomEvent = Animated.event(
    [
      {
        nativeEvent: { scale: this.scale },
      },
    ],
    {
      useNativeDriver: true,
    }
  );

  onZoomStateChange = (event) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      Animated.spring(this.scale, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  };

  thumbnailAnimated = new Animated.Value(0);

  // imageAnimated = new Animated.Value(0);

  handleThumbnailLoad = () => {
    Animated.timing(this.thumbnailAnimated, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  onImageLoad = () => {
    // Animated.timing(this.imageAnimated, {
    //   toValue: 1,
    // }).start();
    this.setState({ opacity: 1 });
  };

  render() {
    const {
      thumbnailSource,
      source,
      type,
      style,
      transparentBackground,
      ...props
    } = this.props;

    var imageSource = source.uri ? source.uri : null;
    // const normalisedSource =
    //   source &&
    //   typeof source.uri === "string" &&
    //   !source.uri.split("https://")[1]
    //     ? null
    //     : source;

    const normalisedSource =
      source && typeof source.uri === "string" && source.uri.length > 20
        ? source
        : null;

    return (
      // <PinchGestureHandler
      //   onGestureEvent={this.onZoomEvent}
      //   onHandlerStateChange={this.onZoomStateChange}
      // >
      <Animated.View
        style={[
          transparentBackground
            ? styles.containerTransParent
            : styles.container,
          { transform: [{ scale: this.scale }] },
        ]}
      >
        {/* )} */}
        {/* {source.uri && source.uri.length > 2 ? (
          <ActivityIndicator
            size="small"
            color="rgb(215, 80, 80)"
            style={[styles.imageOverlay, style]}
            onLoad={this.onImageLoad}
          />
        ) : null} */}
        {/* {alert(type)} */}
        {thumbnailSource &&
        thumbnailSource.uri &&
        thumbnailSource.uri.length > 10 ? (
          <Animated.Image
            {...props}
            source={thumbnailSource}
            style={[
              style,
              {
                opacity: this.thumbnailAnimated,
                // transform: [{ scale: this.scale }],
              },
            ]}
            onLoad={this.handleThumbnailLoad}
            // blurRadius={type === "video" ? 0 : 1}
          />
        ) : (
          <Animated.Image
            {...props}
            source={require("../assets/profilePlaceholder.png")}
            style={[
              style,
              {
                opacity: 1,
                // transform: [{ scale: this.scale }],
              },
            ]}
            resizeMode="contain"
          />
        )}
        {/* {type !== "vr" && normalisedSource && ( */}
        {type != "video" && normalisedSource && (
          <FastImage
            {...props}
            source={source}
            // source={{ uri: source.uri, priority: FastImage.priority.low }}
            style={[
              styles.imageOverlay,
              {
                opacity: this.state.opacity,
              },
              style,
            ]}
            onLoad={this.onImageLoad}
          />
        )}
        {type === "vr" && (
          <Text
            style={{
              color: "rgb(255,255,255)",
              fontSize: 20,
              right: 10,
              top: 10,
              position: "absolute",
              shadowOpacity: 1,
              fontWeight: "bold",
            }}
          >
            360
          </Text>
        )}
      </Animated.View>
      // </PinchGestureHandler>
    );
  }
}

export default ProgressiveImage;
