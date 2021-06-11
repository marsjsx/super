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
  TouchableHighlight,
  PermissionsAndroid,
} from "react-native";
import { RNCamera } from "react-native-camera";
import { Ionicons, MaterialIcons, Entypo } from "@expo/vector-icons";
import ImagePicker from "react-native-image-crop-picker";
import { connect } from "react-redux";
import { openSettingsDialog } from "../util/Helper";
import * as ExpoImagePicker from "expo-image-picker";
const { height, width } = Dimensions.get("window");
import { check, PERMISSIONS, RESULTS } from "react-native-permissions";
import { showLoader } from "../util/Loader";
import * as ImageManipulator from "expo-image-manipulator";
import { updatePhoto, createAndUpdatePreview } from "../actions/post";
import * as Permissions from "expo-permissions";
import constants from "../constants";
import EmptyView from "../component/emptyview";
import { colors } from "../util/theme";
import { Toast } from "native-base";

let recordingCancelled = false;
class CameraView extends Component {
  constructor(props: any) {
    super(props);
    this.camera = null;
    this.sheetRef = {};
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
      isLongHold: false,
      animated: new Animated.Value(0),
      opacityA: new Animated.Value(1),
    };
  }

  takePicture = async () => {
    if (this.camera) {
      const options = {
        quality: 0.5,
        orientation: RNCamera.Constants.Orientation.portrait,
      };
      this.camera
        .takePictureAsync({ options })
        .then(async (data: any) => {
          data.type = "image";
          const d = new Date();
          var timestamp = d.getTime();

          if (!this.props.user.uid) {
            this.sheetRef.openSheet();
            return;
          }

          this.props.dispatch(updatePhoto(data));

          this.props.navigation.navigate("PostDetail");
        })
        .catch((err: any) => console.error(err));
    }
  };

  renderNoPermissions = () => (
    <View style={styles.noPermissions}>
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
    recordingCancelled = true;
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
  }
  async hasAndroidPermission() {}
  async hasiOSMicroPhonePermission() {
    try {
      const { status } = await Permissions.askAsync(
        Permissions.AUDIO_RECORDING
      );

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
      recordingCancelled = false;
      this.camera
        .recordAsync({
          maxDuration: 59,
          quality: RNCamera.Constants.VideoQuality["480p"],
        })
        .then((data: any) => {
          if (recordingCancelled) {
            this.setState({
              isRecording: false,
            });
            this.clearTimer();
            return;
          }

          let selectedfile = {};
          selectedfile.uri = data.uri;
          selectedfile.type = "video";

          selectedfile.duration = this.state.duration * 1000;
          this.clearTimer();
          if (!this.props.user.uid) {
            this.sheetRef.openSheet();
            return;
          }

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
      if (!this.props.user.uid) {
        this.sheetRef.openSheet();
        return;
      }

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
    if (this.state.timer) {
      this.stopTimer();
    }

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
        quality: 0.9,
        duration: 60000,
      });
      this.setState({ showLoading: false });

      if (!selectedFile.cancelled) {
        if (type === "vr") {
          selectedFile.type = "vr";
        }
        if (!this.props.user.uid) {
          this.sheetRef.openSheet();
          return;
        }
        this.props.dispatch(updatePhoto(selectedFile));
        this.props.navigation.navigate("PostDetail");
      }
    }
  };

  openVRImages = async () => {
    ImagePicker.openPicker({
      smartAlbums: ["Panoramas"],
    }).then((image) => {
      var selectedFile = { ...image };
      selectedFile.type = "vr";
      selectedFile.uri = image.path;
      if (!this.props.user.uid) {
        this.sheetRef.openSheet();
        return;
      }

      this.props.dispatch(updatePhoto(selectedFile));
      this.props.navigation.navigate("PostDetail");
    });
  };

  async onHold() {
    if (await this.hasiOSMicroPhonePermission()) {
      this.setState({ isLongHold: true });

      const { isRecording } = this.state;

      return isRecording ? this.stopRecording() : this.startRecording();
    } else {
      openSettingsDialog(
        "Failed to record audio, Please go to the Settings to enable recording audio",
        this.props.navigation
      );
    }
  }

  onRelease() {
    this.setState({ isLongHold: false });

    const { isRecording } = this.state;

    if (isRecording) {
      this.stopRecording();
    }
  }

  renderCamera(permissionsGranted) {
    // if (permissionsGranted === false) {
    //   return this.renderNoPermissions();
    // }
    return (
      <RNCamera
        ref={(cam) => {
          this.camera = cam;
        }}
        style={styles.preview}
        type={this.state.camera.type}
        flashMode={this.state.camera.flashMode}
        androidCameraPermissionOptions={{
          title: "Permission to use camera",
          message: "We need your permission to use your camera",
          buttonPositive: "Ok",
          buttonNegative: "Cancel",
        }}
        androidRecordAudioPermissionOptions={{
          title: "Permission to use audio recording",
          message:
            "We need your permission to use your audio for video recordings",
          buttonPositive: "Ok",
          buttonNegative: "Cancel",
        }}
        defaultTouchToFocus
        mirrorImage={false}
        // forceUpOrientation={true}
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

        <Text
          style={{
            color: "white",
            position: "absolute",
            alignSelf: "center",
            top: 30,
            fontSize: 20,
            textAlign: "center",
          }}
        >
          {this.state.isRecording
            ? this.printChronometer(this.state.duration)
            : ""}
        </Text>

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
          <TouchableOpacity style={styles.typeButton} onPress={this.switchType}>
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
          <View style={styles.buttonOverlay}>
            <View
              style={{
                flexDirection: "row",
                marginVertical: 8,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  this.setState({ imageSourceType: 0 });

                  if (this.state.isRecording) {
                    recordingCancelled = true;
                    this.stopRecording();
                  }
                }}
              >
                <Text
                  style={{
                    color: this.state.imageSourceType == 0 ? "orange" : "white",
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
                    color: this.state.imageSourceType == 1 ? "orange" : "white",
                    marginHorizontal: 10,
                    padding: 5,
                  }}
                >
                  VIDEO
                </Text>
              </TouchableOpacity>
              {/* <TouchableOpacity
                // onPress={() => this.setState({ imageSourceType: 2 })}
                onPress={() => this.openLibrary("vr")}
              >
                <Text
                  style={{
                    color: this.state.imageSourceType == 2 ? "orange" : "white",
                    marginHorizontal: 10,
                    padding: 5,
                  }}
                >
                  360
                </Text>
              </TouchableOpacity> */}
            </View>
            <View
              style={{
                flexDirection: "row",
                width: "90%",
                alignItems: "center",
                alignContent: "center",
                marginBottom: 30,
                marginTop: 10,
                justifyContent: "space-around",
              }}
            >
              <TouchableOpacity
                style={{
                  alignItems: "center",
                }}
                onPress={() => this.openLibrary()}
              >
                <Entypo name="images" style={{ color: "#fff", fontSize: 40 }} />
              </TouchableOpacity>
              {/* <TouchableHighlight
                // style={styles.captureButton}
                onPressOut={() => this.onRelease()}
                onLongPress={() => this.onHold()}
                onPress={this.takePicture}
                delayLongPress={500}
                underlayColor={"#ff0000"}
                style={
                  this.state.isLongHold ? styles.btnPress : styles.btnNormal
                }
              >
                <Text
                  style={{
                    color: "white",
                    position: "absolute",
                  }}
                >
                  {this.state.isRecording
                    ? this.printChronometer(this.state.duration)
                    : ""}
                </Text>
              </TouchableHighlight> */}

              {this.state.imageSourceType == 0 ? (
                <TouchableOpacity
                  style={styles.btnNormal}
                  onPress={this.takePicture}
                >
                  {/* <View style={styles.outerCircle}>
                    <View style={styles.innerCircle}></View>
                  </View> */}
                </TouchableOpacity>
              ) : (
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
              )}

              <TouchableOpacity
                style={{
                  alignItems: "center",
                  backgroundColor: "transparent",
                }}
                onPress={() => this.openVRImages()}
              >
                <Image
                  style={{ width: 70, height: 70, tintColor: "#fff" }}
                  source={constants.images.icon360}
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

  render() {
    return (
      <View style={styles.container}>
        <View style={{ height: 0 }}>
          <EmptyView
            ref={(ref) => {
              this.sheetRef = ref;
            }}
            navigation={this.props.navigation}
          />
        </View>
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
  return {
    user: state.user,
  };
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
    // backgroundColor: "rgba(52, 52, 52, 0.6)",
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
  btnNormal: {
    marginVertical: 11,
    height: 80,
    width: 80,
    borderWidth: 8,
    borderRadius: 40,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  btnPress: {
    marginVertical: 11,
    height: 100,
    width: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 8,
    borderColor: "#fff",
  },
  captureButton: {
    marginVertical: 11,
    height: 80,
    width: 80,
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
