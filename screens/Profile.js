import React from "react";
import styles from "../styles";
import auth from "@react-native-firebase/auth";
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
  ActivityIndicator,
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
import {
  likePost,
  unlikePost,
  deletePost,
  getUserPosts,
} from "../actions/post";
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
      refreshing: false,
      showHide: "hide",
      position: 0,
      visible: false,
      changes: 1,
      userProfile: {},
      userPosts: [],
      routeName: "",
      uid: null,
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
    const routeName = this.props.route.name;
    const { uid } = this.props.route.params;
    this.props.navigation.setParams({
      goToChat: this.goToChat,
    });
    this.setState({ routeName: routeName, uid: uid });

    if (routeName === "Profile") {
      if (uid) {
        this.props.navigation.setParams({
          showActionSheet: this.showActionSheet,
        });
        this.setState({ showLoading: true, refreshing: true });

        this.props.getUser(uid, null, (result, error) => {
          this.setState({ showLoading: false, refreshing: false });
          if (result) {
            this.setState({
              userProfile: result,
            });
            this.props.navigation.setParams({
              title: `@${result.username}`,
            });

            this.props.getUserPosts(
              uid,
              (result, error) => {
                if (result) {
                  this.mergeUserPosts(result);
                } else {
                }
              },
              null
            );
          } else {
            alert(error);
          }
        });

        // this.props
        //   .getUser(uid)
        //   .then((result) => {
        //     alert(JSON.stringify(result));
        //     // this.setState({
        //     //   userProfile: result,
        //     //   showLoading: false,
        //     //   refreshing: false,
        //     // });
        //     // this.props.navigation.setParams({
        //     //   title: `@${result.username}`,
        //     // });
        //   })
        //   .catch((error) => {
        //     this.setState({ showLoading: false, refreshing: false });

        //     alert(error);
        //   });
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

          // let posts = [];
          // const postsQuery = await db
          //   .collection("posts")
          //   .where("uid", "==", uid)
          //   .get();
          // postsQuery.forEach(function (response) {
          //   posts.push(response.data());
          // });

          // user.posts = posts;

          // if (posts != null && posts.length > 0) {
          //   user.posts = orderBy(posts, "date", "desc");
          // }

          // if (images.length > 0) {
          //   this.props.preloadUserImages(images);
          // }

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
          this.getUserPosts(uid);
          resolve(user);
        }
      } catch (e) {
        reject(e);
      }
    });
  // Retrieve More
  retrieveMore = async () => {
    if (!this.state.refreshing) {
      this.setState({
        refreshing: true,
      });
      try {
        if (
          this.state.userProfile &&
          this.state.userProfile.posts &&
          this.state.userProfile.posts.length > 0
        ) {
          let lastFetchedPostDate = this.state.userProfile.posts[
            this.state.userProfile.posts.length - 1
          ].date;

          this.props.getUserPosts(
            this.state.uid,
            (result, error) => {
              if (result) {
                this.mergeUserPosts(result);
              } else {
              }

              this.setState({
                refreshing: false,
              });
            },
            lastFetchedPostDate
          );
        }
      } catch (error) {
        console.log(error);
        this.setState({
          refreshing: false,
        });
      }
    }
  };

  mergeUserPosts = (posts) => {
    if (this.state.routeName === "Profile") {
      if (posts) {
        let userProfile = this.state.userProfile;
        let oldPosts = [];
        if (userProfile.posts) {
          oldPosts = userProfile.posts;
        }
        var mergedArray = oldPosts.concat(posts);
        userProfile.posts = mergedArray;
        this.setState({ userProfile: userProfile });
      }
    }
  };

  getUserPosts = async (uid, lastFetchedPostDate = null) =>
    new Promise(async (resolve, reject) => {
      try {
        // dispatch({ type: "SHOW_LOADING", payload: true });

        var postQuery;
        if (lastFetchedPostDate) {
          // alert(lastFetchedPostDate);
          postQuery = await db
            .collection("posts")
            .where("uid", "==", uid)
            .orderBy("date", "desc")
            .startAfter(lastFetchedPostDate)
            .limit(10)
            .get();
        } else {
          postQuery = await db
            .collection("posts")
            .where("uid", "==", uid)
            .orderBy("date", "desc")
            .limit(10)
            .get();
        }
        var images = [];
        var posts = [];

        postQuery.forEach(function (response) {
          posts.push(response.data());
        });
        if (images.length > 0) {
          this.props.preloadUserImages(images);
        }
        if (this.state.routeName === "Profile") {
          if (posts) {
            let userProfile = this.state.userProfile;
            let oldPosts = [];
            if (userProfile.posts) {
              oldPosts = userProfile.posts;
            }
            var mergedArray = oldPosts.concat(posts);
            userProfile.posts = mergedArray;
            this.setState({ userProfile: userProfile });
          }
        }
        resolve(posts);
      } catch (e) {
        // alert(e);
        reject(e);
        let array = [];
      }
    });

  openProfileActions() {
    const routeName = this.props.route.name;
    // this.props.navigation.setParams({
    //   showActionSheet: this.showActionSheet,
    // });

    if (routeName === "Profile") {
      // const { uid } = state.params;
      const { uid } = this.props.route.params;
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
  }

  goIndex = (index) => {
    this.flatListRef.scrollToIndex({ animated: true, index: index });
  };

  logout = () => {
    auth().signOut();
    this.props.logout();
    showMessage({
      message: "User Logged Out Successfully",
      type: "success",
      duration: 2000,
    });
    // this.props.navigation.navigate("login");
    this.props.navigation.replace("Auth");
  };

  refreshScript = () => {
    this.setState({ state: this.state });
  };

  onSelect = (item, index) => {
    // const { state, navigate } = this.props.navigation;
    const routeName = this.props.route.name;
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
      route: routeName,
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
    // const { state, navigate } = this.props.navigation;
    const routeName = this.props.route.name;
    if (routeName === "MyProfile") {
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
    // const { state, navigate } = this.props.navigation;
    const routeName = this.props.route.name;
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
            routeName: routeName,
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
    // const { state, navigate } = this.props.navigation;
    const routeName = this.props.route.name;
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
            routeName: routeName,
            title: user.username,
            user: user,
          });
        } else {
        }
      }
    );
  };
  logout = () => {
    auth().signOut();
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

  getPostItemLayout = (data, index) => ({
    length: width * 0.33 * (height / width),
    offset: width * 0.33 * (height / width) * index,
    index,
  });

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

  searchUserHeaderComponent(user, routeName, userblocked) {
    return (
      <View>
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
          <View style={[styles.bottomProfile, { width: "100%" }]}>
            {routeName === "MyProfile" && user.photo === "" ? (
              <View
                style={[styles.center, styles.container, { width: "100%" }]}
              >
                <Button
                  bordered
                  danger
                  onPress={() => {
                    this.props.navigation.navigate("ViewProfile", {
                      routeName: routeName,
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
                        // justifyContent: "center",
                      },
                    ]}
                  >
                    <TouchableOpacity
                      style={{
                        justifyContent: "center",
                        flex: 1,
                      }}
                      onPress={() => {
                        this.props.navigation.navigate("ViewProfile", {
                          routeName: routeName,
                          title: user.username,
                          user: user,
                        });
                      }}
                    >
                      <Text
                        style={{
                          fontWeight: "500",
                          fontSize: Scale.moderateScale(38),
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
                              color: "#db565b",
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

              <View
                style={[
                  styles.row,
                  styles.space,
                  { marginTop: 0, display: "none" },
                ]}
              >
                <TouchableOpacity
                  style={[styles.center, { flex: 1 }]}
                  onPress={() =>
                    this.props.navigation.navigate("MyFollowersAndFollowing", {
                      data: "Followers",
                      route: routeName,
                      user: user,
                    })
                  }
                >
                  <Text style={[styles.bold, { fontSize: 22, color: "#fff" }]}>
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
                    this.props.navigation.navigate("MyFollowersAndFollowing", {
                      data: "Following",
                      route: routeName,
                      user: user,
                    })
                  }
                >
                  <Text style={[styles.bold, { fontSize: 22, color: "#fff" }]}>
                    {user.following && user.following.length
                      ? user.following.length
                      : "0"}
                  </Text>
                  <Text style={[{ fontSize: 16, color: "#fff" }]}>
                    following
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.center, { flex: 1 }]}>
                  <Text style={[styles.bold, { fontSize: 22, color: "#fff" }]}>
                    {user.posts && user.posts.length ? user.posts.length : "0"}
                  </Text>
                  <Text style={[{ fontSize: 16, color: "#fff" }]}>posts</Text>
                </TouchableOpacity>
              </View>
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
              {routeName === "Profile" && (
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
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }
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

  render() {
    let user = {};

    // const { state, navigate } = this.props.navigation;
    const routeName = this.props.route.name;
    if (routeName === "Profile") {
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

        <EmptyView
          ref={(ref) => {
            this.sheetRef = ref;
          }}
          navigation={this.props.navigation}
        />

        <FlatList
          initialNumToRender={12}
          maxToRenderPerBatch={12}
          windowSize={12}
          contentContainerStyle={{ marginBottom: 150 }}
          refreshing={false}
          horizontal={false}
          numColumns={3}
          data={userblocked ? [] : user.posts}
          ListHeaderComponent={this.searchUserHeaderComponent(
            user,
            routeName,
            userblocked
          )}
          onEndReachedThreshold={1}
          onEndReached={this.retrieveMore}
          ListFooterComponent={this.renderFooter}
          // extraData={user}
          // onViewableItemsChanged={this._onViewableItemsChanged}
          // viewabilityConfig={viewabilityConfig}
          removeClippedSubviews={true}
          getItemLayout={this.getPostItemLayout}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => {
            const liked = item.likes.includes(this.props.user.uid);
            const visible = this.state.visible;
            return (
              <View
                style={[
                  styles.center,
                  styles.squareLarge,
                  { marginRight: 3, marginBottom: 3 },
                ]}
              >
                <TouchableOpacity
                  id={item.id}
                  onPress={() => [this.onSelect(item, index)]}
                  activeOpacity={0.6}
                  // onLongPress={() => this.activateLongPress(item)}
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
      getUserPosts,
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
