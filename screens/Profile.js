import React from "react";
import styles from "../styles";
import firebase from "firebase";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import db from "../config/firebase";
import { orderBy, groupBy, values } from "lodash";

import {
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  ImageBackground,
  Alert,
  Platform,
  Linking,
  UIManager,
  findNodeHandle,
  Dimensions,
  ScrollView,
  StatusBar,
} from "react-native";
import { validURL } from "../util/Helper";
import { showLoader } from "../util/Loader";
import RBSheet from "react-native-raw-bottom-sheet";
import { AntDesign } from "react-native-vector-icons";
import constants from "../constants";

import {
  followUser,
  unfollowUser,
  getUser,
  blockUser,
  unblockUser,
  logout,
  updateBio,
  updateUser,
  preloadUserImages,
  updateWebsiteLabel,
} from "../actions/user";
import { getMessages } from "../actions/message";
import { likePost, unlikePost, deletePost } from "../actions/post";
import {
  Ionicons,
  MaterialCommunityIcons,
  Entypo,
  SimpleLineIcons,
} from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import Dialog from "react-native-dialog";

import moment from "moment";
import DoubleTap from "../component/DoubleTap";
import FadeInView from "../component/FadeInView";
import ProgressiveImage from "../component/ProgressiveImage";
import { Colors } from "react-native/Libraries/NewAppScreen";
import AvView from "../component/AvView";
import { showMessage, hideMessage } from "react-native-flash-message";
import EmptyView from "../component/emptyview";
import Scale from "../helpers/Scale";

import {
  Button,
  Content,
  Title,
  Icon,
  Subtitle,
  ActionSheet,
  Text as NText,
} from "native-base";

const viewabilityConfig = {
  itemVisiblePercentThreshold: 90,
};

var BUTTONS = ["Profile", "Message", "Report", "Block", "Cancel"];
var MYPROFILE_BUTTONS = ["My Profile", "Logout", "Cancel"];

var BUTTONS1 = ["Profile", "Message", "Report", "Unblock", "Cancel"];

var DESTRUCTIVE_INDEX = 1;
var CANCEL_INDEX = 4;
const { height, width } = Dimensions.get("window");
import { isUserBlocked } from "../util/Helper";

var self;
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
      userProfile: [],
      website: "",
      userBlocked: false,
      websiteLabel: "",
      showLoading: false,
      dialogVisible: false,
    };
    this.scroll = null;
    this.scrollView = null;
  }

  componentDidMount = async () => {
    self = this;
    const { state, navigate } = this.props.navigation;
    const { uid } = state.params;
    this.props.navigation.setParams({
      goToChat: this.goToChat,
    });
    // this.props.navigation.setParams({
    //   showActionSheet: this.showActionSheet,
    // });
    // alert("Called");

    if (state.routeName === "Profile") {
      if (uid) {
        // this.props.navigation.setParams({
        //   userProfile: "show",
        // });

        this.props.navigation.setParams({
          showActionSheet: this.showActionSheet,
        });
        this.setState({ showLoading: true });

        // await this.props.getUser(uid);
        // var result = await this.getUserProfile(uid);
        // this.setState({ userProfile: result, showLoading: false });
        // this.props.navigation.setParams({
        //   title: `@${result.username}`,
        // });
        // this.setState({ showLoading: false });
        this.getUserProfile(uid)
          .then((result) => {
            this.setState({ userProfile: result, showLoading: false });
            this.props.navigation.setParams({
              title: `@${result.username}`,
            });
          })
          .catch((error) => {
            this.setState({ showLoading: false });

            alert(error);
          });

        // alert(JSON.stringify(userProfile));
      }
    } else {
      // this.props.navigation.setParams({
      //   userProfile: "show",
      // });
      this.props.navigation.setParams({
        showActionSheet: this.showMyProfileActionSheet,
      });
      this.props.getUser(this.props.user.uid, "LOGIN");

      this.props.navigation.setParams({
        title: `@${this.props.user.username}`,
      });
    }
  };

  getUserProfile = (uid) =>
    new Promise(async (resolve, reject) => {
      try {
        if (uid) {
          var images = [];

          const userQuery = await db.collection("users").doc(uid).get();
          let user = userQuery.data();
          if (user.photo && user.photo.length > 15) {
            images.push({
              uri: user.photo,
            });
          }

          let posts = [];
          const postsQuery = await db
            .collection("posts")
            .where("uid", "==", uid)
            .get();
          postsQuery.forEach(function (response) {
            posts.push(response.data());
          });

          user.posts = posts;

          if (posts != null && posts.length > 0) {
            user.posts = orderBy(posts, "date", "desc");
          }

          if (images.length > 0) {
            this.props.preloadUserImages(images);
          }

          const followingQuery = await db
            .collection("users")
            .where("followers", "array-contains", uid)
            .get();
          var following = [];
          followingQuery.forEach(function (response) {
            following.push(response.data());
          });
          user = { ...user, myFollowings: following };

          const followersQuery = await db
            .collection("users")
            .where("following", "array-contains", uid)
            .get();

          var followers = [];
          followersQuery.forEach(function (response) {
            followers.push(response.data());
          });
          user = { ...user, myFollowers: followers };
          resolve(user);
        }
      } catch (e) {
        reject(e);
      }
    });

  openProfileActions() {
    const { state, navigate } = this.props.navigation;
    // this.props.navigation.setParams({
    //   showActionSheet: this.showActionSheet,
    // });

    if (state.routeName === "Profile") {
      const { uid } = state.params;
      if (uid) {
        this.showActionSheet();
      }
    } else {
      this.showMyProfileActionSheet();
    }
  }

  goToChat() {
    // var user = this.props.profile;
    var user = this.state.userProfile;

    this.props.navigation.navigate("Chat", {
      uid: user.uid,
      title: user.username,
    });
    // this.props.navigation.navigate("Chat", this.props.profile.uid);
  }

  goIndex = (index) => {
    this.flatListRef.scrollToIndex({ animated: true, index: index });
  };

  logout = () => {
    firebase.auth().signOut();
    this.props.logout();
    showMessage({
      message: "User Logged Out Successfully",
      type: "success",
      duration: 2000,
    });
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
      userPosts: this.state.userProfile.posts,
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
    if (this.props.user.following.indexOf(user.uid) >= 0) {
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

  showActionSheet = () => {
    // var user = this.props.profile;
    var user = this.state.userProfile;
    var options = BUTTONS;
    const { state, navigate } = this.props.navigation;

    if (isUserBlocked(this.props.user, user.uid)) {
      // if (this.state.userBlocked) {
      // BUTTONS[2] = "UnBlock";
      options = BUTTONS1;
    } else {
      // BUTTONS[2] = "Block";
      options = BUTTONS;
    }
    this.actionSheet._root.showActionSheet(
      {
        options: options,
        cancelButtonIndex: CANCEL_INDEX,
        // destructiveButtonIndex: DESTRUCTIVE_INDEX,
      },
      (buttonIndex) => {
        //this.setState({ clicked: BUTTONS[buttonIndex] });
        if ("Report" === options[buttonIndex]) {
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
        } else if ("Profile" === options[buttonIndex]) {
          this.props.navigation.navigate("ViewProfile", {
            routeName: state.routeName,
            title: user.username,
            user: user,
          });
        } else if ("Message" === options[buttonIndex]) {
          this.props.navigation.navigate("Chat", {
            uid: user.uid,
            title: user.username,
          });
          //  this.props.navigation.navigate("Chat", user.uid);
        } else if ("Block" === options[buttonIndex]) {
          Alert.alert(
            "Block Account",
            "They won't be able to find your profile, posts or story on l l l s u p e r l l l.\n l l l s u p e r l l l won't let them know that you've blocked them.",
            [
              {
                text: "Cancel",
                onPress: () => alert("Cancelled"),
                style: "cancel",
              },
              {
                text: "Block",
                onPress: () => {
                  this.props.blockUser(user);
                },
              },
            ],
            { cancelable: false }
          );

          // this.props.blockUser(user.uid);
          // var description = "User blocked sucessfully";
          // var message = "Block User";

          // if (this.state.userBlocked) {
          //   description = "User Unblocked";
          //   message = "Unblock User";
          // }
          // showMessage({
          //   message: message,
          //   description: description,
          //   type: "info",
          //   duration: 2000,
          // });
          // this.setState({ userBlocked: !this.state.userBlocked });
        } else if ("Unblock" === options[buttonIndex]) {
          this.unBlockUser(user);
        } else {
        }
      }
    );
  };

  showMyProfileActionSheet = () => {
    if (!(this.props.user && this.props.user.uid)) {
      return;
    }
    var user = this.props.user;
    var options = MYPROFILE_BUTTONS;
    const { state, navigate } = this.props.navigation;
    this.actionSheet._root.showActionSheet(
      {
        options: options,
        cancelButtonIndex: 2,
        destructiveButtonIndex: 1,
      },
      (buttonIndex) => {
        //this.setState({ clicked: BUTTONS[buttonIndex] });
        if ("Logout" === options[buttonIndex]) {
          this.logout();
        } else if ("My Profile" === options[buttonIndex]) {
          this.props.navigation.navigate("ViewProfile", {
            routeName: state.routeName,
            title: user.username,
            user: user,
          });
        } else {
        }
      }
    );
  };
  logout = () => {
    firebase.auth().signOut();
    this.props.logout();
    showMessage({
      message: "User Logged Out Successfully",
      type: "success",
      duration: 2000,
    });
    this.props.navigation.navigate("login");
  };
  unBlockUser(user) {
    Alert.alert(
      `Unblock ${user.username}?`,
      "They will now be able to see your posts and follow you on l l l s u p e r l l l.\n l l l s u p e r l l l won't let them know that you've unblocked them.",
      [
        {
          text: "Cancel",
          // onPress: () => alert("Cancelled"),
          style: "cancel",
        },
        {
          text: "Unblock",
          onPress: () => {
            this.props.unblockUser(user.uid);
          },
        },
      ],
      { cancelable: false }
    );
  }
  openUrl = async (user) => {
    var url = user.bio;

    if (!url) {
      if (this.props.user.uid === user.uid) {
        this.setState({ dialogVisible: true });
      } else {
        showMessage({
          message: "STOP",
          description: `No Link Attached`,
          type: "danger",
          duration: 2000,
        });
      }
    } else {
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
  };
  handleCancel = () => {
    this.setState({ dialogVisible: false });
  };

  handleOnUpdate = async () => {
    if (this.state.website || this.state.websiteLabel) {
      if (!this.state.website) {
        showMessage({
          message: "STOP",
          description: "Please add website link for the website title",
          type: "danger",
          duration: 2000,
        });
        return;
      }

      if (!validURL(this.state.website)) {
        showMessage({
          message: "STOP",
          description: "Please add valid website link",
          type: "danger",
          duration: 2000,
        });
        return;
      }

      if (!this.state.websiteLabel) {
        showMessage({
          message: "STOP",
          description: "Please add website title for the website link",
          type: "danger",
          duration: 2000,
        });
        return;
      }
    }
    this.props.updateBio(this.state.website);
    this.props.updateWebsiteLabel(this.state.websiteLabel);

    this.props.updateUser();

    this.setState({ dialogVisible: false });
  };

  render() {
    let user = {};

    const { state, navigate } = this.props.navigation;
    if (state.routeName === "Profile") {
      // user = this.props.profile;
      user = this.state.userProfile;
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
    let userblocked = false;

    if (user && user.uid) {
      isUserBlocked(this.props.user, user.uid);
    }

    // if (!user.posts) return <ActivityIndicator style={styles.container} />;
    // if (this.state.showLoading) {
    //   return showLoader("Loading, Please wait... ");
    // }
    return (
      <View style={styles.container}>
        {this.state.showLoading ? showLoader("Loading, Please wait... ") : null}

        <ScrollView style={{ marginBottom: 0 }} ref={(c) => (this.scroll = c)}>
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

          {/* <Image
            source={require("../assets/profilePlaceholder.png")}
            style={[
              styles.profilePhoto,
              { backgroundColor: "red", alignSelf: "stretch", height: "auto" },
            ]}
            resizeMode="contain"
          /> */}
          {/* <View style={[styles.profilePhoto, { backgroundColor: "red" }]} /> */}
          <ImageBackground
            style={[styles.profilePhoto, { position: "absolute" }]}
          >
            <View style={[styles.bottomProfile, { width: "100%" }]}>
              {state.routeName === "MyProfile" && user.photo === "" ? (
                <View
                  style={[styles.center, styles.container, { width: "100%" }]}
                >
                  <Button
                    bordered
                    danger
                    onPress={() => {
                      this.props.navigation.navigate("ViewProfile", {
                        routeName: state.routeName,
                        title: user.username,
                        user: user,
                      });
                    }}
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
              <View style={[styles.container, {}]}>
                {/* <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate("MyFollowersAndFollowing", {
                      data: "Followers",
                      route: state.routeName,
                    })
                  }
                  style={{
                    justify Content: "center",
                    alignContent: "center",
                    marginHorizontal: Scale.moderateScale(20),
                    marginVertical: Scale.moderateScale(10),
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "open-sans-bold",
                      color: constants.colors.superRed,
                      letterSpacing: 1,
                    }}
                  >
                    {user.followers && user.followers.length
                      ? user.followers.length
                      : "0"}{" "}
                    friends
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate("MyFollowersAndFollowing", {
                      data: "Following",
                      route: state.routeName,
                    })
                  }
                  style={{
                    justifyContent: "center",
                    alignContent: "center",
                    marginHorizontal: Scale.moderateScale(20),
                    marginTop: Scale.moderateScale(10),
                    marginBottom: Scale.moderateScale(40),
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "open-sans-bold",
                      color: constants.colors.superRed,
                      letterSpacing: 1,
                    }}
                  >
                    {user.following && user.following.length
                      ? user.following.length
                      : "0"}{" "}
                    following
                  </Text>
                </TouchableOpacity> */}

                <View
                  style={[
                    styles.row,
                    {
                      marginBottom: Scale.moderateScale(20),
                    },
                  ]}
                >
                  <View
                    style={{
                      flex: 1,
                      marginHorizontal: Scale.moderateScale(16),
                    }}
                  >
                    <View
                      style={[
                        styles.row,
                        {
                          alignItems: "center",
                          justifyContent: "center",
                        },
                      ]}
                    >
                      <TouchableOpacity
                        style={{
                          justifyContent: "center",
                        }}
                        onPress={() => {
                          this.props.navigation.navigate("ViewProfile", {
                            routeName: state.routeName,
                            title: user.username,
                            user: user,
                          });
                        }}
                      >
                        <Text
                          style={{
                            fontWeight: "bold",
                            fontSize: Scale.moderateScale(24),
                            color: "rgb(255,255,255)",
                            shadowOpacity: 0.5,
                            // ...constants.fonts.FreightSansLight,
                          }}
                        >
                          {user.username}
                        </Text>
                      </TouchableOpacity>

                      {this.props.user.uid != user.uid ? (
                        !userblocked &&
                        this.props.user.following &&
                        this.props.user.following.indexOf(user.uid) < 0 ? (
                          <TouchableOpacity
                            onPress={() => this.follow(user)}
                            style={{
                              marginHorizontal: Scale.moderateScale(5),
                            }}
                          >
                            <Text
                              style={{
                                color: "#00ff00",
                                fontWeight: "bold",
                                padding: Scale.moderateScale(5),
                                fontSize: Scale.moderateScale(16),
                              }}
                            >
                              +follow
                            </Text>
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity
                            onPress={() => this.follow(user)}
                            style={{
                              marginHorizontal: Scale.moderateScale(10),
                            }}
                          >
                            <Text
                              style={{
                                color: "rgb(215, 80, 80)",
                                fontWeight: "bold",
                                padding: Scale.moderateScale(5),
                                fontSize: Scale.moderateScale(14),
                              }}
                            >
                              unfollow
                            </Text>
                          </TouchableOpacity>
                        )
                      ) : null}
                    </View>
                    {/* <Text
                      numberOfLines={2}
                      style={[
                        styles.textF,
                        styles.white,
                        {
                          fontWeight: "300",
                          fontSize: Scale.moderateScale(15),
                          textAlign: "left",
                          flex: 1,
                        },
                      ]}
                    >
                      {user.userbio}
                    </Text> */}
                  </View>
                </View>

                <View style={[styles.row, styles.space, { marginTop: 0 }]}>
                  <TouchableOpacity
                    style={[styles.center, { flex: 1 }]}
                    onPress={() =>
                      this.props.navigation.navigate(
                        "MyFollowersAndFollowing",
                        {
                          data: "Followers",
                          route: state.routeName,
                          user: user,
                        }
                      )
                    }
                  >
                    <Text
                      style={[styles.bold, { fontSize: 22, color: "#fff" }]}
                    >
                      {user.followers && user.followers.length
                        ? user.followers.length
                        : "0"}
                    </Text>
                    <Text style={[{ fontSize: 16, color: "#fff" }]}>
                      followers
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.center, { flex: 1 }]}
                    onPress={() =>
                      this.props.navigation.navigate(
                        "MyFollowersAndFollowing",
                        {
                          data: "Following",
                          route: state.routeName,
                          user: user,
                        }
                      )
                    }
                  >
                    <Text
                      style={[styles.bold, { fontSize: 22, color: "#fff" }]}
                    >
                      {user.following && user.following.length
                        ? user.following.length
                        : "0"}
                    </Text>
                    <Text style={[{ fontSize: 16, color: "#fff" }]}>
                      following
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={[styles.center, { flex: 1 }]}>
                    <Text
                      style={[styles.bold, { fontSize: 22, color: "#fff" }]}
                    >
                      {user.posts && user.posts.length
                        ? user.posts.length
                        : "0"}
                    </Text>
                    <Text style={[{ fontSize: 16, color: "#fff" }]}>posts</Text>
                  </TouchableOpacity>

                  {/* <TouchableOpacity
                    style={[styles.center, { flex: 1 }]}
                    onPress={() =>
                      this.props.navigation.navigate(
                        "MyFollowersAndFollowing",
                        {
                          data: "Following",
                          route: state.routeName,
                        }
                      )
                    }
                  >
                    <Text
                      style={[styles.bold, { fontSize: 22, color: "#fff" }]}
                    >
                      {user.following && user.following.length
                        ? user.following.length
                        : "0"}
                    </Text>
                    <Text style={[{ fontSize: 16, color: "#fff" }]}>likes</Text>
                  </TouchableOpacity> */}
                </View>

                {/* <View
                  style={[
                    styles.row,
                    {
                      width: "100%",
                      marginBottom: Scale.moderateScale(32),
                      alignItems: "center",
                    },
                  ]}
                >
                  <TouchableOpacity
                    style={{
                      alignSelf: "center",
                      alignSelf: "center",
                      marginLeft: "38%",
                    }}
                    onPress={() => {
                      this.props.navigation.navigate("ViewProfile", {
                        routeName: state.routeName,
                        title: user.username,
                      });
                    }}
                  >
                    <Image
                      style={[
                        styles.profileLogo1,
                        { transform: [{ rotate: "90deg" }] },
                      ]}
                      source={require("../assets/logo-3.png")}
                    />
                  </TouchableOpacity>
             
                  {this.props.user.uid != user.uid ? (
                    !userblocked &&
                    this.props.user.following &&
                    this.props.user.following.indexOf(user.uid) < 0 ? (
                      <TouchableOpacity
                        onPress={() => this.follow(user)}
                        style={{ marginHorizontal: Scale.moderateScale(10) }}
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
                    ) : (
                      <TouchableOpacity
                        onPress={() => this.follow(user)}
                        style={{ marginHorizontal: Scale.moderateScale(10) }}
                      >
                        <Text
                          style={{
                            color: "rgb(215, 80, 80)",
                            fontWeight: "bold",
                            padding: Scale.moderateScale(5),
                            fontSize: Scale.moderateScale(14),
                          }}
                        >
                          unfollow
                        </Text>
                      </TouchableOpacity>
                    )
                  ) : null}
                </View> */}
                {/* <TouchableOpacity
                  style={{
                    alignSelf: "center",
                    margin: Scale.moderateScale(10),
                  }}
                  onPress={() => this.showActionSheet()}
                >
                  <Ionicons
                    style={{
                      color: "white",
                    }}
                    name="ios-more"
                    size={40}
                  />
                </TouchableOpacity> */}
                {/* <Text
                  numberOfLines={2}
                  style={[
                    styles.bold,
                    styles.textF,
                    styles.white,
                    styles.margin10,
                    ,
                    { fontSize: Scale.moderateScale(15) },
                  ]}
                >
                  {user.userbio}
                </Text> */}
                {/* <Text
                  style={{
                    fontWeight: "bold",
                    marginBottom: Scale.moderateScale(16),
                    color: "rgb(255,255,255)",
                    alignSelf: "center",
                  }}
                >
                  {"swipe up"}
                </Text> */}
              </View>
            </View>

            <View
              style={[
                {
                  position: "absolute",
                  top: 40,
                  width: "100%",
                },
              ]}
            >
              <View style={[styles.row, {}]}>
                {state.routeName === "Profile" && (
                  <TouchableOpacity
                    style={{
                      // alignItems: "center",
                      marginLeft: Scale.moderateScale(16),
                      shadowOpacity: 0.5,
                      padding: Scale.moderateScale(5),
                    }}
                    onPress={() => {
                      this.props.navigation.goBack();
                    }}
                  >
                    <Ionicons
                      style={{
                        margin: 0,
                        color: "rgb(255,255,255)",
                      }}
                      name="ios-arrow-back"
                      size={32}
                    />
                  </TouchableOpacity>
                )}

                <View
                  style={{
                    flex: 1,
                    marginHorizontal: Scale.moderateScale(16),
                  }}
                >
                  <View
                    style={[
                      styles.row,
                      {
                        alignItems: "center",
                        justifyContent: "flex-end",
                      },
                    ]}
                  >
                    {/* <TouchableOpacity
                      style={{
                        justifyContent: "center",
                        flex: 1,
                      }}
                    >
                      <Text
                        style={{
                          fontWeight: "bold",
                          fontSize: Scale.moderateScale(20),
                          color: "rgb(255,255,255)",
                          // ...constants.fonts.FreightSansLight,
                        }}
                      >
                        {user.username}
                      </Text>
                    </TouchableOpacity> */}

                    {/* {this.props.user.uid != user.uid ? (
                      !userblocked &&
                      this.props.user.following &&
                      this.props.user.following.indexOf(user.uid) < 0 ? (
                        <TouchableOpacity
                          onPress={() => this.follow(user)}
                          style={{ marginHorizontal: Scale.moderateScale(10) }}
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
                      ) : (
                        <TouchableOpacity
                          onPress={() => this.follow(user)}
                          style={{ marginHorizontal: Scale.moderateScale(10) }}
                        >
                          <Text
                            style={{
                              color: "rgb(215, 80, 80)",
                              fontWeight: "bold",
                              padding: Scale.moderateScale(5),
                              fontSize: Scale.moderateScale(14),
                            }}
                          >
                            unfollow
                          </Text>
                        </TouchableOpacity>
                      )
                    ) : null} */}

                    <TouchableOpacity
                      style={{
                        alignItems: "center",
                        marginLeft: Scale.moderateScale(20),
                        padding: Scale.moderateScale(5),
                      }}
                      onPress={() => this.openProfileActions(user)}
                    >
                      <Ionicons
                        style={{
                          margin: 0,
                          color: "rgb(255,255,255)",
                        }}
                        name="ios-more"
                        size={32}
                      />
                    </TouchableOpacity>
                  </View>
                  {/* <Text
                    numberOfLines={2}
                    style={[
                      styles.textF,
                      styles.white,
                      {
                        fontWeight: "300",
                        fontSize: Scale.moderateScale(15),
                        textAlign: "left",
                        flex: 1,
                      },
                    ]}
                  >
                    {user.userbio}
                  </Text> */}
                </View>
              </View>
            </View>
          </ImageBackground>

          {!userblocked && (
            <FlatList
              initialNumToRender="9"
              maxToRenderPerBatch="9"
              windowSize={12}
              contentContainerStyle={{ marginBottom: 150 }}
              refreshing={false}
              horizontal={false}
              numColumns={3}
              data={user.posts}
              extraData={user}
              onViewableItemsChanged={this._onViewableItemsChanged}
              viewabilityConfig={viewabilityConfig}
              // removeClippedSubviews={true}
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
                          type={item.type}
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
          )}

          <ActionSheet
            ref={(c) => {
              this.actionSheet = c;
            }}
          />

          <Dialog.Container visible={this.state.dialogVisible}>
            <Dialog.Title>Add your link</Dialog.Title>
            <Dialog.Description>
              Add your website label(Title) and website link
            </Dialog.Description>
            <Dialog.Input
              value={this.state.websiteLabel}
              underlineColorAndroid="#000"
              onChangeText={(input) => this.setState({ websiteLabel: input })}
              placeholder="Website Label"
            />
            <Dialog.Input
              value={this.state.website}
              underlineColorAndroid="#000"
              onChangeText={(input) => this.setState({ website: input })}
              placeholder="Website Link"
            />
            <Dialog.Button label="Cancel" onPress={this.handleCancel} />
            <Dialog.Button label="Update" onPress={this.handleOnUpdate} />
          </Dialog.Container>
        </ScrollView>
      </View>
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
      likePost,
      blockUser,
      unblockUser,
      unlikePost,
      getUser,
      logout,
      updateBio,
      updateUser,
      preloadUserImages,
      updateWebsiteLabel,
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
