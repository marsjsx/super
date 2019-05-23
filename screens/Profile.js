import React from 'react';
import styles from '../styles'
import firebase from 'firebase';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Text, View, Image, TouchableOpacity, FlatList, ActivityIndicator, ImageBackground } from 'react-native';
import { followUser, unfollowUser } from '../actions/user'
import { ScrollView } from 'react-native-gesture-handler';

class Profile extends React.Component {
  follow = (user) => {
    if (user.followers.indexOf(this.props.user.uid) >= 0) {
      this.props.unfollowUser(user)
    } else {
      this.props.followUser(user)
    }
  }

  render() {
    let user = {}
    const { state, navigate } = this.props.navigation
    if (state.routeName === 'Profile') {
      user = this.props.profile
    } else {
      user = this.props.user
    }
    if (!user.posts) return <ActivityIndicator style={styles.container} />
    return (
      <ScrollView style={{width:'100%',height:'100%'}}>
        <View style={[styles.container, { width: '100%', height: '100%' }]}>
        <ImageBackground style={[styles.profilePhoto,{width:'100%'}]} source={{ uri: user.photo }} >
          <View style={[styles.bottom, {width: '100%', marginBottom:0}]}>
              <View style={[styles.topLine, { width: '100%' }]}></View>
            <View style={[styles.row, styles.space, { paddingHorizontal: 20, width: '100%'}]}>
              {
                state.routeName === 'MyProfile' ?
                  <View style={[styles.row, styles.space, { paddingHorizontal: 20, width: '100%' }]}>
                    <View>
                      <TouchableOpacity style={styles.buttonCircle} onPress={() => this.props.navigation.navigate('Edit')}>
                        <Text style={[styles.bold, styles.textD,{}]}>Edit</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={[styles.center]}>
                      <Text style={[styles.bold, styles.textD]}>{user.username}</Text>
                      <Text style={[styles.bold, styles.textD]}>{user.bio}</Text>
                    </View>
                    <View>
                      <TouchableOpacity style={styles.buttonLogout} onPress={() => firebase.auth().signOut()}>
                        <Text style={[styles.bold, styles.textE]}>Logout</Text>
                      </TouchableOpacity>
                    </View>
                  </View> :
                  <View style={styles.row}>
                    <View style={styles.center}>
                      <Image style={[styles.squareImage, {}]} source={{ uri: user.photo }} />
                      <Text style={[styles.bold, styles.textD]}>{user.username}</Text>
                      <Text style={[styles.bold, styles.textD]}>{user.bio}</Text>
                    </View>
                    <TouchableOpacity style={styles.buttonSmall} onPress={() => this.follow(user)}>
                      <Text style={[styles.bold, styles.textD]}>{user.followers.indexOf(this.props.user.uid) >= 0 ? 'UnFollow User' : 'Follow User'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonSmall} onPress={() => this.props.navigation.navigate('Chat', user.uid)}>
                      <Text style={[styles.bold, styles.textD]}>Message</Text>
                    </TouchableOpacity>
                  </View>
              }
            </View>
            <View style={[styles.row, styles.space, styles.followBar,]}>
              <View style={styles.center}>
                <Text style={[styles.bold, styles.textF]}>{user.posts.length}</Text>
                <Text style={[styles.bold, styles.textF]}>posts</Text>
              </View>
              <View style={styles.center}>
                <Text style={[styles.bold, styles.textF]}>{user.followers.length}</Text>
                <Text style={[styles.bold, styles.textF]}>followers</Text>
              </View>
              <View style={styles.center}>
                <Text style={[styles.bold, styles.textF]}>{user.following.length}</Text>
                <Text style={[styles.bold, styles.textF]}>following</Text>
              </View>
              {/* <View style={styles.center}>
                <Text style={[styles.bold, styles.textD, { color: 'red' }]}>hide</Text>
              </View> */}
            </View>
          </View>
        </ImageBackground>
        <FlatList
          style={{ paddingTop: 0 }}
          horizontal={false}
          numColumns={3}
          data={user.posts}
          keyExtractor={(item) => JSON.stringify(item.date)}
          renderItem={({ item }) => <Image style={styles.squareLarge} source={{ uri: item.postPhoto }} />} />
      </View>
      </ScrollView>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ followUser, unfollowUser }, dispatch)
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    profile: state.profile
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile)
