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

import {
  followUser,
  unfollowUser,
  getUser,
  blockUser,
  unblockUser,
  logout,
  updateBio,
  updateUser,
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

var BUTTONS = ["Message", "Report", "Block", "Cancel"];
var MYPROFILE_BUTTONS = ["My Profile", "Logout"];

var BUTTONS1 = ["Message", "Report", "Unblock", "Cancel"];

var DESTRUCTIVE_INDEX = 1;
var CANCEL_INDEX = 3;
const { height, width } = Dimensions.get("window");
import { isUserBlocked } from "../util/Helper";

var self;
class Profile extends React.Component {
  static navigationOptions = ({ navigation }) => {
    //Show Header by returning header
    return {
      headerRight: (
        <TouchableOpacity
          style={{ marginRight: 24, shadowOpacity: 0.5 }}
          onPress={() => self.openProfileActions()}
        >
          <Ionicons
            style={{
              color: "white",
            }}
            name="ios-more"
            size={40}
          />
        </TouchableOpacity>
      ),
      title: navigation.getParam("title", ""),
    };
  };

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

        await this.props.getUser(uid);
        this.setState({ showLoading: false });

        this.props.navigation.setParams({
          title: `@${this.props.profile.username}`,
        });
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
    var user = this.props.profile;

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
    var user = this.props.profile;
    var options = BUTTONS;
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
        destructiveButtonIndex: DESTRUCTIVE_INDEX,
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
        // cancelButtonIndex: CANCEL_INDEX,
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

  getProfileComponent(user) {
    const { state, navigate } = this.props.navigation;
    let userblocked = isUserBlocked(this.props.user, user.uid);

    return (
      <View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <TouchableOpacity
            style={{
              padding: Scale.moderateScale(10),
              marginTop: Scale.moderateScale(32),
              marginLeft: Scale.moderateScale(18),
            }}
            onPress={() => this.RBSheet.close()}
          >
            <AntDesign name="left" size={30} color="#000" />
          </TouchableOpacity>
          {state.routeName != "MyProfile" && (
            <TouchableOpacity
              style={{
                padding: Scale.moderateScale(10),
                marginTop: Scale.moderateScale(32),
                marginRight: Scale.moderateScale(18),
              }}
              onPress={() => {
                this.RBSheet.close();
                this.goToChat();
              }}
            >
              <SimpleLineIcons name={"paper-plane"} size={30} color="#000" />
            </TouchableOpacity>
          )}
        </View>
        <View style={[styles.center]}>
          <TouchableOpacity>
            <ProgressiveImage
              transparentBackground="transparent"
              source={{ uri: user.photo }}
              style={styles.roundImage100}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              justifyContent: "center",
              alignItems: "flex-start",
            }}
          >
            <Text
              style={{
                fontWeight: "400",
                fontSize: 18,
                color: "#000",
              }}
            >
              {user.username}
            </Text>
          </TouchableOpacity>

          <View
            style={[
              styles.row,
              styles.space,
              styles.followBar,
              styles.bottomgreyborder,
              {
                marginTop: Scale.moderateScale(14),
                marginBottom: Scale.moderateScale(14),
                paddingBottom: Scale.moderateScale(14),
              },
            ]}
          >
            <TouchableOpacity
              style={[styles.center, {}]}
              onPress={() => {
                this.RBSheet.close();
                this.props.navigation.navigate("MyFollowersAndFollowing", {
                  data: "Followers",
                  route: state.routeName,
                });
              }}
            >
              <Text
                style={[
                  styles.bold,
                  styles.textF,
                  { color: "#000", fontSize: Scale.moderateScale(18) },
                ]}
              >
                {user.followers && user.followers.length
                  ? user.followers.length
                  : "0"}
              </Text>
              <Text style={[styles.grey]}> Followers</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.center, {}]}
              onPress={() => {
                this.RBSheet.close();
                this.props.navigation.navigate("MyFollowersAndFollowing", {
                  data: "Following",
                  route: state.routeName,
                });
              }}
            >
              <Text
                style={[
                  styles.bold,
                  { color: "#000", fontSize: Scale.moderateScale(18) },
                ]}
              >
                {user.following && user.following.length
                  ? user.following.length
                  : "0"}
              </Text>
              <Text style={[styles.grey]}> Following</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.center, {}]} onPress={() => {}}>
              <Text
                style={[
                  styles.bold,
                  { color: "#000", fontSize: Scale.moderateScale(18) },
                ]}
              >
                {"-"}
              </Text>
              <Text style={[styles.grey]}> Likes</Text>
            </TouchableOpacity>
          </View>

          <View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginLeft: Scale.moderateScale(30),
                marginRight: Scale.moderateScale(40),
              }}
            >
              <Text style={[styles.bold, styles.black, { width: "30%" }]}>
                Name:
              </Text>
              <Text
                style={[
                  styles.grey,
                  styles.margin10,
                  { width: "70%", textAlign: "right" },
                ]}
              >
                {user.username}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginLeft: Scale.moderateScale(30),
                marginRight: Scale.moderateScale(40),
              }}
            >
              <Text style={[styles.bold, styles.black, { width: "30%" }]}>
                Bio:
              </Text>
              <Text
                style={[
                  styles.grey,
                  styles.margin10,
                  { width: "70%", textAlign: "right" },
                ]}
              >
                {user.userbio || "-"}
              </Text>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={[
                  styles.textB,
                  styles.margin10,
                  { width: "45%", textAlign: "right" },
                ]}
              >
                Website:
              </Text>
              <Text
                style={[
                  styles.textB,
                  styles.margin10,
                  { width: "55%", textAlign: "left" },
                ]}
              >
                {user.bio}
              </Text>
            </View>

            {state.routeName === "MyProfile" && (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  style={[
                    styles.textB,
                    styles.margin10,
                    { width: "45%", textAlign: "right" },
                  ]}
                >
                  Website Label:
                </Text>
                <Text
                  style={[
                    styles.textB,
                    styles.margin10,
                    { width: "55%", textAlign: "left" },
                  ]}
                >
                  {user.websiteLabel}
                </Text>
              </View>
            )}

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={[
                  styles.textB,
                  styles.margin10,
                  { width: "45%", textAlign: "right" },
                ]}
              >
                Gender:
              </Text>
              <Text
                style={[
                  styles.textB,
                  styles.margin10,
                  { width: "55%", textAlign: "left" },
                ]}
              >
                {user.gender}
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={[
                  styles.textB,
                  styles.margin10,
                  { width: "45%", textAlign: "right" },
                ]}
              >
                Birthdate:
              </Text>
              <Text
                style={[
                  styles.textB,
                  styles.margin10,
                  { width: "55%", textAlign: "left" },
                ]}
              >
                {user.dob ? moment(user.dob).format("ll") : "-"}
              </Text>
            </View>
            {state.routeName === "MyProfile" && (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  style={[
                    styles.textB,
                    styles.margin10,
                    { width: "45%", textAlign: "right" },
                  ]}
                >
                  Account Type:
                </Text>
                <Text
                  style={[
                    styles.textB,
                    styles.margin10,
                    { width: "55%", textAlign: "left" },
                  ]}
                >
                  {user.accountType}
                </Text>
              </View>
            )}
            {state.routeName === "MyProfile" && (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  style={[
                    styles.textB,
                    styles.margin10,
                    { width: "45%", textAlign: "right" },
                  ]}
                >
                  Email:
                </Text>
                <Text
                  style={[
                    styles.textB,
                    styles.margin10,
                    { width: "55%", textAlign: "left" },
                  ]}
                >
                  {user.email}
                </Text>
              </View>
            )}

            {state.routeName === "MyProfile" && (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  style={[
                    styles.textB,
                    styles.margin10,
                    { width: "45%", textAlign: "right" },
                  ]}
                >
                  Phone:
                </Text>
                <Text
                  style={[
                    styles.textB,
                    styles.margin10,
                    { width: "55%", textAlign: "left" },
                  ]}
                >
                  {user.phone}
                </Text>
              </View>
            )}
          </View>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              padding: 15,
              marginTop: Scale.moderateScale(10),
            }}
            onPress={() => {
              this.RBSheet.close();
              this.props.navigation.navigate("BlockedUsers");
            }}
          >
            <Text style={{ flex: 1 }}>Blocked Accounts </Text>
            <Ionicons name="ios-arrow-forward" size={20} color="black" />
          </TouchableOpacity>
          <Button block light style={styles.margin10} onPress={this.logout}>
            <Text>Logout</Text>
          </Button>
          <TouchableOpacity
            style={{
              marginTop: Scale.moderateScale(10),
            }}
            onPress={() => {
              if (state.routeName === "MyProfile") {
                this.RBSheet.close();
                this.props.navigation.navigate("Edit");
              }
            }}
          >
            <Image
              style={[
                styles.profileLogo1,
                { transform: [{ rotate: "90deg" }] },
              ]}
              source={require("../assets/logo-1.png")}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

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
    let userblocked = isUserBlocked(this.props.user, user.uid);

    // if (!user.posts) return <ActivityIndicator style={styles.container} />;
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
              <View style={[styles.container, {}]}>
                <View
                  style={[
                    styles.row,
                    {
                      width: "100%",
                      marginBottom: Scale.moderateScale(32),
                      // justifyContent: "center",
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
                      // this.RBSheet.open()
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
                  {/* <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 18,
                      color: "rgb(255,255,255)",
                    }}
                  >
                    @ {user.username}
                  </Text> */}
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
                </View>
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
                <Text
                  style={{
                    fontWeight: "bold",
                    marginBottom: Scale.moderateScale(16),
                    color: "rgb(255,255,255)",
                    alignSelf: "center",
                  }}
                >
                  {"swipe up"}
                </Text>
              </View>
            </View>
          </ImageBackground>
          {/* <View
            style={[
              styles.row,
              styles.space,
              styles.followBar,
              { marginTop: 0 },
            ]}
          >
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
                onPress={() => {
                  userblocked ? this.unBlockUser(user) : this.follow(user);
                }}
              >
                <NText
                  style={[
                    styles.small,
                    styles.bold,
                    { marginRight: 10, marginLeft: 10 },
                  ]}
                >
                  {userblocked
                    ? "Unblock"
                    : this.props.user.following &&
                      this.props.user.following.indexOf(user.uid) >= 0
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
          </View> */}

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
        <RBSheet
          ref={(ref) => {
            this.RBSheet = ref;
          }}
          height={height * 1}
          openDuration={250}
          customStyles={{
            container: {
              // justifyContent: "center",
              // alignItems: "center",
            },
          }}
        >
          {this.getProfileComponent(user)}
        </RBSheet>
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
