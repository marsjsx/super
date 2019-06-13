import React from 'react';
import styles from '../styles'
import firebase from 'firebase';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Text, View, Image, TouchableOpacity, FlatList, ActivityIndicator, ImageBackground, VirtualizedList } from 'react-native';
import { followUser, unfollowUser } from '../actions/user'
import { ScrollView } from 'react-native-gesture-handler';
import { Ionicons, MaterialCommunityIcons, } from '@expo/vector-icons';

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      imgStyle: styles.squareLarge,
      refresh: Boolean,
       };
  }

  onButtonPress= () => {
    { this.state.imgStyle == styles.squareLarge ? 
      this.setState({
        imgStyle: styles.postPhoto,
      })
      : 
      this.setState({
        imgStyle: styles.squareLarge,
      }) }
    this.setState({
      refresh: !this.state.refresh
    })
    this.scroll.scrollTo({ x: 0, y: 11500, animated: true });
  };
  goToTop = () => {
    this.scroll.scrollTo({ x: 0, y: 0, animated: true });
  }

  _onPress = () => {
    this.props.onPressItem(this.props.id);
  };

  follow = (user) => {
    if (user.followers.indexOf(this.props.user.uid) >= 0) {
      this.props.unfollowUser(user)
    } else {
      this.props.followUser(user)
    }
  };

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
      <ScrollView ref={(c) => { this.scroll = c }}>
        
        <ImageBackground style={[styles.profilePhoto]} source={{ uri: user.photo }} >
          <View style={[styles.bottom, {width: '100%', marginBottom:0}]}>
              <View style={[styles.topLine]} />
            <View style={[styles.row, styles.space, {width: '100%'}]}>
              {
                state.routeName === 'MyProfile' ?
                  <View style={[styles.row, styles.space, {width: '100%' }]}>
                    <View>
                      <TouchableOpacity style={styles.buttonCircle} onPress={() => this.props.navigation.navigate('Edit')}>
                        <Text style={[styles.bold, styles.textD]}>Edit</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={[styles.center, {width:'66%'}]}>
                      <Text style={[styles.center, styles.bold, styles.textW]}>{user.username}</Text>
                      <Text style={[styles.center, styles.bold, styles.textW]}>{user.bio}</Text>
                    </View>
                    <View>
                      <TouchableOpacity style={styles.buttonLogout} onPress={() => firebase.auth().signOut()}>
                        <Text style={[styles.bold, styles.textE]}>Logout</Text>
                      </TouchableOpacity>
                    </View>
                  </View> :
                  <View >
                    <View style={styles.row}>
                    <TouchableOpacity style={styles.buttonCircle} onPress={() => this.follow(user)}>
                      <Ionicons style={{ margin: 5, color: 'rgb(255,255,255)' }} name={user.followers.indexOf(this.props.user.uid) >= 0 ? 'ios-checkmark' : 'ios-add'} size={25}/>
                    </TouchableOpacity>
                    <View style={[styles.center, { width: '70%' }]}>
                      <Text style={[styles.center, styles.bold, styles.textW]}>{user.username}</Text>
                      <Text style={[styles.center, styles.bold, styles.textW]}>{user.bio}</Text>
                    </View>
                    </View>
                    <TouchableOpacity style={styles.buttonMessage} onPress={() => this.props.navigation.navigate('Chat', user.uid)}>
                      <MaterialCommunityIcons style={{ margin: 5, color: 'rgb(255,255,255)' }} name='email-outline' size={50} />
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
        { this.state.imgStyle === styles.squareLarge ?
        <FlatList
          key={1}
          style={{ paddingTop: 0 }}
          initialScrollIndex={0}
          horizontal={false}
          numColumns={3}
          data={user.posts}
          extraData={this.state}
          keyExtractor={(item) => JSON.stringify(item.date)}
          renderItem={({ item }) => 
            <TouchableOpacity onPress={this.onButtonPress}>
              <Image style={this.state.imgStyle} source={{ uri: item.postPhoto }} />
              </TouchableOpacity>
          }/> :
          <FlatList
            key={2}
            style={{ paddingTop: 0 }}

            horizontal={true}
            data={user.posts}
            extraData={this.state}
            keyExtractor={(item) => JSON.stringify(item.date)}
            renderItem={({ item }) =>
              <TouchableOpacity onPress={this.onButtonPress}>
                <Image style={this.state.imgStyle} source={{ uri: item.postPhoto }} />
              </TouchableOpacity>
            } />
          }
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
