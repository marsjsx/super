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

import { showLoader } from "../util/Loader";
const barWidth = Dimensions.get("screen").width - 30;

import AvView from "../component/AvView";

const { height, width } = Dimensions.get("window");
import db from "../config/firebase";

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
    };
    this.start = this.start.bind(this);
  }

  start(post) {
    var self = this;

    if (this.state.timer != null) {
      this.resetTimer();
    }

    if (post.type === "video") {
      let timer = setInterval(() => {
        // log video view
        //  alert("View Counted");
        this.props.logVideoView(post);

        this.resetTimer();
      }, 3000);
      this.setState({ timer });
    }
  }

  resetTimer() {
    clearInterval(this.state.timer);
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

  handleUrlPress(url, matchIndex /*: number*/) {
    Linking.openURL(url);
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
  renderText(matchingString, matches) {
    // matches => ["[@michel:5455345]", "@michel", "5455345"]
    let pattern = /\[(@[^:]+):([^\]]+)\]/i;
    let match = matchingString.match(pattern);
    return `^^${match[1]}^^`;
  }

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
      <View style={[styles.fullScreen, styles.center]}>
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
          removeClippedSubviews
          // initialScrollIndex={selectedIndex}
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const liked = item.likes.includes(this.props.user.uid);
            return (
              <InstagramProvider>
                <ElementContainer>
                  <TouchableOpacity
                    activeOpacity={1}
                    style={styles.fullScreen}
                    id={item.id}
                    onPress={() => this.cellRefs[item.id].handleOnPress()}
                  >
                    <AvView
                      ref={(ref) => {
                        this.cellRefs[item.id] = ref;
                      }}
                      type={item.type ? item.type : "image"}
                      source={item.postPhoto}
                      navigation={this.props.navigation}
                      style={styles.fullScreen}
                      onDoubleTap={() => this.onDoubleTap(item)}
                      preview={item.preview}
                    />

                    <View
                      style={{
                        marginRight: 10,
                        right: 0,
                        bottom: 0,
                        top: 0,
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
                            VR
                          </Text>
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity
                        style={{
                          alignItems: "center",
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

                      <TouchableOpacity
                        style={{
                          alignItems: "center",
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
                        {item.likes && item.likes.length > 0 ? (
                          <TouchableOpacity
                            onPress={() =>
                              this.props.navigation.navigate(
                                "LikersAndViewers",
                                {
                                  data: item.likes,
                                  title: "Post Likers",
                                }
                              )
                            }
                            style={{
                              justifyContent: "center",
                              alignContent: "center",
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
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{
                          alignItems: "center",
                        }}
                        onPress={() =>
                          this.props.navigation.navigate("Comment", item)
                        }
                      >
                        <Ionicons
                          style={{
                            color: "rgb(255,255,255)",
                            margin: 0,
                          }}
                          name="ios-chatbubbles"
                          size={40}
                        />
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
                      <TouchableOpacity
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
                      </TouchableOpacity>

                      {this.props.user.isSuperAdmin && (
                        <TouchableOpacity
                          style={styles.center}
                          onPress={() =>
                            this.props.navigation.navigate("PostReport", item)
                          }
                        >
                          <Ionicons
                            style={{ margin: 0 }}
                            color="#db565b"
                            name="ios-alert"
                            size={40}
                          />
                          <Text
                            style={[
                              styles.bold,
                              styles.white,
                              { fontSize: 16 },
                            ]}
                          >
                            {item.reports ? item.reports.length : 0}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                    <View style={[styles.bottom, styles.absolute, {}]}>
                      {item.viewers && item.viewers.length > 0 ? (
                        <TouchableOpacity
                          onPress={() =>
                            this.props.navigation.navigate("LikersAndViewers", {
                              data: item.viewers,
                              flow: "Views",
                              title: "Post Viewers",
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

                      <View style={[styles.row]}>
                        <TouchableOpacity onPress={() => this.goToUser(item)}>
                          <ProgressiveImage
                            // thumbnailSource={{
                            //   uri: item.preview,
                            // }}
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
                              {item.postLocation
                                ? item.postLocation.name
                                : null}
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
                            {
                              pattern: / @(\w+)/,
                              style: styles.username,
                              onPress: this.handleNamePress,
                            },
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
                </ElementContainer>
              </InstagramProvider>
            );
          }}
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
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      getPosts,
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
