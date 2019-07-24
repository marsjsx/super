import React from 'react';
import styles from '../styles'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { ImagePicker, Permissions } from 'expo';
import { Text, View, TextInput, TouchableOpacity, Image, ImageBackground, ScrollView, KeyboardAvoidingView } from 'react-native';
import { updatePhoto, updateEmail, updatePassword, updateUsername, updateBio, signup, updateUser, facebookLogin } from '../actions/user'
import { uploadPhoto } from '../actions'

class Signup extends React.Component {

  componentDidMount = () => {
    const { routeName } = this.props.navigation.state
    console.log(routeName)
  }

  onPress = () => {
    const { routeName } = this.props.navigation.state
    if (routeName === 'Signup') {
      this.props.signup()
      this.props.navigation.navigate('Home')
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
        console.log(url)
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
                style={[styles.border4, styles.textB,{marginTop: 20}]}
                editable={routeName === 'Signup' ? true : false}
                value={this.props.user.email}
                onChangeText={input => this.props.updateEmail(input)}
                placeholder='email'
                placeholderTextColor='rgb(75,75,75)'
              />
              <TextInput
                style={[styles.border4, styles.textB, { marginTop: 20 }]}
                editable={routeName === 'Signup' ? true : false}
                value={this.props.user.password}
                onChangeText={input => this.props.updatePassword(input)}
                placeholder='password'
                placeholderTextColor='rgb(75,75,75)'
                secureTextEntry={true}
              />
              <TextInput
                style={[styles.border4, styles.textB, { marginTop: 20 }]}
                value={this.props.user.username}
                onChangeText={input => this.props.updateUsername(input)}
                placeholder='username'
                placeholderTextColor='rgb(75,75,75)'
              />
              <TextInput
                style={[styles.border4, styles.textB, { marginTop: 20 }]}
                value={this.props.user.bio}
                onChangeText={input => this.props.updateBio(input)}
                placeholder='bio'
                placeholderTextColor='rgb(75,75,75)'
              />
              <TouchableOpacity style={[styles.buttonSignup, { marginTop: 40 }]} onPress={this.onPress}>
                <Text style={styles.textA}>signup</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.buttonFacebook]} onPress={() => this.props.facebookLogin()}>
                <Text style={styles.textA}>facebook signup</Text>
              </TouchableOpacity>
              </ScrollView></KeyboardAvoidingView>
            </ImageBackground> :
            <ScrollView>
            <View style={[styles.container, styles.space]}>
              <ImageBackground style={[styles.profileEditPhoto, styles.container]} source={{ uri: this.props.user.photo }}>
                <View style={[styles.space, styles.row]}>
                    <TouchableOpacity style={[styles.buttonSave, { marginTop: 30 }]} onPress={() => this.props.navigation.goBack()}>
                    <Text style={styles.textW}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.buttonSave,{marginTop: 30}]} onPress={this.onPress}>
                    <Text style={styles.textW}>Save</Text>
                  </TouchableOpacity>
                </View>
              </ImageBackground>

              <TouchableOpacity style={[styles.center,{margin: '5%'}]} onPress={this.openLibrary} >
                <Text style={[styles.bold, styles.textL]}>change profile photo</Text>
              </TouchableOpacity>
              
              <View style={[styles.container, styles.row]}>
                <Text style={[styles.textG, {marginLeft:'1%'}]}>Username:</Text>
                <TextInput
                  style={[styles.border3, styles.textF]}
                  value={this.props.user.username}
                  onChangeText={input => this.props.updateUsername(input)}
                  placeholder='Username'
                />
              </View>
              <View style={[styles.container, styles.row]}>
                <Text style={[styles.textG, { marginLeft: '1%' }]}>Bio:</Text>
                <TextInput
                  style={[styles.border3, styles.textF]}
                  value={this.props.user.bio}
                  onChangeText={input => this.props.updateBio(input)}
                  placeholder='Bio'
                />
              </View>
              <Text style={styles.textH}>Private Information</Text>
              <View style={[styles.container, styles.row]}>
                <Text style={[styles.textG, { marginLeft: '1%' }]}>Password:</Text>
                <TextInput
                  style={[styles.border3, styles.textF]}
                  editable={routeName === 'Signup' ? true : false}
                  value={this.props.user.password}
                  onChangeText={input => this.props.updatePassword(input)}
                  placeholder='Password'
                  secureTextEntry={true}
                />
              </View>
              <View style={[styles.container, styles.row]}>
                <Text style={[styles.textG, { marginLeft: '1%' }]}>Email:</Text>
                <TextInput
                  style={[styles.border3, styles.textF]}
                  editable={routeName === 'Signup' ? true : false}
                  value={this.props.user.email}
                  onChangeText={input => this.props.updateEmail(input)}
                  placeholder='Email'
                />
              </View>
              <View style={[styles.container, styles.row]}>
                <Text style={[styles.textG, { marginLeft: '1%' }]}>Phone:</Text>
                <TextInput
                  style={[styles.border3, styles.textF]}
                  editable={routeName === 'Signup' ? true : false}
                  value={this.props.user.email}
                  onChangeText={input => this.props.updateEmail(input)}
                  placeholder='Phone'
                />
              </View>
              <View style={[styles.container, styles.row]}>
                <Text style={[styles.textG, { marginLeft: '1%' }]}>Gender:</Text>
                <TextInput
                  style={[styles.border3, styles.textF]}
                  editable={routeName === 'Signup' ? true : false}
                  value={this.props.user.email}
                  onChangeText={input => this.props.updateEmail(input)}
                  placeholder='Gender'
                />
              </View>
              <View style={[styles.container, styles.row]}>
                <Text style={[styles.textG, { marginLeft: '1%' }]}>Birthdate:</Text>
                <TextInput
                  style={[styles.border3, styles.textF]}
                  editable={routeName === 'Signup' ? true : false}
                  value={this.props.user.email}
                  onChangeText={input => this.props.updateEmail(input)}
                  placeholder='Birthdate'
                />
              </View>
                <TouchableOpacity style={[styles.buttonLogin2, { marginTop: 10 }]} onPress={this.onPress}>
                  <Text style={styles.textA}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.buttonCancel, { marginTop: 10, marginBottom: 25 }]} onPress={() => this.props.navigation.goBack()}>
                  <Text style={styles.textA}>Cancel</Text>
                </TouchableOpacity>
            </View>
              
            </ScrollView>
        }
      </View>
      
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ updatePhoto, uploadPhoto, updateUser, updateEmail, updatePassword, updateUsername, updateBio, signup, facebookLogin }, dispatch)
}

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Signup)
