/* eslint-disable no-use-before-define */
import PropTypes from "prop-types";
import React from "react";
import { StyleSheet, View, ViewPropTypes } from "react-native";
import { Video } from "expo-av";

export default function MessageVideo({
  containerStyle,
  videoProps,
  videoStyle,
  currentMessage
}) {
  return (
    <View style={[styles.container, containerStyle]}>
      {/* <Video
        {...videoProps}
        source={{ uri: currentMessage.video1 }}
        style={videoStyle}
        resizeMode="cover"
      
      /> */}

      {/* <Video
        source={{
          uri: currentMessage.video1
        }}
        rate={1.0}
        volume={1.0}
        isMuted={false}
        resizeMode="cover"
        
        isLooping
        style={{ width: 300, height: 300 }}
      /> */}

      <Video
        ref={ref => {
          this.vid = ref;
        }}
        source={{
          uri: "http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4"
        }}
        rate={1.0}
        volume={1.0}
        muted={false}
        resizeMode="cover"
        repeat
        style={{ width: 300, height: 300 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {}
});

MessageVideo.defaultProps = {
  currentMessage: {
    // video: null,
  },
  containerStyle: {},
  videoStyle: {
    width: 150,
    height: 100,
    borderRadius: 13,
    margin: 3,
    resizeMode: "cover"
  },
  videoProps: {}
};

MessageVideo.propTypes = {
  currentMessage: PropTypes.object,
  containerStyle: ViewPropTypes.style,
  videoStyle: ViewPropTypes.style,
  videoProps: PropTypes.object
};
