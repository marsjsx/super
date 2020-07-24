import React from "react";
import styles from "../styles";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import db from "../config/firebase";
import orderBy from "lodash/orderBy";
import moment from "moment";
import EmptyView from "../component/emptyview";
import { getUser } from "../actions/user";
import {
  Ionicons,
  MaterialCommunityIcons,
  EvilIcons,
  Entypo,
  Feather,
} from "@expo/vector-icons";
import { showMessage, hideMessage } from "react-native-flash-message";
import FastImage from "react-native-fast-image";

class Activity extends React.Component {
  state = {
    activity: [],
  };

  componentDidMount = () => {
    this.getActivity();
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
    await this.props.getUser(uid);
    this.props.navigation.navigate("Profile");
  };

  showNoPostMessage = () => {
    showMessage({
      message: "Error",
      description: `Post Not Found, It May be delete by the user or removed by the App Admin`,
      type: "danger",
      duration: 2000,
    });
  };

  goToPost = (data) => {
    switch (data.type) {
      case "LIKE":
        if (!this.props.user.posts) {
          this.showNoPostMessage();
          return;
        }
        var index = this.props.user.posts.findIndex(
          (item) => item.id === data.postId
        );

        if (index < 0) {
          this.showNoPostMessage();
          return;
        }

        this.props.navigation.navigate("PostListScreen", {
          selectedIndex: index,
          route: "MyProfile",
        });

      case "COMMENT":
        if (!this.props.user.posts) {
          this.showNoPostMessage();
          return;
        }
        var index = this.props.user.posts.findIndex(
          (item) => item.id === data.postId
        );
        if (index < 0) {
          this.showNoPostMessage();
          return;
        }

        this.props.navigation.navigate("PostListScreen", {
          selectedIndex: index,
          route: "MyProfile",
        });

      case "REPORT":
        if (!this.props.post.feed) {
          this.showNoPostMessage();
          return;
        }
        var index = this.props.post.feed.findIndex(
          (item) => item.id === data.postId
        );

        if (index < 0) {
          this.showNoPostMessage();
          return;
        }
        this.props.navigation.navigate("PostListScreen", {
          selectedIndex: index,
          route: "Search",
        });

      default:
        null;
    }
  };

  renderList = (item) => {
    switch (item.type) {
      case "LIKE":
        return (
          <View style={[styles.row, styles.space]}>
            <TouchableOpacity onPress={() => this.goToUser(item.likerId)}>
              <FastImage
                style={styles.roundImage}
                source={{ uri: item.likerPhoto }}
              />
            </TouchableOpacity>
            <View style={[styles.container, styles.left]}>
              <Text style={styles.bold}>{item.likerName}</Text>
              <Text style={styles.gray}>Liked Your Photo</Text>
              <Text style={[styles.gray, styles.small]}>
                {moment(item.date).format("ll")}
              </Text>
            </View>
            <TouchableOpacity onPress={() => this.goToPost(item)}>
              <FastImage
                style={styles.roundImage}
                source={{ uri: item.postPhoto }}
              />
            </TouchableOpacity>
          </View>
        );
      case "COMMENT":
        return (
          <View style={[styles.row, styles.space]}>
            <TouchableOpacity onPress={() => this.goToUser(item.commenterId)}>
              <FastImage
                style={styles.roundImage}
                source={{ uri: item.commenterPhoto }}
              />
            </TouchableOpacity>
            <View style={[styles.container, styles.left]}>
              <Text style={styles.bold}>{item.commenterName}</Text>
              <Text style={styles.gray}>{item.comment}</Text>
              <Text style={[styles.gray, styles.small]}>
                {moment(item.date).format("ll")}
              </Text>
            </View>
            <TouchableOpacity onPress={() => this.goToPost(item)}>
              <FastImage
                style={styles.roundImage}
                source={{ uri: item.postPhoto }}
              />
            </TouchableOpacity>
          </View>
        );
      case "REPORT":
        return (
          <View style={[styles.row, styles.space, { marginTop: 15 }]}>
            <TouchableOpacity onPress={() => this.goToUser(item.reporterId)}>
              <FastImage
                style={styles.roundImage}
                source={{ uri: item.reporterPhoto }}
              />
            </TouchableOpacity>
            <View style={[styles.container, styles.left]}>
              <View style={styles.row}>
                <Text style={styles.bold}>{item.reporterName}</Text>

                <Ionicons
                  style={{ marginLeft: 8 }}
                  color="#db565b"
                  name="ios-alert"
                  size={20}
                />
              </View>
              <Text style={styles.red}>Reported This Post </Text>
              <Text style={styles.gray}>{item.reportReason}</Text>
              <Text style={[styles.gray, styles.small]}>
                {moment(item.date).format("ll")}
              </Text>
            </View>
            <TouchableOpacity onPress={() => this.goToPost(item)}>
              <FastImage
                style={styles.roundImage}
                source={{ uri: item.postPhoto }}
              />
            </TouchableOpacity>
          </View>
        );
      default:
        null;
    }
  };

  render() {
    if (!this.props.user.uid || this.state.activity.length <= 0) {
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
    return (
      <View style={[styles.container, { marginTop: 100 }]}>
        {/* <EmptyView
          desc="All user activities will appear here"
          button="Signup"
          userId={this.props.user.uid}
          navigation={this.props.navigation}
          icon={<Feather style={{ margin: 5 }} name="activity" size={64} />}
        /> */}
        <FlatList
          onRefresh={() => this.getActivity()}
          refreshing={false}
          data={this.state.activity}
          keyExtractor={(item) => JSON.stringify(item.date)}
          renderItem={({ item }) => this.renderList(item)}
        />
      </View>
    );
  }
}
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      getUser,
    },
    dispatch
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    post: state.post,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Activity);
