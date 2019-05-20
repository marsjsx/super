import React from 'react';
import styles from '../styles'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Ionicons } from '@expo/vector-icons';
import { Text, View, Button, Image, FlatList, TouchableOpacity, ImageBackground } from 'react-native';
import { getPosts, likePost, unlikePost } from '../actions/post'
import moment from 'moment'

class Home extends React.Component {

  componentDidMount() {
    this.props.getPosts()
  }

  likePost = (post) => {
    const { uid } = this.props.user
    if (post.likes.includes(uid)) {
      this.props.unlikePost(post)
    } else {
      this.props.likePost(post)
    }
  }

  navigateMap = (item) => {
    this.props.navigation.navigate('Map', {
      location: item.postLocation
    })
  }

  render() {
    if (this.props.post === null) return null
    return (
      <View style={styles.container}>
        <FlatList
          onRefresh={() => this.props.getPosts()}
          refreshing={false}
          data={this.props.post.feed}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const liked = item.likes.includes(this.props.user.uid)
            return (
              <View>
                <TouchableOpacity onPress={() => this.likePost(item)} >
                  <ImageBackground style={styles.postPhoto} source={{ uri: item.postPhoto }} >
                    <View style={styles.bottom}>

                      <View style={[styles.row, styles.space]}>

                        <View style={[styles.row]}>
                          <Image style={styles.squareImage} source={{ uri: item.photo }} />
                          <View>
                            <Text style={[styles.bold, styles.textD]}>{item.username}</Text>
                            <Text style={[styles.gray, styles.small]}>{moment(item.date).format('ll')}</Text>
                            <TouchableOpacity onPress={() => this.navigateMap(item)} >
                              <Text style={styles.textD} > {item.postLocation ? item.postLocation.name : null} </Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                        
                        <View style={{marginTop: -80}}>
                          <Ionicons style={{ margin: 5, color: 'rgb(255,255,255)' }} name='ios-flag' size={25} />
                          <Ionicons style={{ margin: 5 }} color={liked ? '#db565b' : '#fff'} name={liked ? 'ios-heart' : 'ios-heart-empty'} size={25} />
                          <TouchableOpacity onPress={() => this.props.navigation.navigate('Comment', item)} >
                            <Ionicons style={{ margin: 5, color: 'rgb(255,255,255)' }} name='ios-chatbubbles' size={25} />
                          </TouchableOpacity>
                          <Ionicons style={{ margin: 5, color: 'rgb(255,255,255)' }} name='ios-send' size={25} />
                        </View>

                      </View>

                      <View style={{ width: '65%', marginTop: 0 }}>
                        <Text style={styles.textD} > {item.postDescription} </Text>
                      </View>

                    </View> 
                  </ImageBackground>
                </TouchableOpacity>
              </View>
            )
          }}
        />
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ getPosts, likePost, unlikePost }, dispatch)
}

const mapStateToProps = (state) => {
  return {
    post: state.post,
    user: state.user
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
