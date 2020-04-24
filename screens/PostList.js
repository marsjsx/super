import React from "react";
import styles from "../styles";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  Ionicons,
  MaterialCommunityIcons,
  Entypo,
  EvilIcons,
} from "@expo/vector-icons";
import {
  Text,
  View,
  Button,
  Image,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  Alert,
  Proger,
} from "react-native";
import {
  getPosts,
  likePost,
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
import { ActionSheet } from "native-base";
import ProgressBarAnimated from "../component/AnimatedProgressBar";

import { showLoader } from "../util/Loader";
const barWidth = Dimensions.get("screen").width - 30;

import AvView from "../component/AvView";

const { height, width } = Dimensions.get("window");

import { ShareDialog } from "react-native-fbsdk";
import { ShareApi } from "react-native-fbsdk";
import EmptyView from "../component/emptyview";
import ParsedText from "react-native-parsed-text";

const cellHeight = height * 0.6;
const cellWidth = width;

const viewabilityConfig = {
  itemVisiblePercentThreshold: 90,
};

var BUTTONS = ["Report", "Mute", "Share Post Link", "Cancel"];
var DESTRUCTIVE_INDEX = 3;
var CANCEL_INDEX = 4;

class PostListScreen extends React.Component {
  constructor(props) {
    super(props);
    this.cellRefs = {};
    this.sheetRef = {};
    this.currentVideoKey = "";
    this.state = {
      fontLoaded: false,
      showLoading: false,
    };
  }

  async componentDidMount() {
    // add listener
    this.willBlurSubscription = this.props.navigation.addListener(
      "willBlur",
      this.willBlurAction
    );
    await Font.loadAsync({
      "open-sans-bold": require("../assets/fonts/OpenSans-Bold.ttf"),
    });
    this.setState({ fontLoaded: true });
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
    }
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
    this.props.getUser(user.uid);
    this.props.navigation.navigate("Profile");
  };

  _onViewableItemsChanged = (props) => {
    const changed = props.changed;
    changed.forEach((item) => {
      const cell = this.cellRefs[item.key];
      if (cell) {
        if (item.isViewable) {
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

  handleUrlPress(url, matchIndex /*: number*/) {
    Linking.openURL(url);
  }

  showActionSheet = (post) => {
    const { uid } = this.props.user;

    var actions = [...BUTTONS];
    if (uid === post.uid) {
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
            "Delete post?",
            "Press OK to Delete. This action is irreversible, it cannot be undone.",
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
          Alert.alert(
            "Report user?",
            "Press OK to Delete. This action is irreversible, it cannot be undone.",
            [
              {
                text: "Cancel",
                onPress: () => alert("Cancelled"),
                style: "cancel",
              },
              {
                text: "OK",
                onPress: () => {
                  showMessage({
                    message: "REPORT",
                    description: `User reported sucessfully`,
                    type: "info",
                    duration: 2000,
                  });
                },
              },
            ],
            { cancelable: false }
          );
        } else {
          if (CANCEL_INDEX === buttonIndex) {
            return;
          }
          showMessage({
            message: "Coming Soon",
            type: "info",
            duration: 2000,
          });
        }
      }
    );
  };

  render() {
    let posts = {};
    const { route, selectedIndex } = this.props.navigation.state.params;

    if (route === "Profile") {
      posts = this.props.profile.posts;
    } else if (route === "Search") {
      posts = this.props.post.feed;
    } else {
      posts = this.props.user.posts;
    }

    posts = [...posts];
    if (selectedIndex >= 0) {
      var obj = { ...posts[selectedIndex] };

      posts.splice(selectedIndex, 1);

      posts.splice(0, 0, obj);
    }

    // alert(JSON.stringify(this.props.post.feed.length));
    if (this.props.post === null) return null;
    return (
      <View style={[styles.postPhoto, styles.center]}>
        <EmptyView
          ref={(ref) => {
            this.sheetRef = ref;
          }}
          navigation={this.props.navigation}
        />
        <FlatList
          initialNumToRender="3"
          maxToRenderPerBatch="4"
          windowSize={8}
          snapToAlignment={"top"}
          refreshing={false}
          pagingEnabled={true}
          onViewableItemsChanged={this._onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          removeClippedSubviews={true}
          decelerationRate={"fast"}
          // initialScrollIndex={selectedIndex}
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const liked = item.likes.includes(this.props.user.uid);
            return (
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
                  type={item.type ? item.type : "image"}
                  source={item.postPhoto}
                  style={styles.postPhoto}
                  onDoubleTap={() => this.onDoubleTap(item)}
                  preview={item.preview}
                />

                <View style={[styles.bottom, styles.absolute]}>
                  <View
                    style={{
                      alignItems: "flex-end",
                      marginRight: 10,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => this.showActionSheet(item)}
                    >
                      <Ionicons
                        style={{
                          margin: 5,
                          color: "rgb(255,255,255)",
                        }}
                        name="ios-more"
                        size={40}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => this.likePost(item)}>
                      <Ionicons
                        style={{ margin: 5 }}
                        color={liked ? "#db565b" : "#fff"}
                        name={liked ? "ios-heart" : "ios-heart-empty"}
                        size={40}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() =>
                        this.props.navigation.navigate("Comment", item)
                      }
                    >
                      <Ionicons
                        style={{ margin: 5, color: "rgb(255,255,255)" }}
                        name="ios-chatbubbles"
                        size={40}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        this.onShare(item);
                      }}
                    >
                      <Entypo
                        style={{ margin: 5, color: "#3b5998" }}
                        name="facebook-with-circle"
                        size={40}
                      />
                      <EvilIcons
                        style={{
                          position: "absolute",
                          margin: 7,
                          color: "rgb(255,255,255)",
                        }}
                        name="sc-facebook"
                        size={40}
                      />
                    </TouchableOpacity>
                  </View>

                  <View style={[styles.row]}>
                    <TouchableOpacity onPress={() => this.goToUser(item)}>
                      <ProgressiveImage
                        thumbnailSource={{
                          uri: item.preview,
                        }}
                        transparentBackground="transparent"
                        source={{ uri: item.photo }}
                        style={styles.roundImage60}
                      />

                      {/* <Image
                            style={styles.roundImage60}
                            source={{ uri: item.photo }}
                          /> */}
                    </TouchableOpacity>
                    <View style={{ width: "100%" }}>
                      <View
                        style={{
                          borderBottomWidth: 0.5,
                          borderBottomColor: "rgb(255,255,255)",
                        }}
                      >
                        <TouchableOpacity
                          style={{
                            flex: 1,
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
                      </View>
                      {/* <Text style={[styles.white, styles.small]}>
                        {moment(item.date).format("ll")}
                      </Text> */}
                      {/* <TouchableOpacity
                            onPress={() => this.navigateMap(item)}
                          > */}
                      <TouchableOpacity>
                        <Text
                          style={styles.textD}
                          ellipsizeMode="tail"
                          numberOfLines={2}
                        >
                          {item.postLocation ? item.postLocation.name : null}
                        </Text>
                      </TouchableOpacity>

                      <Text style={[styles.white, styles.small]}>
                        {moment(item.date).format("ll")}
                      </Text>
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
                      ]}
                      style={styles.textD}
                    >
                      {item.postDescription}
                    </ParsedText>
                  </View>
                </View>
                {/* </ImageBackground> */}
                {/* </DoubleTap> */}
              </TouchableOpacity>
            );
          }}
        />

        {this.state.showLoading ? showLoader("Loading, Please wait... ") : null}
        <ActionSheet
          ref={(c) => {
            this.actionSheet = c;
          }}
        />
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      getPosts,
      likePost,
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
