import React from "react";
import styles from "../styles";
import firebase from "firebase";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  ImageBackground,
  Alert,
  Platform,
  Linking,
  UIManager,
  findNodeHandle,
  Dimensions,
  ScrollView,
} from "react-native";
import { followUser, unfollowUser, getUser, logout } from "../actions/user";
import { getMessages } from "../actions/message";
import { getPosts, likePost, unlikePost, deletePost } from "../actions/post";
import { Ionicons, MaterialCommunityIcons, Entypo } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import moment from "moment";
import DoubleTap from "../component/DoubleTap";
import FadeInView from "../component/FadeInView";
import ProgressiveImage from "../component/ProgressiveImage";
import { Colors } from "react-native/Libraries/NewAppScreen";
import AvView from "../component/AvView";
import { showMessage, hideMessage } from "react-native-flash-message";
import EmptyView from "../component/emptyview";

import {
  Button,
  Content,
  Title,
  ActionSheet,
  Text as NText,
} from "native-base";

const viewabilityConfig = {
  itemVisiblePercentThreshold: 90,
};

var BUTTONS = ["Message", "Report", "Cancel"];
var DESTRUCTIVE_INDEX = 1;
var CANCEL_INDEX = 2;
const { height, width } = Dimensions.get("window");

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.page;
    this.cellRefs = {};

    this.state = {
      flatListSmall: true,
      showHide: "hide",
      position: 0,
      visible: false,
      changes: 1,
    };
    this.scroll = null;
    this.scrollView = null;
  }

  componentDidMount = () => {
    const { state, navigate } = this.props.navigation;

    if (state.routeName === "MyProfile") {
      // alert(this.props.user.uid);
      this.props.getUser(this.props.user.uid, "LOGIN");
    }

    this.props.getPosts();
  };

  goIndex = (index) => {
    this.flatListRef.scrollToIndex({ animated: true, index: index });
  };

  logout = () => {
    firebase.auth().signOut();
    this.props.logout();
    this.props.navigation.navigate("login");
  };

  onButtonPress = (item) => {
    this.setState({
      flatListSmall: !this.state.flatListSmall,
    });
    Platform.OS === "android"
      ? this.scroll.scrollTo({ y: 12000, animated: true })
      : this.scroll.scrollTo({ y: 120, animated: true });
  };

  refreshScript = () => {
    this.setState({ state: this.state });
  };

  onSelect = (item, index) => {
    const { state, navigate } = this.props.navigation;

    // {
    //   this.state.selectedId === "showAll"
    //     ? [
    //         this.scroll.scrollToEnd(),
    //         /* this.flatListRef.scrollToIndex({ animated: true, index: index }), */
    //         this.setState({
    //           selectedId: item.id,
    //         }),
    //       ]
    //     : [
    //         this.setState({
    //           selectedId: "showAll",
    //         }),
    //         /* this.flatListRef.scrollToIndex({ animated: true, index: index }) */
    //       ];
    // }

    this.props.navigation.navigate("PostListScreen", {
      selectedIndex: index,
      route: state.routeName,
    });

    // this.visibleSwitch(item);
  };

  follow = (user) => {
    if (!this.props.user.uid) {
      this.sheetRef.openSheet();
      return;
    }

    var message = "";
    var type = "success";
    if (user.followers.indexOf(this.props.user.uid) >= 0) {
      this.props.unfollowUser(user);
      message = "User unfollowed successfully";
      type = "danger";
    } else {
      this.props.followUser(user);
      message = "User followed successfully";
    }

    showMessage({
      message: message,
      type: type,
      duration: 2000,
    });
  };

  openLibrary = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status === "granted") {
      const image = await ImagePicker.launchImageLibraryAsync();
      if (!image.cancelled) {
        const url = await this.props.uploadPhoto(image);
        this.props.updatePhoto(url);
        /* console.log(url) */
      }
    }
  };

  onDoubleTap = (post) => {
    const { uid } = this.props.user;
    if (post.likes.includes(uid)) {
      this.props.unlikePost(post);
    } else {
      this.props.likePost(post);
    }
    this.setState({ state: this.state });
  };

  visibleSwitch = (post) => {
    const { uid } = this.props.user;
    if (post.likes.includes(uid)) {
      this.setState({
        visible: true,
      });
    } else {
      this.setState({
        visible: false,
      });
    }
  };

  likePostAction = (post) => {
    if (!this.props.user.uid) {
      this.sheetRef.openSheet();
      return;
    }

    const { uid } = this.props.user;
    if (post.likes.includes(uid)) {
      this.props.unlikePost(post);
      this.setState({
        visible: false,
      });
    } else {
      this.props.likePost(post);
      this.setState({
        visible: true,
      });
    }
  };

  activateLongPress = (item) => {
    const { state, navigate } = this.props.navigation;
    if (state.routeName === "MyProfile") {
      Alert.alert(
        "Delete post?",
        "Press OK to Delete. This action is irreversible, it cannot be undone.",
        [
          {
            text: "Cancel",
            onPress: () => alert("Cancelled"),
            style: "cancel",
          },
          { text: "OK", onPress: () => this.props.deletePost(item) },
        ],
        { cancelable: false }
      );
    } else {
      this.likePostAction(item);
    }
  };

  showActionSheet = (user) => {
    this.actionSheet._root.showActionSheet(
      {
        options: BUTTONS,
        cancelButtonIndex: CANCEL_INDEX,
        destructiveButtonIndex: DESTRUCTIVE_INDEX,
      },
      (buttonIndex) => {
        //this.setState({ clicked: BUTTONS[buttonIndex] });
        if ("Report" === BUTTONS[buttonIndex]) {
          Alert.alert(
            "Report user?",
            "Press OK to Report. This action is irreversible, it cannot be undone.",
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
        } else if ("Message" === BUTTONS[buttonIndex]) {
          this.props.navigation.navigate("Chat", user.uid);
        } else {
        }
      }
    );
  };

  openUrl = async (user) => {
    var url = user.bio;

    if (!url) {
      showMessage({
        message: "STOP",
        description: `No Link Attached`,
        type: "danger",
        duration: 2000,
      });
    }

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
  };

  render() {
    let user = {};

    const { state, navigate } = this.props.navigation;
    if (state.routeName === "Profile") {
      user = this.props.profile;
    } else {
      user = this.props.user;
      if (!this.props.user.uid) {
        return (
          <EmptyView
            desc="Your Profile will appear here"
            button="Signup"
            userId={this.props.user.uid}
            navigation={this.props.navigation}
            icon={
              <MaterialCommunityIcons
                style={{ margin: 5 }}
                name="face-profile"
                size={64}
              />
            }
          />
        );
      }
    }
    // if (!user.posts) return <ActivityIndicator style={styles.container} />;
    return (
      <ScrollView ref={(c) => (this.scroll = c)}>
        <EmptyView
          ref={(ref) => {
            this.sheetRef = ref;
          }}
          navigation={this.props.navigation}
        />
        <ProgressiveImage
          thumbnailSource={{
            uri: user.preview,
          }}
          source={{ uri: user.photo }}
          style={[styles.profilePhoto]}
          resizeMode="cover"
        />
        <ImageBackground
          style={[styles.profilePhoto, { position: "absolute" }]}
        >
          <View style={[styles.bottom, { width: "100%" }]}>
            {state.routeName === "MyProfile" && user.photo === "" ? (
              <View
                style={[styles.center, styles.container, { width: "100%" }]}
              >
                <Button
                  bordered
                  danger
                  onPress={() => this.props.navigation.navigate("Edit")}
                >
                  <Text style={{ color: "red" }}>Add Profile Photo</Text>
                </Button>
              </View>
            ) : (
              <View />
            )}
          </View>
          <View style={[{ width: "100%", marginTop: -10 }]} />
          <View style={[styles.row, styles.space, { width: "100%" }]}>
            <View style={styles.container}>
              <View style={[styles.row, styles.space, { width: "100%" }]}>
                <View style={[styles.center, { flex: 1 }]}>
                  <View>
                    {/* <Image
                      style={[styles.logoHeader, { width: 45, height: 45 }]}
                      source={require("../assets/logo-1.png")}
                      resizeMode="contain"
                    /> */}

                    <Title style={[styles.textW]}>{user.username}</Title>
                    <View
                      style={{
                        marginTop: 20,
                        marginBottom: 20,
                        width: width,
                        borderBottomColor: "gray",
                        borderBottomWidth: 2,
                      }}
                    />
                  </View>

                  <Button
                    rounded
                    style={{ backgroundColor: "#ea5b62" }}
                    onPress={() => this.openUrl(user)}
                  >
                    <Text
                      style={[
                        styles.textW,
                        { marginLeft: 40, marginRight: 40 },
                      ]}
                    >
                      {user.websiteLabel ? user.websiteLabel : "Profile"}
                    </Text>
                  </Button>

                  {state.routeName != "MyProfile" &&
                    this.props.user.uid !== user.uid && (
                      <TouchableOpacity
                        onPress={() => this.showActionSheet(user)}
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
                    )}
                </View>
              </View>
            </View>
          </View>
        </ImageBackground>
        <View
          style={[styles.row, styles.space, styles.followBar, { marginTop: 0 }]}
        >
          {/* <View style={styles.center}>
            <Text style={[styles.bold, styles.textF]}>
              {user.posts && user.posts.length ? user.posts.length : "0"}
            </Text>
            <Text style={[styles.bold, styles.textF]}>posts</Text>
          </View> */}

          <TouchableOpacity
            style={[styles.center, { flexDirection: "row" }]}
            onPress={() =>
              this.props.navigation.navigate("MyFollowersAndFollowing", {
                data: "Followers",
                route: state.routeName,
              })
            }
          >
            <Text style={[styles.bold, styles.textF]}>
              {user.followers && user.followers.length
                ? user.followers.length
                : "0"}
            </Text>
            <Text style={[styles.bold, styles.textF]}> followers</Text>
          </TouchableOpacity>

          {state.routeName === "MyProfile" ||
          this.props.user.uid === user.uid ? (
            <Button
              bordered
              dark
              onPress={() => this.props.navigation.navigate("Edit")}
            >
              <Text
                style={[
                  styles.small,
                  styles.bold,
                  { marginRight: 10, marginLeft: 10 },
                ]}
              >
                EDIT PROFILE
              </Text>
            </Button>
          ) : (
            <Button
              bordered
              danger={
                user.followers &&
                user.followers.indexOf(this.props.user.uid) >= 0
              }
              info={
                !(
                  user.followers &&
                  user.followers.indexOf(this.props.user.uid) >= 0
                )
              }
              onPress={() => this.follow(user)}
            >
              <NText
                style={[
                  styles.small,
                  styles.bold,
                  { marginRight: 10, marginLeft: 10 },
                ]}
              >
                {user.followers &&
                user.followers.indexOf(this.props.user.uid) >= 0
                  ? "UNFOLLOW"
                  : "FOLLOW"}
              </NText>
            </Button>
          )}

          <TouchableOpacity
            style={[styles.center, { flexDirection: "row" }]}
            onPress={() =>
              this.props.navigation.navigate("MyFollowersAndFollowing", {
                data: "Following",
                route: state.routeName,
              })
            }
          >
            <Text style={[styles.bold, styles.textF]}>
              {user.following && user.following.length
                ? user.following.length
                : "0"}
            </Text>
            <Text style={[styles.bold, styles.textF]}> following</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          initialNumToRender="9"
          maxToRenderPerBatch="9"
          windowSize={12}
          onRefresh={() => this.props.getPosts()}
          refreshing={false}
          horizontal={false}
          numColumns={3}
          data={user.posts}
          extraData={user}
          onViewableItemsChanged={this._onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          removeClippedSubviews={true}
          keyExtractor={(item, index) => [item.id, index]}
          onEndReachedThreshold={0.4}
          renderItem={({ item, index }) => {
            const liked = item.likes.includes(this.props.user.uid);
            const visible = this.state.visible;
            return (
              <View>
                <TouchableOpacity
                  id={item.id}
                  onPress={() => [this.onSelect(item, index)]}
                  activeOpacity={0.6}
                  onLongPress={() => this.activateLongPress(item)}
                >
                  <View style={[styles.center]}>
                    <ProgressiveImage
                      id={item.id}
                      thumbnailSource={{
                        uri: item.preview,
                      }}
                      source={{ uri: item.postPhoto }}
                      style={styles.squareLarge}
                      resizeMode="cover"
                    />
                    {item.type === "video" ? (
                      <Ionicons
                        name="ios-play"
                        size={40}
                        color="white"
                        style={{
                          backgroundColor: "transparent",
                          alignSelf: "center",
                          position: "absolute",
                        }}
                      />
                    ) : null}
                  </View>
                </TouchableOpacity>
              </View>
            );
          }}
        />

        <ActionSheet
          ref={(c) => {
            this.actionSheet = c;
          }}
        />
      </ScrollView>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      followUser,
      unfollowUser,
      getMessages,
      deletePost,
      getPosts,
      likePost,
      unlikePost,
      getUser,
      logout,
    },
    dispatch
  );
};

const mapStateToProps = (state) => {
  return {
    post: state.post,
    user: state.user,
    profile: state.profile,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
