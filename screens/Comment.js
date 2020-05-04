import React from "react";
import styles from "../styles";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  Text,
  View,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { addComment, getComments } from "../actions/post";
import moment from "moment";
import EmptyView from "../component/emptyview";
import FastImage from "react-native-fast-image";

import {
  Ionicons,
  MaterialCommunityIcons,
  EvilIcons,
  Entypo,
} from "@expo/vector-icons";

class Comment extends React.Component {
  constructor(props) {
    super(props);
    this.sheetRef = {};
    this.state = {
      comment: "",
    };
  }

  componentDidMount = () => {
    const { params } = this.props.navigation.state;
    this.props.getComments(params);
  };

  postComment = () => {
    if (!this.props.user.uid) {
      this.sheetRef.openSheet();
      return;
    }

    const { params } = this.props.navigation.state;
    this.props.addComment(this.state.comment, params);
    this.setState({ comment: "" });
  };

  render() {
    return (
      <KeyboardAvoidingView
        behavior="padding"
        style={[styles.container, { marginTop: 90 }]}
      >
        <View style={{ height: 0 }}>
          <EmptyView
            ref={(ref) => {
              this.sheetRef = ref;
            }}
            navigation={this.props.navigation}
          />
        </View>
        <View style={[styles.container, { top: 0 }]}>
          {/* <KeyboardAvoidingView
            enabled
            behavior="padding"
            style={[styles.container]}
          > */}
          <FlatList
            keyExtractor={(item) => JSON.stringify(item.date)}
            data={this.props.post.comments}
            renderItem={({ item }) => (
              <View style={[styles.row, styles.space]}>
                <FastImage
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
              </View>
            )}
          />
          <TextInput
            style={[styles.input, { marginBottom: 30 }]}
            onChangeText={(comment) => this.setState({ comment })}
            value={this.state.comment}
            returnKeyType="send"
            placeholder="Add Comment"
            onSubmitEditing={this.postComment}
          />
          {/* </KeyboardAvoidingView> */}
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ addComment, getComments }, dispatch);
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    post: state.post,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Comment);
