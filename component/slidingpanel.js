import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Animated,
  Dimensions,
  PanResponder,
  TouchableOpacity,
} from "react-native";
const { width, height } = Dimensions.get("window");
let sliderPosition = 0;
import Scale from "../helpers/Scale";
import { Ionicons, AntDesign } from "@expo/vector-icons";

const styles = StyleSheet.create({
  headerPanelViewStyle: {
    width,
    backgroundColor: "#ff0032",
    position: "absolute",
    alignSelf: "flex-end",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
});

const headerPanelHeight = Scale.moderateScale(50);

const HeaderView = (props) => (
  <View style={{ backgroundColor: "green" }}>
    <Text style={{ color: "white" }}>Hello world</Text>
  </View>
);

const SlidingPanelView = (props) => (
  <View style={{ backgroundColor: "blue" }}>
    <Text style={{ color: "white" }}>Hello world</Text>
  </View>
);

const SlidingPanelIOS = (props) => (
  <Animated.View
    style={
      props.panelPosition === "bottom"
        ? {
            bottom: props.heightAnim,
            flex: 1,
            position: "absolute",
            backgroundColor: "red",
          }
        : {
            top: props.heightAnim,
            flex: 1,
            position: "absolute",
            backgroundColor: "red",
          }
    }
  >
    <View
      style={
        props.panelPosition === "bottom"
          ? { top: props.headerPanelHeight, left: 0, position: "absolute" }
          : { bottom: props.headerPanelHeight, left: 0, position: "absolute" }
      }
    >
      {props.slidingPanelView()}
      <Animated.View
        {...props.panResponder}
        style={{
          height: headerPanelHeight,
          position: "absolute",
          bottom: 0,
        }}
      >
        <View
          style={{
            width: width,
            flexDirection: "row",
            height: headerPanelHeight,
            backgroundColor: "transparent",
            // opacity: 0.1,
            shadowOpacity: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            style={{
              position: "absolute",
              bottom: Scale.moderateScale(8),
              left: Scale.moderateScale(8),
            }}
            onPress={() => props.onGalleryPress()}
          >
            <Ionicons name="md-photos" size={32} color="white" />
          </TouchableOpacity>

          <View
            style={{
              flexDirection: "row",
              position: "absolute",
              right: Scale.moderateScale(8),
              bottom: Scale.moderateScale(8),
            }}
          >
            <TouchableOpacity style={{}} onPress={() => props.closePanel()}>
              <AntDesign name="upcircle" size={32} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              style={{ marginLeft: Scale.moderateScale(10) }}
              onPress={() => props.openPanel()}
            >
              <AntDesign name="downcircle" size={32} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </View>
    <Animated.View
      {...props.panResponder}
      style={{ height: props.headerPanelHeight }}
    >
      {props.headerView()}
    </Animated.View>
  </Animated.View>
);

const SlidingPanelAndroid = (props) => (
  <Animated.View
    style={
      props.panelPosition === "bottom"
        ? { bottom: props.heightAnim, flex: 1, position: "absolute" }
        : { top: props.heightAnim, flex: 1, position: "absolute" }
    }
  >
    <Animated.View
      {...props.panResponder}
      style={{ height: props.headerPanelHeight }}
    >
      {props.headerView()}
    </Animated.View>
    <Animated.View
      style={
        props.panelPosition === "bottom"
          ? { top: props.headerPanelHeight, left: 0, position: "absolute" }
          : { bottom: props.headerPanelHeight, left: 0, position: "absolute" }
      }
    >
      {props.slidingPanelView()}
    </Animated.View>
  </Animated.View>
);

export default class SlidingPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      heightAnim: new Animated.Value(0),
      panResponder: {},
      sliderHeight: 0,
    };
  }

  componentWillMount() {
    var a = 0;
    this.state.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt, gestureState) => {
        a = 0;
      },
      onPanResponderMove: (event, gestureState) => {
        if (this.props.allowDragging) {
          if (a === 0) {
            this.props.onDragStart(event, gestureState);
          } else {
            this.props.onDrag(event, gestureState);
          }
          if (this.props.panelPosition === "bottom") {
            a = gestureState.dy * -1;
          } else {
            a = gestureState.dy * 1;
          }
          if (
            (Platform.OS === "android"
              ? sliderPosition + a <
                (this.props.slidingPanelLayoutHeight
                  ? this.props.slidingPanelLayoutHeight
                  : height - (this.props.headerLayoutHeight + 25))
              : sliderPosition + a <
                (this.props.slidingPanelLayoutHeight
                  ? this.props.slidingPanelLayoutHeight
                  : height - (this.props.headerLayoutHeight - 2))) &&
            sliderPosition + a > headerPanelHeight
          ) {
            if (sliderPosition !== 0) {
              this.state.heightAnim.setValue(sliderPosition + a);
              this.props.sliderHeight(sliderPosition + a);
            } else {
              this.state.heightAnim.setValue(a);
              this.props.sliderHeight(a);
            }
          }
        }
      },
      onPanResponderRelease: (e, gesture) => {
        sliderPosition = sliderPosition + a;
        if (a !== 0) {
          this.props.onDragStop(e, gesture);
        }

        if (this.props.allowAnimation) {
          if (
            a === 0 ||
            (this.props.panelPosition === "bottom"
              ? gesture.vy < -1
              : gesture.vy > 1)
          ) {
            if (
              sliderPosition <
              (this.props.slidingPanelLayoutHeight
                ? this.props.slidingPanelLayoutHeight
                : height - this.props.headerLayoutHeight)
            ) {
              sliderPosition = this.props.slidingPanelLayoutHeight
                ? this.props.slidingPanelLayoutHeight
                : height - this.props.headerLayoutHeight;
              this.props.onAnimationStart();

              let value =
                Platform.OS === "android"
                  ? this.props.slidingPanelLayoutHeight
                    ? this.props.slidingPanelLayoutHeight
                    : height - this.props.headerLayoutHeight - 25
                  : this.props.slidingPanelLayoutHeight
                  ? this.props.slidingPanelLayoutHeight
                  : height - this.props.headerLayoutHeight;

              this.props.sliderHeight(value);
              Animated.timing(this.state.heightAnim, {
                toValue:
                  Platform.OS === "android"
                    ? this.props.slidingPanelLayoutHeight
                      ? this.props.slidingPanelLayoutHeight
                      : height - this.props.headerLayoutHeight - 25
                    : this.props.slidingPanelLayoutHeight
                    ? this.props.slidingPanelLayoutHeight
                    : height - this.props.headerLayoutHeight,
                duration: this.props.AnimationSpeed,
              }).start(() => this.props.onAnimationStop());
            } else {
              sliderPosition = headerPanelHeight;
              this.props.sliderHeight(headerPanelHeight);

              this.props.onAnimationStart();
              Animated.timing(this.state.heightAnim, {
                toValue: headerPanelHeight,
                duration: this.props.AnimationSpeed,
              }).start(() => this.props.onAnimationStop());
            }
          }
          if (
            this.props.panelPosition === "bottom"
              ? gesture.vy > 1
              : gesture.vy < -1
          ) {
            sliderPosition = 0;
            this.props.onAnimationStart();
            Animated.timing(this.state.heightAnim, {
              toValue: 0,
              duration: this.props.AnimationSpeed,
            }).start(() => this.props.onAnimationStop());
          }
        }
      },
    });
  }

  onRequestClose() {
    sliderPosition = headerPanelHeight;
    this.props.sliderHeight(headerPanelHeight);
    this.props.onAnimationStart();
    Animated.timing(this.state.heightAnim, {
      toValue: headerPanelHeight,
      duration: this.props.AnimationSpeed,
    }).start(() => this.props.onAnimationStop());
  }

  onRequestStart() {
    sliderPosition = this.props.slidingPanelLayoutHeight
      ? this.props.slidingPanelLayoutHeight
      : height - this.props.headerLayoutHeight;
    this.props.onAnimationStart();

    let value =
      Platform.OS === "android"
        ? this.props.slidingPanelLayoutHeight
          ? this.props.slidingPanelLayoutHeight
          : height - this.props.headerLayoutHeight - 25
        : this.props.slidingPanelLayoutHeight
        ? this.props.slidingPanelLayoutHeight
        : height - this.props.headerLayoutHeight;

    this.props.sliderHeight(value);

    Animated.timing(this.state.heightAnim, {
      toValue: value,
      duration: this.props.AnimationSpeed,
    }).start(() => this.props.onAnimationStop());
  }

  render() {
    return (
      <View
        style={
          this.props.panelPosition === "bottom"
            ? { position: "absolute", bottom: 0 }
            : { position: "absolute", top: 0 }
        }
      >
        {Platform.OS === "ios" && this.props.visible === true ? (
          <SlidingPanelIOS
            onGalleryPress={this.props.onGalleryPress}
            openPanel={() => this.onRequestStart()}
            closePanel={() => this.onRequestClose()}
            panResponder={this.state.panResponder.panHandlers}
            panelPosition={this.props.panelPosition}
            headerPanelHeight={this.props.headerLayoutHeight}
            headerView={() => this.props.headerLayout()}
            heightAnim={this.state.heightAnim}
            visible={this.props.visible}
            slidingPanelView={() => this.props.slidingPanelLayout()}
          />
        ) : (
          this.props.visible === true && (
            <SlidingPanelAndroid
              onGalleryPress={this.props.onGalleryPress}
              openPanel={() => this.onRequestStart()}
              closePanel={() => this.onRequestClose()}
              panResponder={this.state.panResponder.panHandlers}
              panelPosition={this.props.panelPosition}
              headerPanelHeight={this.props.headerLayoutHeight}
              headerView={() => this.props.headerLayout()}
              heightAnim={this.state.heightAnim}
              visible={this.props.visible}
              slidingPanelView={() => this.props.slidingPanelLayout()}
            />
          )
        )}
      </View>
    );
  }
}

SlidingPanel.propTypes = {
  headerLayoutHeight: PropTypes.number.isRequired,
  headerLayout: PropTypes.func.isRequired,
  slidingPanelLayout: PropTypes.func.isRequired,

  AnimationSpeed: PropTypes.number,
  slidingPanelLayoutHeight: PropTypes.number,
  panelPosition: PropTypes.string,
  visible: PropTypes.bool,
  allowDragging: PropTypes.bool,
  allowAnimation: PropTypes.bool,
  onDragStart: (event, gestureState) => {},
  onDragStop: (event, gestureState) => {},
  onDrag: (event, gestureState) => {},
  onAnimationStart: () => {},
  onAnimationStop: () => {},
};

SlidingPanel.defaultProps = {
  panelPosition: "bottom",
  headerLayoutHeight: 50,
  headerLayout: () => {},
  visible: true,
  onDragStart: (event, gestureState) => {},
  onDragStop: (event, gestureState) => {},
  onDrag: (event, gestureState) => {},
  onAnimationStart: () => {},
  onAnimationStop: () => {},
  slidingPanelLayout: () => {},
  allowDragging: true,
  allowAnimation: true,
  slidingPanelLayoutHeight: 0,
  AnimationSpeed: 1000,
};
