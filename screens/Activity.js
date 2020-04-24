import React from "react";
import styles from "../styles";
import { connect } from "react-redux";
import { Text, View, FlatList, ActivityIndicator, Image } from "react-native";
import db from "../config/firebase";
import orderBy from "lodash/orderBy";
import moment from "moment";
import EmptyView from "../component/emptyview";
import {
  Ionicons,
  MaterialCommunityIcons,
  EvilIcons,
  Entypo,
  Feather,
} from "@expo/vector-icons";

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

  renderList = (item) => {
    switch (item.type) {
      case "LIKE":
        return (
          <View style={[styles.row, styles.space]}>
            <Image
              style={styles.roundImage}
              source={{ uri: item.likerPhoto }}
            />
            <View style={[styles.container, styles.left]}>
              <Text style={styles.bold}>{item.likerName}</Text>
              <Text style={styles.gray}>Liked Your Photo</Text>
              <Text style={[styles.gray, styles.small]}>
                {moment(item.date).format("ll")}
              </Text>
            </View>
            <Image style={styles.roundImage} source={{ uri: item.postPhoto }} />
          </View>
        );
      case "COMMENT":
        return (
          <View style={[styles.row, styles.space]}>
            <Image
              style={styles.roundImage}
              source={{ uri: item.commenterPhoto }}
            />
            <View style={[styles.container, styles.left]}>
              <Text style={styles.bold}>{item.commenterName}</Text>
              <Text style={styles.gray}>{item.comment}</Text>
              <Text style={[styles.gray, styles.small]}>
                {moment(item.date).format("ll")}
              </Text>
            </View>
            <Image style={styles.roundImage} source={{ uri: item.postPhoto }} />
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
          button="Signup"
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

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(Activity);
