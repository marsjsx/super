import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  View,
  Platform,
  Animated,
  Dimensions,
  PermissionsAndroid,
} from "react-native";
// import {RNCamera} from 'react-native-camera';
import { Camera as RNCamera } from "expo-camera";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { connect } from "react-redux";
import { openSettingsDialog } from "../util/Helper";
import * as ExpoImagePicker from "expo-image-picker";
const { height, width } = Dimensions.get("window");
import { check, PERMISSIONS, RESULTS } from "react-native-permissions";
import { showLoader } from "../util/Loader";

import { updatePhoto, createAndUpdatePreview } from "../actions/post";
import * as Permissions from "expo-permissions";

import { colors } from "../util/theme";
import { Toast } from "native-base";

class CameraView extends Component {
  constructor(props: any) {
    super(props);
    this.camera = null;

    this.state = {
      camera: {
        //captureTarget: RNCamera.Constants.CaptureTarget.cameraRoll,
        type: RNCamera.Constants.Type.back,
        // orientation: RNCamera.Constants.Orientation.auto,
        flashMode: RNCamera.Constants.FlashMode.auto,
      },
      permissionsGranted: false,

      galleryImagePath: false,
      cameraImagePath: false,
      isRecording: false,
      duration: 0,
      imageSourceType: 0,
      isCameraButton: false,
      timer: null,
      showLoading: false,
      animated: new Animated.Value(0),
      opacityA: new Animated.Value(1),
    };
  }

  async componentDidMount() {
    // const { status, granted } = await RNCamera.requestPermissionsAsync();
    // // const { status } = await Permissions.askAsync(Permissions.CAMERA);
    // // alert("Permission Status " + granted);
    // this.setState({ permissionsGranted: granted });

    // // alert(this.state.permissionsGranted);

    // if (status === "granted") {
    // } else {
    //   // alert("Denied");

    //   openSettingsDialog(
    //     "Failed to Access Camera, Please go to the Settings to enable access",
    //     this.props.navigation
    //   );
    // }
    this.didFocusSubscription = this.props.navigation.addListener(
      "focus",
      this.didFocusAction
    );
  }
  componentWillUmount() {
    // remove listener
    this.didFocusSubscription.remove();
  }
  didFocusAction = (payload) => {
    this.checkPermissions();
  };

  async checkPermissions() {
    const { status, granted } = await RNCamera.requestPermissionsAsync();
    // alert(granted);
    this.setState({ permissionsGranted: granted });
    if (granted) {
    } else {
      // alert("Denied");
      openSettingsDialog(
        "Failed to Access Camera, Please go to the Settings to enable access",
        this.props.navigation
      );
    }
  }

  takePicture = async () => {
    if (
      Platform.OS === "android" &&
      !(await this.hasCameraAndroidPermission())
    ) {
      openSettingsDialog(
        "Failed to Access Device Camera, Please go to the Settings to enable camera access",
        this.props.navigation
      );
      return;
    }

    if (this.camera) {
      const options = { quality: 0.5 };
      this.camera
        .takePictureAsync(options)
        .then((data: any) => {
          data.type = "image";
          // alert(JSON.stringify(data));
          const d = new Date();
          var timestamp = d.getTime();
          this.setState({ cameraImagePath: data });

          // RNFetchBlob.fs.readFile(data.uri, 'base64')
          //     .then((data) => {
          //         this.setState({cameraImagePath: `data:image/jpg;base64,${data}`});
          //     });
        })
        .catch((err: any) => console.error(err));
    }
  };

  async hasCameraAndroidPermission() {
    const permission = PermissionsAndroid.PERMISSIONS.CAMERA;

    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
      return true;
    }
    try {
      const status = await PermissionsAndroid.request(permission);
      return status === "granted";
    } catch (error) {
      // return false;
      alert("Permission Denied, Can't access camera ");
    }
  }

  renderNoPermissions = () => (
    <View style={styles.noPermissions}>
      {/* {this.checkPermissions()} */}
      <Text style={{ color: "white" }}>
        Camera permissions not granted - cannot open camera preview.
      </Text>
    </View>
  );

  switchType = () => {
    let newType;
    const { back, front } = RNCamera.Constants.Type;

    if (this.state.camera.type === back) {
      newType = front;
    } else if (this.state.camera.type === front) {
      newType = back;
    }

    this.setState({
      camera: {
        ...this.state.camera,
        type: newType,
      },
    });
  };

  get typeIcon() {
    let icon;
    const { back, front } = RNCamera.Constants.Type;
    if (this.state.camera.type === back) {
      icon = require("../assets/images/ic_camera_rear_white.png");
    } else if (this.state.camera.type === front) {
      icon = require("../assets/images/ic_camera_front_white.png");
    }
    return icon;
  }

  switchFlash = () => {
    let newFlashMode;
    const { auto, on, off } = RNCamera.Constants.FlashMode;

    if (this.state.camera.flashMode === auto) {
      newFlashMode = on;
    } else if (this.state.camera.flashMode === on) {
      newFlashMode = off;
    } else if (this.state.camera.flashMode === off) {
      newFlashMode = auto;
    }

    this.setState({
      camera: {
        ...this.state.camera,
        flashMode: newFlashMode,
      },
    });
  };

  get flashIcon() {
    let icon;
    const { auto, on, off } = RNCamera.Constants.FlashMode;

    if (this.state.camera.flashMode === auto) {
      icon = require("../assets/images/ic_flash_auto_white.png");
    } else if (this.state.camera.flashMode === on) {
      icon = require("../assets/images/ic_flash_on_white.png");
    } else if (this.state.camera.flashMode === off) {
      icon = require("../assets/images/ic_flash_off_white.png");
    }

    return icon;
  }

  getSelectedImages(image: any, current: any) {
    console.log("====image path ===", current.uri);
    this.setState({ galleryImagePath: current.uri });

    // RNFetchBlob.fs.readFile(current.uri, 'base64')
    // .then((data) => {
    //   console.log("===base64 ====",data)
    //   this.setState({galleryImagePath:`data:image/jpg;base64,${data}`});
    // });
  }
  async hasAndroidPermission() {}
  async hasiOSMicroPhonePermission() {
    try {
      const { status } = await Permissions.askAsync(
        Permissions.AUDIO_RECORDING
      );
      // const status = await check(PERMISSIONS.IOS.MICROPHONE);
      // alert(JSON.stringify(status));
      return status === "granted";
    } catch (error) {
      alert("Permission Denied, Can't record video ");
      return false;
    }
  }
  startRecording = async () => {
    if (Platform.OS === "android") {
      const permission = PermissionsAndroid.PERMISSIONS.RECORD_AUDIO;

      const hasPermission = await PermissionsAndroid.check(permission);
      if (hasPermission) {
        this.startVideoRecording();
      } else {
        try {
          const status = await PermissionsAndroid.request(permission);
          if (status === "granted") {
            this.startVideoRecording();
          } else {
            openSettingsDialog(
              "Failed to record audio, Please go to the Settings to enable recording audio",
              this.props.navigation
            );
          }
        } catch (error) {
          // return false;
          openSettingsDialog(
            "Failed to record audio, Please go to the Settings to enable recording audio",
            this.props.navigation
          );
        }
      }
    }
    if (Platform.OS === "ios") {
      try {
        const { status } = await Permissions.askAsync(
          Permissions.AUDIO_RECORDING
        );

        if (status === "granted") {
          this.startVideoRecording();
        } else {
          openSettingsDialog(
            "Failed to record audio, Please go to the Settings to enable recording audio",
            this.props.navigation
          );
        }
      } catch (error) {
        openSettingsDialog(
          "Failed to record audio, Please go to the Settings to enable recording audio",
          this.props.navigation
        );
      }
    }
    // alert("Reached");
  };

  startVideoRecording() {
    if (this.camera) {
      this.startTimer();
      this.camera
        .recordAsync({ maxDuration: 59, quality: "4:3" })
        .then((data: any) => {
          let selectedfile = {};
          selectedfile.uri = data.uri;
          selectedfile.type = "video";

          selectedfile.duration = this.state.duration * 1000;
          this.clearTimer();
          this.props.dispatch(updatePhoto(selectedfile));
          this.props.navigation.navigate("PostDetail");
        })
        .catch((err: any) => alert("==error==" + err));
      this.setState({
        isRecording: true,
      });
    }
  }

  stopRecording = () => {
    if (this.camera) {
      this.camera.stopRecording();
      this.setState({
        isRecording: false,
      });
      this.stopTimer();
    }
  };

  toggleRecording() {
    const { isRecording } = this.state;

    return isRecording ? this.stopRecording() : this.startRecording();
  }

  cancleImage() {
    this.setState({ cameraImagePath: false });
  }

  onNext() {
    if (this.state.cameraImagePath) {
      this.props.dispatch(updatePhoto(this.state.cameraImagePath));
      //   this.props.navigation.goBack();

      this.props.navigation.navigate("PostDetail");
    }
  }

  printChronometer = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remseconds = seconds % 60;
    return (
      "" +
      (minutes < 10 ? "0" : "") +
      minutes +
      ":" +
      (remseconds < 10 ? "0" : "") +
      remseconds
    );
  };

  startTimer() {
    this.setState({ duration: 0 });

    let timer = setInterval(() => {
      this.setState({ duration: this.state.duration + 1 });
    }, 1000);
    this.setState({ timer });
  }

  stopTimer() {
    clearInterval(this.state.timer);
  }

  clearTimer() {
    this.setState({
      timer: null,
      duration: "00",
    });
  }
  openLibrary = async (type = "image") => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status === "granted") {
      var selectedFile;

      this.setState({ showLoading: true });
      selectedFile = await ExpoImagePicker.launchImageLibraryAsync({
        mediaTypes: ExpoImagePicker.MediaTypeOptions.All,
        // allowsEditing: true,
        duration: 60000,
      });
      this.setState({ showLoading: false });

      if (!selectedFile.cancelled) {
        if (type === "vr") {
          selectedFile.type = "vr";
        }

        this.props.dispatch(updatePhoto(selectedFile));
        this.props.navigation.navigate("PostDetail");

        // if ((selectedFile.type = "video")) {
        //   this.props.dispatch(updatePhoto(selectedFile));
        //   this.props.navigation.navigate("PostDetail");
        // } else {
        //   this.props.dispatch(updatePhoto(selectedFile));

        //   this.props.navigation.navigate("PostDetail");
        // }
      }
    }
  };

  renderCamera(permissionsGranted) {
    // const { permissionsGranted } = this.state;

    // alert(!this.state.cameraImagePath);
    if (permissionsGranted === false) {
      // alert(permissionsGranted);

      return this.renderNoPermissions();
    } else if (!this.state.cameraImagePath) {
      // alert(permissionsGranted);

      // if ((state && state.routeName === "Camera") || this.props.focused) {
      return (
        <RNCamera
          ref={(cam) => {
            this.camera = cam;
          }}
          style={styles.preview}
          aspect={this.state.camera.aspect}
          type={this.state.camera.type}
          flashMode={this.state.camera.flashMode}
          onFocusChanged={() => {}}
          onZoomChanged={() => {}}
          defaultTouchToFocus
          mirrorImage={false}
        >
          <TouchableOpacity
            style={{ position: "absolute", top: 15, left: 0 }}
            onPress={() => {
              this.clearTimer();

              this.props.navigation.navigate("Home");
              // this.props.navigation.goBack();
            }}
          >
            <Ionicons
              style={[styles.icon, { marginLeft: 20 }]}
              name={"ios-arrow-back"}
              color="white"
              size={32}
            />
          </TouchableOpacity>

          <View
            style={[
              styles.frontCameraOverlay,
              {
                position: "absolute",
                right: 0,
                left: 0,
                top: "50%",
              },
            ]}
          >
            <TouchableOpacity
              style={styles.typeButton}
              onPress={this.switchType}
            >
              <Image source={this.typeIcon} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.flashButton}
              onPress={this.switchFlash}
            >
              <Image source={this.flashIcon} />
            </TouchableOpacity>
          </View>

          <View style={[styles.bottomOverlay]}>
            {/* {this.props.activeIndex == 3 ? ( */}
            {/* <View style={styles.buttonOverlay}>
              <TouchableOpacity
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={() => {
                  this.toggleRecording();
                }}
              >
                <Ionicons
                  name={
                    this.state.isRecording
                      ? "ios-square"
                      : "ios-radio-button-on"
                  }
                  size={94}
                  color="red"
                />
                <Text
                  style={{
                    color: "white",
                    position: "absolute",
                  }}
                >
                  {this.printChronometer(this.state.duration)}
                </Text>
              </TouchableOpacity>
            </View> 
            {/* ) : ( */}
            <View style={styles.buttonOverlay}>
              <View
                style={{
                  flexDirection: "row",
                  marginVertical: 8,
                }}
              >
                <TouchableOpacity
                  onPress={() => this.setState({ imageSourceType: 0 })}
                >
                  <Text
                    style={{
                      color:
                        this.state.imageSourceType == 0 ? "orange" : "white",
                      marginHorizontal: 10,
                      padding: 5,
                    }}
                  >
                    PHOTO
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={async () => {
                    if (await this.hasiOSMicroPhonePermission()) {
                      this.setState({ imageSourceType: 1 });
                    } else {
                      openSettingsDialog(
                        "Failed to record audio, Please go to the Settings to enable recording audio",
                        this.props.navigation
                      );
                    }
                  }}
                >
                  <Text
                    style={{
                      color:
                        this.state.imageSourceType == 1 ? "orange" : "white",
                      marginHorizontal: 10,
                      padding: 5,
                    }}
                  >
                    VIDEO
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  // onPress={() => this.setState({ imageSourceType: 2 })}
                  onPress={() => this.openLibrary("vr")}
                >
                  <Text
                    style={{
                      color:
                        this.state.imageSourceType == 2 ? "orange" : "white",
                      marginHorizontal: 10,
                      padding: 5,
                    }}
                  >
                    360
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  width: "90%",
                  alignItems: "center",
                  alignContent: "center",
                  marginBottom: 30,
                  // backgroundColor: "red",
                  marginTop: 10,
                  justifyContent: "space-between",
                }}
              >
                <TouchableOpacity
                  style={{
                    alignItems: "center",
                  }}
                  onPress={() => this.openLibrary()}
                >
                  <Ionicons
                    name="ios-photos"
                    style={{ color: "#fff", fontSize: 40 }}
                  />
                </TouchableOpacity>
                {this.state.imageSourceType == 0 ? (
                  <TouchableOpacity
                    style={styles.captureButton}
                    onPress={this.takePicture}
                  >
                    <View style={styles.outerCircle}>
                      <View style={styles.innerCircle}></View>
                    </View>
                  </TouchableOpacity>
                ) : (
                  // <View style={styles.buttonOverlay}>
                  <TouchableOpacity
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onPress={() => {
                      this.toggleRecording();
                    }}
                  >
                    <Ionicons
                      style={{}}
                      name={
                        this.state.isRecording
                          ? "ios-square"
                          : "ios-radio-button-on"
                      }
                      size={94}
                      color="red"
                    />
                    <Text
                      style={{
                        color: "white",
                        position: "absolute",
                      }}
                    >
                      {this.printChronometer(this.state.duration)}
                    </Text>
                  </TouchableOpacity>
                  // </View>
                )}

                <TouchableOpacity
                  style={{
                    alignItems: "center",
                    backgroundColor: "transparent",
                  }}
                  onPress={this.switchType}
                  // onPress={() => this.handleCameraType()}
                >
                  <MaterialIcons
                    name="switch-camera"
                    style={{ color: "#fff", fontSize: 40 }}
                  />
                </TouchableOpacity>
              </View>
            </View>
            {/* )} */}
          </View>
        </RNCamera>
      );
      // } else {
      //   return <View style={{ flex: 1, backgroundColor: "black" }} />;
      // }
    }
    if (this.state.cameraImagePath) {
      return (
        <View style={{ flex: 1, padding: 0 }}>
          <View style={styles.header}>
            <View>
              <TouchableOpacity onPress={this.cancleImage.bind(this)}>
                {/* <Image source={require('../../assets/images/close.png')} style={styles.closeBtn}/> */}

                <Ionicons
                  style={[styles.icon, { marginLeft: 20 }]}
                  name={"ios-close"}
                  size={30}
                  color="white"
                />
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity onPress={this.onNext.bind(this)}>
                <Text style={{ color: "white", padding: 8 }}>Done </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.previewImage}>
            <Image
              source={{ uri: this.state.cameraImagePath.uri }}
              style={{ height: height }}
            />
          </View>
        </View>
      );
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.showLoading ? showLoader("Please wait... ") : null}
        {this.renderCamera(this.state.permissionsGranted)}
      </View>
    );
  }
}
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ updatePhoto }, dispatch);
};

const mapStateToProps = (state) => {
  return {};
};

export default connect(mapStateToProps)(CameraView);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
  },
  preview: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  noPermissions: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "black",
  },
  header: {
    height: 60,
    backgroundColor: colors.black,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 10,
    paddingRight: 10,
  },
  cancleBtn: {
    padding: 20,
  },
  doneBtn: {
    padding: 20,
  },
  closeImage: {
    height: 30,
    width: 30,
  },
  imageView: {
    paddingTop: 15,
  },
  image: {
    height: 500,
    width: null,
  },
  doneText: {
    position: "absolute",
    right: 10,
  },
  bottomOverlay: {
    position: "absolute",
    right: 0,
    left: 0,
    bottom: 0,
    alignItems: "center",
    backgroundColor: "rgba(52, 52, 52, 0.6)",
    // opacity: 0.5,
    // top: Dimensions.get("window").height * 0.6,
    flexDirection: "column",
    alignItems: "stretch",
  },
  frontCameraOverlay: {
    padding: 10,
    flexDirection: "row",
    backgroundColor: colors.transparent,
    justifyContent: "space-between",
  },
  buttonOverlay: {
    // height: 130,
    alignItems: "center",
    backgroundColor: colors.transparent,
    justifyContent: "center",
  },
  captureButton: {
    paddingLeft: 15,
    paddingRight: 15,
    marginVertical: 11,
  },
  typeButton: {
    padding: 5,
  },
  flashButton: {
    padding: 5,
  },
  closeBtn: {
    height: 25,
    width: 25,
  },
  outerCircle: {
    backgroundColor: "#ddd",
    height: 80,
    width: 80,
    borderRadius: 50,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#ccc",
  },
  innerCircle: {
    backgroundColor: "#fff",
    height: 50,
    width: 50,
    borderRadius: 50,
    margin: 14,
  },
  recOuterCircle: {
    backgroundColor: "#ddd",
    height: 80,
    width: 80,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#918b8b",
  },
  recInnerCircle: {
    backgroundColor: "#e54242",
    height: 70,
    width: 70,
    borderRadius: 50,
    margin: 4,
  },
  previewImage: {
    backgroundColor: "red",
  },
});
