import React from 'react';
import styles from '../styles'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Text, View, TextInput, FlatList, Image, KeyboardAvoidingView, ScrollView } from 'react-native';
import { addComment, getComments } from '../actions/post';
import moment from 'moment'

class Comment extends React.Component {
  state = {
    comment: ''
  }

  componentDidMount = () => {
    const { params } = this.props.navigation.state
    this.props.getComments(params)
  }

  postComment = () => {
    const { params } = this.props.navigation.state
    this.props.addComment(this.state.comment, params)
    this.setState({ comment: '' })
  }

  render() {
    return (
      <View style={[styles.container,{ marginTop: 90 }]}>
      <KeyboardAvoidingView enabled behavior='padding' style={styles.container}>
        <FlatList
          keyExtractor={(item) => JSON.stringify(item.date)}
          data={this.props.post.comments}
          renderItem={({ item }) => (
            <View style={[styles.row, styles.space,]}>
              <Image style={styles.roundImage} source={{ uri: item.commenterPhoto }} />
              <View style={[styles.container, styles.left]}>
                <Text style={styles.bold}>{item.commenterName}</Text>
                <Text style={styles.gray}>{item.comment}</Text>
                <Text style={[styles.gray, styles.small]}>{moment(item.date).format('ll')}</Text>
              </View>
            </View>
          )} />
        <TextInput
          style={[styles.input,{marginBottom: 30}]}
          onChangeText={(comment) => this.setState({ comment })}
          value={this.state.comment}
          returnKeyType='send'
          placeholder='Add Comment'
          onSubmitEditing={this.postComment} />
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ addComment, getComments }, dispatch)
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    post: state.post
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Comment)