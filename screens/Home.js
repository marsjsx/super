import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Text, View, Button, Image, FlatList } from 'react-native';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getPosts } from '../actions/post'
import styles from '../styles'

class Home extends React.Component {

  componentDidMount() {
    this.props.getPosts()
  }

  render() {
    if (this.props.post === null) return null
    return (
      <View style={styles.container}>
        <FlatList
          data={this.props.post.feed}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View>
              <View style={[styles.row, styles.center]}>
                <View style={[styles.row, styles.center]}>
                  <Image style={styles.roundImage} source={{ uri: item.photo }} />
                  <Text>{item.username}</Text>
                </View>
                <Ionicons style={{ margin: 5 }} name='ios-flag' size={25} />
              </View>
              <Image style={styles.postPhoto} source={{ uri: item.postPhoto }} />

              <View style={styles.row}>
                <Ionicons style={{ margin: 5 }} name='ios-heart-empty' size={25} />
                <Ionicons style={{ margin: 5 }} name='ios-chatbubbles' size={25} />
                <Ionicons style={{ margin: 5 }} name='ios-send' size={25} />
              </View>
              <Text>{item.postDescription}</Text>
            </View>
          )}
        />
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ getPosts }, dispatch)
}

const mapStateToProps = (state) => {
  return {
    post: state.post
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)

