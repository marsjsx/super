import React from 'react';
import styles from '../styles'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { ImagePicker, Permissions } from 'expo';
import { Text, View, TextInput, TouchableOpacity, Image, ImageBackground, ScrollView, KeyboardAvoidingView, Alert } from 'react-native';
import { updatePhoto, updateEmail, updatePassword, updateUsername, updateBio, signup, updateUser, facebookLogin, deleteAuth, deleteAllPosts, deleteUser } from '../actions/user'
import { uploadPhoto } from '../actions'
import firebase from 'firebase'

class Signup extends React.Component {

  componentDidMount = () => {
    const { routeName } = this.props.navigation.state
    /* console.log(routeName) */
  }
  
  beginDel = async () => {
    /* this.props.deleteAllPosts() */
    await this.props.deleteUser()
    await this.props.deleteAuth()
    firebase.auth().signOut()
    this.props.navigation.navigate('Splash')
  }

  onPressDel = () => {
    Alert.alert(
      'Delete Account?',
      'Press OK to Delete. This action is irreversible, it cannot be undone. This will not delete your posts.',
      [
      {
        text: 'Cancel',
        onPress: () => alert('Cancelled'),
        style: 'cancel',
      },
      { text: 'OK', onPress: () => this.beginDel() },
      ],
    { cancelable: false },
    );
  }
  onPress = () => {
    const { routeName } = this.props.navigation.state
    if (routeName === 'Signup') {
      this.props.signup()
      this.props.navigation.navigate('Edit')
    } else {
      this.props.updateUser()
      this.props.navigation.goBack()
    }
  }

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

  render() {
    const { routeName } = this.props.navigation.state
    return (
      <View style={[styles.container,{ width: '100%', height: '100%' }]}>
        {
          routeName === 'Signup' ?
            <ImageBackground source={require('../temp/signupBG.png')} style={[styles.container, styles.center]}>
              <KeyboardAvoidingView style={{ flex: 1, width: '100%' }} behavior={"padding"} >
                <ScrollView style={[{ width: '100%' }]} contentContainerStyle={styles.center}>
              {/* <TouchableOpacity style={styles.center} onPress={this.openLibrary} >
                <Image style={[styles.squareImage]} source={{ uri: this.props.user.photo }} />
                <Text style={[styles.bold, styles.textW]}>Upload Photo</Text>
              </TouchableOpacity> */}
              <Image style={styles.logo2} source={require('../assets/logo-2.png')} />
              <TextInput
                style={[styles.border4, styles.textB,{marginTop: 30}]}
                editable={routeName === 'Signup' ? true : false}
                value={this.props.user.email}
                onChangeText={input => this.props.updateEmail(input)}
                placeholder='email'
                placeholderTextColor='rgb(75,75,75)'
              />
              <TextInput
                style={[styles.border4, styles.textB, { marginTop: 30 }]}
                editable={routeName === 'Signup' ? true : false}
                value={this.props.user.password}
                onChangeText={input => this.props.updatePassword(input)}
                placeholder='password'
                placeholderTextColor='rgb(75,75,75)'
                secureTextEntry={true}
              />
              <TextInput
                style={[styles.border4, styles.textB, { marginTop: 30 }]}
                value={this.props.user.username}
                onChangeText={input => this.props.updateUsername(input)}
                placeholder='username'
                placeholderTextColor='rgb(75,75,75)'
              />
              <TextInput
                style={[styles.border4, styles.textB, { marginTop: 30 }]}
                value={this.props.user.bio}
                onChangeText={input => this.props.updateBio(input)}
                placeholder='bio'
                placeholderTextColor='rgb(75,75,75)'
              />
              <TouchableOpacity style={[styles.buttonSignup, { marginTop: 60 }]} onPress={this.onPress}>
                <Text style={styles.textA}>signup</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.buttonFacebook]} onPress={() => this.props.facebookLogin()}>
                <Text style={styles.textA}>facebook signup</Text>
              </TouchableOpacity>
              </ScrollView></KeyboardAvoidingView>
            </ImageBackground> 
            :
            <ScrollView>
            <View style={[styles.container, styles.space]}>
              <ImageBackground style={[styles.profileEditPhoto, styles.container, styles.bottom, styles.bottomLine]} source={{ uri: this.props.user.photo }}>
                  <TouchableOpacity style={[styles.center, { marginBottom: 30 }]} onPress={this.openLibrary} >
                    <Text style={[styles.bold, { color: 'rgb(237,75,75)', textDecorationLine: 'underline'}]}>change profile photo</Text>
                  </TouchableOpacity>
              </ImageBackground>
                <View style={[styles.container, styles.row, {alignItems: 'flex-start'}]}>
                <Text style={[styles.textG, {marginLeft:'1%', marginTop: '2%', }]}>Username:</Text>
                <TextInput
                  style={[styles.border3, styles.textF]}
                  value={this.props.user.username}
                  onChangeText={input => this.props.updateUsername(input)}
                  placeholder='Username'
                />
              </View>
              <View style={[styles.container, styles.left, styles.row, {marginTop: 15}]}>
                <Text style={[styles.textG, {   }]}>Bio:</Text>
                <TextInput
                  style={[styles.border3, styles.textF]}
                  value={this.props.user.bio}
                  onChangeText={input => this.props.updateBio(input)}
                  placeholder='Bio'
                />
              </View>
              
              <View style={[styles.container, styles.left, styles.row, {marginTop: 15}]}>
                <Text style={[styles.textG, {   }]}>Password:</Text>
                <TextInput
                  style={[styles.border3, styles.textF]}
                  editable={routeName === 'Signup' ? true : false}
                  value={this.props.user.password}
                  onChangeText={input => this.props.updatePassword(input)}
                  placeholder='Password'
                  secureTextEntry={true}
                />
              </View>
              <View style={[styles.container, styles.left, styles.row, {marginTop: 15}]}>
                <Text style={[styles.textG, {   }]}>Email:</Text>
                <TextInput
                  style={[styles.border3, styles.textF]}
                  editable={routeName === 'Signup' ? true : false}
                  value={this.props.user.email}
                  onChangeText={input => this.props.updateEmail(input)}
                  placeholder='Email'
                />
              </View>
              <View style={[styles.container, styles.left, styles.row, {marginTop: 15}]}>
                <Text style={[styles.textG, {   }]}>Phone:</Text>
                <TextInput
                  style={[styles.border3, styles.textF]}
                  editable={routeName === 'Signup' ? true : false}
                  value={this.props.user.email}
                  onChangeText={input => this.props.updateEmail(input)}
                  placeholder='Phone'
                />
              </View>
              <View style={[styles.container, styles.left, styles.row, {marginTop: 15}]}>
                <Text style={[styles.textG, {   }]}>Gender:</Text>
                <TextInput
                  style={[styles.border3, styles.textF]}
                  editable={routeName === 'Signup' ? true : false}
                  value={this.props.user.email}
                  onChangeText={input => this.props.updateEmail(input)}
                  placeholder='Gender'
                />
              </View>
              <View style={[styles.container, styles.left, styles.row, {marginTop: 15}]}>
                <Text style={[styles.textG, {   }]}>Birthdate:</Text>
                <TextInput
                  style={[styles.border3, styles.textF]}
                  editable={routeName === 'Signup' ? true : false}
                  value={this.props.user.email}
                  onChangeText={input => this.props.updateEmail(input)}
                  placeholder='Birthdate'
                />
              </View>
                <TouchableOpacity style={[styles.buttonLogin2, { marginTop: 20 }]} onPress={this.onPress}>
                  <Text style={styles.textA}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.buttonCancel, { marginTop: 10 }]} onPress={() => this.props.navigation.goBack()}>
                  <Text style={styles.textA}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.buttonDelete, { marginTop: 25, marginBottom: 25 }]} onPress={this.onPressDel}>
                  <Text style={styles.textA}>! Delete User !</Text>
                </TouchableOpacity>
            </View>
              
            </ScrollView>
        }
      </View>
      
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ updatePhoto, uploadPhoto, updateUser, updateEmail, updatePassword, updateUsername, updateBio, signup, facebookLogin, deleteAuth, deleteAllPosts, deleteUser }, dispatch)
}

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Signup)
