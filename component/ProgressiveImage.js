import React from "react";
import { View, StyleSheet, Animated, ActivityIndicator } from "react-native";
import FastImage from "react-native-fast-image";

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

  thumbnailAnimated = new Animated.Value(0);

  // imageAnimated = new Animated.Value(0);

  handleThumbnailLoad = () => {
    Animated.timing(this.thumbnailAnimated, {
      toValue: 1,
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
      <View
        style={
          transparentBackground ? styles.containerTransParent : styles.container
        }
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
          style={[style, { opacity: this.thumbnailAnimated }]}
          onLoad={this.handleThumbnailLoad}
          blurRadius={1}
        />
        {/* <Animated.Image
          {...props}
          source={source}
          style={[styles.imageOverlay, { opacity: this.imageAnimated }, style]}
          onLoad={this.onImageLoad}
        /> */}

        <FastImage
          {...props}
          source={source}
          style={[styles.imageOverlay, { opacity: this.state.opacity }, style]}
          onLoad={this.onImageLoad}
        />

        {/* <FastImage
          style={{ width: 200, height: 200 }}
          source={{
            uri: "https://unsplash.it/400/400?image=1",
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.contain}
        /> */}
      </View>
    );
  }
}

export default ProgressiveImage;
