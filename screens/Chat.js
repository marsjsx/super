import { AppLoading, Asset, Linking } from "expo";
import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  Platform,
  KeyboardAvoidingView
} from "react-native";
import { connect } from "react-redux";
import { addMessage, getMessages } from "../actions/message";
import { bindActionCreators } from "redux";
import { orderBy } from "lodash";

import {
  Bubble,
  GiftedChat,
  SystemMessage,
  IMessage
} from "react-native-gifted-chat";

import AccessoryBar from "../component/AccessoryBar";
import CustomActions from "../component/CustomActions";
import MessageVideo from "../component/MessageVideo";

import CustomView from "../component/CustomView";
import messagesData from "../data/messages";
import earlierMessages from "../data/earlierMessages";
import KeyboardSpacer from "react-native-keyboard-spacer";


const styles = StyleSheet.create({
  container: { flex: 1 }
});

var user = {};

const otherUser = {
  _id: 2,
  name: "React Native",
  avatar: "https://facebook.github.io/react/img/logo_og.png"
};

class Chat extends Component {
  state = {
    inverted: false,
    step: 0,
    messages: [],
    loadEarlier: true,
    typingText: null,
    isLoadingEarlier: false,
    appIsReady: false,
    isTyping: true
  };

  _isMounted = false;

  componentDidMount() {
    this._isMounted = true;

    let loggedInUser = this.props.user;
    user = {
      _id: loggedInUser.uid,
      name: loggedInUser.username,
      avatar: loggedInUser.photo
    };

    // this.props.getMessages();

    // this.getUserChat();
    // init with only system messages
    this.setState({
      // messages: messagesData, // messagesData.filter(message => message.system),
      appIsReady: true,
      isTyping: true
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  onLoadEarlier = () => {
    this.setState(() => {
      return {
        isLoadingEarlier: true
      };
    });

    setTimeout(() => {
      if (this._isMounted === true) {
        this.setState(previousState => {
          return {
            messages: GiftedChat.prepend(
              previousState.messages,
              earlierMessages,
              Platform.OS !== "web"
            ),
            loadEarlier: false,
            isLoadingEarlier: false
          };
        });
      }
    }, 1000); // simulating network
  };

  onSend = (messages = []) => {
    const step = this.state.step + 1;

    const sentMessages = {
      ...messages[0],
      pending: true,
      sent: false,
      received: false
    };

    const { params } = this.props.navigation.state;

    this.props.addMessage(params, sentMessages);
  };

  botSend = (step = 0) => {
    const newMessage = messagesData
      .reverse()
      // .filter(filterBotMessages)
      .find(findStep(step));
    if (newMessage) {
      this.setState(previousState => ({
        messages: GiftedChat.append(
          previousState.messages,
          [newMessage],
          Platform.OS !== "web"
        )
      }));
    }
  };

  parsePatterns = _linkStyle => {
    return [
      {
        pattern: /#(\w+)/,
        style: { textDecorationLine: "underline", color: "darkorange" }
        // onPress: () => Linking.openURL("http://gifted.chat")
      }
    ];
  };

  renderCustomView(props) {
    return <CustomView {...props} />;
  }

  renderMessageVideo(props) {
    if (props.currentMessage.video1) {
      const { containerStyle, wrapperStyle, ...messageVideoProps } = props;
      if (props.renderMessageVideo) {
        return props.renderMessageVideo(messageVideoProps);
      }
      return <MessageVideo {...messageVideoProps} />;
    }
    return null;
  }

  onReceive = text => {
    this.setState(previousState => {
      return {
        messages: GiftedChat.append(
          previousState.messages,
          [
            {
              _id: Math.round(Math.random() * 1000000),
              text,
              createdAt: new Date(),
              user: otherUser
            }
          ],
          Platform.OS !== "web"
        )
      };
    });
  };

  onSendFromUser = (messages = []) => {
    const createdAt = new Date();
    const messagesToUpload = messages.map(message => ({
      ...message,
      user,
      createdAt,
      _id: Math.round(Math.random() * 1000000)
    }));
    this.onSend(messagesToUpload);
  };

  setIsTyping = () => {
    this.setState({
      isTyping: !this.state.isTyping
    });
  };

  renderAccessory = () => (
    <AccessoryBar onSend={this.onSendFromUser} isTyping={this.setIsTyping} />
  );

  renderCustomActions = props =>
    Platform.OS === "web" ? null : (
      <CustomActions {...props} onSend={this.onSendFromUser} />
    );

  renderBubble = props => {
    // return <Bubble {...props} />
    return (
      <View>
        {/* {this.renderAudio(props)} */}
        {/* Will add Audio And Video In Future  */}
        {/* {this.renderMessageVideo(props)} */}

        <Bubble {...props} />
      </View>
    );
  };

  renderSystemMessage = props => {
    return (
      <SystemMessage
        {...props}
        containerStyle={{
          marginBottom: 15
        }}
        textStyle={{
          fontSize: 14
        }}
      />
    );
  };

  // renderFooter = props => {
  //   if (this.state.typingText) {
  //     return (
  //       <View style={styles.footerContainer}>
  //         <Text style={styles.footerText}>{this.state.typingText}</Text>
  //       </View>
  //     )
  //   }
  //   return null
  // }

  onQuickReply = replies => {
    const createdAt = new Date();
    if (replies.length === 1) {
      this.onSend([
        {
          createdAt,
          _id: Math.round(Math.random() * 1000000),
          text: replies[0].title,
          user
        }
      ]);
    } else if (replies.length > 1) {
      this.onSend([
        {
          createdAt,
          _id: Math.round(Math.random() * 1000000),
          text: replies.map(reply => reply.title).join(", "),
          user
        }
      ]);
    } else {
      console.warn("replies param is not set correctly");
    }
  };

  renderQuickReplySend = () => <Text>{" custom send =>"}</Text>;

  getUserChat() {
    // const { id } = this.props.navigation.state;
    const { params } = this.props.navigation.state;

    if (this.props.messages.length) {
      var chatlist = this.props.messages.filter(
        message => message.user.uid === params
      );

      // alert(JSON.stringify(chatlist[0].chats));
      // alert(chatlist.length);

      if (chatlist.length > 0) {
        const orderedChat = orderBy(chatlist[0].chats, "createdAt", "desc");
        // alert(JSON.stringify(orderedChat));

        return orderedChat;
      } else {
        // this.setState({ messages: [] });
        //return [];
      }
    }
    return [];
  }

  render() {
    if (!this.state.appIsReady) {
      return <AppLoading />;
    }
    return (
      <View
        style={[styles.container, { marginTop: 100 }]}
        accessible
        accessibilityLabel="main"
        testID="main"
      >
        {/* //         data={this.props.messages.filter(message => message.members.indexOf(params) >= 0 && message.members.indexOf(this.props.user.uid) >= 0)} */}

        {/* <NavBar /> */}

        {/* {alert(JSON.stringify(this.props.messages[0].chats.length))} */}
        {/* messages={this.props.messages[0].chats} */}

        <GiftedChat
          messages={this.getUserChat()}
          onSend={this.onSend}
          loadEarlier={this.state.loadEarlier}
          onLoadEarlier={this.onLoadEarlier}
          isLoadingEarlier={this.state.isLoadingEarlier}
          parsePatterns={this.parsePatterns}
          user={user}
          scrollToBottom
          onLongPressAvatar={user => alert(JSON.stringify(user))}
          onPressAvatar={() => alert("short press")}
          keyboardShouldPersistTaps="never"
          renderAccessory={Platform.OS === "web" ? null : this.renderAccessory}
          renderActions={this.renderCustomActions}
          renderBubble={this.renderBubble}
          renderSystemMessage={this.renderSystemMessage}
          renderCustomView={this.renderCustomView}
          timeTextStyle={{ left: { color: "red" }, right: { color: "yellow" } }}
          isTyping={this.state.isTyping}
        />
        {Platform.OS === "android" ? <KeyboardSpacer /> : null}
      </View>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ addMessage, getMessages }, dispatch);
};

const mapStateToProps = state => {
  return {
    user: state.user,
    messages: state.messages
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
