import React from "react";
import styles from "../styles";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { MaterialIcons } from "@expo/vector-icons";
import ProgressiveImage from "../component/ProgressiveImage";
import styled from 'styled-components/native';

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
import {
  View,
  FlatList,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { getMessages } from "../actions/message";
import moment from "moment";
import { groupBy, values } from "lodash";

class HomeScreen extends React.Component {
  componentDidMount = () => {
    // this.props.getMessages();
  };
  getCount(data) {
    return data ? data.length : 0;
  }

  render() {
    const { data, route } = this.props.navigation.state.params;

    const initialTabPosition = data === "Following" ? 1 : 0;
    let user = {};

    if (route === "Profile") {
      user = this.props.otherUser;
    } else {
      user = this.props.user;
    }

    // alert(JSON.stringify(user.myFollowings));
    return (
      <Container>
        <Header hasTabs>
          <Body>
            <Title>{user.username}</Title>
          </Body>
        </Header>
        <Tabs initialPage={initialTabPosition}>
          <Tab heading={`${this.getCount(user.myFollowers)} Followers`}>
            <MyFollowers
              data={user.myFollowers}
              navigation={this.props.navigation}
            />
          </Tab>
          <Tab heading={`${this.getCount(user.myFollowings)} Following`}>
            <MyFollowings
              data={user.myFollowings}
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
)(HomeScreen);
