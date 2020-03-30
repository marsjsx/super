import React from "react";
import styles from "../styles";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  View,
  Text,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  TouchableOpacity,
  Image,
  ActivityIndicator
} from "react-native";
import { addMessage, getMessages } from "../actions/message";
import { GiftedChat } from "react-native-gifted-chat";

import moment from "moment";

class Chat extends React.Component {
  state = {
    messages: []
  };

  componentWillMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: "Hello developer",
          createdAt: new Date(),
          user: {
            _id: 2,
            name: "React Native",
            avatar: "https://facebook.github.io/react/img/logo_og.png"
          }
        },
        {
          _id: 1,
          text: 'My message',
          createdAt: new Date(Date.UTC(2016, 5, 11, 17, 20, 0)),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://res.cloudinary.com/demo/image/upload/w_500/sample.jpg',
          },
          image: 'https://res.cloudinary.com/demo/image/upload/w_500/sample.jpg',
          audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
          // You can also add a video prop:
          // video: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
          // Any additional custom parameters are passed through
        },
        {
          _id: Math.round(Math.random() * 1000000),
          text: '',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
          },
          sent: true,
          received: true,
          location: {
            latitude: 48.864601,
            longitude: 2.398704
          },
        }
      ]
    });
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages)
    }));
  }

  // state = {
  //   message: '',
  // }

  // componentDidMount = () => {
  //   this.props.getMessages()
  // }

  // sendMessage = () => {
  //   const { params } = this.props.navigation.state
  //   this.props.addMessage(params, this.state.message)
  //   this.setState({ message: '' })
  // }

  // render() {
  //   const { params } = this.props.navigation.state
  //   const { uid } = this.props.user
  //   if (!this.props.messages) return <ActivityIndicator style={styles.container} />
  //   return (
  //     <KeyboardAvoidingView enabled behavior='padding' style={styles.container}>
  //       <FlatList
  //         inverted
  //         onRefresh={()=> this.props.getMessages()}
  //         refreshing={false}
  //         keyExtractor={(item) => JSON.stringify(item.date)}
  //         data={this.props.messages.filter(message => message.members.indexOf(params) >= 0 && message.members.indexOf(this.props.user.uid) >= 0)}
  //         renderItem={({ item }) => (
  //           <TouchableOpacity  style={[styles.row, styles.space]}>
  //             {item.uid !== uid ? <Image style={styles.roundImage} source={{ uri: item.photo }} /> : null}
  //             <View style={[styles.container, item.uid === uid ? styles.right : styles.left]}>
  //               <Text style={styles.bold}>{item.username}</Text>
  //               <View style={[styles.container, item.uid === uid ? styles.chatBlue : styles.chatWhite]}>
  //                 <Text style={[item.uid === uid ? styles.textChatOut : styles.textChatInc,{padding: 12}]}>{item.message}</Text>
  //               </View>
  //               <Text style={[styles.textF, styles.small, { paddingBottom: 5 }]}>{moment(item.date).format('ll')}</Text>
  //             </View>
  //             {item.uid === uid ? <Image style={styles.roundImage} source={{ uri: item.photo }} /> : null}
  //           </TouchableOpacity>
  //         )}/>
  //       <TextInput
  //         style={styles.input}
  //         onChangeText={(message) => this.setState({ message })}
  //         value={this.state.message}
  //         returnKeyType='send'
  //         placeholder='Send Message'
  //         onSubmitEditing={this.sendMessage} />
  //     </KeyboardAvoidingView>
  //   );
  // }

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={messages => this.onSend(messages)}
        user={{
          _id: 1
        }}
      />
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
