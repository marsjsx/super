import React from 'react';
import styles from '../styles'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { ImagePicker, Permissions } from 'expo';
import { Text, View, TextInput, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { updatePhoto, updateEmail, updatePassword, updateUsername, updateBio, signup, updateUser } from '../actions/user'
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
      <ImageBackground source={require('../temp/redSunset.jpg')} style={[styles.container, styles.center]}>
        <TouchableOpacity style={styles.center} onPress={this.openLibrary} >
          <Image style={[styles.squareImage, {}]} source={{ uri: this.props.user.photo }} />
          <Text style={[styles.bold, styles.textW]}>Upload Photo</Text>
        </TouchableOpacity>
        <TextInput
          style={[styles.border,styles.textW]}
          editable={routeName === 'Signup' ? true : false}
          value={this.props.user.email}
          onChangeText={input => this.props.updateEmail(input)}
          placeholder='Email'
        />
        <TextInput
          style={[styles.border, styles.textW]}
          editable={routeName === 'Signup' ? true : false}
          value={this.props.user.password}
          onChangeText={input => this.props.updatePassword(input)}
          placeholder='Password'
          secureTextEntry={true}
        />
        <TextInput
          style={[styles.border, styles.textW]}
          value={this.props.user.username}
          onChangeText={input => this.props.updateUsername(input)}
          placeholder='Username'
        />
        <TextInput
          style={[styles.border, styles.textW]}
          value={this.props.user.bio}
          onChangeText={input => this.props.updateBio(input)}
          placeholder='Bio'
        />
        <TouchableOpacity style={styles.buttonSignup} onPress={this.onPress}>
          <Text style={styles.textC}>Done</Text>
        </TouchableOpacity>
      </ImageBackground>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ updatePhoto, uploadPhoto, updateUser, updateEmail, updatePassword, updateUsername, updateBio, signup }, dispatch)
}

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Signup)