import React from "react";
import styles from "../styles";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import cloneDeep from "lodash/cloneDeep";

import {
  Ionicons,
  MaterialCommunityIcons,
  Entypo,
  EvilIcons,
} from "@expo/vector-icons";
import Icon from "react-native-vector-icons/Feather";
import constants from "../constants";

import {
  Text,
  View,
  Button,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  Alert,
  Linking,
  Proger,
} from "react-native";
import {
  likePost,
  logVideoView,
  unlikePost,
  reportPost,
  getFilterPosts,
  deletePost,
} from "../actions/post";
import { getUser } from "../actions/user";
import moment from "moment";
import * as Font from "expo-font";
import DoubleTap from "../component/DoubleTap";
import ProgressiveImage from "../component/ProgressiveImage";
import { showMessage, hideMessage } from "react-native-flash-message";
import { getMessages } from "../actions/message";
import { ActionSheet, Badge } from "native-base";
import ProgressBarAnimated from "../component/AnimatedProgressBar";
import GestureRecognizer, { swipeDirections } from "../component/swipeguesture";

import { showLoader } from "../util/Loader";
const barWidth = Dimensions.get("screen").width - 30;
import Scale from "../helpers/Scale";

import AvView from "../component/AvView";

const { height, width } = Dimensions.get("window");
import db from "../config/firebase";
import {
  updatePhoto,
  followUser,
  updateCompressedPhoto,
  updateUser,
  createAndUpdatePreview,
} from "../actions/user";
import { ShareDialog } from "react-native-fbsdk";
import { ShareApi } from "react-native-fbsdk";
import EmptyView from "../component/emptyview";
import ParsedText from "react-native-parsed-text";
import Dialog from "react-native-dialog";
import {
  InstagramProvider,
  ElementContainer,
} from "instagram-zoom-react-native";

const cellHeight = height * 0.6;
const cellWidth = width;

const viewabilityConfig = {
  itemVisiblePercentThreshold: 90,
};

var BUTTONS = ["Report", "Mute", "Share Post Link", "Cancel"];
var DESTRUCTIVE_INDEX = 3;
var CANCEL_INDEX = 4;
import RenderFullScreenPostItem from "../component/RenderFullScreenPostItem";

class PostListScreen extends React.Component {
  constructor(props) {
    super(props);
    this.cellRefs = {};
    this.sheetRef = {};
    this.currentVideoKey = "";
    this.state = {
      fontLoaded: false,
      showLoading: false,
      result: "",
      timer: null,
      dialogVisible: false,
      reportReason: "",
      selectedPost: {},
      userPosts: [],
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
    }, 1500);
    this.setState({ timer });
    // }
  }

  resetTimer() {
    clearInterval(this.state.timer);
  }

  async componentDidMount() {
    // add listener
    this.willBlurSubscription = this.props.navigation.addListener(
      "blur",
      this.willBlurAction
    );
    await Font.loadAsync({
      "open-sans-bold": require("../assets/fonts/OpenSans-Bold.ttf"),
    });
    this.setState({ fontLoaded: true });

    // const { userPosts } = this.props.navigation.state.params;

    const { userPosts } = this.props.route.params;
    this.setState({ userPosts: userPosts });
  }

  componentWillUmount() {
    // remove listener
    this.willBlurSubscription.remove();
  }

  willBlurAction = (payload) => {
    if (this.currentVideoKey) {
      const cell = this.cellRefs[this.currentVideoKey];
      if (cell) {
        cell.pauseVideo();
      }
    }
  };

  likePost = (post) => {
    if (!this.props.user.uid) {
      this.sheetRef.openSheet();
      return;
    }

    const { uid } = this.props.user;
    if (post.likes.includes(uid)) {
      this.props.unlikePost(post);
    } else {
      this.props.likePost(post);
      this.likeUserPost();
    }
  };

  likeUserPost(post) {
    const { uid } = this.props.user;

    if (this.state.userPosts && this.state.userPosts.length > 0) {
      const feeds = cloneDeep(this.state.userPosts);
      let updatedPosts = feeds.map((item) => {
        if (item.id === post.id) {
          item.likes.push(uid);
          // alert("Called");
        }

        return item;
      });

      this.setState({ userPosts: updatedPosts });
    }
  }
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
      this.likeUserPost(post);
    }
  };

  navigateMap = (item) => {
    this.props.navigation.navigate("Map", {
      location: item.postLocation,
    });
  };

  goToUser = (user) => {
    // this.props.getUser(user.uid);
    // this.props.navigation.navigate("Profile");

    this.props.navigation.navigate("Profile", { uid: user.uid });
  };

  _onViewableItemsChanged = (props) => {
    var cells = Object.keys(this.cellRefs);
    cells.forEach((item) => {
      const cell = this.cellRefs[item];
      if (cell) {
        cell.pauseVideo();
      }
    });
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
  handleNamePress = async (name, matchIndex /*: number*/) => {
    // Alert.alert(`${name}`);
    var mentionedName = name.replace("@", "");
    var user_name = mentionedName.replace(/\s+/g, "");

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

  renderText(matchingString, matches) {
    // matches => ["[@michel:5455345]", "@michel", "5455345"]
    let pattern = /\[(@[^:]+):([^\]]+)\]/i;
    let match = matchingString.match(pattern);
    return `^^${match[1]}^^`;
  }

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
    return (
      <RenderFullScreenPostItem
        {...item}
        key={index}
        user={this.props.user}
        onPostPress={() => this.cellRefs[item.id].handleOnPress()}
        onDoubleTap={() => this.onDoubleTap(item)}
        navigation={this.props.navigation}
        onPressFullScreen={() => {
          if (this.currentVideoKey) {
            const cell = this.cellRefs[this.currentVideoKey];
            if (cell) {
              item.type == "video"
                ? cell.enterFullScreen()
                : cell.enterFullScreenImage();
            }
          }
        }}
        onLikePress={() => {
          this.props.navigation.navigate("LikersAndViewers", {
            views: item.viewers,
            data: item.likes,
            flow: "Views",
            title: "Views and likes",
          });
        }}
        onCommentPress={() => {
          this.props.navigation.navigate("Comment", item);
        }}
        onViewsPress={() => {
          this.props.navigation.navigate("LikersAndViewers", {
            views: item.viewers,
            data: item.likes,
            flow: "Views",
            title: "Views and likes",
          });
        }}
        onUserPress={() => {
          this.goToUser(item);
        }}
        onFollowPress={() => {
          this.follow(item);
        }}
        showActionSheet={() => {
          this.showActionSheet(item);
        }}
        onMentionNamePress={(name, matchIndex /*: number*/) => {
          this.handleNamePress(name, matchIndex);
        }}
        onUrlPress={(url, matchIndex /*: number*/) => {
          this.handleUrlPress(url, matchIndex);
        }}
        onPostRef={(ref) => {
          // this.handleUrlPress(url, matchIndex);
          this.cellRefs[item.id] = ref;
        }}
      />
    );
  };

  getItemLayout = (data, index) => ({
    length: height,
    offset: height * index,
    index,
  });

  render() {
    let posts = {};
    // const {
    //   route,
    //   selectedIndex,
    //   userPosts,
    // } = this.props.navigation.state.params;

    const { route, selectedIndex, userPosts } = this.props.route.params;

    if (route === "Profile") {
      // posts = userPosts;
      posts = this.state.userPosts;
    } else if (route === "Search") {
      posts = this.props.post.feed;
    } else {
      posts = this.props.user.posts;
    }

    posts = [...posts];
    // if (posts && posts.length > 0 && selectedIndex >= 0) {
    //   var obj = { ...posts[selectedIndex] };

    //   posts.splice(selectedIndex, 1);

    //   posts.splice(0, 0, obj);
    // }

    // alert(JSON.stringify(this.props.post.feed.length));
    if (this.props.post === null) return null;
    return (
      <View
        style={[styles.postPhoto, styles.center]}
        // onLayout={() => this.onLayout()}
      >
        {/* {alert(JSON.stringify(posts))} */}
        <EmptyView
          ref={(ref) => {
            this.sheetRef = ref;
          }}
          navigation={this.props.navigation}
        />
        <FlatList
          ref={(ref) => {
            this.flatListRef = ref;
          }}
          initialNumToRender={3}
          maxToRenderPerBatch={2}
          windowSize={3}
          ListEmptyComponent={<EmptyView desc="No Data Found" />}
          snapToAlignment={"top"}
          refreshing={false}
          pagingEnabled={true}
          onViewableItemsChanged={this._onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          removeClippedSubviews={true}
          initialScrollIndex={selectedIndex}
          onScrollToIndexFailed={(info) => {
            const wait = new Promise((resolve) => setTimeout(resolve, 500));
            wait.then(() => {
              this.flatListRef?.scrollToIndex({
                index: selectedIndex,
                animated: true,
              });
            });
          }}
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={this.renderItem}
          getItemLayout={this.getItemLayout}
        />

        {this.state.showLoading ? showLoader("Loading, Please wait... ") : null}
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
            onChangeText={(input) => this.setState({ reportReason: input })}
            placeholder="Help Us by providing some more information on the problem"
            multiline={true}
            numberOfLines={7}
          ></Dialog.Input>
          <Dialog.Button label="Cancel" onPress={this.handleCancel} />
          <Dialog.Button label="Report" onPress={this.handleReport} />
        </Dialog.Container>

        {/* <View style={[{ position: "absolute", top: 40 }]}> */}
        <TouchableOpacity
          style={[
            { position: "absolute", top: 40, right: 0, shadowOpacity: 0.5 },
          ]}
          onPress={() => this.props.navigation.goBack()}
        >
          <Ionicons
            style={[styles.icon, { marginHorizontal: Scale.moderateScale(4) }]}
            name="ios-close"
            color="#fff"
            size={45}
          ></Ionicons>
        </TouchableOpacity>
        {/* </View> */}
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      followUser,
      likePost,
      logVideoView,
      unlikePost,
      getUser,
      reportPost,
      getFilterPosts,
      getMessages,
      deletePost,
    },
    dispatch
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    post: state.post,
    profile: state.profile,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PostListScreen);
