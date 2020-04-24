import React from "react";
import styles from "../styles";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { orderBy } from "lodash";
import ProgressiveImage from "../component/ProgressiveImage";
import EmptyView from "../component/emptyview";

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
import { Badge, Content } from "native-base";

class Messages extends React.Component {
  componentDidMount = () => {
    this.props.getMessages();
  };

  goToChat = (members) => {
    const uid = members.filter((id) => id !== this.props.user.uid);
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

  getUnSeenMessageCount(item) {
    let unseenMessageCount = 0;
    if (item.chats.length) {
      item.chats.forEach((element) => {
        if (!element.seenBy[this.props.user.uid]) {
          unseenMessageCount++;
        }
      });
    }

    return unseenMessageCount;
  }

  render() {
    if (!this.props.user.uid || !this.props.messages.length) {
      return (
        <EmptyView
          desc="All user messages will appear here"
          button="Signup"
          userId={this.props.user.uid}
          navigation={this.props.navigation}
          icon={
            <Ionicons style={{ margin: 5 }} name="ios-chatbubbles" size={64} />
          }
        />
      );
    }
    // else if (!this.props.messages)
    //   return <ActivityIndicator style={styles.container} />;
    return (
      <View style={[styles.container, { marginTop: 80 }]}>
        {/* {alert(JSON.stringify(this.props.messages.length))} */}

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
                  uri: item.user.preview,
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
              {this.getUnSeenMessageCount(item) ? (
                <Badge style={{ marginRight: 10, alignSelf: "center" }}>
                  <Text style={{ color: "white" }}>
                    {this.getUnSeenMessageCount(item)}
                  </Text>
                </Badge>
              ) : null}
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
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ getMessages }, dispatch);
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    messages: state.messages,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Messages);
