import React from "react";
import styles from "../styles";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  Text,
  View,
  TextInput,
  FlatList,
  Image,
  KeyboardAvoidingView,
} from "react-native";
import { addComment, getComments, getPostReports } from "../actions/post";
import FastImage from "react-native-fast-image";

import moment from "moment";
import EmptyView from "../component/emptyview";
import {
  Ionicons,
  MaterialCommunityIcons,
  EvilIcons,
  Entypo,
  Feather,
} from "@expo/vector-icons";

class PostReport extends React.Component {
  constructor(props) {
    super(props);
    this.sheetRef = {};
    this.state = {
      comment: "",
    };
  }

  componentDidMount = () => {
    // const { params } = this.props.navigation.state;
    const { params } = this.props.route;

    this.props.getPostReports(params);
  };

  render() {
    var reportsLength =
      this.props.post.postReports && this.props.post.postReports.length > 0
        ? this.props.post.postReports.length
        : 0;

    if (!this.props.user.uid || reportsLength < 1) {
      return (
        <EmptyView
          ref={(ref) => {
            this.sheetRef = ref;
          }}
          desc="No Reports Found For This Post "
          userId={this.props.user.uid}
          navigation={this.props.navigation}
          icon={<Feather style={{ margin: 5 }} name="activity" size={64} />}
        />
      );
    }
    return (
      <KeyboardAvoidingView
        behavior="padding"
        style={[styles.container, { marginTop: 90 }]}
      >
        <View style={{ height: 0 }}></View>
        <View style={[styles.container, { top: 0 }]}>
          {/* <KeyboardAvoidingView
            enabled
            behavior="padding"
            style={[styles.container]}
          > */}
          <FlatList
            keyExtractor={(item) => JSON.stringify(item.date)}
            data={this.props.post.postReports}
            renderItem={({ item }) => (
              <View style={[styles.row, styles.space]}>
                <FastImage
                  style={styles.roundImage}
                  source={{ uri: item.reporterPhoto }}
                />
                <View style={[styles.container, styles.left]}>
                  <Text style={styles.bold}>{item.reporterName}</Text>
                  <Text style={styles.gray}>{item.reportReason}</Text>
                  <Text style={[styles.gray, styles.small]}>
                    {moment(item.date).format("ll")}
                  </Text>
                </View>
              </View>
            )}
          />
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    { addComment, getComments, getPostReports },
    dispatch
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    post: state.post,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PostReport);
