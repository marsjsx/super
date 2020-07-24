import React from "react";
import styles from "../styles";
import ENV from "../env";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import * as ExpoImagePicker from "expo-image-picker";
import { NavigationEvents } from "react-navigation";
import { ProcessingManager } from "react-native-video-processing";
import Loader from "../component/Loader";
import EmptyView from "../component/emptyview";
import * as ImageManipulator from "expo-image-manipulator";
import ImagePicker from "react-native-image-crop-picker";
import { PanoramaView } from "@lightbase/react-native-panorama-view";
import Editor, { displayTextWithMentions } from "../component/mentioneditor";
import db from "../config/firebase";

import _ from "lodash";

import {
  updateDescription,
  updateLocation,
  uploadPost,
  updatePhoto,
  createAndUpdatePreview,
  updatePhotoPreview,
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
  ImageBackground,
} from "react-native";
const GOOGLE_API =
  "https://maps.googleapis.com/maps/api/place/nearbysearch/json";
import { uploadPhoto } from "../actions/index";

import {
  Item,
  Input,
  Label,
  Picker,
  Icon,
  Button,
  Textarea,
  Form,
  Content,
} from "native-base";
import Constants from "expo-constants";

import { Dropdown } from "react-native-material-dropdown";
import { Trimmer, VideoPlayer } from "react-native-video-processing";
// import { Audio, Video } from "expo-av";
import Video from "react-native-video";
import Filter from "../component/Filter";
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
class Post extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerRight: (
        <TouchableOpacity onPress={navigation.getParam("onNext")}>
          <Text
            style={{
              color: "dodgerblue",
              fontWeight: "bold",
              padding: 5,
              fontSize: 16,
            }}
          >
            Next{" "}
          </Text>
        </TouchableOpacity>
      ),
    };
  };

  constructor(props) {
    super(props);
    this.sheetRef = {};
    this.lastPress = 0;

    this.state = {
      showModal: false,
      locations: [],
      users: [],
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
      clearInput: false,
      showMentions: false /**use this parameter to programmatically trigger the mentionsList */,
    };
    this.start = this.start.bind(this);
  }

  async componentDidMount() {
    self = this;
    // alert("didMount Called");
    this.props.navigation.setParams({ onNext: this._onNext });

    const selectedFile = this.props.post.photo;
    if (selectedFile) {
      this.processSelectedImage(selectedFile);
    }

    this.onWillFocus();

    let search = this.state.users;

    // alert(searchQuery);

    const query = await db.collection("users").get();

    // alert(query.size);

    query.forEach((response) => {
      let user = response.data();
      if (user.user_name) {
        var data = {
          id: user.uid,
          name: user.username,
          username: user.user_name,
          gender: "",
          photo: user.photo,
        };

        search.push(data);
      }
    });
    // alert(search.length);
    this.setState({ users: search });
  }

  loadImage() {
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ loading: false });
    }, 3000);
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
    } else if (this.props.post.photo.type === "image") {
      //alert(JSON.stringify(this.props.post.photo));
      this.cropImage();
    } else if (this.props.post.photo.type === "vr") {
      this.cropImage("vr");
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
      this.setState({
        startTime: 0,
        endTime: 59,
      });

      if (selectedFile.duration < 60000) {
        this.setState({
          endTime: Math.round(selectedFile.duration / 1000),
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

    await ImagePicker.openCropper({
      path: this.props.post.photo.uri,
      cropping: true,
      // width: 1200,
      width: type ? this.props.post.photo.width : 600,
      height: type ? this.props.post.photo.height : 1000,
      // width: this.props.post.photo.width,
      // height: this.props.post.photo.height,
      // // height: 1500,

      // compressImageQuality: type ? 0.4 : 0,
    })
      .then((image) => {
        console.log(image);
        // alert(JSON.stringify(image));
        this.props.createAndUpdatePreview(image.path);

        var selectedFile = {};
        selectedFile.height = image.height;
        selectedFile.width = image.width;
        selectedFile.size = image.size;
        selectedFile.uri = image.path;
        selectedFile.type = type ? "vr" : "image";

        this.props.updatePhoto(selectedFile);
        this.loadImage();
      })
      .catch((err) => {
        // this.props.navigation.goBack();
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
          //  this.props.createAndUpdatePreview(selectedFile.uri);
          this.setState({ index: 0 });
          this.cropImage();
        } else if (selectedFile.type === "video") {
          this.setState({
            startTime: 0,
            endTime: 59,
          });

          // alert(JSON.stringify(selectedFile));

          if (selectedFile.duration < 60000) {
            this.setState({
              endTime: Math.round(selectedFile.duration / 1000),
            });
          }
          const maximumSize = { width: 50, height: 500 };
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
    if (_this.props.post.photo.type === "image") {
      if (_this.state.filteredImage) {
        // alert(this.state.filteredImage);
        _this.props.createAndUpdatePreview(_this.state.filteredImage);

        // var selectedFile = this.props.post.photo;
        // selectedFile.uri = this.state.filteredImage;

        //   this.props.updatePhoto(selectedFile);
      }

      _this.props.navigation.navigate("PostCaption", {
        filteredImage: _this.state.filteredImage,
      });
    }
  }

  trimVideo() {
    // alert(this.state.startTime + " " + this.state.endTime);
    this.setState({ showLoading: true });

    const options = {
      startTime: this.state.startTime,
      endTime: this.state.endTime,
      quality: "1280x720", // iOS only
      // saveToCameraRoll: true, // default is false // iOS only
      // saveWithCurrentDate: true, // default is false // iOS only
    };

    // const selectedFile = this.props.post.photo;

    // this.props.updatePhoto(selectedFile);

    ProcessingManager.trim(this.props.post.photo.uri, options) // like VideoPlayer trim options
      .then((newSource) => {
        const duration = this.state.endTime - this.state.startTime;

        this.props.updatePhoto({
          ...this.props.post.photo,
          duration: duration,
          uri: newSource,
        });
        this.setState({ showLoading: false });

        this.props.uploadPost();
        this.props.navigation.goBack();

        this.props.navigation.navigate("Home");
      });

    // this.videoPlayerRef
    //   .trim(options)
    //   .then((newSource) => {
    //     // alert(JSON.stringify(newSource));

    //     const duration = this.state.endTime - this.state.startTime;

    //     this.props.updatePhoto({
    //       ...this.props.post.photo,
    //       duration: duration,
    //       uri: newSource,
    //     });

    //     this.props.uploadPost();
    //     this.props.navigation.navigate("Home");
    //   })
    //   .catch(console.warn);
  }
  onEnd = () => {
    this.videoPlayerRef.seek(this.state.startTime);
  };
  getSelectedComponent() {
    const selectedFile = this.props.post.photo;

    // alert(JSON.stringify(selectedFile));
    // return

    if (selectedFile) {
      if (selectedFile.type === "image") {
        return (
          <View>
            <ImageFilters
              key={""}
              name={""}
              index={this.state.index}
              resizeMode={"cover"}
              onExtractImage={({ nativeEvent }) => {
                this.setState({ filteredImage: nativeEvent.uri });
                // alert(nativeEvent.uri)
              }}
              extractImageEnabled={true}
              style={styles.postPhotoPreview}
              url={this.props.post.photo.uri}
              onChange={(index) => {
                // this.setState({ index: index });
              }}
            />
            {/* <Gingham
              image={
                <Image
                  style={styles.postPhotoPreview}
                  source={{ uri: this.props.post.photo.uri }}
                  resizeMode={"cover"}
                />
              }
            /> */}
            <FlatList
              horizontal={true}
              keyExtractor={(item) => JSON.stringify(item.name)}
              data={[
                "Normal",
                "Inkwell",
                "Reyes",
                "Moon",
                "Lark",
                "Clarendon",
                "Slumber",
                "Aden",
                "Perpetua",
                "Mayfair",
                "Rise",
                "Hudson",
                "Valencia",
                "Xpro2",
                "Willow",
                "Lofi",
                "Gingham",
                "Nashville",
              ]}
              renderItem={({ index, item }) => (
                <ImageFilters
                  key={item}
                  name={item}
                  index={index}
                  selectedIndex={this.state.index}
                  resizeMode={"cover"}
                  style={{ width: 120, height: 120 }}
                  url={this.props.post.photo.uri}
                  onChange={(value) => {
                    // alert(index);
                    this.setState({ index: index });

                    if (index === 0) {
                      this.setState({ filteredImage: "" });
                    }
                  }}
                ></ImageFilters>
              )}
            />
          </View>
          // <Image
          //   style={styles.postPhotoPreview}
          //   // source={{ uri: this.props.post.photo.uri }}
          //   source={{ uri: " https://i.imgur.com/5EOyTDQ.jpg" }}
          // />
        );
      }
      if (selectedFile.type === "vr") {
        return (
          <View>
            <PanoramaView
              style={styles.postPhotoPreview}
              dimensions={{
                height: height * 0.7,
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
              }}
            >
              VR
            </Text>
          </View>
        );
      } else if (selectedFile.type === "video") {
        return (
          <View style={styles.videoPlayer}>
            {/* <Video
              ref={(ref) => (this.videoPlayerRef = ref)}
              play={true} // default false
              replay={true} // should player play video again if it's ended
              rotate={false} // use this prop to rotate video if it captured in landscape mode iOS only
              source={{ uri: this.props.post.photo.uri }}
              playerWidth={Dimensions.get("screen").width} // iOS only
              playerHeight={300} // iOS only
              resizeMode={VideoPlayer.Constants.resizeMode.CONTAIN}
              style={{ backgroundColor: "black" }}
              onProgress={this.onProgress}
              startTime={10} // seconds
              endTime={14} // seconds
              onChange={({ nativeEvent }) => console.log({ nativeEvent })} // get Current time on every second
            /> */}

            <Video
              source={{ uri: this.props.post.photo.uri }} // Can be a URL or a local file.
              ref={(ref) => {
                this.videoPlayerRef = ref;
              }} // Store reference
              onEnd={this.onEnd}
              style={styles.videoPlayer}
              onProgress={this.onProgress}
              resizeMode="cover"
            />
            <View style={{ position: "absolute", bottom: 0 }}>
              <Trimmer
                source={this.props.post.photo.uri}
                height={50}
                width={Dimensions.get("screen").width}
                onTrackerMove={(e) => alert(e.currentTime)} // iOS only
                currentTime={this.state.currentTime} // use this prop to set tracker position iOS only
                themeColor={"blue"} // iOS only
                thumbWidth={30} // iOS only
                trackerColor={"green"} // iOS only
                minLength={3}
                maxLength={60}
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
              <Text
                style={{
                  padding: 10,
                  backgroundColor: "black",
                  color: "white",
                }}
              >
                {`${this.state.endTime - this.state.startTime} second selected`}
              </Text>
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

  render() {
    // const filter = this.filters[this.state.index];

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
            {/* <NavigationEvents onWillFocus={this.onWillFocus} /> */}
            {this.getSelectedComponent()}
            {this.renderTopBar()}

            {/* <TouchableOpacity
              style={{
                position: "absolute",
                right: 16,
                top: 100,
                zIndex: 100,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                this.onNext();
              }}
            >
              <Text
                style={{
                  color: "blue",
                  padding: 10,
                  fontWeight: "bold",
                  fontSize: 16,
                }}
              >
                Next{" "}
              </Text>
            </TouchableOpacity> */}

            {/* <Dropdown label='Tag People' data={data} containerStyle={styles.dropDown}/>
      <Dropdown label='Add Location' data={dataLoc} containerStyle={styles.dropDown} />
      <View style={[styles.postShare, styles.row, styles.space,]}>
        <Text style={[styles.left,{ color: 'rgba(150,150,150,0.9)' }]}>Facebook</Text>
        <TouchableOpacity style={[styles.buttonShare, styles.right]}>
          <Text style={[{ color: 'rgba(244,66,66,0.9)' }]}>SHARE</Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.postShare, styles.row, styles.space,]}>
        <Text style={[styles.left, { color: 'rgba(150,150,150,0.9)' }]}>Twitter</Text>
        <TouchableOpacity style={[styles.buttonShare, styles.right]}>
          <Text style={[{ color: 'rgba(244,66,66,0.9)' }]}>SHARE</Text>
        </TouchableOpacity>
      </View> */}
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
