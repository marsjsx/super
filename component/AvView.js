import React from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  Animated,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import Video from "react-native-video";
import { Ionicons, MaterialCommunityIcons, Entypo } from "@expo/vector-icons";
import ProgressiveImage from "./ProgressiveImage";
import * as Animatable from "react-native-animatable";
import Icon from "react-native-vector-icons/AntDesign";
const { width, height } = Dimensions.get("window");
import { PinchGestureHandler, State } from "react-native-gesture-handler";
import styles from "../styles";
import * as ScreenOrientation from "expo-screen-orientation";
import { PanoramaView } from "@lightbase/react-native-panorama-view";

const AnimatedIcon = Animatable.createAnimatableComponent(Icon);

class AvView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rate: 1,
      volume: 1,
      muted: false,
      resizeMode: "contain",
      duration: 0.0,
      currentTime: 0.0,
      controls: false,
      paused: true,
      skin: "custom",
      vrLoaded: false,
      ignoreSilentSwitch: null,
      isBuffering: false,
      imageHeight: 0,
    };
    this.lastPress = 0;
    this.onLoad = this.onLoad.bind(this);
    this.onProgress = this.onProgress.bind(this);
    this.onBuffer = this.onBuffer.bind(this);
  }

  //   componentWillMount() {
  //     if (this.props.type === "image") {
  //       Image.getSize(this.props.source, (w, h) => {
  //         this.setState({ imageHeight: Math.floor(h * (width / w)) });
  //       });
  //     }
  //   }

  handleLargeAnimatedIconRef = (ref) => {
    this.largeAnimatedIcon = ref;
  };

  animateIcon = () => {
    const { liked } = this.state;
    this.largeAnimatedIcon.stopAnimation();

    this.largeAnimatedIcon.bounceOut();

    // if (liked) {
    //   this.largeAnimatedIcon.bounceIn()
    //     .then(() => this.largeAnimatedIcon.bounceOut())
    //   this.smallAnimatedIcon.pulse(200)
    // } else {
    //   this.largeAnimatedIcon.bounceIn()
    //     .then(() => {
    //       this.largeAnimatedIcon.bounceOut()
    //       this.smallAnimatedIcon.bounceIn()
    //     })
    //     .then(() => {
    //       if (!liked) {
    //         this.setState(prevState => ({ liked: !prevState.liked }))
    //       }
    //     })
    // }
  };

  onLoad(data) {
    this.setState({ duration: data.duration });
  }

  onProgress(data) {
    this.setState({ currentTime: data.currentTime });
  }
  videoError(error) {
    alert("Error while loading video");
  }

  onBuffer({ isBuffering }: { isBuffering: boolean }) {
    this.setState({ isBuffering });
  }

  pauseVideo = () => {
    if (this.video) {
      this.setState({ paused: true });
      //    this.video.pauseAsync();
    }
  };

  playVideo = () => {
    if (this.video) {
      this.setState({ paused: false });
      // this.video.playAsync();
    }
  };

  enterFullScreen = () => {
    if (this.video) {
      setTimeout(() => {
        this.video.presentFullscreenPlayer();
      }, 1000);
    }
  };

  enterFullScreenImage = async () => {
    // ScreenOrientation.unlockAsync();
    // await ScreenOrientation.lockAsync(
    //   ScreenOrientation.OrientationLock.LANDSCAPE
    // );
    this.props.navigation.navigate("FullScreenImage", { data: this.props });
  };

  handlePlaying = (isVisible) => {
    isVisible ? this.playVideo() : this.pauseVideo();
  };

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

  handleOnPress = () => {
    const time = new Date().getTime();
    const delta = time - this.lastPress;
    const doublePressDelay = 400;

    if (delta < doublePressDelay) {
      this.props.onDoubleTap();
      this.animateIcon();
    } else {
      setTimeout(() => {
        const time = new Date().getTime();
        const delta = time - this.lastPress;
        if (delta > 500) {
          this.setState({ paused: !this.state.paused });
        }
      }, 600);
    }
    this.lastPress = time;
  };
  onImageLoad = () => {
    // alert("Called");
    this.setState({ vrLoaded: true });
  };
  handleThumbnailLoad = () => {
    Animated.timing(this.thumbnailAnimated, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };
  thumbnailAnimated = new Animated.Value(0);

  render() {
    if (this.props.type === "image") {
      return (
        <TouchableOpacity
          style={{ justifyContent: "center" }}
          onPress={this.handleOnPress}
          activeOpacity={1}
        >
          {/* <Image
              source={{ uri: this.props.source }}
              style={{ width, height: this.state.imageHeight }}
              resizeMode={"contain"}
            /> */}
          <AnimatedIcon
            ref={this.handleLargeAnimatedIconRef}
            name="heart"
            color="red"
            size={96}
            style={styles.animatedIcon}
            duration={800}
            delay={200}
          />
          <ProgressiveImage
            thumbnailSource={{
              uri: this.props.preview,
            }}
            source={{ uri: this.props.source }}
            style={this.props.style}
            // resizeMode={"stretch"}
          />
          {/* <TouchableOpacity
            style={{
              position: "absolute",
              top: this.props.flow === "home" ? 33 : 100,
              // top: 100,

              left: 10,
            }}
            onPress={() => this.enterFullScreenImage()}
          >
            <Ionicons
              name="md-phone-landscape"
              size={40}
              color="white"
              style={{
                backgroundColor: "transparent",
                alignSelf: "center",
                shadowOpacity: 1,
                // lineHeight: 40,
                // marginLeft: 10,
              }}
            />
          </TouchableOpacity> */}
        </TouchableOpacity>
      );
    }
    if (this.props.type === "vr") {
      return (
        <TouchableOpacity
          style={{ justifyContent: "center" }}
          onPress={this.handleOnPress}
          activeOpacity={1}
        >
          {/* <Image
              source={{ uri: this.props.source }}
              style={{ width, height: this.state.imageHeight }}
              resizeMode={"contain"}
            /> */}
          <AnimatedIcon
            ref={this.handleLargeAnimatedIconRef}
            name="heart"
            color="red"
            size={96}
            style={styles.animatedIcon}
            duration={800}
            delay={200}
          />
          {/* <Animated.Image
            source={{ uri: this.props.preview }}
            style={[
              this.props.style,
              {
                opacity: this.thumbnailAnimated,
                // transform: [{ scale: this.scale }],
              },
            ]}
            onLoad={this.handleThumbnailLoad}
            blurRadius={1}
          /> */}
          <PanoramaView
            style={styles.postPhoto}
            dimensions={{
              height: Dimensions.get("window").height,
              width: Dimensions.get("window").width,
            }}
            inputType="mono"
            imageUrl={this.props.source}
            onImageLoaded={this.onImageLoad}
            enableTouchTracking={true}
          />
          {/* {this.state.vrLoaded && (
            <View
              style={{
                position: "absolute",
                top: height / 2 - 30,
                left: 0,
                right: 0,
                bottom: 0,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator size="large" color="rgb(215, 80, 80)" />
            </View>
          )} */}

          {/* <TouchableOpacity
            style={{
              position: "absolute",
              top: this.props.flow === "home" ? 33 : 100,
              // top: 100,
              left: 10,
            }}
            onPress={() => this.enterFullScreenImage()}
          >
            <Ionicons
              name="md-phone-landscape"
              size={40}
              color="white"
              style={{
                backgroundColor: "transparent",
                alignSelf: "center",
                shadowOpacity: 1,
                // lineHeight: 40,
                // marginLeft: 10,
              }}
            />
          </TouchableOpacity> */}
        </TouchableOpacity>
      );
    }

    return (
      // <PinchGestureHandler
      //   onGestureEvent={this.onZoomEvent}
      //   onHandlerStateChange={this.onZoomStateChange}
      // >
      <Animated.View style={[{ transform: [{ scale: this.scale }] }]}>
        <TouchableOpacity
          onPress={this.handleOnPress}
          activeOpacity={0.8}
          style={[
            this.props.style,
            { justifyContent: "center", alignItems: "center" },
          ]}
        >
          <AnimatedIcon
            ref={this.handleLargeAnimatedIconRef}
            name="heart"
            color="red"
            size={80}
            style={styles.animatedIcon}
            duration={800}
            delay={200}
          />
          <Video
            ref={(ref) => {
              this.video = ref;
            }}
            source={{ uri: this.props.source }}
            style={this.props.style}
            rate={this.state.rate}
            paused={this.state.paused}
            volume={this.state.volume}
            poster={this.props.preview}
            posterResizeMode="cover"
            muted={this.state.muted}
            ignoreSilentSwitch={"ignore"}
            resizeMode={"cover"}
            onLoad={this.onLoad}
            onBuffer={this.onBuffer}
            onProgress={this.onProgress}
            onError={this.videoError}
            onEnd={() => null}
            repeat={true}
          />
          {/* 
          <TouchableOpacity
            style={{
              position: "absolute",
              shadowOpacity: 1,
              top: this.props.flow === "home" ? 33 : 100,
              left: 0,
            }}
            onPress={() => this.enterFullScreen()}
          >
            <MaterialCommunityIcons
              name="fullscreen"
              size={52}
              color="white"
              style={{
                backgroundColor: "transparent",
                alignSelf: "center",
                shadowOpacity: 1,
                // lineHeight: 40,
                // marginLeft: 10,
              }}
            />
          </TouchableOpacity> */}
          {this.state.paused ? (
            <View
              style={{
                position: "absolute",
                height: 60,
                width: 60,
                justifyContent: "center",
                borderRadius: 30,
              }}
            >
              <Ionicons
                name="ios-play"
                size={40}
                color="white"
                style={{
                  backgroundColor: "transparent",
                  alignSelf: "center",
                  // lineHeight: 40,
                  // marginLeft: 10,
                }}
              />
            </View>
          ) : null}
        </TouchableOpacity>
      </Animated.View>
      // </PinchGestureHandler>
    );
  }
}
export default AvView;
