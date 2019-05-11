import React from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { updateDescription, uploadPost } from '../actions/post'
import { Text, View, TextInput, Image, TouchableOpacity } from 'react-native';
import styles from '../styles'

class Post extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Image style={styles.postPhoto} source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/super-b71be.appspot.com/o/md80x73.jpg?alt=media&token=e0a7bce2-1cd1-48c8-bc94-c2cd4269c412' }} />
        <TextInput
          style={styles.border}
          value={this.props.post.description}
          onChangeText={text => this.props.updateDescription(text)}
          placeholder='Description'
        />
        <TouchableOpacity style={styles.button} onPress={this.props.uploadPost}>
          <Text>Post</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ updateDescription, uploadPost }, dispatch)
}

const mapStateToProps = (state) => {
  return {
    post: state.post,
    user: state.user
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Post)