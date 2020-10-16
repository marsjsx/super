import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Platform,
  StatusBar,
} from "react-native";
import {
  Body,
  Button,
  Container,
  Content,
  Footer,
  Header,
  Left,
  Right,
} from "native-base";
import { colors } from "../../util/theme";
import Modal from "react-native-modalbox";
import { NavigationEvents } from "react-navigation";
import Swiper from "react-native-swiper";
import GalleryView from "../../component/GalleryView";
import CameraView from "../../component/CameraView";
import CameraView1 from "../../component/CameraView";
import CameraScreen from "../Camera";
import { showMessage, hideMessage } from "react-native-flash-message";
import { connect } from "react-redux";
import { openSettingsDialog } from "../../util/Helper";
import * as Permissions from "expo-permissions";

class Add extends React.Component {
  swiper: any;

  constructor(props: any) {
    super(props);
    this.cellRefs = null;
    this.cameraRef = null;
    this.cameraRef2 = null;

    this.state = {
      isModalOpen: false,
      activeIndex: 0,
      footerHeight: 60,
      isPaused: false,
      cameraViewFocused: false,
      cameraViewFocused2: false,
    };
  }

  componentWillReceiveProps(nextProps: any) {
    // @ts-ignore
    const { activeIndex } = this.state;
    // if (activeIndex > 0) {
    //   this.swiper.scrollBy(activeIndex * -1); //offset
    // }
  }

  async componentDidMount() {
    // add listener
    this.willBlurSubscription = this.props.navigation.addListener(
      "willBlur",
      this.willBlurAction
    );
    this.willFocusSubscription = this.props.navigation.addListener(
      "willFocus",
      this.willFocusAction
    );
  }

  componentWillUmount() {
    // remove listener
    this.willBlurSubscription.remove();
    this.willFocusSubscription.remove();
  }

  willBlurAction = (payload) => {
    this.setState({ isPaused: true });
    // const cell = this.cellRefs;
    // if (this.child) {
    //   this.child.pauseVideo;
    // }
  };
  willFocusAction = async (payload) => {
    if (Platform.OS === "ios") {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status === "granted") {
      } else {
        openSettingsDialog(
          "Failed to Access Photos, Please go to the Settings to enable access",
          this.props.navigation
        );
      }
    }
  };

  onMomentumScrollEnd(e: any, state: any, context: any) {
    this.setState({ activeIndex: state.index });
  }

  segmentClicked = (targetIndex: number) => {
    this.setState({
      activeIndex: targetIndex,
    });

    // @ts-ignore
    // const { activeIndex } = this.state;

    const currentIndex = this.swiper.state.index;
    const offset = targetIndex - currentIndex;
    this.swiper.scrollBy(offset);

    // if (index > 0) {
    //   this.swiper.scrollBy(index * -1); //offset
    // }
  };

  closeModal = () => {
    this.setState({ isModalOpen: false, isPaused: true });
    this.props.navigation.navigate("Home");
  };

  onNext = () => {
    if (this.props.post.photo == null || this.props.post.photo == undefined) {
      showMessage({
        message: "STOP",
        description: "Please select an image/video",
        type: "danger",
        duration: 3000,
      });

      return;
    }

    // alert(JSON.stringify(this.props.post.photo))
    this.setState({ isPaused: true });

    this.props.navigation.navigate("PostDetail");
  };

  render() {
    // @ts-ignore
    const { isModalOpen } = this.state;

    return (
      <Container>
        {Platform.OS === "ios" && <StatusBar hidden />}
        <NavigationEvents
          onDidFocus={(payload) => {
            this.setState({ isModalOpen: true });
          }}
        />
        <Modal
          style={styles.modal}
          isOpen={isModalOpen}
          onClosed={this.closeModal}
          position="center"
          swipeToClose
          swipeArea={250}
          backButtonClose
        >
          {/* <Content> */}
          <Swiper
            ref={(component) => (this.swiper = component)}
            removeClippedSubviews={false}
            onMomentumScrollEnd={this.onMomentumScrollEnd.bind(this)}
            loop={false}
            style={styles.wrapper}
            showsButtons={false}
            showsPagination={false}
            index={0}
            onIndexChanged={(index: number) => {
              this.setState({ activeIndex: index });
              if (index == 0) {
                this.setState({ isPaused: false });
              } else {
                this.setState({ isPaused: true });
              }

              if (index == 2) {
                this.setState({
                  cameraViewFocused: true,
                  cameraViewFocused2: false,
                });
              }

              if (index == 3) {
                this.setState({
                  cameraViewFocused: false,
                  cameraViewFocused2: true,
                });
              }
            }}
          >
            <View style={styles.slide1}>
              <GalleryView
                activeIndex={this.state.activeIndex}
                isPaused={this.state.isPaused}
                closeModel={this.closeModal}
                onNext={this.onNext}
                footerHeight={this.state.footerHeight}
                navigation={this.props.navigation}
              />
            </View>
            <View style={styles.slide4}>
              {this.state.activeIndex === 1 && (
                <GalleryView
                  activeIndex={this.state.activeIndex}
                  type="vr"
                  footerHeight={this.state.footerHeight}
                  closeModel={this.closeModal}
                  onNext={this.onNext}
                  isPaused={this.state.isPaused}
                  navigation={this.props.navigation}
                />
              )}
              {/* <GalleryView
                  activeIndex={this.state.activeIndex}
                  type="vr"
                  isPaused={this.state.isPaused}
                /> */}
            </View>
            <View style={styles.slide2}>
              <CameraView
                ref={(ref) => {
                  this.cameraRef = ref;
                }}
                type="camera"
                activeIndex={this.state.activeIndex}
                navigation={this.props.navigation}
                focused={this.state.cameraViewFocused}
              />
            </View>
            <View style={styles.slide2}>
              <CameraView
                ref={(ref) => {
                  this.cameraRef2 = ref;
                }}
                type="video"
                activeIndex={this.state.activeIndex}
                navigation={this.props.navigation}
                focused={this.state.cameraViewFocused2}
              />
            </View>
          </Swiper>
          {/* </Content> */}
          <Footer
            style={{
              backgroundColor: "#f5f5f5",
              borderTopWidth: 0,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                flex: 1,
              }}
              onLayout={(event) => {
                var { x, y, width, height } = event.nativeEvent.layout;
                this.setState({ footerHeight: height });
              }}
            >
              <Button
                transparent
                onPress={() => this.segmentClicked(0)}
                active={this.state.activeIndex === 0}
              >
                <Text
                  style={Object.assign({}, styles.btnActions, {
                    color:
                      this.state.activeIndex === 0
                        ? colors.black
                        : colors.dark_gray,
                  })}
                >
                  Gallery
                </Text>
              </Button>
              <Button
                transparent
                onPress={() => this.segmentClicked(1)}
                active={this.state.activeIndex === 1}
              >
                <Text
                  style={Object.assign({}, styles.btnActions, {
                    color:
                      this.state.activeIndex === 1
                        ? colors.black
                        : colors.dark_gray,
                  })}
                >
                  360
                </Text>
              </Button>
              <Button
                transparent
                onPress={() => this.segmentClicked(2)}
                active={this.state.activeIndex === 2}
              >
                <Text
                  style={Object.assign({}, styles.btnActions, {
                    color:
                      this.state.activeIndex === 2
                        ? colors.black
                        : colors.dark_gray,
                  })}
                >
                  Photo
                </Text>
              </Button>
              <Button
                transparent
                onPress={() => this.segmentClicked(3)}
                active={this.state.activeIndex === 3}
              >
                <Text
                  style={Object.assign({}, styles.btnActions, {
                    color:
                      this.state.activeIndex === 3
                        ? colors.black
                        : colors.dark_gray,
                  })}
                >
                  Video
                </Text>
              </Button>
            </View>
          </Footer>
        </Modal>
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    post: state.post,
    user: state.user,
  };
};

export default connect(mapStateToProps)(Add);

const styles = StyleSheet.create({
  wrapper: {},
  paddingContainer: {
    flexDirection: "column",
    padding: 16,
  },
  btnActions: {
    fontWeight: "bold",
    fontSize: 17,
    color: colors.white,
  },
  marginContainer: {
    marginTop: 16,
  },
  modal: {
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
    flex: 1,
  },
  scene: {
    flex: 1,
  },
  slide1: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#9DD6EB",
  },
  slide4: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#9DD6EB",
  },
  slide2: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#97CAE5",
  },
  slide3: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#92BBD9",
  },
});
