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
import ButtonComponent from "../component/ButtonComponent";

import {
  followUser,
  unfollowUser,
  getUser,
  blockUser,
  unblockUser,
  logout,
  updateBio,
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
import EmptyView1 from "../component/emptyviewLayout1";
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
var MYPROFILE_BUTTONS = [
  "My Profile",
  "Find Friends",
  "Invite Friends",
  "Logout",
  "Cancel",
];

var BUTTONS1 = ["Profile", "Message", "Report", "Unblock", "Cancel"];

var DESTRUCTIVE_INDEX = 1;
var CANCEL_INDEX = 4;
const { height, width } = Dimensions.get("window");
import { isUserBlocked } from "../util/Helper";
import FastImage from "react-native-fast-image";

var self;
var uid;
class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.page;
    this.cellRefs = {};
    this.uid = null;

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
      website: "",
      userBlocked: false,
      websiteLabel: "",
      showLoading: false,
    };
    this.scroll = null;
    this.scrollView = null;
    this.haveMorePosts = true;
  }

  componentDidMount = async () => {
    // this.didFocusSubscription = this.props.navigation.addListener(
    //   "focus",
    //   this.didFocusAction
    // );
    self = this;
    const routeName = this.props.route.name;
    var uid = null;

    if (this.props.route.params && this.props.route.params.uid) {
      uid = this.props.route.params.uid;
    }

    this.props.navigation.setParams({
      goToChat: this.goToChat,
    });
    this.setState({ routeName: routeName, uid: uid });

    if (routeName === "Profile") {
      if (uid) {
        this.uid = uid;
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
              result,
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
      }
    } else {
      // this.props.navigation.setParams({
      //   userProfile: "show",
      // });
      this.props.navigation.setParams({
        showActionSheet: this.showMyProfileActionSheet,
      });
      this.uid = this.props.user.uid;
      this.props.getUser(this.props.user.uid, "LOGIN");

      this.props.navigation.setParams({
        title: `@${this.props.user.username}`,
      });
    }
  };

  componentWillUmount() {
    // remove listener
    this.didFocusSubscription.remove();
  }

  didFocusAction = (payload) => {
    if (this.props.user && !this.props.user.photo) {
      showMessage({
        message: "Please complete your profile",
        type: "info",
        duration: 2000,
      });

      this.props.navigation.navigate("EditProfile", {
        title: this.props.user.username,
      });
    }
  };

  // Retrieve More
  retrieveMore = async () => {
    if (!this.state.refreshing) {
      this.setState({
        refreshing: true,
      });
      try {
        if (this.state.routeName === "Profile") {
          if (
            this.state.userProfile &&
            this.state.userProfile.posts &&
            this.state.userProfile.posts.length > 0
          ) {
            let lastFetchedPostDate = this.state.userProfile.posts[
              this.state.userProfile.posts.length - 1
            ].date;

            this.props.getUserPosts(
              this.state.userProfile,
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
        } else {
          if (
            this.props.user &&
            this.props.user.posts &&
            this.props.user.posts.length > 0
          ) {
            let lastFetchedPostDate = this.props.user.posts[
              this.props.user.posts.length - 1
            ].date;

            // alert(this.uid);

            this.props.getUserPosts(
              this.props.user,
              (result, error) => {
                this.setState({
                  refreshing: false,
                });
              },
              lastFetchedPostDate
            );
          }
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

    // alert(index + "---" + routeName);
    // alert(JSON.stringify(this.state.userProfile.posts));
    // return;

    this.props.navigation.push("PostListScreen", {
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
        cancelButtonIndex: 4,
        destructiveButtonIndex: 3,
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
        } else if ("Find Friends" === options[buttonIndex]) {
          this.props.navigation.navigate("MyContacts", { selectedTab: 0 });
        } else if ("Invite Friends" === options[buttonIndex]) {
          this.props.navigation.navigate("MyContacts", { selectedTab: 1 });
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
        {/* {user.accountType == "Brand" ? (
          <ProgressiveImage
            source={{ uri: user.bgImage }}
            style={[styles.profilePhoto]}
            resizeMode="cover"
          />
        ) : (
          <ProgressiveImage
            thumbnailSource={{
              uri: user.preview,
            }}
            source={{ uri: user.photo }}
            style={[styles.profilePhoto]}
            resizeMode="cover"
          />
        )} */}

        <ProgressiveImage
          source={
            user.accountType == "Brand"
              ? user.bgImage
                ? { uri: user.bgImage }
                : constants.images.backgroundImagePlaceholder
              : user.photo
              ? { uri: user.photo }
              : constants.images.backgroundImagePlaceholder
          }
          // style={{ width: width, height: Scale.moderateScale(500) }}
          style={[styles.profilePhoto]}
          resizeMode="cover"
          thumbnailSource={{
            uri:
              user.accountType == "Brand"
                ? user.backgroundPreview
                : user.preview,
          }}
          transparentBackground="transparent"
        />

        <ImageBackground
          style={[styles.profilePhoto, { position: "absolute" }]}
        >
          <View style={[styles.bottomProfile, { width: "100%" }]}>
            <View style={[styles.center, styles.container]}>
              {user.accountType == "Brand" &&
                (user.photo ? (
                  <View>
                    <ProgressiveImage
                      source={{
                        uri:
                          this.props.user.accountType == "Brand"
                            ? user.photo
                            : "",
                      }}
                      resizeMode={
                        this.props.user.accountType == "Brand"
                          ? "contain"
                          : "cover"
                      }
                      transparentBackground="transparent"
                      style={[
                        ,
                        {
                          height: Scale.moderateScale(150),
                          width: Scale.moderateScale(150),
                          borderRadius: Scale.moderateScale(75),
                        },
                      ]}
                    />
                  </View>
                ) : routeName === "MyProfile" ? (
                  <TouchableOpacity
                    style={{
                      height: Scale.moderateScale(150),
                      width: Scale.moderateScale(150),
                      borderRadius: Scale.moderateScale(75),
                      borderColor: "white",
                      borderWidth: Scale.moderateScale(6),
                      alignItems: "center",
                      justifyContent: "center",
                      shadowOpacity: 0.3,
                    }}
                    onPress={() =>
                      this.props.navigation.navigate("EditProfile", {
                        title: this.props.user.username,
                      })
                    }
                  >
                    <Text
                      style={{
                        fontSize: Scale.moderateScale(18),
                        fontWeight: "400",
                        color: constants.colors.superRed,
                      }}
                    >
                      {"Add Logo"}
                    </Text>
                  </TouchableOpacity>
                ) : null)}

              {user.accountType == "Brand" && (
                <View>
                  {!user.accountStatus && (
                    <ButtonComponent
                      title={`Account Status: Request For Approval`}
                      containerStyle={{
                        width: Scale.moderateScale(260),
                        alignSelf: "center",
                      }}
                      color={constants.colors.red}
                      colors={[
                        constants.colors.transparent,
                        constants.colors.transparent,
                      ]}
                      textStyle={{ fontSize: 16, textAlign: "center" }}
                      onPress={() => {
                        this.props.navigation.navigate("ViewProfile", {
                          routeName: routeName,
                          title: user.username,
                          user: user,
                        });
                      }}
                      linearGradientStyle={{
                        paddingHorizontal: Scale.moderateScale(0),
                        // marginHorizontal: Scale.moderateScale(0),
                      }}
                    />
                  )}

                  {user.accountStatus === "inreview" && (
                    <ButtonComponent
                      title={`Account Status: In Review`}
                      containerStyle={{
                        width: Scale.moderateScale(260),
                        alignSelf: "center",
                      }}
                      color={constants.colors.blue800}
                      colors={[
                        constants.colors.transparent,
                        constants.colors.transparent,
                      ]}
                      textStyle={{ fontSize: 16, textAlign: "center" }}
                      onPress={() => {}}
                      linearGradientStyle={{
                        paddingHorizontal: Scale.moderateScale(0),
                        // marginHorizontal: Scale.moderateScale(0),
                      }}
                    />
                  )}
                  {user.accountStatus === "rejected" && (
                    <ButtonComponent
                      title={`Account Status: Rejected`}
                      containerStyle={{
                        width: Scale.moderateScale(260),
                        alignSelf: "center",
                      }}
                      color={constants.colors.red}
                      colors={[
                        constants.colors.transparent,
                        constants.colors.transparent,
                      ]}
                      textStyle={{ fontSize: 16, textAlign: "center" }}
                      onPress={() => {}}
                      linearGradientStyle={{
                        paddingHorizontal: Scale.moderateScale(0),
                        // marginHorizontal: Scale.moderateScale(0),
                      }}
                    />
                  )}
                </View>
              )}
            </View>
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
                          fontWeight: "bold",
                          fontSize: Scale.moderateScale(23),
                          color: "rgb(255,255,255)",
                          shadowOpacity: 0.5,

                          // ...constants.fonts.FreightSansLight,
                        }}
                        numberOfLines={1}
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

                  {routeName === "MyProfile" &&
                    ((user.accountType == "Brand" && !user.bgImage) ||
                      (user.accountType !== "Brand" && !user.photo)) && (
                      <TouchableOpacity
                        style={{
                          shadowOpacity: 0.5,
                          flexDirection: "row",
                          justifyContent: "flex-end",
                          alignItems: "center",
                          marginTop: 8,
                        }}
                        onPress={() =>
                          this.props.navigation.navigate("EditProfile", {
                            title: this.props.user.username,
                          })
                        }
                      >
                        <Text
                          style={{
                            fontSize: Scale.moderateScale(18),
                            fontWeight: "600",
                            color: constants.colors.superRed,
                          }}
                        >
                          {this.props.user.accountType == "Brand"
                            ? "Add/Change background"
                            : "Add/Change Photo"}
                        </Text>
                        <Ionicons
                          style={{
                            marginLeft: 12,
                            color: "rgb(255,255,255)",
                          }}
                          name="ios-camera"
                          size={48}
                        />
                      </TouchableOpacity>
                    )}
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
          <EmptyView1
            // title={`No ads.\nNo bs.\nJust real people\nsharing rad posts! \n⚡⚡⚡`}
            title={`Rad vibes, good times `}
            button="Signup"
            textButton="Create account"
            image={require("../assets/logoH.png")}
            userId={this.props.user.uid}
            imageStyle={{
              width: Scale.moderateScale(150),
              height: Scale.moderateScale(150),
              marginLeft: Scale.moderateScale(-30),
              marginBottom: Scale.moderateScale(-15),
              // backgroundColor: "red",
            }}
            navigation={this.props.navigation}
            // icon={
            //   <MaterialCommunityIcons
            //     style={{ margin: 5 }}
            //     name="face-profile"
            //     size={64}
            //   />
            // }
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
          contentContainerStyle={{ marginBottom: 150 }}
          refreshing={false}
          horizontal={false}
          numColumns={3}
          data={userblocked ? [] : user.posts}
          ListEmptyComponent={
            <EmptyView
              title={
                routeName === "Profile"
                  ? "No posts found"
                  : "Make your first post !"
              }
              titleStyle={{ color: constants.colors.superRed }}
            />
          }
          ListHeaderComponent={this.searchUserHeaderComponent(
            user,
            routeName,
            userblocked
          )}
          onEndReachedThreshold={0.1}
          onMomentumScrollBegin={() => {
            this.onEndReachedCalledDuringMomentum = false;
          }}
          onEndReached={() => {
            if (!this.onEndReachedCalledDuringMomentum) {
              this.retrieveMore(); // LOAD MORE DATA
              this.onEndReachedCalledDuringMomentum = true;
            }
          }}
          // onEndReached={this.retrieveMore}
          ListFooterComponent={this.renderFooter}
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
