import React from "react";
import { View, StyleSheet, Animated, ActivityIndicator } from "react-native";

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
  },
  containerTransParent: {
    backgroundColor: "transparent"
  }
});

class ProgressiveImage extends React.Component {
  thumbnailAnimated = new Animated.Value(0);

  imageAnimated = new Animated.Value(0);

  handleThumbnailLoad = () => {
    Animated.timing(this.thumbnailAnimated, {
      toValue: 1
    }).start();
  };

  onImageLoad = () => {
    Animated.timing(this.imageAnimated, {
      toValue: 1
    }).start();
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
      <View
        style={
          transparentBackground ? styles.containerTransParent : styles.container
        }
      >
        <ActivityIndicator
          size="small"
          color="rgb(215, 80, 80)"
          style={[styles.imageOverlay, style]}
          onLoad={this.onImageLoad}
        />
        <Animated.Image
          {...props}
          source={thumbnailSource}
          style={[style, { opacity: this.thumbnailAnimated }]}
          onLoad={this.handleThumbnailLoad}
          blurRadius={1}
        />
        <Animated.Image
          {...props}
          source={source}
          style={[styles.imageOverlay, { opacity: this.imageAnimated }, style]}
          onLoad={this.onImageLoad}
        />
      </View>
    );
  }
}

export default ProgressiveImage;
