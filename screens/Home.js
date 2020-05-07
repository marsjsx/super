import React from "react";
import styles from "../styles";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  Ionicons,
  MaterialCommunityIcons,
  EvilIcons,
  Entypo,
  Octicons,
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
  Proger,
  Animated,
  Share,
  Alert,
  Linking,
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
import {
  Header,
  Title,
  Content,
  Icon,
  Badge,
  Left,
  Right,
  Body,
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
      dialogVisible: false,
      reportReason: "",
      selectedPost: {},
    };
  }

  showDialog = () => {
    this.setState({ dialogVisible: true });
  };

  handleCancel = () => {
    this.setState({ dialogVisible: false });
  };
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
    this.setState({ showLoading: true });
    await this.props.getPosts();

    setTimeout(() => {
      this.props.getMessages();
    }, 500); // simulating network

    this.setState({ showLoading: false });
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
    this.props.getUser(user.uid);
    this.props.navigation.navigate("Profile");
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

  getUploadingFile(progress) {
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

  render() {
    let userFollowingList = [this.props.user.following];
    if (this.props.post === null) return null;
    return (
      <View style={[styles.postPhoto, styles.center]}>
        <EmptyView
          ref={(ref) => {
            this.sheetRef = ref;
          }}
          navigation={this.props.navigation}
        />
        {this.props.post.progress &&
        this.props.post.progress > 0 &&
        this.props.post.progress <= 100
          ? this.getUploadingFile(this.props.post.progress)
          : null}

        <FlatList
          initialNumToRender="3"
          maxToRenderPerBatch="4"
          windowSize={8}
          snapToAlignment={"top"}
          onRefresh={() => this.props.getPosts()}
          refreshing={false}
          pagingEnabled={true}
          onViewableItemsChanged={this._onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          removeClippedSubviews={true}
          decelerationRate={"fast"}
          data={this.props.post.feed}
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
                  style={[styles.postPhoto]}
                  onDoubleTap={() => this.onDoubleTap(item)}
                  preview={item.preview}
                />

                {/* {alert(item.type ? item.type : "image")} */}
                {/* <AvView
                  type="video"
                  source="https://github.com/saitoxu/InstaClone/raw/master/contents/videos/garden.mov"
                /> */}

                {/* <DoubleTap onDoubleTap={() => this.onDoubleTap(item)}> */}
                {/* <ImageBackground
                  style={[styles.postPhoto, { position: "absolute" }]}
                > */}
                <View style={[styles.bottom, styles.absolute, {}]}>
                  <View
                    style={{
                      marginRight: 10,
                      alignSelf: "flex-end",
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

                    {this.props.user.isSuperAdmin && (
                      <TouchableOpacity
                        style={styles.center}
                        onPress={() =>
                          this.props.navigation.navigate("PostReport", item)
                        }
                      >
                        <Ionicons
                          style={{ margin: 5 }}
                          color="#db565b"
                          name="ios-alert"
                          size={40}
                        />
                        <Text
                          style={[styles.bold, styles.white, { fontSize: 20 }]}
                        >
                          {item.reports ? item.reports.length : 0}
                        </Text>
                      </TouchableOpacity>
                    )}
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
        <View
          style={{
            position: "absolute",
            zIndex: 1,
            width: "100%",
            top: 0,
          }}
        >
          <Header transparent>
            <Left>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("Camera")}
              >
                <Ionicons
                  style={{ left: 5, top: 13, color: "white" }}
                  name={"ios-camera"}
                  size={40}
                />
              </TouchableOpacity>
            </Left>
            <Body>
              {/* <Title>Transparent</Title> */}
              <Image
                style={[styles.logoHeader, { width: 150, height: 45, top: 13 }]}
                source={require("../assets/logo-1.png")}
                resizeMode="contain"
              />
            </Body>
            <Right>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("Messages")}
              >
                <Ionicons
                  style={{ color: "white", top: 13, right: 5 }}
                  name={"ios-paper-plane"}
                  size={40}
                />

                {this.getUnSeenMessageCount() ? (
                  <Badge style={{ position: "absolute", right: 0 }}>
                    <Text style={{ color: "white" }}>
                      {this.getUnSeenMessageCount()}
                    </Text>
                  </Badge>
                ) : null}
              </TouchableOpacity>
            </Right>
          </Header>
          {/* {this.props.user.isSuperAdmin && (
            <TouchableOpacity
              style={{
                alignSelf: "flex-start",
                position: "absolute",
                top: 150,
              }}
              onPress={() => this.likePost(item)}
            >
              <Ionicons
                style={{ margin: 5 }}
                color="#db565b"
                name="ios-alert"
                size={40}
              />
            </TouchableOpacity>
          )} */}
        </View>

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
    post: state.post,
    user: state.user,
    messages: state.messages,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
