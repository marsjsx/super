import React from "react";
import styles from "../styles";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  Ionicons,
  SimpleLineIcons,
  FontAwesome,
  MaterialCommunityIcons,
  EvilIcons,
  Entypo,
  Octicons,
} from "@expo/vector-icons";

import Icon from "react-native-vector-icons/Feather";
import GestureRecognizer, { swipeDirections } from "../component/swipeguesture";

import { Icon as RNIonicons } from "react-native-vector-icons/Ionicons";
import {
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  Proger,
  Animated,
  ActivityIndicator,
  Share,
  StatusBar,
  Alert,
  Linking,
} from "react-native";
import {
  getPosts,
  newPostsListner,
  getMorePosts,
  mergeNewPosts,
  likePost,
  logVideoView,
  unlikePost,
  filterBlockedPosts,
  reportPost,
  getFilterPosts,
  getFollowingPosts,
  filterFollowingPosts,
  deletePost,
} from "../actions/post";
import { getUser, getBlockedUser } from "../actions/user";
import { CheckConnectivity } from "../helpers/checkinternetconnection";
import moment from "moment";
import * as Font from "expo-font";
import DoubleTap from "../component/DoubleTap";
import ProgressiveImage from "../component/ProgressiveImage";
import { showMessage, hideMessage } from "react-native-flash-message";
import { getMessages } from "../actions/message";
import { PanoramaView } from "@lightbase/react-native-panorama-view";
import Modal from "react-native-modal";
import ImagePicker from "react-native-image-crop-picker";
import Editor, { displayTextWithMentions } from "../component/mentioneditor";
import db from "../config/firebase";
import Scale from "../helpers/Scale";
import {
  updatePhoto,
  followUser,
  updateCompressedPhoto,
  updateUser,
  createAndUpdatePreview,
} from "../actions/user";

import * as Permissions from "expo-permissions";
import { validURL, openSettingsDialog } from "../util/Helper";
// import {
//   NewsByFollowing,
//   NewsByFollowingText,
//   NewsByFollowingTextBold,
// } from "./homestyle";
import {
  Header,
  Title,
  Subtitle,
  Content,
  Badge,
  Button,
  Left,
  Right,
  Body,
  Container,
  ActionSheet,
} from "native-base";

import ProgressBarAnimated from "../component/AnimatedProgressBar";

import { PinchGestureHandler, State } from "react-native-gesture-handler";

import { showLoader } from "../util/Loader";
const barWidth = Dimensions.get("screen").width - 30;

import AvView from "../component/AvView";

const { height, width } = Dimensions.get("window");

import { ShareDialog } from "react-native-fbsdk";
import { ShareApi } from "react-native-fbsdk";
import EmptyView from "../component/emptyview";
import ParsedText from "react-native-parsed-text";
import Dialog from "react-native-dialog";
import {
  InstagramProvider,
  ElementContainer,
} from "instagram-zoom-react-native";
// import { Share } from "react-native";
// import Share from "react-native-share";

const cellHeight = height * 0.6;
const cellWidth = width;

const viewabilityConfig = {
  itemVisiblePercentThreshold: 90,
};

var BUTTONS = ["Report", "Mute", "Share Post Link", "Cancel"];
var DESTRUCTIVE_INDEX = 3;
var CANCEL_INDEX = 4;

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.cellRefs = {};
    this.sheetRef = {};
    this.currentVideoKey = "";
    this.state = {
      fontLoaded: false,
      showLoading: false,
      result: "",
      selectedTab: 1,
      timer: null,
      dialogVisible: false,
      reportReason: "",
      selectedPost: {},
      refreshing: false,
      isModalVisible: false,
    };

    this.start = this.start.bind(this);
  }

  start(post) {
    var self = this;

    if (this.state.timer != null) {
      this.resetTimer();
    }

    // if (post.type === "video") {
    let timer = setInterval(() => {
      // log video view

      this.props.logVideoView(post);

      this.resetTimer();
      // alert("View Counted");
    }, 1500);
    this.setState({ timer });
    // }
  }

  showDialog = () => {
    this.setState({ dialogVisible: true });
  };

  resetTimer() {
    clearInterval(this.state.timer);
  }

  handleCancel = () => {
    this.setState({ dialogVisible: false });
  };
  async componentDidMount() {
    // get blocked users
    // this.props.getBlockedUser();
    // this.setState({ showLoading: true });

    // add listener
    this.willBlurSubscription = this.props.navigation.addListener(
      "willBlur",
      this.willBlurAction
    );

    //let isConnected = await CheckConnectivity();
    // var str = "  pat   Super  ";
    // var username = str.toLowerCase().replace(/\s+/g, "_");
    // alert(username);
    this.didFocusSubscription = this.props.navigation.addListener(
      "didFocus",
      this.didFocusAction
    );
    await Font.loadAsync({
      "open-sans-bold": require("../assets/fonts/OpenSans-Bold.ttf"),
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      ...Ionicons.font,
    });
    this.setState({ fontLoaded: true });

    if (this.props.post && this.props.post.feed) {
    } else {
      this.setState({ showLoading: true });
      await this.props.getPosts();
      this.setState({ showLoading: false });
    }

    // subscribe to post listner
    this.props.newPostsListner();

    // this.props.filterBlockedPosts();

    setTimeout(() => {
      this.props.filterBlockedPosts();

      this.props.getMessages();
    }, 1500); // simulating network

    setTimeout(() => {
      if (this.props.user.uid) {
        if (!this.props.user.photo) {
          if (!this.state.isModalVisible) {
            this.toggleModal();
          }
        }
      }

      // this.props.filterBlockedPosts();
    }, 2000);
  }

  componentWillUmount() {
    // remove listener
    this.willBlurSubscription.remove();
    this.didFocusSubscription.remove();
  }

  willBlurAction = (payload) => {
    if (this.currentVideoKey) {
      const cell = this.cellRefs[this.currentVideoKey];
      if (cell) {
        cell.pauseVideo();
      }
    }
  };

  didFocusAction = (payload) => {
    setTimeout(() => {
      if (this.props.user.uid) {
        if (!this.props.user.photo) {
          if (!this.state.isModalVisible) {
            this.toggleModal();
          }
        }
      }
    }, 2000);
  };

  likePost = (post) => {
    // this.props.filterBlockedPosts();

    if (!this.props.user.uid) {
      this.sheetRef.openSheet();
      return;
    }

    const { uid } = this.props.user;
    if (post.likes.includes(uid)) {
      this.props.unlikePost(post);
    } else {
      this.props.likePost(post);
    }
  };

  showActionSheet = (post) => {
    const { uid, isSuperAdmin } = this.props.user;

    var actions = [...BUTTONS];
    if (uid === post.uid || isSuperAdmin) {
      actions.splice(3, 0, "Delete");
    } else {
      DESTRUCTIVE_INDEX = -1;
      CANCEL_INDEX = 3;
    }
    this.actionSheet._root.showActionSheet(
      {
        options: actions,
        cancelButtonIndex: CANCEL_INDEX,
        destructiveButtonIndex: DESTRUCTIVE_INDEX,
      },
      (buttonIndex) => {
        //this.setState({ clicked: BUTTONS[buttonIndex] });
        if ("Delete" === actions[buttonIndex]) {
          Alert.alert(
            isSuperAdmin ? "SUPER ADMIN(Delete Post)" : "Delete post?",
            "Press OK to Delete Post. This action is irreversible, it cannot be undone.",
            [
              {
                text: "Cancel",
                onPress: () => alert("Cancelled"),
                style: "cancel",
              },
              { text: "OK", onPress: () => this.props.deletePost(post) },
            ],
            { cancelable: false }
          );
        } else if ("Report" === actions[buttonIndex]) {
          this.setState({
            dialogVisible: true,
            reportReason: "",
            selectedPost: post,
          });
        } else {
        }
      }
    );
  };

  onDoubleTap = (post) => {
    if (!this.props.user.uid) {
      this.sheetRef.openSheet();
      return;
    }

    const { uid } = this.props.user;
    if (post.likes.includes(uid)) {
      // this.props.unlikePost(post);
    } else {
      this.props.likePost(post);
    }
  };

  navigateMap = (item) => {
    this.props.navigation.navigate("Map", {
      location: item.postLocation,
    });
  };

  goToUser = (user) => {
    // this.props.getUser(user.uid);
    this.props.navigation.navigate("Profile", { uid: user.uid });
  };

  getUnSeenMessageCount() {
    let unseenMessageCount = 0;
    if (this.props.messages.length) {
      this.props.messages.forEach((element) => {
        element.chats.forEach((item) => {
          if (!item.seenBy[this.props.user.uid]) {
            unseenMessageCount++;
          }
        });
      });
    }

    return unseenMessageCount;
  }
  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };
  getUploadingFile(progress) {
    if (progress > 99) {
      this.flatListRef.scrollToOffset({ animated: true, offset: 0 });
    }
    return (
      <View
        style={[
          styles.center,
          {
            position: "absolute",
            zIndex: 2,
            top: 90,
            width: "100%",
            flexDirection: "row",
          },
        ]}
      >
        <ProgressiveImage
          style={styles.roundImage60}
          resizeMode="cover"
          transparentBackground="transparent"
          source={{ uri: this.props.post.preview }}
        />
        <View>
          <Text
            style={[styles.bold, { color: "rgba(225,30,30,0.85)" }]}
          >{`Uploading Post ... ${progress}%`}</Text>

          <ProgressBarAnimated
            width={barWidth - 80}
            value={progress}
            backgroundColorOnComplete="#6CC644"
          />
        </View>
      </View>
    );
  }

  checkForNewposts() {
    return (
      <TouchableOpacity
        style={[
          styles.center,
          {
            position: "absolute",
            zIndex: 2,
            borderRadius: Scale.moderateScale(20),
            padding: Scale.moderateScale(10),
            top: 90,
            backgroundColor: "#1e90ff",
            flexDirection: "row",
          },
        ]}
        onPress={() => {
          this.props.mergeNewPosts();

          this.flatListRef.scrollToOffset({ animated: true, offset: 0 });
        }}
      >
        <Text style={{ color: "#fff" }}>New Posts Available</Text>
      </TouchableOpacity>
    );
  }

  onShare = async (item) => {
    const shareLinkContent = {
      contentType: "link",
      contentUrl: item.postPhoto,
      contentDescription: item.postDescription,
      contentTitle: item.postDescription,
      quote: item.postLocation.name,
      imageUrl: item.preview,
    };

    this.shareLinkWithShareDialog(shareLinkContent);
    // this.shareLinkSilently(shareLinkContent)

    // ShareApi.share(shareLinkContent, '/me', 'Some message.');
  };

  // Share the link using the share dialog.
  shareLinkWithShareDialog(shareLinkContent) {
    var tmp = this;
    ShareDialog.canShow(shareLinkContent)
      .then(function (canShow) {
        if (canShow) {
          return ShareDialog.show(shareLinkContent);
        }
      })
      .then(
        function (result) {
          if (result.isCancelled) {
            console.log("Share cancelled");
          } else {
            console.log("Share success with postId: " + result.postId);
            showMessage({
              message: "Post Shared Successfully",
              type: "success",
              duration: 2000,
            });
          }
        },
        function (error) {
          console.log("Share fail with error: " + error);
        }
      );
  }

  async handleUrlPress(url, matchIndex /*: number*/) {
    // Linking.openURL(url);

    //  url = "Https://Www.google.com";
    url = url.toLowerCase();
    if (!url.startsWith("http")) {
      url = `http://${url}`;
    }

    const supported = await Linking.canOpenURL(url);

    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      Linking.openURL(url);
    } else {
      showMessage({
        message: "STOP",
        description: `Don't know how to open this URL: ${url}`,
        type: "danger",
        duration: 2000,
      });
    }
  }

  _onViewableItemsChanged = (props) => {
    const changed = props.changed;
    changed.forEach((item) => {
      const cell = this.cellRefs[item.key];
      if (cell) {
        if (item.isViewable) {
          // alert(JSON.stringify(item.item.type));
          this.start(item.item);

          this.currentVideoKey = item.key;
          cell.playVideo();
        } else {
          cell.pauseVideo();
        }
      }
    });
  };

  handleReport = async () => {
    if (!this.props.user.uid) {
      this.sheetRef.openSheet();
      return;
    }
    // The user has pressed the "Delete" button, so here you can do your own logic.
    // ...Your logic

    this.setState({ dialogVisible: false });

    const { uid } = this.props.user;
    if (this.state.selectedPost.reports.includes(uid)) {
      showMessage({
        message: "REPORT",
        description: `You have already reported this Post `,
        type: "warning",
        duration: 2000,
      });
      return;
    }

    this.props.reportPost(this.state.selectedPost, this.state.reportReason);
    showMessage({
      message: "REPORT",
      description: `Post reported successfully`,
      type: "info",
      duration: 2000,
    });
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

  cropImage = async (selectedImage) => {
    // alert(JSON.stringify(this.props.post.photo.uri));

    await ImagePicker.openCropper({
      path: selectedImage.path,
      cropping: true,
      width: width * 1.5,
      height: height * 1.5,

      // width: selectedImage.width,
      // height: selectedImage.height,

      // compressImageQuality: 0.8,
    })
      .then((image) => {
        console.log(image);
        // alert(JSON.stringify(image));

        // var selectedFile = {};
        // selectedFile.height = image.height;
        // selectedFile.width = image.width;
        // selectedFile.size = image.size;
        // selectedFile.uri = image.path;
        // selectedFile.type = "image";

        this.props.updatePhoto(selectedImage.path);
        this.props.updateCompressedPhoto(image.path);

        this.props.createAndUpdatePreview(selectedImage.path);
      })
      .catch((err) => {
        // alert("Error Image Crop" + err);
        // Here you handle if the user cancels or any other errors
      });
  };

  follow = (user) => {
    if (!this.props.user.uid) {
      this.sheetRef.openSheet();
      return;
    }

    var message = "";
    var type = "success";
    this.props.followUser(user);
    message = "User followed successfully";
    showMessage({
      message: message,
      type: type,
      duration: 2000,
    });
  };

  openLibrary = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status === "granted") {
      // const image = await ImagePicker.launchImageLibraryAsync({ quality: 0.1 });
      // if (!image.cancelled) {
      //   this.props.updatePhoto(image.uri);
      //   this.props.createAndUpdatePreview(image.uri);
      // } else {
      // }

      ImagePicker.openPicker({
        compressImageQuality: 0.8,
      }).then((image) => {
        // alert(JSON.stringify(image));
        //  alert(JSON.stringify(image));
        this.cropImage(image);
        // this.props.updatePhoto(image.path);
        // this.props.createAndUpdatePreview(image.path);
        // console.log(image);
      });
    } else {
      // alert("Denied");

      openSettingsDialog(
        "Failed to Access Photos, Please go to the Settings to enable access",
        this.props.navigation
      );
    }
  };
  handleNamePress = async (name, matchIndex /*: number*/) => {
    // Alert.alert(`${name}`);
    var mentionedName = name.replace("@", "");
    var user_name = mentionedName.replace(/\s+/g, "");
    // Alert.alert(`${user_name}`);

    // alert(user_name.length);
    const query = await db
      .collection("users")
      .where("user_name", "==", user_name)
      .get();

    if (query.size > 0) {
      query.forEach((response) => {
        let user = response.data();

        this.goToUser(user);
        return;
      });
    }
  };
  renderText(matchingString, matches) {
    // matches => ["[@michel:5455345]", "@michel", "5455345"]
    let pattern = /\[(@[^:]+):([^\]]+)\]/i;
    let match = matchingString.match(pattern);
    return `^^${match[1]}^^`;
  }
  saveProfilePhoto = async () => {
    this.props.updateUser();
    this.toggleModal();
    showMessage({
      message: "Uploading Image",
      type: "info",
      duration: 2000,
    });
  };

  getRightBar(item, liked) {
    return (
      <View
        style={{
          marginRight: 10,
          right: 0,
          bottom: 0,
          top: 0,
          shadowOpacity: 1,
          justifyContent: "center",
          position: "absolute",
        }}
      >
        {item.type === "vr" && (
          <TouchableOpacity
            style={{
              borderColor: "rgb(255,255,255)",
              borderWidth: 3,
              width: 45,
              justifyContent: "center",
              alignItems: "center",
              height: 45,
              borderRadius: 10,
            }}
          >
            <Text
              style={{
                color: "rgb(255,255,255)",
                fontSize: 20,
                fontWeight: "bold",
              }}
            >
              360
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={{
            alignItems: "center",
            marginTop: Scale.moderateScale(10),
          }}
          onPress={() => this.likePost(item)}
        >
          <Ionicons
            style={{
              margin: 0,
            }}
            color={liked ? "#db565b" : "#fff"}
            name={liked ? "ios-heart" : "ios-heart-empty"}
            size={40}
          />
        </TouchableOpacity>

        {item.likes && item.likes.length > 0 ? (
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate("LikersAndViewers", {
                data: item.likes,
                title: "Likes",
              })
            }
            style={{
              justifyContent: "center",
              alignContent: "center",
              marginTop: Scale.moderateScale(10),
            }}
          >
            <Text
              style={[
                styles.bold,
                {
                  color: "white",
                  fontSize: 16,
                  textAlign: "center",
                },
              ]}
            >
              {item.likes.length}
            </Text>
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity
          style={{
            alignItems: "center",
            marginTop: Scale.moderateScale(10),
          }}
          onPress={() => this.props.navigation.navigate("Comment", item)}
        >
          {/* <MaterialCommunityIcons
        style={{
          color: "rgb(255,255,255)",
          margin: 0,
        }}
        name="chat-outline"
        size={40}
      /> */}
          {/* <MaterialCommunityIcons
        name="chat-outline"
        size={24}
        color="black"
      /> */}
          {/* <MaterialCommunityIcons name="chat-outline" size={24} color="black" /> */}
          {/* <Icon type="Ionicons" name="ios-chatbubble-outline" /> */}
          <Icon name="message-circle" size={40} color="rgb(255,255,255)" />
          {item.comments && item.comments.length > 0 ? (
            <Text
              style={[
                styles.bold,
                {
                  color: "white",
                  fontSize: 16,
                  textAlign: "center",
                },
              ]}
            >
              {item.comments.length}
            </Text>
          ) : null}
        </TouchableOpacity>
        {/* <TouchableOpacity
      onPress={() => {
        this.onShare(item);
      }}
    >
      <Entypo
        style={{ margin: 0, color: "#3b5998" }}
        name="facebook-with-circle"
        size={40}
      />
      <EvilIcons
        style={{
          position: "absolute",
          margin: 2,
          color: "rgb(255,255,255)",
        }}
        name="sc-facebook"
        size={40}
      />
    </TouchableOpacity> */}

        {this.props.user.isSuperAdmin && (
          <TouchableOpacity
            style={[styles.center, { marginTop: Scale.moderateScale(10) }]}
            onPress={() => this.props.navigation.navigate("PostReport", item)}
          >
            <Ionicons
              style={{ margin: 0 }}
              color="#db565b"
              name="ios-alert"
              size={40}
            />
            <Text style={[styles.bold, styles.white, { fontSize: 16 }]}>
              {item.reports ? item.reports.length : 0}
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={{
            alignItems: "center",
            marginTop: Scale.moderateScale(10),
          }}
          onPress={() => this.showActionSheet(item)}
        >
          <Ionicons
            style={{
              margin: 0,
              color: "rgb(255,255,255)",
            }}
            name="ios-more"
            size={40}
          />
        </TouchableOpacity>
      </View>
    );
  }

  onSwipeUp(gestureState) {
    // alert("You swiped up!");
  }

  onSwipeDown(gestureState) {
    //alert("You swiped down!");
  }

  onSwipeLeft(gestureState, item) {
    // alert("You swiped left!");
    //open Comment Screen
    this.props.navigation.navigate("Comment", item);
  }

  onSwipeRight(gestureState) {
    // alert("You swiped right!");
  }

  onSwipe(gestureName, gestureState) {
    const { SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT } = swipeDirections;
    this.setState({ gestureName: gestureName });
    switch (gestureName) {
      case SWIPE_UP:
        // this.setState({ backgroundColor: "red" });
        break;
      case SWIPE_DOWN:
        // this.setState({ backgroundColor: "green" });
        break;
      case SWIPE_LEFT:
        // this.setState({ backgroundColor: "blue" });
        break;
      case SWIPE_RIGHT:
        // this.setState({ backgroundColor: "yellow" });
        break;
    }
  }

  renderItem = ({ item, index }) => {
    const config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80,
    };
    const liked = item.likes && item.likes.includes(this.props.user.uid);
    return (
      <GestureRecognizer
        onSwipe={(direction, state) => this.onSwipe(direction, state)}
        onSwipeUp={(state) => this.onSwipeUp(state)}
        onSwipeDown={(state) => this.onSwipeDown(state)}
        onSwipeLeft={(state) => this.onSwipeLeft(state, item)}
        onSwipeRight={(state) => this.onSwipeRight(state)}
        config={config}
        style={{
          flex: 1,
          // backgroundColor: this.state.backgroundColor,
        }}
      >
        <InstagramProvider>
          <ElementContainer>
            <TouchableOpacity
              activeOpacity={1}
              style={styles.postPhoto}
              id={item.id}
              onPress={() => this.cellRefs[item.id].handleOnPress()}
            >
              <AvView
                ref={(ref) => {
                  this.cellRefs[item.id] = ref;
                }}
                flow="home"
                type={item.type ? item.type : "image"}
                source={item.postPhoto}
                navigation={this.props.navigation}
                style={[styles.postPhoto]}
                onDoubleTap={() => this.onDoubleTap(item)}
                preview={item.preview}
              />

              {/* {this.getRightBar(item, liked)} */}
              <View style={[styles.bottom, styles.absolute, {}]}>
                {item.viewers && item.viewers.length > 0 ? (
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate("LikersAndViewers", {
                        views: item.viewers,
                        data: item.likes,
                        flow: "Views",
                        title: "Views and likes",
                      })
                    }
                  >
                    <Text
                      style={{
                        fontFamily: "open-sans-bold",
                        color: "red",
                        margin: 10,
                      }}
                    >
                      {item.viewers.length} views
                    </Text>
                  </TouchableOpacity>
                ) : null}

                <View style={[styles.row, { shadowOpacity: 1 }]}>
                  <TouchableOpacity onPress={() => this.goToUser(item)}>
                    <ProgressiveImage
                      // thumbnailSource={{
                      //   uri: item.preview,
                      // }}
                      transparentBackground="transparent"
                      source={{ uri: item.photo }}
                      style={styles.roundImage60}
                    />
                  </TouchableOpacity>
                  <View
                    style={{
                      width: "100%",
                      justifyContent: "center",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        // borderBottomWidth: 0.5,
                        // borderBottomColor: "rgb(255,255,255)",
                      }}
                    >
                      <TouchableOpacity
                        style={{
                          justifyContent: "center",
                          alignItems: "flex-start",
                        }}
                        onPress={() => this.goToUser(item)}
                      >
                        {this.state.fontLoaded ? (
                          <Text
                            style={{
                              fontFamily: "open-sans-bold",
                              fontSize: 18,
                              color: "rgb(255,255,255)",
                            }}
                          >
                            {item.username}
                          </Text>
                        ) : null}
                      </TouchableOpacity>

                      {this.props.user.uid != item.uid &&
                        this.props.user.following &&
                        this.props.user.following.indexOf(item.uid) < 0 && (
                          <TouchableOpacity
                            onPress={() => this.follow(item)}
                            style={{ marginLeft: Scale.moderateScale(10) }}
                          >
                            <Text
                              style={{
                                color: "#00ff00",
                                fontWeight: "bold",
                                padding: Scale.moderateScale(5),
                                fontSize: Scale.moderateScale(14),
                              }}
                            >
                              +follow
                            </Text>
                          </TouchableOpacity>
                        )}
                    </View>

                    {/* <TouchableOpacity>
                    <Text
                      style={styles.textD}
                      ellipsizeMode="tail"
                      numberOfLines={2}
                    >
                      {item.postLocation ? item.postLocation.name : null}
                    </Text>
                  </TouchableOpacity>

                  <Text style={[styles.white, styles.medium, styles.bold]}>
                    {moment(item.date).format("ll")}
                  </Text> */}
                  </View>
                </View>

                <View style={{ marginLeft: 10 }}>
                  <ParsedText
                    parse={[
                      {
                        type: "url",
                        style: styles.url,
                        onPress: this.handleUrlPress,
                      },
                      { pattern: /42/, style: styles.magicNumber },
                      { pattern: /#(\w+)/, style: styles.hashTag },
                      {
                        pattern: / @(\w+)/,
                        style: styles.username,
                        onPress: this.handleNamePress,
                      },
                    ]}
                    style={[styles.textD, styles.bold]}
                  >
                    {item.postDescription}
                  </ParsedText>
                </View>
              </View>
              {/* </ImageBackground> */}
              {/* </DoubleTap> */}
            </TouchableOpacity>
          </ElementContainer>
        </InstagramProvider>
      </GestureRecognizer>
    );
  };
  // Render Footer
  renderFooter = () => {
    try {
      // Check If Loading
      if (this.state.refreshing) {
        return <ActivityIndicator />;
      } else {
        return null;
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Retrieve More
  retrieveMore = async () => {
    // alert("Retrieve More Called");
    if (this.state.selectedTab == 1) {
      if (!this.state.refreshing) {
        this.setState({
          refreshing: true,
        });
        // alert("More Called");
        try {
          // Set State: Refreshing
          // this.setState({
          //   refreshing: true,
          // });
          await this.props.getMorePosts();
          this.setState({
            refreshing: false,
          });
          // alert("Load More");
        } catch (error) {
          // alert(error);
          console.log(error);
          this.setState({
            refreshing: false,
          });
        }
      }
    }
  };

  async changeSelectedTab(position) {
    this.setState({ selectedTab: position });
    if (position == 0) {
      // this.props.filterFollowingPosts();

      if (!this.props.post.followingfeed) {
        this.setState({ showLoading: true });
        await this.props.getFollowingPosts();
        this.setState({ showLoading: false });
      }
    }
    this.flatListRef.scrollToOffset({ animated: false, offset: 0 });
  }

  render() {
    let userFollowingList = [this.props.user.following];
    if (this.props.post === null) return showLoader("Loading, Please wait... ");
    try {
      return (
        <View style={[styles.postPhoto, styles.center]}>
          {/* <StatusBar hidden/> */}

          {/* <StatusBar hidden={false} translucent={true} /> */}
          {this.state.showLoading
            ? showLoader("Loading, Please wait... ")
            : null}
          <EmptyView
            ref={(ref) => {
              this.sheetRef = ref;
            }}
            navigation={this.props.navigation}
          />
          {/* <NewsByFollowing>
            <NewsByFollowingText>
              Following |{" "}
              <NewsByFollowingTextBold>For You</NewsByFollowingTextBold>{" "}
            </NewsByFollowingText>
          </NewsByFollowing> */}
          {this.props.post.progress &&
          this.props.post.progress > 0 &&
          this.props.post.progress <= 100
            ? this.getUploadingFile(this.props.post.progress)
            : null}
          {this.state.selectedTab == 1 &&
            this.props.post.newPosts &&
            this.props.post.newPosts.length > 0 &&
            this.checkForNewposts()}

          {/* {this.state.selectedTab == 0 ? (
            <FlatList
              // initialNumToRender={3}
              // maxToRenderPerBatch={10}
              // windowSize={8}
              // ref={(ref) => {
              //   this.flatListRef = ref;
              // }}
              snapToAlignment={"top"}
              onRefresh={() => {
                this.props.getFollowingPosts();
              }}
              // refreshing={false}
              pagingEnabled={true}
              onViewableItemsChanged={this._onViewableItemsChanged}
              viewabilityConfig={viewabilityConfig}
              removeClippedSubviews={true}
              data={this.props.post.followingfeed}
              keyExtractor={(item) => item.id}
              renderItem={this.renderItem}
              // onEndReachedThreshold={12}
              ListFooterComponent={this.renderFooter}
              contentContainerStyle={{ paddingBottom: 20 }}
              ListEmptyComponent={<EmptyView desc="No Posts Found" />}
              // On End Reached (Takes a function)
              // onEndReached={this.retrieveMore}
              // Refreshing (Set To True When End Reached)
              refreshing={this.state.refreshing}
            />
          ) : (
            <FlatList
              // initialNumToRender={3}
              // maxToRenderPerBatch={10}
              // windowSize={8}
              ref={(ref) => {
                this.flatListRef = ref;
              }}
              snapToAlignment={"top"}
              onRefresh={() => {
                this.props.getPosts();
              }}
              // refreshing={false}
              pagingEnabled={true}
              onViewableItemsChanged={this._onViewableItemsChanged}
              viewabilityConfig={viewabilityConfig}
              removeClippedSubviews={true}
              data={this.props.post.feed}
              keyExtractor={(item) => item.id}
              renderItem={this.renderItem}
              onEndReachedThreshold={12}
              ListFooterComponent={this.renderFooter}
              contentContainerStyle={{ paddingBottom: 20 }}
              ListEmptyComponent={<EmptyView desc="No Posts Found" />}
              // On End Reached (Takes a function)
              onEndReached={this.retrieveMore}
              // Refreshing (Set To True When End Reached)
              refreshing={this.state.refreshing}
            />
          )} */}

          <FlatList
            // initialNumToRender={3}
            // maxToRenderPerBatch={10}
            // windowSize={8}
            ref={(ref) => {
              this.flatListRef = ref;
            }}
            snapToAlignment={"top"}
            onRefresh={() => {
              // alert("Called");
              this.state.selectedTab == 0
                ? this.props.getFollowingPosts()
                : this.props.getPosts();
            }}
            snapToAlignment={"top"}
            // refreshing={false}
            pagingEnabled={true}
            onViewableItemsChanged={this._onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            removeClippedSubviews={true}
            data={
              this.state.selectedTab == 0
                ? this.props.post.followingfeed
                : this.props.post.feed
            }
            keyExtractor={(item) => item.id}
            renderItem={this.renderItem}
            onEndReachedThreshold={12}
            ListFooterComponent={this.renderFooter}
            contentContainerStyle={{ paddingBottom: 20 }}
            ListEmptyComponent={<EmptyView desc="No Posts Found" />}
            // On End Reached (Takes a function)
            onEndReached={this.retrieveMore}
            // Refreshing (Set To True When End Reached)
            refreshing={this.state.refreshing}
          />

          <View
            style={{
              position: "absolute",
              justifyContent: "space-between",
              flexDirection: "row",
              width: "57%",
              right: 0,
              top: 10,
            }}
          >
            <View style={{}}>
              {/* <Title>Transparent</Title> */}
              {/* <Image
                style={[
                  styles.logoHeader,
                  {
                    width: 45,
                    height: 45,
                    top: 23,
                    transform: [{ rotate: "90deg" }],
                  },
                ]}
                source={require("../assets/logo-1.png")}
                resizeMode="contain"
              /> */}
            </View>

            <View style={{ shadowOpacity: 1 }}>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("Messages")}
              >
                <SimpleLineIcons
                  style={{ color: "white", top: 23, right: 10 }}
                  name={"paper-plane"}
                  size={40}
                />
                {this.getUnSeenMessageCount() ? (
                  <Badge style={{ position: "absolute", right: 5, top: 20 }}>
                    <Text style={{ color: "white" }}>
                      {this.getUnSeenMessageCount()}
                    </Text>
                  </Badge>
                ) : null}
              </TouchableOpacity>
            </View>
          </View>

          <ActionSheet
            ref={(c) => {
              this.actionSheet = c;
            }}
          />
          <Dialog.Container visible={this.state.dialogVisible}>
            <Dialog.Title>Report Post</Dialog.Title>
            <Dialog.Description>
              Do you want to report this post
            </Dialog.Description>
            <Dialog.Input
              value={this.state.reportReason}
              underlineColorAndroid="#000"
              onChangeText={(input) => this.setState({ reportReason: input })}
              placeholder="Help Us by providing some more information on the problem"
              multiline={true}
              numberOfLines={7}
            ></Dialog.Input>
            <Dialog.Button label="Cancel" onPress={this.handleCancel} />
            <Dialog.Button label="Report" onPress={this.handleReport} />
          </Dialog.Container>

          <Modal isVisible={this.state.isModalVisible}>
            <View style={{ backgroundColor: "white" }}>
              <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <Text
                  style={{
                    margin: 10,
                    flex: 1,
                    fontSize: 20,
                    textAlign: "left",
                    alignSelf: "center",
                    fontWeight: "bold",
                    color: "black",
                  }}
                >
                  Set Profile Photo
                </Text>
                <TouchableOpacity
                  onPress={this.toggleModal}
                  style={{ margin: 10 }}
                >
                  <Ionicons name="ios-close" size={32}></Ionicons>
                </TouchableOpacity>
              </View>

              <Text
                style={{
                  margin: 10,
                  color: "black",
                }}
              >
                Please pick a profile photo that will demonstrate how
                lllsuperlll you are !!
              </Text>

              <View
                style={[styles.borderAll, { height: height * 0.5, margin: 20 }]}
              >
                <Image
                  style={{ height: height * 0.5 }}
                  source={{ uri: this.props.user.photo }}
                  resizeMode="cover"
                />
              </View>
              <Button
                block
                style={{ margin: 10, backgroundColor: "rgb(215, 80, 80)" }}
                onPress={this.openLibrary}
              >
                <Text style={{ color: "white" }}>
                  {this.props.user.photo ? "Change Picture" : "Choose Picture"}
                </Text>
              </Button>
              {this.props.user.photo ? (
                <Button
                  onPress={this.saveProfilePhoto}
                  block
                  style={{ margin: 10, backgroundColor: "rgb(215, 80, 80)" }}
                >
                  <Text style={{ color: "white" }}>Continue</Text>
                </Button>
              ) : null}
            </View>
          </Modal>
          <View
            style={{
              flexDirection: "row",
              position: "absolute",
              shadowOpacity: 1,
              top: Scale.moderateScale(45),
            }}
          >
            <TouchableOpacity
              style={[
                this.state.selectedTab == 0 ? styles.bottomwhiteborder : null,
                {},
              ]}
              onPress={() => this.changeSelectedTab(0)}
            >
              <Text
                style={
                  this.state.selectedTab == 0
                    ? styles.activeLabel
                    : styles.inactiveLabel
                }
              >
                friends
              </Text>
            </TouchableOpacity>
            <View
              style={{
                width: 2,
                backgroundColor: "white",
                margin: Scale.moderateScale(10),
              }}
            />
            <TouchableOpacity
              style={[
                this.state.selectedTab == 1 ? styles.bottomwhiteborder : null,
                {},
              ]}
              onPress={() => this.changeSelectedTab(1)}
            >
              <Text
                style={
                  this.state.selectedTab == 1
                    ? styles.activeLabel
                    : styles.inactiveLabel
                }
              >
                explore
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    } catch (error) {
      alert(error);
    }
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      getPosts,
      mergeNewPosts,
      newPostsListner,
      getMorePosts,
      followUser,
      likePost,
      logVideoView,
      unlikePost,
      getUser,
      reportPost,
      getFilterPosts,
      getFollowingPosts,
      getMessages,
      deletePost,
      updatePhoto,
      updateCompressedPhoto,
      updateUser,
      getBlockedUser,
      filterBlockedPosts,
      filterFollowingPosts,
      createAndUpdatePreview,
    },
    dispatch
  );
};

const mapStateToProps = (state) => {
  return {
    store: state,
    post: state.post,
    user: state.user,
    messages: state.messages,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
