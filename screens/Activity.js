import React from "react";
import styles from "../styles";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import db from "../config/firebase";
import orderBy from "lodash/orderBy";
import moment from "moment";
import EmptyView from "../component/emptyview";
import { getUser } from "../actions/user";
import { getMoreActivities } from "../actions/activity";
import Scale from "../helpers/Scale";
import constants from "../constants";

import { showLoader } from "../util/Loader";
import {
  Ionicons,
  MaterialCommunityIcons,
  EvilIcons,
  Entypo,
  Feather,
} from "@expo/vector-icons";
import { followUser } from "../actions/user";
import { getPostById } from "../actions/post";

import { showMessage, hideMessage } from "react-native-flash-message";
import FastImage from "react-native-fast-image";

class Activity extends React.Component {
  state = {
    activity: [],
    refreshing: false,
    showLoading: false,
  };

  componentDidMount = async () => {
    if (this.props.user && this.props.user.uid) {
      if (this.props.activity.activities.length < 1) {
        this.setState({ showLoading: true });
        // await this.getActivity();
        await this.props.getMoreActivities();

        // alert(JSON.stringify(this.props.activity.activities));
        this.setState({ showLoading: false });
      }
    }
  };

  // Retrieve More
  retrieveMore = async () => {
    if (!this.state.refreshing) {
      this.setState({
        refreshing: true,
      });
      try {
        // alert("Called");

        await this.props.getMoreActivities();
        this.setState({
          refreshing: false,
        });
      } catch (error) {
        alert(error);
        console.log(error);
        this.setState({
          refreshing: false,
        });
      }
    }
  };

  getActivity = async () => {
    let activity = [];
    const query = await db
      .collection("activity")
      .where("uid", "==", this.props.user.uid)
      .get();
    query.forEach((response) => {
      activity.push(response.data());
    });
    this.setState({ activity: orderBy(activity, "date", "desc") });
  };

  goToUser = async (uid) => {
    // this.props.navigation.navigate("Profile");
    this.props.navigation.navigate("Profile", { uid: uid });
  };

  showNoPostMessage = () => {
    showMessage({
      message: "Error",
      description: `Post Not Found, It May be delete by the user or removed by the App Admin`,
      type: "danger",
      duration: 2000,
    });
  };

  goToPost = async (data) => {
    // this.getPost(data.postId);

    switch (data.type) {
      case "LIKE":
        this.setState({ showLoading: true });

        await this.props.getPostById(data.postId);
        this.setState({ showLoading: false });

        if (this.props.user.posts.length < 1) {
          this.showNoPostMessage();
          return;
        }
        var index = this.props.user.posts.findIndex(
          (item) => item.id === data.postId
        );

        if (index < 0) {
          this.showNoPostMessage();
        } else {
          this.props.navigation.navigate("PostListScreen", {
            selectedIndex: index,
            route: "MyProfile",
          });
        }
        break;
      case "COMMENT":
        this.setState({ showLoading: true });

        await this.props.getPostById(data.postId);
        this.setState({ showLoading: false });
        if (this.props.user.posts.length < 1) {
          this.showNoPostMessage();
          return;
        }
        var index = this.props.user.posts.findIndex(
          (item) => item.id === data.postId
        );
        if (index < 0) {
          this.showNoPostMessage();
        } else {
          this.props.navigation.navigate("PostListScreen", {
            selectedIndex: index,
            route: "MyProfile",
          });
        }
        break;

      case "REPORT":
        this.setState({ showLoading: true });

        await this.props.getPostById(data.postId);
        this.setState({ showLoading: false });
        if (!this.props.post.feed) {
          this.showNoPostMessage();
          return;
        }
        var index = this.props.post.feed.findIndex(
          (item) => item.id === data.postId
        );

        if (index < 0) {
          this.showNoPostMessage();
        } else {
          this.props.navigation.navigate("PostListScreen", {
            selectedIndex: index,
            route: "Search",
          });
        }
        break;

      default:
        null;
    }
  };
  follow = (data) => {
    if (!this.props.user.uid) {
      this.sheetRef.openSheet();
      return;
    }
    let user = {
      uid: data.followerId,
      photo: data.followerPhoto,
      username: data.followerName,
    };

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

  renderList = (item) => {
    switch (item.type) {
      case "LIKE":
        return (
          <View
            style={[
              styles.row,
              styles.space,

              { marginTop: Scale.moderateScale(10) },
            ]}
          >
            <TouchableOpacity onPress={() => this.goToUser(item.likerId)}>
              <FastImage
                style={styles.roundImage}
                source={{ uri: item.likerPhoto }}
              />
            </TouchableOpacity>
            <View style={[styles.container, styles.left]}>
              <TouchableOpacity onPress={() => this.goToUser(item.likerId)}>
                <Text
                  style={[
                    styles.bold,
                    styles.textMedium,
                    { color: constants.colors.white },
                  ]}
                >
                  {item.likerName}
                </Text>
              </TouchableOpacity>
              <Text style={[styles.gray, styles.textHelveticaNeueNormal]}>
                {item.postType === "video"
                  ? "Liked Your Video"
                  : "Liked Your Photo"}
              </Text>
              <Text style={[styles.gray, styles.textHelveticaNeueNormal]}>
                {moment(item.date).format("ll")}
              </Text>
            </View>
            <TouchableOpacity onPress={() => this.goToPost(item)}>
              <FastImage
                style={styles.squareImage}
                source={{ uri: item.postPhoto }}
              />
            </TouchableOpacity>
          </View>
        );
      case "FOLLOWER":
        return (
          <View
            style={[
              styles.row,
              styles.space,
              { marginTop: Scale.moderateScale(10) },
            ]}
          >
            <TouchableOpacity onPress={() => this.goToUser(item.followerId)}>
              <FastImage
                style={styles.roundImage}
                source={{ uri: item.followerPhoto }}
              />
            </TouchableOpacity>
            <View style={[styles.container, styles.left]}>
              <TouchableOpacity onPress={() => this.goToUser(item.followerId)}>
                <Text
                  style={[
                    styles.bold,
                    styles.textMedium,
                    { color: constants.colors.white },
                  ]}
                >
                  {item.followerName}
                </Text>
              </TouchableOpacity>
              <Text style={[styles.gray, styles.textHelveticaNeueNormal]}>
                started following you
              </Text>
              <Text style={[styles.gray, styles.textHelveticaNeueNormal]}>
                {moment(item.date).format("ll")}
              </Text>
            </View>
            {this.props.user.uid != item.followerId &&
            this.props.user.following &&
            this.props.user.following.indexOf(item.followerId) < 0 ? (
              <TouchableOpacity
                style={{
                  marginRight: 12,
                  backgroundColor: constants.colors.primaryColor,
                  width: 90,
                  borderRadius: 5,
                }}
                onPress={() => this.follow(item)}
              >
                <Text
                  style={[
                    styles.textHelveticaNeueNormal,
                    {
                      color: "white",
                      padding: 6,
                      textAlign: "center",
                    },
                  ]}
                >
                  Follow
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{
                  marginRight: 12,
                  borderWidth: 0.5,
                  width: 90,
                  borderRadius: 5,
                  borderColor: constants.colors.primaryColor,
                }}
              >
                <Text
                  style={[
                    styles.textHelveticaNeueNormal,
                    {
                      padding: 6,
                      textAlign: "center",
                      color: constants.colors.primaryColor,
                    },
                  ]}
                >
                  Following
                </Text>
              </TouchableOpacity>
            )}
          </View>
        );
      case "COMMENT":
        return (
          <View
            style={[
              styles.row,
              styles.space,
              { marginTop: Scale.moderateScale(10) },
            ]}
          >
            <TouchableOpacity onPress={() => this.goToUser(item.commenterId)}>
              <FastImage
                style={styles.roundImage}
                source={{ uri: item.commenterPhoto }}
              />
            </TouchableOpacity>
            <View style={[styles.container, styles.left]}>
              <TouchableOpacity onPress={() => this.goToUser(item.commenterId)}>
                <Text
                  style={[
                    styles.bold,
                    styles.textMedium,
                    { color: constants.colors.white },
                  ]}
                >
                  {item.commenterName}
                </Text>
              </TouchableOpacity>
              <Text
                style={[styles.gray, styles.textHelveticaNeueNormal]}
              >{`commented: "${item.comment}"`}</Text>
              <Text style={[styles.gray, styles.textHelveticaNeueNormal]}>
                {moment(item.date).format("ll")}
              </Text>
            </View>
            <TouchableOpacity onPress={() => this.goToPost(item)}>
              <FastImage
                style={styles.squareImage}
                source={{ uri: item.postPhoto }}
              />
            </TouchableOpacity>
          </View>
        );
      case "REPORT":
        return (
          <View
            style={[
              styles.row,
              styles.space,
              { marginTop: Scale.moderateScale(10) },
            ]}
          >
            <TouchableOpacity onPress={() => this.goToUser(item.reporterId)}>
              <FastImage
                style={styles.roundImage}
                source={{ uri: item.reporterPhoto }}
              />
            </TouchableOpacity>
            <View style={[styles.container, styles.left]}>
              <View style={styles.row}>
                <TouchableOpacity
                  onPress={() => this.goToUser(item.reporterId)}
                >
                  <Text
                    style={[
                      styles.bold,
                      styles.textMedium,
                      { color: constants.colors.white },
                    ]}
                  >
                    {item.reporterName}
                  </Text>
                </TouchableOpacity>
                <Ionicons
                  style={{ marginLeft: 8 }}
                  color="#db565b"
                  name="ios-alert"
                  size={20}
                />
              </View>
              <Text style={[styles.red, styles.textHelveticaNeueNormal]}>
                Reported This Post{" "}
              </Text>
              <Text style={[styles.gray, styles.textHelveticaNeueNormal]}>
                {item.reportReason}
              </Text>
              <Text style={[styles.gray, styles.textHelveticaNeueNormal]}>
                {moment(item.date).format("ll")}
              </Text>
            </View>
            <TouchableOpacity onPress={() => this.goToPost(item)}>
              <FastImage
                style={styles.squareImage}
                source={{ uri: item.postPhoto }}
              />
            </TouchableOpacity>
          </View>
        );
      default:
        null;
    }
  };

  // // Render Footer
  // renderFooter = () => {
  //   try {
  //     // Check If Loading
  //     if (this.state.refreshing) {
  //       return <ActivityIndicator />;
  //     } else {
  //       return <View />;
  //     }
  //   } catch (error) {
  //     alert(error);
  //     return <View />;
  //     // console.log(error);
  //   }
  // };

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
  FlatListItemSeparator = () => {
    return (
      <View
        style={[
          {
            marginVertical: Scale.moderateScale(10),
            width: "100%",
            backgroundColor: "#dcdcdc",
            height: 0.5,
            // backgroundColor: "#000",
          },
        ]}
      />
    );
  };
  render() {
    if (this.state.showLoading) return showLoader("Loading, Please wait... ");
    if (!this.props.user.uid) {
      return (
        <EmptyView
          desc="All user activities will appear here"
          button="Signup/Login"
          userId={this.props.user.uid}
          navigation={this.props.navigation}
          icon={<Feather style={{ margin: 5 }} name="activity" size={64} />}
        />
      );
    }

    // alert(JSON.stringify(this.props.activity.activities));
    return (
      // <View style={[styles.container, { marginTop: 100 }]}>
      <View style={[styles.container]}>
        {/* <EmptyView
          desc="All user activities will appear here"
          button="Signup"
          userId={this.props.user.uid}
          navigation={this.props.navigation}
          icon={<Feather style={{ margin: 5 }} name="activity" size={64} />}
        /> */}
        <FlatList
          onRefresh={() => this.props.getMoreActivities(true)}
          data={this.props.activity.activities}
          refreshing={this.state.refreshing}
          // onEndReached={this.retrieveMore}
          ListFooterComponent={this.renderFooter}
          ListEmptyComponent={<EmptyView desc="No Data Found" />}
          // onEndReachedThreshold={0}
          ItemSeparatorComponent={this.FlatListItemSeparator}
          keyExtractor={(item) => JSON.stringify(item.date)}
          renderItem={({ item }) => this.renderList(item)}
          onEndReachedThreshold={0.01}
          onMomentumScrollBegin={() => {
            this.onEndReachedCalledDuringMomentum = false;
          }}
          onEndReached={() => {
            if (!this.onEndReachedCalledDuringMomentum) {
              this.retrieveMore(); // LOAD MORE DATA
              this.onEndReachedCalledDuringMomentum = true;
            }
          }}
        />
      </View>
    );
  }
}
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      getUser,
      followUser,
      getMoreActivities,
      getPostById,
    },
    dispatch
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    post: state.post,
    activity: state.activity,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Activity);
