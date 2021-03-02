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

class MyFollowersAndFollowing extends React.Component {
  componentDidMount = () => {
    // this.props.getMessages();
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
            <Title>{userProfile.username}</Title>
          </Body>
        </Header>
        <Tabs initialPage={initialTabPosition}>
          <Tab heading={`${this.getCount(userProfile.myFollowers)} Followers`}>
            <MyFollowers
              data={userProfile.myFollowers}
              navigation={this.props.navigation}
            />
          </Tab>
          <Tab heading={`${this.getCount(userProfile.myFollowings)} Following`}>
            <MyFollowings
              data={userProfile.myFollowings}
              navigation={this.props.navigation}
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
