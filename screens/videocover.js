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
// import Slider from "@react-native-community/slider";
// import Slider from "../component/slider";
var Slider = require("../component/Slider");
import MultiSlider from "../component/MultiSlider";
import _ from "lodash";
// import sliderThumb from "https://w7.pngwing.com/pngs/874/257/png-transparent-whatsapp-computer-icons-computer-software-whatsapp-text-logo-whatsapp-icon-thumbnail.png";

import {
  updateDescription,
  updateLocation,
  uploadPost,
  updatePhoto,
  createAndUpdatePreview,
  updatePhotoPreview,
  updateVideoCover,
} from "../actions/post";
import {
  FlatList,
  Modal,
  SafeAreaView,
  Text,
  View,
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
import { uploadPhoto } from "../actions/index";
import { showMessage, hideMessage } from "react-native-flash-message";

import {
  Item,
  Input,
  Label,
  Picker,
  Button,
  Textarea,
  Form,
  Content,
} from "native-base";

import Icon from "react-native-vector-icons";
import Constants from "expo-constants";

import { Dropdown } from "react-native-material-dropdown";
import { Trimmer, VideoPlayer } from "react-native-video-processing";
// import { Audio, Video } from "expo-av";
import Video from "react-native-video";
import constants from "../constants";
import ImageFilters from "../component/ImageFilters";

import {
  Ionicons,
  MaterialIcons,
  Foundation,
  MaterialCommunityIcons,
  Octicons,
} from "@expo/vector-icons";
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

  // "Willow",
  // "Lofi",
  // "Gingham",
  // "Nashville",
  // "Reyes",
  // "Moon",
  // "Lark",
  // "Clarendon",
  // "Slumber",
  // "Aden",
  // "Perpetua",
  // "Mayfair",
  // "Rise",
  // "Hudson",
  // "Valencia",
  // "Xpro2",
];
class VideoCover extends React.Component {
  // static navigationOptions = ({ navigation }) => {
  //   return {
  //     headerRight: (
  //       <TouchableOpacity onPress={navigation.getParam("onNext")}>
  //         <Text
  //           style={{
  //             color: "dodgerblue",
  //             fontWeight: "bold",
  //             padding: 5,
  //             fontSize: 16,
  //           }}
  //         >
  //           Next{" "}
  //         </Text>
  //       </TouchableOpacity>
  //     ),
  //   };
  // };

  constructor(props) {
    super(props);
    this.sheetRef = {};
    this.lastPress = 0;

    this.state = {
      showModal: false,
      locations: [],
      users: [],
      thumbIcon: null,
      filters: [],
      loading: false,
      timer: null,
      showLoading: false,
      selectedSource: "",
      selectedSource: "",
      language: "",
      filteredImage: "",
      startTime: 0,
      endTime: 59,
      showSignUpSheet: false,
      selectedLocation: "",
      currentTime: 0,
      initialValue: "",
      showEditor: true,
      message: null,
      messages: [],
      index: 0,
      paused: true,
      isCropped: false,
      clearInput: false,
      showMentions: false /**use this parameter to programmatically trigger the mentionsList */,
    };
  }

  async componentDidMount() {
    self = this;
    // alert("didMount Called");
    this.props.navigation.setParams({ onNext: this._onNext });

    this.props.navigation.setOptions({
      title: "Choose  Cover",
      gestureEnabled: false,
      headerShown: true,
      headerTransparent: true,
      headerTintColor: "#fff",
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
      headerLeft: () => (
        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
          <Ionicons
            style={[{ marginLeft: 20, color: "#fff" }]}
            name={"ios-arrow-back"}
            size={30}
          />
        </TouchableOpacity>
      ),
    });

    // Icon.getImageSource("circle", 15, "red").then((source) =>
    //   this.setState({ thumbIcon: source })
    // );

    setTimeout(() => {
      if (this.videoPlayerRef != null) {
        this.videoPlayerRef.seek(this.state.startTime);
      }
    }, 1500);
  }

  loadImage(index) {
    // if (index < 7) {
    //   this.setState({ loading: true });
    // } else {
    //   this.setState({ loading: false });
    // }
    // this.setState({ loading: true });
    // // alert(index);
    // // if (index < filters.length) {

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

  _onNext() {
    var _this = self;

    if (!_this.props.user.uid) {
      _this.sheetRef.openSheet();
      return;
    }
    // alert("Called");

    if (_this.props.post.photo == null || _this.props.post.photo == undefined) {
      showMessage({
        message: "STOP",
        description: "Please select an image/video",
        type: "danger",
        duration: 3000,
      });

      return;
    }

    // trim video first
    _this.trimVideo();
  }

  trimVideo() {
    // alert(this.state.startTime + " " + this.state.endTime);
    const selectedFile = this.props.post.photo;

    this.setState({ showLoading: true });
    // const maximumSize = { width: 100, height: 100 };
    const maximumSize = { width: 200, height: 400 };
    ProcessingManager.getPreviewForSecond(
      selectedFile.uri,
      this.state.startTime,
      maximumSize,
      "base64"
    ).then((data) => {
      var imageData = "data:image/jpeg;base64," + data;
      this.props.updatePhotoPreview(imageData);
      this.setState({ showLoading: false, paused: true });
      // _this.setState({ paused: true });

      // ProcessingManager.getPreviewForSecond(
      //   selectedFile.uri,
      //   this.state.startTime,
      //   videoCover,
      //   "base64"
      // ).then((data) => {
      //   var imageData = "data:image/jpeg;base64," + data;
      //   this.props.updateVideoCover(imageData);
      //   this.setState({ showLoading: false, paused: true });
      //   // _this.setState({ paused: true });

      //   this.props.navigation.navigate("PostCaption", {
      //     filteredImage: "",
      //   });
      // });

      this.props.navigation.navigate("PostCaption", {
        filteredImage: "",
      });
    });
  }
  onEnd = () => {
    this.videoPlayerRef.seek(this.state.startTime);
  };

  handleOnPress = () => {
    this.setState({ paused: !this.state.paused });
  };
  _renderThumbImage = () => {
    return <Image source={require("../assets/logo-1.png")} />;
  };
  getSelectedComponent() {
    const selectedFile = this.props.post.photo;

    // alert(JSON.stringify(selectedFile));
    // return

    if (selectedFile) {
      if (selectedFile.type === "image") {
        return <View />;
      }
      if (selectedFile.type === "vr") {
        return null;
      } else if (selectedFile.type === "video") {
        return (
          <View style={styles.videoPlayer}>
            <TouchableOpacity
              style={{ justifyContent: "center", alignItems: "center" }}
              // onPress={this.handleOnPress}
              activeOpacity={0.8}
            >
              <Video
                source={{ uri: this.props.post.photo.uri }} // Can be a URL or a local file.
                ref={(ref) => {
                  this.videoPlayerRef = ref;
                }} // Store reference
                onEnd={this.onEnd}
                style={styles.videoPlayer}
                paused={this.state.paused}
                onProgress={this.onProgress}
                resizeMode="cover"
              />
            </TouchableOpacity>
            <View
              style={{
                position: "absolute",
                bottom: 0,
                marginHorizontal: 20,
                // marginTop: 20,
                backgroundColor: "red",
              }}
            >
              <Trimmer
                source={this.props.post.photo.uri}
                height={50}
                width={Dimensions.get("screen").width - 40}
                // onTrackerMove={(e) => alert(e.currentTime)} // iOS only
                onTrackerMove={(e) => {
                  // alert(Math.round(e.currentTime));
                  this.setState({
                    startTime: Math.round(e.currentTime),
                  });
                  this.videoPlayerRef.seek(Math.round(e.currentTime));
                }} // iOS only
                currentTime={this.state.currentTime} // use this prop to set tracker position iOS only
                themeColor={"transparent"} // iOS only
                thumbWidth={1} // iOS only
                trackerColor={"transparent"} // iOS only
                minLength={0}
                maxLength={this.props.post.photo.duration}
                // showTrackerHandle={true}
                resizeMode={VideoPlayer.Constants.resizeMode.CONTAIN}
                onChange={(e) => {
                  this.setState({
                    startTime: Math.round(e.startTime),
                    endTime: Math.round(e.endTime),
                  });
                  this.videoPlayerRef.seek(this.state.startTime);
                  // this.videoPlayerRef.seek(this.state.startTime);
                  // this.onEnd;
                }}
              />
            </View>
            {/* <Slider
              style={{
                width: Dimensions.get("screen").width,
                // height: 60,
                position: "absolute",
                transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
                bottom: 30,
              }}
              minimumValue={0}
              maximumValue={this.props.post.photo.duration}
              step={1}
              onValueChange={(e) => {
                // alert(JSON.stringify(e));
                this.setState({
                  startTime: Math.round(e),
                });
                this.videoPlayerRef.seek(e);
              }}
              // thumbTintColor={"#7fff00"}
              thumbImage={this.state.thumbIcon}
              // thumbImage={this._renderThumbImage()}
              minimumTrackTintColor="transparent"
              maximumTrackTintColor="transparent"
            /> */}

            {/* <Slider
              trackStyle={{
                height: 10,
                borderRadius: 5,
                backgroundColor: "#d0d0d0",
              }}
              thumbStyle={{
                width: 10,
                height: 30,
                borderRadius: 5,
                backgroundColor: "#eb6e1b",
              }}
              minimumTrackTintColor="#eecba8"
            /> */}

            <View
              style={{
                width: Dimensions.get("screen").width,
                // height: 60,
                marginHorizontal: 20,
                position: "absolute",
                // transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
                bottom: 0,
              }}
            >
              <MultiSlider
                selectedStyle={{
                  backgroundColor: "transparent",
                }}
                unselectedStyle={{
                  backgroundColor: "transparent",
                }}
                // values={[5]}
                min={0}
                max={this.props.post.photo.duration}
                containerStyle={{
                  height: 20,
                }}
                onValuesChange={(e) => {
                  var value = Math.round(e[0]);
                  // alert(value);
                  this.setState({
                    startTime: Math.round(value),
                  });
                  this.videoPlayerRef.seek(value);
                }}
                step={1}
                trackStyle={{
                  height: 10,
                  backgroundColor: "transparent",
                }}
                touchDimensions={{
                  height: 50,
                  width: 50,
                  borderRadius: 20,
                  slipDisplacement: 40,
                }}
                // customMarker={CustomMarker}
                // customLabel={CustomLabel}
                sliderLength={Dimensions.get("screen").width - 40}
              />
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

  render() {
    // const filter = this.filters[this.state.index];
    const selectedFile = this.props.post.photo;

    return (
      <View style={{ flex: 1, width: "100%", height: "100%" }}>
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
      createAndUpdatePreview,
      updatePhotoPreview,
      updateVideoCover,
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

export default connect(mapStateToProps, mapDispatchToProps)(VideoCover);
