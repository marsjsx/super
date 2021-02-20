import React from "react";
import styles from "../styles";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { showLoader } from "../util/Loader";
import db from "../config/firebase";
import ProgressiveImage from "../component/ProgressiveImage";
import EmptyView from "../component/emptyview";
import MyFollowers from "./Followers";
import { getUser } from "../actions/user";
import { followUser } from "../actions/user";
import { showMessage, hideMessage } from "react-native-flash-message";
import { _ } from "lodash";
import {
  Ionicons,
  MaterialCommunityIcons,
  EvilIcons,
  Entypo,
  Feather,
  Octicons,
} from "@expo/vector-icons";
import { Badge, Button, Left, Right, Body } from "native-base";

import { View, FlatList, Text, Image, TouchableOpacity } from "react-native";
import moment from "moment";
import { groupBy, values } from "lodash";
var self;

class LikersAndViewers extends React.Component {
  // static navigationOptions = ({ navigation }) => {
  //   return {
  //     title: navigation.getParam("title", ""),
  //   };
  // };

  constructor(props) {
    super(props);

    this.state = {
      showLoading: false,
      users: [],
      page: 1,
      uniqueIds: [],
      allViewers: [],
      isLoading: false,
      isRefreshing: false,
    };

    self = this;
  }

  componentDidMount = () => {
    this.getUsersList();
  };

  getViewCount(uid) {
    var obj = _.countBy(this.state.allViewers, function (rec) {
      return rec === uid;
    });

    return obj.true;
  }

  static async getDerivedStateFromProps(props, state) {}

  async getUsersList() {
    const { data } = this.props.navigation.state.params;
    if (data && data.length > 0) {
      const unique = (value, index, self) => {
        return self.indexOf(value) === index;
      };

      const uniqueIds = data.filter(unique);

      this.setState({ allViewers: data, uniqueIds: uniqueIds });

      var ids = uniqueIds.slice(0, 10);

      this.setState({ showLoading: true });

      const userQuery = await db
        .collection("users")
        .where("uid", "in", ids)
        .get();

      let user = [];
      userQuery.forEach(function (response) {
        user.push(response.data());
      });
      // alert(ids.length);

      this.setState({ showLoading: false });
      this.setState({ users: user });
      // alert(JSON.stringify(user));
    }
  }
  handleRefresh = () => {
    // alert("Refresh Called");
  };

  handleLoadMore = async () => {
    // alert("Load More Called");

    if (this.state.users.length < this.state.uniqueIds.length) {
      var ids = this.state.uniqueIds.slice(this.state.users.length - 1, 10);

      const userQuery = await db
        .collection("users")
        .where("uid", "in", ids)
        .get();

      let user = [];
      userQuery.forEach(function (response) {
        user.push(response.data());
      });
      // alert(user.length);

      this.setState({ showLoading: false });
      this.setState({ users: this.state.users.concat(user) });
    }
  };
  goToUser = (user) => {
    // this.props.getUser(user.uid);
    // this.props.navigation.navigate("Profile");
    this.props.navigation.navigate("Profile", { uid: user.uid });
  };
  follow = (item) => {
    if (!this.props.user.uid) {
      this.sheetRef.openSheet();
      return;
    }
    // let user = {
    //   uid: data.followerId,
    //   photo: data.followerPhoto,
    //   username: data.followerName,
    // };

    var message = "";
    var type = "success";
    this.props.followUser(item);
    message = "User followed successfully";
    showMessage({
      message: message,
      type: type,
      duration: 2000,
    });
  };
  renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => this.goToUser(item)}
        style={[styles.row, styles.space]}
      >
        <ProgressiveImage
          thumbnailSource={{
            uri: item.preview,
          }}
          transparentBackground="transparent"
          source={{ uri: item.photo }}
          style={styles.roundImage}
        />
        {/* <Image style={styles.roundImage} source={{ uri: item.photo }} /> */}

        <View style={[styles.container, styles.left]}>
          <Text style={styles.bold}>{item.username}</Text>
          <Text style={styles.gray}>{item.bio}</Text>
        </View>
        {this.props.user.uid === item.uid ? null : this.props.user.following &&
          this.props.user.following.indexOf(item.uid) < 0 ? (
          <TouchableOpacity
            style={{
              marginRight: 12,
              backgroundColor: "#4169e1",
              width: 90,
              borderRadius: 5,
            }}
            onPress={() => this.follow(item)}
          >
            <Text
              style={{
                color: "white",
                padding: 6,
                textAlign: "center",
              }}
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
              borderColor: "black",
            }}
          >
            <Text style={{ padding: 6, textAlign: "center" }}>Following</Text>
          </TouchableOpacity>
        )}
        {/* {flow && (
      <Badge
        style={{
          right: 10,
          alignSelf: "center",
          backgroundColor: "blue",
        }}
      >
        <Text style={{ color: "white" }}>
          {this.getViewCount(item.uid)}
        </Text>
      </Badge>
    )} */}
      </TouchableOpacity>
    );
  };

  render() {
    const { users, isRefreshing } = this.state;
    const { flow, views } = this.props.navigation.state.params;

    return (
      <View style={{ flex: 1 }}>
        {flow && (
          <View style={{ marginBottom: 20 }}>
            <View
              style={{
                flexDirection: "row",
                padding: 24,
                justifyContent: "center",
                alignItems: "center",
                borderBottomColor: "gray",
                borderBottomWidth: 0.5,
              }}
            >
              <Feather
                style={{
                  margin: 0,
                }}
                name={"play"}
                size={32}
              />
              <Text style={{ fontSize: 16 }}>{`${views.length} views`}</Text>
            </View>
            <Text
              style={{ fontSize: 16, fontWeight: "bold", margin: 10 }}
            >{`Liked by`}</Text>
          </View>
        )}
        <FlatList
          initialNumToRender="10"
          maxToRenderPerBatch="10"
          windowSize={10}
          refreshing={isRefreshing}
          onRefresh={this.handleRefresh}
          onEndReached={this.handleLoadMore}
          onEndThreshold={0}
          data={this.state.users}
          ListEmptyComponent={<EmptyView desc="No Data Found" />}
          keyExtractor={(item) => JSON.stringify(item.uid)}
          renderItem={this.renderItem}
        />
        {/* <MyFollowers
          data={this.state.users}
          refreshing={isRefreshing}
          onRefresh={this.handleRefresh}
          onEndReached={this.handleLoadMore}
          onEndThreshold={0}
          navigation={this.props.navigation}
        /> */}
        {this.state.showLoading ? showLoader("Loading, Please wait... ") : null}
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ getUser, followUser }, dispatch);
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LikersAndViewers);
