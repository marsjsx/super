import React from "react";
import styles from "../styles";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { MaterialIcons } from "@expo/vector-icons";
import { orderBy } from "lodash";
import ProgressiveImage from "../component/ProgressiveImage";

import {
  View,
  FlatList,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import { getMessages } from "../actions/message";
import moment from "moment";
import { groupBy, values } from "lodash";

class Messages extends React.Component {
  componentDidMount = () => {
    // this.props.getMessages();
  };

  goToChat = members => {
    const uid = members.filter(id => id !== this.props.user.uid);
    this.props.navigation.navigate("Chat", uid[0]);
  };

  getLastMessage(message) {
    var lastMessage = message.chats[0];
    if (lastMessage.text) {
      return <LastMessage lastMessage={lastMessage.text} />;
    } else if (lastMessage.image) {
      return <LastMessage name="photo" lastMessage="Photo" />;
    } else if (lastMessage.location) {
      return <LastMessage name="my-location" lastMessage="Location" />;
    }
  }
  render() {
    if (!this.props.messages)
      return <ActivityIndicator style={styles.container} />;
    return (
      <View style={[styles.container, { marginTop: 80 }]}>
        <FlatList
          // keyExtractor={item => new Date().getTime()}
          data={orderBy(this.props.messages, "updatedAt", "desc")}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() => this.goToChat(item.members)}
              style={[styles.row, styles.space, { marginBottom: 10 }]}
            >
              <ProgressiveImage
                thumbnailSource={{
                  uri: item.user.preview
                }}
                transparentBackground="transparent"
                source={{ uri: item.user.photo }}
                style={styles.roundImage}
              />
              {/* <Image
                style={styles.roundImage}
                source={{ uri: item.user.photo }}
              /> */}
              <View style={[styles.container, styles.left]}>
                <Text style={styles.bold}>{item.user.username}</Text>
                {this.getLastMessage(item)}
                {/* <Text style={styles.gray}>{this.getLastMessage(item)}</Text> */}
                <Text style={[styles.gray, styles.small]}>
                  {moment(item.updatedAt).format("ll")}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }
}
const LastMessage = ({
  size = 18,
  lastMessage = "",
  color = "rgba(0,0,0,0.5)",
  ...props
}) => (
  <View>
    {props.name ? <MaterialIcons size={size} color={color} {...props} /> : null}

    <Text style={styles.gray}>{lastMessage}</Text>
  </View>
);
const mapDispatchToProps = dispatch => {
  return bindActionCreators({ getMessages }, dispatch);
};

const mapStateToProps = state => {
  return {
    user: state.user,
    messages: state.messages
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Messages);
