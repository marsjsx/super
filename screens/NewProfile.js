import React from "react";
import styles from "../styles";
import auth from "@react-native-firebase/auth";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  ImageBackground,
  Alert,
  Platform,
  Linking,
  UIManager,
  findNodeHandle,
  Dimensions,
  ScrollView,
  StatusBar,
  FlatList,
} from "react-native";
import { showLoader } from "../util/Loader";
import { AntDesign } from "react-native-vector-icons";
import { validURL, openSettingsDialog } from "../util/Helper";
import ButtonComponent from "../component/ButtonComponent";
import FastImage from "react-native-fast-image";
import AddNewLinkModal from "../component/AddNewLinkModal";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  followUser,
  unfollowUser,
  getUser,
  blockUser,
  deleteAuth,
  unblockUser,
  updateCompressedPhoto,
  updateEmail,
  updatePassword,
  updateUsername,
  updateBio,
  updateUserBio,
  updateWebsiteLabel,
  updateUser,
  deleteUser,
  updatePhone,
  updateGender,
  updateAccountType,
  updateDOB,
  updatePhoto,
  logout,
  requestForBrandApproval,
  createAndUpdatePreview,
} from "../actions/user";
import { uploadPhoto } from "../actions";
import constants from "../constants";

import { getMessages } from "../actions/message";
import { likePost, unlikePost, deletePost } from "../actions/post";
import { BlurView } from "@react-native-community/blur";
import {
  Ionicons,
  MaterialCommunityIcons,
  Entypo,
  SimpleLineIcons,
} from "react-native-vector-icons";
// import * as ImagePicker from "expo-image-picker";
import ImagePicker from "react-native-image-crop-picker";
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
  DatePicker,
  Picker,
  Text as NText,
} from "native-base";

const viewabilityConfig = {
  itemVisiblePercentThreshold: 90,
};

var BUTTONS = ["Message", "Report", "Block", "Cancel"];
var BUTTONS1 = ["Message", "Report", "Unblock", "Cancel"];
import { convertDate } from "../util/DateFormater";
var DESTRUCTIVE_INDEX = 1;
var CANCEL_INDEX = 3;
const { height, width } = Dimensions.get("window");
import { isUserBlocked } from "../util/Helper";
import { TextInput } from "react-native-gesture-handler";
var routeName = "";

var BUTTONS = ["Message", "Report", "Block", "Cancel"];
var MYPROFILE_BUTTONS = ["Edit Profile", "Logout", "Cancel"];

var BUTTONS1 = ["Message", "Report", "Unblock", "Cancel"];

var DESTRUCTIVE_INDEX = 1;
var CANCEL_INDEX = 3;
class ViewProfile extends React.Component {
  static navigationOptions = ({ navigation, route }) => {
    //Show Header by returning header
    return {
      headerShown: false,
    };
  };

  constructor(props) {
    super(props);
    this.page;
    this.cellRefs = {};
    this.state = {
      showHide: "hide",
      position: 0,
      visible: false,
      changes: 1,
      website: "",
      userBlocked: false,
      websiteLabel: "",
      showLoading: false,
      profile: null,
      dialogVisible: false,
      showAddNewLinkModal: false,
      linkPosition: -1,
    };
    this.scroll = null;
    this.scrollView = null;
  }

  onDobChange(value) {
    this.props.updateDOB(value.getTime());
  }
  componentDidMount = async () => {
    const { params } = this.props.route;
    // const { routeName, user } = this.props.route.params;

    routeName = params.routeName;

    // alert(routeName);

    var user = this.props.profile;

    this.setState({ profile: user });
  };

  logout = () => {
    auth().signOut();
    this.props.logout();
    showMessage({
      message: "User Logged Out Successfully",
      type: "success",
      duration: 2000,
    });
    this.props.navigation.replace("Auth");
  };

  refreshScript = () => {
    this.setState({ state: this.state });
  };

  onSelect = (item, index) => {
    // const { state, navigate } = this.props.navigation;
    const routeName = this.props.route.name;
    this.props.navigation.navigate("PostListScreen", {
      selectedIndex: index,
      route: routeName,
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
      ImagePicker.openPicker({
        compressImageQuality: 0.8,
      }).then((image) => {
        // alert(JSON.stringify(image));
        this.cropImage(image);
      });
    } else {
      openSettingsDialog(
        "Failed to Access Photos, Please go to the Settings to enable access",
        this.props.navigation
      );
    }
  };

  showActionSheet = (user) => {
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
        } else if ("Unblock" === options[buttonIndex]) {
          this.unBlockUser(user);
        } else {
        }
      }
    );
  };
  showMyProfileActionSheet = (user) => {
    if (!(this.props.user && this.props.user.uid)) {
      return;
    }
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
        } else if ("Edit Profile" === options[buttonIndex]) {
          this.props.navigation.navigate("EditProfile", {
            routeName: routeName,
            title: user.username,
            user: user,
          });
        } else {
        }
      }
    );
  };

  cropImage = async (selectedImage) => {
    await ImagePicker.openCropper({
      path: selectedImage.path,

      width: width * 1.5,
      height: width * 1.5 * 1.6,
    })
      .then((image) => {
        console.log(image);
        this.props.updatePhoto(image.path);
        this.props.updateCompressedPhoto(image.path);

        this.props.createAndUpdatePreview(image.path);
      })
      .catch((err) => {
        // Here you handle if the user cancels or any other errors
      });
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
  openUrl = async (url) => {
    if (!url) {
      if (this.props.user.uid === user.uid) {
        this.setState({
          showAddNewLinkModal: true,
        });
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

  onGenderChange(value) {
    this.props.updateGender(value);
  }

  onAccountTypeChange(value) {
    this.props.updateAccountType(value);
  }

  handleOnUpdate = async (website, websiteLabel) => {
    // alert(website + "------" + websiteLabel);

    if (!website) {
      showMessage({
        message: "STOP",
        description: "Please add website link for the website title",
        type: "danger",
        duration: 2000,
      });
      return;
    }

    if (!validURL(website)) {
      showMessage({
        message: "STOP",
        description: "Please add valid website link",
        type: "danger",
        duration: 2000,
      });
      return;
    }

    if (!websiteLabel) {
      showMessage({
        message: "STOP",
        description: "Please add website title for the website link",
        type: "danger",
        duration: 2000,
      });
      return;
    }

    // this.props.updateBio(website);
    // this.props.updateWebsiteLabel(websiteLabel);

    var user = this.props.user;

    if (this.state.linkPosition === -1) {
      // Add New link

      var links = [];
      if (user.links) {
        links = user.links;
      }
      links.push({ link: website, label: websiteLabel });

      user.links = links;
    } else {
      // Edit Existing link

      var links = [];
      if (user.links) {
        links = user.links;
      }
      links[this.state.linkPosition] = { link: website, label: websiteLabel };

      user.links = links;
    }
    // user.bio = website;
    // user.websiteLabel = websiteLabel;

    this.props.updateUser(user);

    this.setState({ showAddNewLinkModal: false });
  };

  deleteLink = async (position) => {
    var user = this.props.user;

    var links = [];

    if (user.links) {
      links = user.links;
    }
    links.splice(position, 1);

    // links.push({ link: website, label: websiteLabel });

    this.props.updateUser(user);
  };

  onPressDel = () => {
    Alert.alert(
      "Delete Account?",
      "Press OK to Delete. This action is irreversible, it cannot be undone. This will not delete your posts.",
      [
        {
          text: "Cancel",
          onPress: () => alert("Cancelled"),
          style: "cancel",
        },
        { text: "OK", onPress: () => this.beginDel() },
      ],
      { cancelable: false }
    );
  };
  beginDel = async () => {
    /* this.props.deleteAllPosts() */
    await this.props.deleteUser();
    await this.props.deleteAuth();
    auth().signOut();
    this.props.navigation.navigate("Splash");
  };

  openProfileActions(user) {
    // alert(routeName);
    if (routeName !== "MyProfile") {
      // const { uid } = state.params;
      const uid = user.uid;
      if (uid) {
        this.showActionSheet(user);
      }
    } else {
      this.showMyProfileActionSheet(user);
    }
  }

  getProfileComponent(user) {
    let userblocked = false;

    if (user && user.uid) {
      userblocked = isUserBlocked(this.props.user, user.uid);
    }

    const { params } = this.props.route;
    return (
      <View style={[styles.center, {}]}>
        {/* <View
          style={{
            height: Scale.moderateScale(180),
            backgroundColor: "black",
            width: "100%",
            opacity: 0,
          }}
        /> */}
        <View
          style={{
            marginTop:
              user.accountType == "Brand"
                ? Scale.moderateScale(70)
                : Scale.moderateScale(90),
          }}
        />
        {user.accountType == "Brand" && (
          <FastImage
            thumbnailSource={{
              uri: user.preview,
            }}
            source={{ uri: user.photo }}
            resizeMode={user.accountType == "Brand" ? "contain" : "cover"}
            style={[
              {
                height: Scale.moderateScale(150),
                width: Scale.moderateScale(150),
                borderRadius: Scale.moderateScale(75),
              },
            ]}
          />
        )}

        <Text
          style={[
            styles.title1,
            {
              color: constants.colors.white,
              alignSelf: "center",
              marginVertical: Scale.moderateScale(16),
            },
          ]}
        >
          {user.username}
        </Text>

        <Text
          style={[
            styles.textNormal,
            {
              color: constants.colors.white,
              alignSelf: "center",
            },
          ]}
        >
          {user.userbio}
        </Text>

        {routeName === "MyProfile" && (
          <View style={[styles.center, styles.container, { width: "100%" }]}>
            {user.accountType == "Brand" && (
              <View>
                {!user.accountStatus && (
                  <View>
                    <ButtonComponent
                      title={`Account Status: Not Approved !!!`}
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
                    <ButtonComponent
                      title={"Request For Approval"}
                      color={constants.colors.white}
                      textStyle={{ fontSize: 16 }}
                      onPress={() => {
                        this.props.requestForBrandApproval(
                          this.props.navigation
                        );
                      }}
                      containerStyle={{
                        width: Scale.moderateScale(250),
                        alignSelf: "center",
                      }}
                    />
                  </View>
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
                    textStyle={{ fontSize: 18, textAlign: "center" }}
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
                {/* 
                {user.accountStatus === "approved" && (
                  <ButtonComponent
                    title={`Account Status: Approved`}
                    containerStyle={{
                      width: Scale.moderateScale(260),
                      alignSelf: "center",
                    }}
                    color={constants.colors.green}
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
                )} */}
              </View>
            )}
          </View>
        )}

        <View
          style={[
            styles.row,
            styles.space,
            styles.followBar,
            styles.bottomgreyborder,
            styles.topgreyborder,
            {
              paddingVertical: 16,
              borderTopWidth: 0.3,
              borderBottomWidth: 0.3,
              justifyContent: "space-between",
              backgroundColor: "transparemt",
              marginVertical: Scale.moderateScale(16),
              // paddingBottom: Scale.moderateScale(14),
            },
          ]}
        >
          <TouchableOpacity
            style={[styles.center, {}]}
            onPress={() => {
              this.props.navigation.navigate("MyFollowersAndFollowing", {
                data: "Followers",
                route: params.routeName,
                user: user,
              });
            }}
          >
            <Text
              style={[
                styles.bold,
                styles.textF,
                { color: "#fff", fontSize: Scale.moderateScale(18) },
              ]}
            >
              {user.followers && user.followers.length
                ? user.followers.length
                : "0"}
            </Text>
            <Text style={[styles.white]}> Followers</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.center, {}]}
            onPress={() => {
              this.props.navigation.navigate("MyFollowersAndFollowing", {
                data: "Following",
                route: params.routeName,
                user: user,
              });
            }}
          >
            <Text
              style={[
                styles.bold,
                { color: "#fff", fontSize: Scale.moderateScale(18) },
              ]}
            >
              {user.following && user.following.length
                ? user.following.length
                : "0"}
            </Text>
            <Text style={[styles.white]}> Following</Text>
          </TouchableOpacity>

          {this.props.user.uid != user.uid ? (
            !userblocked &&
            this.props.user.following &&
            this.props.user.following.indexOf(user.uid) < 0 ? (
              <ButtonComponent
                title={"Follow"}
                color={constants.colors.white}
                onPress={() => this.follow(user)}
                textStyle={{ fontSize: 16 }}
                containerStyle={{
                  width: Scale.moderateScale(100),
                  alignSelf: "center",
                }}
                linearGradientStyle={{ height: 40 }}
              />
            ) : (
              <ButtonComponent
                title={"Unfollow"}
                color={constants.colors.white}
                onPress={() => this.follow(user)}
                textStyle={{ fontSize: 16 }}
                containerStyle={{
                  width: Scale.moderateScale(100),
                  alignSelf: "center",
                }}
                linearGradientStyle={{ height: 40 }}
              />
            )
          ) : null}
        </View>

        <View style={{ flex: 1 }}>
          <FlatList
            data={user.links ? user.links : []}
            keyExtractor={(item) => JSON.stringify(item.link)}
            nestedScrollEnabled={false}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  backgroundColor: "rgba(255,255,255,0.5)",
                  width: width - Scale.moderateScale(40),
                  height: Scale.moderateScale(60),
                  marginTop: Scale.moderateScale(13),
                  borderRadius: Scale.moderateScale(5),
                  padding: Scale.moderateScale(10),
                  alignItems: "center",
                }}
                onPress={() => this.openUrl(item.link)}
              >
                {/* <MaterialCommunityIcons
                  style={{
                    marginHorizontal: 5,
                  }}
                  name="lead-pencil"
                  size={32}
                  onPress={() =>
                    this.setState({
                      showAddNewLinkModal: true,
                      linkPosition: index,
                    })
                  }
                /> */}
                <MaterialCommunityIcons
                  style={{
                    marginHorizontal: 5,
                  }}
                  color="transparent"
                  name="web"
                  size={32}
                />
                <MaterialCommunityIcons
                  style={{
                    marginHorizontal: 5,
                  }}
                  color="transparent"
                  name="web"
                  size={32}
                />
                <Text
                  style={{
                    flex: 1,
                    fontSize: Scale.moderateScale(14),
                    fontWeight: "700",
                    textAlign: "center",
                  }}
                >
                  {item.label ? item.label : "-"}
                </Text>

                <MaterialCommunityIcons
                  style={{
                    marginHorizontal: 8,
                  }}
                  name="lead-pencil"
                  size={32}
                  color={
                    routeName === "MyProfile"
                      ? constants.colors.primary
                      : "transparent"
                  }
                  onPress={() =>
                    this.setState({
                      showAddNewLinkModal: true,
                      linkPosition: index,
                    })
                  }
                />

                <MaterialCommunityIcons
                  style={{
                    marginHorizontal: 8,
                  }}
                  name="delete"
                  size={32}
                  color={
                    routeName === "MyProfile"
                      ? constants.colors.superRed
                      : "transparent"
                  }
                  onPress={() => this.deleteLink(index)}
                />
              </TouchableOpacity>
            )}
          />
        </View>
        {routeName === "MyProfile" && (
          <ButtonComponent
            // title={this.props.user.bio ? "Edit Link" : "Create A New Link"}
            title={"Create A New Link"}
            color={constants.colors.white}
            textStyle={{ fontSize: 16 }}
            containerStyle={{
              width: width - Scale.moderateScale(20),
              marginTop: Scale.moderateScale(24),
            }}
            linearGradientStyle={{ height: Scale.moderateScale(60) }}
            onPress={() =>
              this.setState({
                showAddNewLinkModal: true,
                linkPosition: -1,
              })
            }
          />
        )}

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
            {/* {routeName !== "MyProfile" && ( */}
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
            {/* )} */}

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
                  <MaterialCommunityIcons
                    style={{
                      margin: 0,
                      color: "rgb(255,255,255)",
                    }}
                    name="dots-vertical"
                    size={32}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }

  render() {
    let userProfile = {};

    // const { params } = this.props.navigation.state.params;
    const { routeName, user } = this.props.route.params;
    if (routeName === "Profile") {
      userProfile = user;
    } else {
      userProfile = this.props.user;
    }
    let userblocked = isUserBlocked(this.props.user, userProfile.uid);
    // if (!this.props.user.uid) {
    //   return (
    //     <EmptyView
    //       desc="Your Profile will appear here"
    //       button="Signup"
    //       userId={this.props.user.uid}
    //       navigation={this.props.navigation}
    //       icon={
    //         <MaterialCommunityIcons
    //           style={{ margin: 5 }}
    //           name="face-profile"
    //           size={64}
    //         />
    //       }
    //     />
    //   );
    // }
    // if (!user.posts) return <ActivityIndicator style={styles.container} />;
    return (
      <View style={[styles.container, { backgroundColor: "black" }]}>
        {this.state.showLoading ? showLoader("Loading, Please wait... ") : null}

        <View style={{ height: 0 }}>
          <EmptyView
            ref={(ref) => {
              this.sheetRef = ref;
            }}
            navigation={this.props.navigation}
          />
        </View>

        {userProfile.accountType === "Brand" ? (
          <FastImage
            source={{ uri: userProfile.bgImage }}
            style={[styles.container]}
            thumbnailSource={{
              uri: userProfile.backgroundPreview,
            }}
          />
        ) : (
          <FastImage
            source={{ uri: userProfile.photo }}
            style={[styles.container]}
            thumbnailSource={{
              uri: userProfile.preview,
            }}
          />
        )}

        <View
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            alignItems: "center",
            width: "100%",
            opacity: 0.4,
            // flex: 1,
            backgroundColor: "#000",
          }}
        />

        <KeyboardAwareScrollView
          style={{ marginBottom: 0, position: "absolute", height: height }}
        >
          {this.getProfileComponent(userProfile)}

          <ActionSheet
            ref={(c) => {
              this.actionSheet = c;
            }}
          />

          {this.state.showAddNewLinkModal ? (
            <AddNewLinkModal
              Show={true}
              websiteLabel={
                this.state.linkPosition === -1
                  ? ""
                  : userProfile.links[this.state.linkPosition].label
              }
              website={
                this.state.linkPosition === -1
                  ? ""
                  : userProfile.links[this.state.linkPosition].link
              }
              Hide={() => {
                this.setState({
                  showAddNewLinkModal: false,
                });
              }}
              onSave={(website, websiteLabel) => {
                this.handleOnUpdate(website, websiteLabel);
              }}
            />
          ) : null}
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      updatePhoto,
      updateCompressedPhoto,
      uploadPhoto,
      updateUser,
      updateEmail,
      updatePassword,
      updateUsername,
      updateBio,
      updateUserBio,
      updateWebsiteLabel,
      updatePhone,
      updateGender,
      updateAccountType,
      updateDOB,
      logout,
      createAndUpdatePreview,
      followUser,
      unfollowUser,
      deleteUser,
      deleteAuth,
      getMessages,
      deletePost,
      likePost,
      blockUser,
      unblockUser,
      unlikePost,
      getUser,
      requestForBrandApproval,
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

export default connect(mapStateToProps, mapDispatchToProps)(ViewProfile);

{
  /* <TouchableOpacity
              style={{
                marginTop: Scale.moderateScale(10),
              }}
              onPress={() => {
                if (params.routeName === "MyProfile") {
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
            </TouchableOpacity> */
}
