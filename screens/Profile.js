import React from 'react';
import styles from '../styles'
import firebase from 'firebase';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Text, View, Image, TouchableOpacity, FlatList, ActivityIndicator, ImageBackground, Alert, Platform, UIManager, findNodeHandle } from 'react-native';
import { followUser, unfollowUser, getUser } from '../actions/user'
import { getMessages } from '../actions/message'
import { getPosts, likePost, unlikePost, deletePost } from '../actions/post';
import { ScrollView } from 'react-native-gesture-handler';
import { Ionicons, MaterialCommunityIcons, Entypo} from '@expo/vector-icons';
import { ImagePicker, Permissions } from 'expo';
import moment from 'moment';
import DoubleTap from '../component/DoubleTap';
import FadeInView from '../component/FadeInView';

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.page;
    this.state = {
      flatListSmall: true,
      selectedId: 'showAll',
      position: 0,
      visible: false,
      changes: 1,
       };
    this.scroll = null;
    this.scrollView = null;
  }

  componentDidMount = () => {
    this.props.getMessages()
    this.props.getPosts()
  }

  goIndex = (index) => {
    this.flatListRef.scrollToIndex({ animated: true, index: index });
  };

  logout = () => {
    firebase.auth().signOut()
    this.props.navigation.navigate('Login')
  }

  onButtonPress= (item) => {
    this.setState({
      flatListSmall: !this.state.flatListSmall
    })
    Platform.OS === 'android' ?
      this.scroll.scrollTo({ y: 12000, animated: true }):
      this.scroll.scrollTo({ y: 120, animated: true })
  };
  
  refreshScript = () => {
    this.setState({ state: this.state });
  }

  onSelect = (item, index) => {
    {
    this.state.selectedId === 'showAll' ?
      [
      this.scroll.scrollToEnd(),
      /* this.flatListRef.scrollToIndex({ animated: true, index: index }), */
      this.setState({
        selectedId: item.id
      })
      ]
      :
      [
      this.setState({
        selectedId: 'showAll',
      }),
      /* this.flatListRef.scrollToIndex({ animated: true, index: index }) */
      ]
    }
    this.visibleSwitch(item)
  };

  follow = (user) => {
    if (user.followers.indexOf(this.props.user.uid) >= 0) {
      this.props.unfollowUser(user)
    } else {
      this.props.followUser(user)
    }
  };

  openLibrary = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL)
    if (status === 'granted') {
      const image = await ImagePicker.launchImageLibraryAsync()
      if (!image.cancelled) {
        const url = await this.props.uploadPhoto(image)
        this.props.updatePhoto(url)
        /* console.log(url) */
      }
    }
  }

  onDoubleTap =  (post) => {
    const { uid } = this.props.user;
    if (post.likes.includes(uid)) {
      this.props.unlikePost(post)
    } else {
      this.props.likePost(post)
    };
    this.setState({ state: this.state });
  }

  onSingleTap = (item, index) => {
    {
      this.state.selectedId === 'showAll' ?
        [
          this.scroll.scrollToEnd(),
          /* this.flatListRef.scrollToIndex({ animated: true, index: index }), */
          this.setState({
            selectedId: item.id
          })
        ]
        :
        [
          this.setState({
            selectedId: 'showAll',
          }),
          /* this.flatListRef.scrollToIndex({ animated: true, index: index }) */
        ]
    }
  };

  visibleSwitch = (post) => {
    const { uid } = this.props.user
    if (post.likes.includes(uid)) {
      this.setState({
        visible: true,
      })
    } else {
      this.setState({
        visible: false,
      })
    }
  }

  likePostAction = (post) => {
    const { uid } = this.props.user
    if (post.likes.includes(uid)) {
      this.props.unlikePost(post)
      this.setState({
        visible: false,
      })
    } else {
      this.props.likePost(post)
      this.setState({
        visible: true,
      })
    }
  }

  activateLongPress = (item) => {
    const { state, navigate } = this.props.navigation;
    if (state.routeName === 'MyProfile'){ 
      Alert.alert(
        'Delete post?',
        'Press OK to Delete. This action is irreversible, it cannot be undone.',
        [
          {
            text: 'Cancel',
            onPress: () => alert('Cancelled'),
            style: 'cancel',
          },
          { text: 'OK', onPress: () => this.props.deletePost(item) },
          
        ],
        { cancelable: false },
      );
    }else{
      this.likePostAction(item)
    }
  }

  render() {
    let user = {}
    const selectedId = this.state.selectedId
    const { state, navigate } = this.props.navigation
    if (state.routeName === 'Profile' ) {
      user = this.props.profile
    } else {
      user = this.props.user
    }
    if (!user.posts) return <ActivityIndicator style={styles.container} />
    return (
      <ScrollView ref={(c) => this.scroll = c} >

        <ImageBackground style={[styles.profilePhoto]} source={{ uri: user.photo }} >
          <View style={[styles.bottom, {width: '100%', marginTop:450}]}>
            {state.routeName === 'MyProfile' && user.photo === '' ?
              <View style={[styles.center, styles.container, {width:'100%'}]}>
                <TouchableOpacity onPress={this.openLibrary} >
                <Text style={[styles.bold]}>Add profile photo +</Text>
              </TouchableOpacity>
            </View>:
            <View/>
            }
          </View>
          <View style={[styles.topLine, { width: '100%', marginTop: -10}]} />
            <View style={[styles.row, styles.space, {width: '100%'}]}>
              {
                state.routeName === 'MyProfile' ?
                <View style={styles.container}>
                  <View style={[styles.row, styles.space, {width: '100%'}]}>
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
                      <TouchableOpacity style={styles.buttonLogout} onPress={this.logout}>
                        <Text style={[styles.bold, styles.textE]}>Logout</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                    {/* <TouchableOpacity onPress={() => this.props.navigation.navigate('Dash')} style={styles.buttonMessage}>
                      <MaterialCommunityIcons 
                        style={{ margin: 5, color: 'rgb(255,255,255)' }} 
                        name='view-dashboard' 
                        size={50} />
                    </TouchableOpacity> */}
                  </View>
                  :
                <View style={styles.container}>
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
                      {/* <TouchableOpacity style={styles.buttonMessage} onPress={() => this.props.navigation.navigate('Pay', user.uid)}>
                        <MaterialCommunityIcons style={{ margin: 5, color: 'rgb(255,255,255)' }} name='currency-usd' size={50} />
                      </TouchableOpacity> */}
                    
                  </View>
              }
            </View>
        </ImageBackground>  
          <View style={[styles.row, styles.space, styles.followBar,{marginTop:0}]}>
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
        
        <FlatList
          initialNumToRender='9'
          maxToRenderPerBatch='9'
          windowSize={12}
          onRefresh={() => this.props.getPosts()}
          refreshing={false}
          style={selectedId === 'showAll' ? { paddingTop: 0, paddingBottom: 130 }:{paddingTop:0, paddingBottom:0}}
          horizontal={false}
          numColumns={3}
          data={user.posts}
          extraData={user}
          keyExtractor={(item, index) => [item.id, index]}
          onEndReachedThreshold={0.4}
          renderItem={({ item, index }) => {
            const selectedId = this.state.selectedId
            const liked = item.likes.includes(this.props.user.uid)
            const visible = this.state.visible
            return(
              <View>
                {item.id === selectedId ?
                  <TouchableOpacity
                    id={item.id}
                    onPress={() => [this.onSelect(item, index)]}
                    activeOpacity={0.6}
                    onLongPress={() => this.activateLongPress(item)}>
                    
                    <ImageBackground style={styles.postPhoto} source={{ uri: item.postPhoto }} >

                      <View style={styles.bottom}>
                        <View style={[styles.row, styles.space]}>
                          <View style={[styles.row,]}>
                            <View>
                              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start' }}>
                                {
                                  this.state.fontLoaded ? (
                                    <Text style={{ fontFamily: 'open-sans-bold', fontSize: 18, color: 'rgb(255,255,255)' }}>{item.username}</Text>
                                  ) : null
                                }
                              </View>

                              <Text style={[styles.gray, styles.small]}>{moment(item.date).format('ll')}</Text>
                              <TouchableOpacity onPress={() => this.navigateMap(item)} >
                                <Text style={styles.textD} > {item.postLocation ? item.postLocation.name : null} </Text>
                              </TouchableOpacity>
                            </View>
                          </View>

                          <View style={{ marginTop: -75 }}>
                            {this.state.visible === true ?
                              <FadeInView style={styles.center}>
                                <Ionicons style={{ margin: 5, }}
                                  color={'#db565b'}
                                  name={'ios-heart'}
                                  size={50} />
                                <Text style={[styles.textD]}>{item.likes.length}</Text>
                              </FadeInView>
                              :
                              <FadeInView style= { styles.center }>
                                <Ionicons style={{ margin: 5, }}
                                  color={'rgb(255,255,255)'}
                                  name={'ios-heart-empty'}
                                  size={50} />
                                <Text style={[styles.textD]}>{item.likes.length}</Text>
                              </FadeInView>
                            }
                            <FadeInView style={styles.center}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('Comment', item)} >
                              <Ionicons style={{ margin: 5, color: 'rgb(255,255,255)' }} name='ios-chatbubbles' size={50} />
                            </TouchableOpacity>
                            </FadeInView>
                          </View>

                        </View>
                        
                        <FadeInView style={{ width: '65%', marginTop: 0, }}>
                          <Text style={styles.textD} > {item.postDescription} </Text>
                        </FadeInView>

                      </View>
                    </ImageBackground>
                    
                  </TouchableOpacity>
                  :
                  
                  <TouchableOpacity 
                    id={item.id}
                    onPress={() => [this.onSelect(item, index)]}
                    activeOpacity={0.6}
                    onLongPress={() => this.activateLongPress(item)}>
                    {selectedId === 'showAll' ?
                      <Image id={item.id} style={styles.squareLarge} source={{ uri: item.postPhoto }} /> 
                      :
                      null
                    }
                  </TouchableOpacity>
                  
                }
              </View>
            )}
          }/>
      </ScrollView>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ followUser, unfollowUser, getMessages, deletePost, getPosts, likePost, unlikePost, getUser }, dispatch)
}

const mapStateToProps = (state) => {
  return {
    post: state.post,
    user: state.user,
    profile: state.profile,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile)
