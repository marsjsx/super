import React from "react";
import styles from "../styles";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { MaterialIcons } from "@expo/vector-icons";
import ProgressiveImage from "../component/ProgressiveImage";
import {
  Container,
  Header,
  Content,
  Body,
  Title,
  Tab,
  Tabs,
} from "native-base";
import MyFollowers from "./Followers";
import MyFollowings from "./Followers";
import { View, FlatList, Text, Image, TouchableOpacity } from "react-native";
import { getMessages } from "../actions/message";
import moment from "moment";
import { groupBy, values } from "lodash";
import db from "../config/firebase";

class MyFollowersAndFollowing extends React.Component {
  constructor(props) {
    super(props);
    this.page;
    this.cellRefs = {};

    this.state = {
      followingLoading: false,
      followersLoading: false,
      following: [],
      followers: [],
      user: {},
    };
    this.scroll = null;
    this.scrollView = null;
  }

  componentDidMount = () => {
    // this.props.getMessages();

    const { data, route, user } = this.props.route.params;

    const initialTabPosition = data === "Following" ? 1 : 0;
    let userProfile = {};

    if (route === "Profile") {
      // userProfile = this.props.otherUser;
      userProfile = user;
    } else {
      userProfile = this.props.user;
    }
    this.props.navigation.setOptions({ title: userProfile.username });
    this.setState({ user: userProfile });
    if (userProfile.followers) {
      var ids = userProfile.followers.slice(0, 10);
      this.getUsersList("followers", ids);
    }
    if (userProfile.following) {
      var ids = userProfile.following.slice(0, 10);
      this.getUsersList("following", ids);
    }
  };

  async getUsersList(type = "followers", ids = []) {
    if (type === "followers") {
      this.setState({ followersLoading: true });
    } else if (type === "following") {
      this.setState({ followingLoading: true });
    }
    const userQuery = await db
      .collection("users")
      .where("uid", "in", ids)
      .get();

    let users = [];
    userQuery.forEach(function (response) {
      users.push(response.data());
    });
    // alert(ids.length);

    if (type === "followers") {
      this.setState({
        followers: this.state.followers.concat(users),
        followersLoading: false,
      });
    } else if (type === "following") {
      this.setState({
        following: this.state.following.concat(users),
        followingLoading: false,
      });
    }
    // this.setState({ showLoading: false });
    // this.setState({ users: user });
    // alert(JSON.stringify(user));
  }

  // Retrieve More
  onLoadMore = async (type = "followers") => {
    if (type === "followers") {
      if (!this.state.followersLoading) {
        if (
          this.state.user.followers &&
          this.state.user.followers.length > this.state.followers.length
        ) {
          var start = this.state.followers.length - 1;
          var end = start + 10;

          if (end > this.state.user.followers.length) {
            end = this.state.user.followers.length - 1;
          }

          var ids = this.state.user.followers.slice(start, end);
          // alert(JSON.stringify(ids));

          this.getUsersList("followers", ids);
        }
      }
    } else if (type === "following") {
      if (!this.state.followingLoading) {
        if (
          this.state.user.following &&
          this.state.user.following.length > this.state.following.length
        ) {
          var start = this.state.following.length - 1;
          var end = start + 10;

          if (end > this.state.user.following.length) {
            end = this.state.user.following.length - 1;
          }

          var ids = this.state.user.following.slice(start, end);
          this.getUsersList("following", ids);
        }
      }
    }
  };

  getCount(data) {
    return data ? data.length : 0;
  }

  render() {
    // const { data, route, user } = this.props.navigation.state.params;
    const { data, route, user } = this.props.route.params;

    const initialTabPosition = data === "Following" ? 1 : 0;
    let userProfile = {};

    if (route === "Profile") {
      // userProfile = this.props.otherUser;
      userProfile = user;
    } else {
      userProfile = this.props.user;
    }

    // alert(JSON.stringify(user.myFollowings));
    return (
      <Container>
        <Header hasTabs>
          <Body
            style={{
              alignItems: "center",
            }}
          >
            {/* <Title>{userProfile.username}</Title> */}
          </Body>
        </Header>
        <Tabs initialPage={initialTabPosition}>
          <Tab heading={`${this.getCount(userProfile.followers)} Followers`}>
            <MyFollowers
              // data={userProfile.myFollowers}
              data={this.state.followers}
              navigation={this.props.navigation}
              loadingUsers={this.state.followersLoading}
              onLoadMore={() => this.onLoadMore("followers")}
            />
          </Tab>
          <Tab heading={`${this.getCount(userProfile.following)} Following`}>
            <MyFollowings
              // data={userProfile.myFollowings}
              data={this.state.following}
              navigation={this.props.navigation}
              loadingUsers={this.state.followingLoading}
              onLoadMore={() => this.onLoadMore("following")}
            />
          </Tab>
        </Tabs>
      </Container>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ getMessages }, dispatch);
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    otherUser: state.profile,
    messages: state.messages,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyFollowersAndFollowing);
