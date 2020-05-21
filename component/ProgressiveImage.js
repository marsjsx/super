import React from "react";
import {
  View,
  StyleSheet,
  Animated,
  ActivityIndicator,
  Dimensions,
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
      style,
      transparentBackground,
      ...props
    } = this.props;

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
        {source.uri ? (
          <ActivityIndicator
            size="small"
            color="rgb(215, 80, 80)"
            style={[styles.imageOverlay, style]}
            onLoad={this.onImageLoad}
          />
        ) : null}
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
          blurRadius={1}
        />

        <FastImage
          {...props}
          source={source}
          style={[
            styles.imageOverlay,
            {
              opacity: this.state.opacity,
            },
            style,
          ]}
          onLoad={this.onImageLoad}
        />
      </Animated.View>
      // </PinchGestureHandler>
    );
  }
}

export default ProgressiveImage;
