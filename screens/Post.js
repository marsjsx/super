import React from "react";
import styles from "../styles";
import ENV from "../env";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import * as ExpoImagePicker from "expo-image-picker";
import { ProcessingManager } from "react-native-video-processing";
import Loader from "../component/Loader";
import EmptyView from "../component/emptyview";
import * as ImageManipulator from "expo-image-manipulator";
import ImagePicker from "react-native-image-crop-picker";
import { PanoramaView } from "@lightbase/react-native-panorama-view";
import Editor, { displayTextWithMentions } from "../component/mentioneditor";
import db from "../config/firebase";
import Scale from "../helpers/Scale";
import CropperPage from "../screens/CropperPage";
import { showLoader } from "../util/Loader";

import _ from "lodash";

import {
  updateDescription,
  updateLocation,
  uploadPost,
  updatePhoto,
  filterBlockedPosts,
  createAndUpdatePreview,
  updatePhotoPreview,
} from "../actions/post";
import {
  FlatList,
  Modal,
  SafeAreaView,
  Text,
  View,
  Platform,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
  Dimensions,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
const GOOGLE_API =
  "https://maps.googleapis.com/maps/api/place/nearbysearch/json";
import { uploadPhoto } from "../actions/index";
import { showMessage, hideMessage } from "react-native-flash-message";

import Constants from "expo-constants";

import { Dropdown } from "react-native-material-dropdown";
import { Trimmer, VideoPlayer } from "react-native-video-processing";
// import { Audio, Video } from "expo-av";
import Video from "react-native-video";
import ImageEditor from "@react-native-community/image-editor";
import {
  Ionicons,
  MaterialIcons,
  Foundation,
  MaterialCommunityIcons,
  Octicons,
} from "@expo/vector-icons";
import constants from "../constants";
const { height, width } = Dimensions.get("window");
var self;
const filters = [
  "normal",
  "nightvision",
  "technicolor",
  "invert",
  "inkwell",
  "kodachrome",
  "luminance",
  "polaroid",
  "rgba",
  "greyscale",
  "lsd",
  "vintage",
  "sepia",
  "warm",
  "night",
  "duotone",
  "colortone",
  "browni",
];
class Post extends React.Component {
  constructor(props) {
    super(props);
    this.sheetRef = {};
    this.lastPress = 0;
    //Default visible isVisible
    this.isVisible = true;
    this.state = {
      showModal: false,
      locations: [],
      users: [],
      filters: [],
      loading: false,
      timer: null,
      showLoading: false,
      selectedSource: "",
      selectedSource: "",
      language: "",
      filteredImage: "",
      startTime: 0,
      endTime: 300,
      videoDuration: 0,
      showSignUpSheet: false,
      selectedLocation: "",
      currentTime: 0,
      initialValue: "",
      showEditor: true,
      message: null,
      messages: [],
      index: 0,
      videoUri: "",
      paused: false,
      isCropped: false,
      clearInput: false,
      showMentions: false /**use this parameter to programmatically trigger the mentionsList */,
    };
    this.start = this.start.bind(this);
  }

  async componentDidMount() {
    self = this;
    // alert("didMount Called");

    const selectedFile = this.props.post.photo;
    if (selectedFile) {
      this.processSelectedImage(selectedFile);
    }

    this.onWillFocus();
  }

  onFullScreen() {
    // Set the params to pass in fullscreen isVisible to navigationOptions
    this.props.navigation.setParams({
      fullscreen: !this.isVisible,
    });
    this.isVisible = !this.isVisible;

    if (this.isVisible) {
      this.showHeader();
    } else {
      this.props.navigation.setOptions({
        headerShown: false,
        title: "",
        gestureEnabled: false,
        headerRight: null,
      });
    }
  }

  showHeader() {
    this.props.navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      gestureEnabled: false,
      title: "",
      headerTintColor: constants.colors.white,
      headerRight: () => (
        <TouchableOpacity onPress={this._onNext}>
          <Text
            style={{
              color: constants.colors.white,
              fontWeight: "bold",
              padding: 5,
              fontSize: 16,
            }}
          >
            Next{" "}
          </Text>
        </TouchableOpacity>
      ),
    });
  }

  loadImage(index) {
    if (index < 18) {
      if (index === 0) {
        var stateFilters = this.state.filters;
        stateFilters.push(filters[index]);
        stateFilters.push(filters[index + 1]);
        stateFilters.push(filters[index + 2]);
        this.setState({ filters: stateFilters });
        index = index + 3;
        // this.loadImage(number);
      }

      // else{

      // }
      setTimeout(() => {
        // this.setState({ loading: false });
        var stateFilters = this.state.filters;
        stateFilters.push(filters[index]);
        stateFilters.push(filters[index + 1]);
        stateFilters.push(filters[index + 2]);
        this.setState({ filters: stateFilters });
        var number = index + 3;
        this.loadImage(number);
        // this.setState({ loading: false });
      }, 700);
    }
  }

  post = async () => {
    // alert(JSON.stringify(this.props.post.photo))
    // return

    if (!this.props.user.uid) {
      this.sheetRef.openSheet();
      return;
    }

    if (this.props.post.photo == null || this.props.post.photo == undefined) {
      showMessage({
        message: "STOP",
        description: "Please select an image/video",
        type: "danger",
        duration: 3000,
      });

      return;
    }

    if (this.props.post.photo.type === "image") {
      this.props.uploadPost();
      this.props.navigation.goBack();
      this.props.navigation.navigate("Home");
    } else if (this.props.post.photo.type === "vr") {
      this.props.uploadPost();
      this.props.navigation.goBack();
      this.props.navigation.navigate("Home");
    } else {
      // trim video first
      this.trimVideo();
    }
  };

  onWillFocus = () => {
    if (!this.props.post.photo) {
      this.openLibrary();
      this.showHeader();
    } else if (this.props.post.photo.type === "image") {
      this.onFullScreen();

      // if (Platform.OS === "android") {
      //   this.cropImage();
      //   this.showHeader();
      // } else {
      //   this.onFullScreen();
      // }
    } else if (this.props.post.photo.type === "vr") {
      this.cropImage("vr");
      this.showHeader();
    } else {
      this.showHeader();
    }
  };

  renderTopBar = () => (
    <View
      style={{
        alignSelf: "flex-end",
        position: "absolute",
        shadowOpacity: 1,
        paddingTop: Constants.statusBarHeight,
      }}
    >
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => this.openLibrary()}
      >
        <Foundation name="thumbnails" size={40} color="white" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => this.open3DLibrary()}
      >
        <MaterialCommunityIcons name="video-3d" size={40} color="white" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => this.props.navigation.navigate("Camera")}
      >
        <Ionicons name="ios-reverse-camera" size={40} color="white" />
      </TouchableOpacity>

      {this.props.post.photo && this.props.post.photo.type === "image" && (
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => this.cropImage()}
        >
          <Ionicons name="ios-crop" size={40} color="white" />
        </TouchableOpacity>
      )}
      {/* <Button
        rounded
        onPress={this.post}
        style={[styles.toggleButton, { backgroundColor: "orange" }]}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>Post</Text>
      </Button> */}
    </View>
  );

  processSelectedImage = async (selectedFile) => {
    // alert(JSON.stringify(selectedFile));
    // return;

    if (selectedFile.type === "image") {
      this.props.createAndUpdatePreview(selectedFile.uri);
    } else if (selectedFile.type === "video") {
      let videoDuration = Math.round(selectedFile.duration / 1000);

      // alert(selectedFile.duration)
      this.setState({
        startTime: 0,
        endTime: 300,
        videoDuration: 300,
      });

      if (selectedFile.duration < 300000) {
        this.setState({
          endTime: videoDuration,
          videoDuration: videoDuration,
        });
      }
      const maximumSize = { width: 300, height: 500 };
      ProcessingManager.getPreviewForSecond(
        selectedFile.uri,
        1,
        maximumSize,
        "base64"
      ).then((data) => {
        var imageData = "data:image/jpeg;base64," + data;
        this.props.updatePhotoPreview(imageData);
      });
    }
  };

  cropImage = async (type) => {
    // alert(JSON.stringify(this.props.post.photo.uri));

    var scalingFactor =
      this.props.post.photo.height / this.props.post.photo.width;

    var imageWidth = this.props.post.photo.width;
    var imageHeight = this.props.post.photo.height;

    if (this.props.post.photo.width > 7800) {
      imageWidth = 7800;
      // imageHeight = imageHeight * scalingFactor;
    }
    if (this.props.post.photo.height > 4000) {
      imageHeight = 4000;
    }

    await ImagePicker.openCropper({
      path: this.props.post.photo.uri,
      cropping: true,
      hideBottomControls: true, //android only
      // width: this.props.post.photo.width,
      // height: this.props.post.photo.height,
      width: type ? imageWidth : width * 1.5,
      height: type ? imageHeight : height * 1.5,
      compressImageQuality: 0.5,
    })
      .then((image) => {
        console.log(image);
        // alert(JSON.stringify(image));
        this.props.createAndUpdatePreview(image.path);
        // this.cleanTempImages();

        var selectedFile = {};
        selectedFile.height = image.height;
        selectedFile.width = image.width;
        selectedFile.size = image.size;
        selectedFile.uri = image.path;
        selectedFile.type = type ? "vr" : "image";

        this.props.updatePhoto(selectedFile);
        this.setState({ isCropped: true });
        this.setState({ filters: [] });
        if (selectedFile.type === "image") {
          this.loadImage(0);
        }
      })
      .catch((err) => {
        // alert("Called");
        // this.cleanTempImages();
        this.props.navigation.goBack();
        // Here you handle if the user cancels or any other errors
      });
  };

  openLibrary = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status === "granted") {
      const selectedFile = await ExpoImagePicker.launchImageLibraryAsync({
        mediaTypes: ExpoImagePicker.MediaTypeOptions.All,
        // allowsEditing: true,
        duration: 15000,
      });

      if (!selectedFile.cancelled) {
        // const uri = image.uri;
        // this.setState({ selectedSource: uri });

        // const maximumSize = { width: 100, height: 200 };
        // ProcessingManager.getPreviewForSecond(
        //   image.uri,
        //   1,
        //   maximumSize,
        //   "base64"
        // ).then((data) => alert(data));
        //  alert(JSON.stringify(selectedFile));
        this.props.updatePhoto(selectedFile);
        if (selectedFile.type === "image") {
          this.setState({ isCropped: false });

          //  this.props.createAndUpdatePreview(selectedFile.uri);
          this.setState({ index: 0 });
          this.cropImage();
        } else if (selectedFile.type === "video") {
          this.setState({
            startTime: 0,
            endTime: 300,
          });

          // alert(JSON.stringify(selectedFile));

          if (selectedFile.duration < 300000) {
            this.setState({
              endTime: Math.round(selectedFile.duration / 1000),
            });
          }
          const maximumSize = { width: 80, height: 80 };
          ProcessingManager.getPreviewForSecond(
            selectedFile.uri,
            1,
            maximumSize,
            "base64"
          ).then((data) => {
            var imageData = "data:image/jpeg;base64," + data;
            this.props.updatePhotoPreview(imageData);
          });
        }
      }
    }
  };

  open3DLibrary = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status === "granted") {
      const selectedFile = await ExpoImagePicker.launchImageLibraryAsync({
        mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
      });

      if (!selectedFile.cancelled) {
        this.setState({ isCropped: false });
        selectedFile.type = "vr";
        this.props.updatePhoto(selectedFile);
        this.props.createAndUpdatePreview(selectedFile.uri);
        this.cropImage("vr");
      }
    }
  };

  _onNext() {
    var _this = self;
    // alert("Called");

    if (!_this.props.user.uid) {
      _this.sheetRef.openSheet();
      return;
    }

    if (_this.props.post.photo == null || _this.props.post.photo == undefined) {
      showMessage({
        message: "STOP",
        description: "Please select an image/video",
        type: "danger",
        duration: 3000,
      });

      return;
    }

    if (_this.props.post.photo.type === "image") {
      if (_this.state.filteredImage) {
        _this.props.createAndUpdatePreview(_this.state.filteredImage);
      }
      _this.setState({ paused: true });

      _this.props.navigation.navigate("PostCaption", {
        filteredImage: _this.state.filteredImage,
      });
    } else if (_this.props.post.photo.type === "vr") {
      _this.setState({ paused: true });

      _this.props.navigation.navigate("PostCaption", {
        filteredImage: "",
      });
    } else {
      // trim video first
      _this.trimVideo();
    }
  }

  async trimVideo() {
    try {
      // let response = await this.videoPlayerRef.save();
      // alert(JSON.stringify(response));
      // return
      // portrait video output 720 x 1280
      // const origin = await ProcessingManager.getVideoInfo(
      //   this.props.post.photo.uri
      // );

      // const videoSize = origin.size;

      // const aspectRatio = 640 / 480;
      // const outputWidth = videoSize.width;
      // const outputHeight = parseInt(outputWidth * aspectRatio);
      // const options1 = {
      //   cropWidth: videoSize.width,
      //   cropHeight: outputHeight,
      //   cropOffsetX: 0,
      //   cropOffsetY: parseInt(Math.abs((videoSize.height - outputHeight) / 2)),
      // };
      // var result = await ProcessingManager.crop(
      //   this.props.post.photo.uri,
      //   options1
      // );
      // // alert(JSON.stringify(result));
      // // return;

      // const origin1 = await ProcessingManager.getVideoInfo(result);

      // alert(JSON.stringify(origin1));
      // return;

      // alert(this.state.startTime + " " + this.state.endTime);
      this.setState({ showLoading: true, paused: true });

      const options = {
        startTime: this.state.startTime,
        endTime: this.state.endTime,
        // quality: "720*480", // iOS only
        // quality: "1280x720", // iOS only
        // saveToCameraRoll: true, // default is false // iOS only
        // saveWithCurrentDate: true, // default is false // iOS only
      };

      // const duration = this.state.endTime - this.state.startTime;

      // this.props.updatePhoto({
      //   ...this.props.post.photo,
      //   duration: duration,
      // });
      // this.setState({ showLoading: false, paused: true });

      // this.props.navigation.navigate("VideoCover", {
      //   filteredImage: "",
      // });
      // return;

      ProcessingManager.trim(this.props.post.photo.uri, options) // like VideoPlayer trim options
        .then(async (newSource) => {
          const duration = this.state.endTime - this.state.startTime;

          const origin = await ProcessingManager.getVideoInfo(newSource);

          const videoSize = origin.size;

          // alert(JSON.stringify(origin));
          // return;

          // selectedFile.width = videoSize.width;
          // selectedFile.height = videoSize.height;
          var height = 800;

          if (videoSize.height < 800) {
            height = videoSize.height;
          }

          var widthFactor = videoSize.width / videoSize.height;
          var compressWidth = Math.round(height * widthFactor);
          var compressHeight = height;
          // this.props.updatePhoto({
          //   ...this.props.post.photo,
          //   duration: duration,
          //   uri: newSource,
          // });
          // this.setState({ showLoading: false, paused: true });

          // this.props.navigation.navigate("VideoCover", {
          //   filteredImage: "",
          // });

          ProcessingManager.compress(newSource, {
            width: compressWidth,
            height: compressHeight,
            bitrateMultiplier: 3,
            minimumBitrate: 1200000,
          })
            .then(async (result) => {
              var videoSource = "";

              if (Platform.OS === "android") {
                videoSource = result.source;
              } else {
                videoSource = result;
              }
              // alert(JSON.stringify(result));

              this.props.updatePhoto({
                ...this.props.post.photo,
                duration: duration,
                uri: videoSource,
              });
              this.setState({ showLoading: false, paused: true });

              this.props.navigation.navigate("VideoCover", {
                filteredImage: "",
              });
            })
            .catch((error) => {
              this.setState({ showLoading: false });
              console.log("error", error);
              alert(error);
            });
        });
    } catch (error) {
      alert(error);
    }
  }
  onEnd = () => {
    if (Platform.OS === "ios") {
      this.videoPlayerRef.seek(this.state.startTime);
    }
  };

  handleOnPress = () => {
    this.setState({ paused: !this.state.paused });
  };

  getSelectedComponent() {
    const selectedFile = this.props.post.photo;

    // alert(JSON.stringify(selectedFile));
    // return

    if (selectedFile) {
      if (selectedFile.type === "vr") {
        if (this.state.isCropped) {
          return (
            <View>
              <PanoramaView
                style={styles.postPhotoPreview}
                dimensions={{
                  height: height,
                  width: width,
                }}
                inputType="mono"
                imageUrl={this.props.post.photo.uri}
              />
              <Text
                style={{
                  color: "rgb(255,255,255)",
                  fontSize: 28,
                  position: "absolute",
                  fontWeight: "bold",
                  top: 100,
                  left: 20,
                  shadowOpacity: 1,
                }}
              >
                360
              </Text>
            </View>
          );
        }
        return null;
      } else if (selectedFile.type === "video") {
        return (
          <View style={styles.videoPlayer}>
            <TouchableOpacity
              style={{ justifyContent: "center", alignItems: "center" }}
              onPress={this.handleOnPress}
              activeOpacity={0.8}
            >
              <Video
                source={{ uri: this.props.post.photo.uri }} // Can be a URL or a local file.
                // source={{ uri: this.state.videoUri }}
                ref={(ref) => {
                  this.videoPlayerRef = ref;
                }} // Store reference
                onEnd={this.onEnd}
                style={styles.videoPlayer}
                paused={this.state.paused}
                onProgress={this.onProgress}
                resizeMode="cover"
                repeat={true}
              />
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
            <View
              style={{
                position: "absolute",
                bottom: 0,
                backgroundColor: "black",
              }}
            >
              <View
                style={{
                  marginHorizontal: 10,
                }}
              >
                <Trimmer
                  source={this.props.post.photo.uri}
                  height={Scale.moderateScale(100)}
                  width={Dimensions.get("screen").width - 20}
                  onTrackerMove={(e) => alert(e.currentTime)} // iOS only
                  currentTime={this.state.currentTime} // use this prop to set tracker position iOS only
                  themeColor={"white"} // iOS only
                  thumbWidth={Scale.moderateScale(10)} // iOS only
                  trackerColor={"green"} // iOS only
                  minLength={3}
                  maxLength={this.state.videoDuration}
                  // showTrackerHandle={true}
                  resizeMode={VideoPlayer.Constants.resizeMode.CONTAIN}
                  onChange={(e) => {
                    let startTime = Math.round(e.startTime);
                    let endTime = Math.round(e.endTime);
                    // if (endTime - startTime > 300) {
                    //   endTime = startTime + 300;
                    // }

                    this.setState({
                      startTime: startTime,
                      endTime: endTime,
                    });
                    this.videoPlayerRef.seek(this.state.startTime);
                    // this.videoPlayerRef.seek(this.state.startTime);
                    // this.onEnd;
                  }}
                />
                <Text
                  style={{
                    padding: 10,
                    backgroundColor: "black",
                    color: "white",
                  }}
                >
                  {`${
                    this.state.endTime - this.state.startTime
                  } second selected`}
                </Text>
              </View>
            </View>
          </View>
        );
      }
    } else {
      return <View style={styles.postPhotoPreview} />;
    }
  }

  getMaxDuration = (duration) => (_.isEmpty(duration) ? 15 : duration);

  getMinDuration = (duration) => (_.isEmpty(duration) ? 3 : duration);

  onProgress = ({ currentTime, playableDuration, seekableDuration }) => {
    this.setState({ currentTime: currentTime });
    if (currentTime >= this.state.endTime) {
      this.videoPlayerRef.seek(this.state.startTime);
    }
  };
  onChangeHandler = async (message) => {
    var searchQuery = message.displayText;
    this.props.updateDescription(searchQuery);
    var index = searchQuery.lastIndexOf("@");
    if (index >= 0) {
      var query = searchQuery.substring(index, searchQuery.length);
      // alert(query);
      var search = query.replace("@", "");
      if (search.length > 0) {
        // alert(search);
        // var search = message.text.replace("@", "");
        this.start(search);
      }
    }
  };

  resetTimer() {
    clearInterval(this.state.timer);
  }

  start(searchQuery) {
    // alert(searchQuery);

    var self = this;
    if (this.state.timer != null) {
      this.resetTimer();
    }

    let timer = setInterval(async () => {
      this.resetTimer();
      // alert(JSON.stringify(searchQuery));

      // let search = [];
      // let search = this.state.users;

      // // alert(searchQuery);

      // const query = await db
      //   .collection("users")
      //   .where("username", ">=", searchQuery)
      //   .get();

      // // alert(query.size);

      // query.forEach((response) => {
      //   if (response.data().username.includes(searchQuery)) {
      //     let user = response.data();
      //     var data = {
      //       id: user.uid,
      //       name: user.username,
      //       username: user.user_name,
      //       gender: "",
      //       photo: user.photo,
      //     };

      //     search.push(data);
      //   }
      // });
      // // alert(JSON.stringify(search.length));
      // this.setState({ users: search });
      //alert("View Counted");
    }, 500);
    this.setState({ timer });

    this.setState({
      clearInput: false,
    });
    //  this.props.updateDescription(searchQuery)
  }

  toggleEditor = () => {
    /**
     * This callback will be called
     * once user left the input field.
     * This will handle blur event.
     */
    // this.setState({
    //   showEditor: false,
    // })
  };

  onHideMentions = () => {
    /**
     * This callback will be called
     * When MentionsList hide due to any user change
     */
    this.setState({
      showMentions: false,
    });
  };

  onSave = (uri) => {
    this.props.createAndUpdatePreview(uri);
    // this.cleanTempImages();

    var selectedFile = {};
    // selectedFile.height = info.image.height;
    // selectedFile.width = info.image.width;
    // selectedFile.size = image.size;
    selectedFile.uri = uri;
    selectedFile.type = "image";

    this.props.updatePhoto(selectedFile);
    this.setState({ isCropped: true });
    this.setState({ filters: [] });
    // this.loadImage(0);

    // this.onFullScreen();

    this._onNext();
  };

  onCancel = () => {
    this.props.navigation.goBack();
  };

  render() {
    // const filter = this.filters[this.state.index];
    const selectedFile = this.props.post.photo;
    const { width, height, uri, type } = this.props.post.photo;

    // if (type == "image" && Platform.OS === "ios") {
    if (type == "image") {
      // if (type == "image" && Platform.OS === "ios" && !this.state.isCropped) {
      return (
        <CropperPage
          photo={this.props.post.photo}
          thumbnailPreview={this.props.post.thumbnailPreview}
          onSave={this.onSave}
          onCancel={this.onCancel}
        />
      );
    }
    return (
      <View
        style={{
          flex: 1,
          width: "100%",
          height: "100%",
        }}
      >
        {this.state.showLoading
          ? showLoader("Processing video, Please wait... ")
          : null}
        <KeyboardAvoidingView style={{ flex: 1, width: "100%" }}>
          <EmptyView
            ref={(ref) => {
              this.sheetRef = ref;
            }}
            navigation={this.props.navigation}
          />
          <ScrollView
            style={[{ width: "100%", height: "100%" }]}
            contentContainerStyle={{ alignItems: "center" }}
          >
            {/* <NavigationEvents onWillFocus={this.onWillFocus} /> */}
            {this.getSelectedComponent()}
          </ScrollView>
        </KeyboardAvoidingView>
        {this.state.loading ? (
          <Loader message="Loading image, Please wait... " bgColor="white" />
        ) : null}
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      updateDescription,
      uploadPost,
      updateLocation,
      uploadPhoto,
      updatePhoto,
      filterBlockedPosts,
      createAndUpdatePreview,
      updatePhotoPreview,
    },
    dispatch
  );
};

const mapStateToProps = (state) => {
  return {
    post: state.post,
    user: state.user,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Post);
