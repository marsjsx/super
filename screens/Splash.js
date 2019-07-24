import React from 'react'
import styles from '../styles'
import firebase from 'firebase'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Text, View, TextInput, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { updateEmail, updatePassword, login, getUser, facebookLogin } from '../actions/user'

class Splash extends React.Component {

  componentDidMount = () => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.props.getUser(user.uid, 'LOGIN')
        if (this.props.user != null) {
          this.props.navigation.navigate('Home')
        }
      }
    })
  }

  render() {
    return (
      <ImageBackground source={require('../temp/signupLogin.png')} style={[styles.container, { alignItems: 'center' }]}>
        <Image style={{ width: 150, height: 150, marginTop: '33%' }} source={require('../assets/logo-2.png')} />
        <Image style={{ width: 250, height: 70, marginTop: '0%' }} source={require('../assets/logoW.png')} />

        <View style={[styles.bottom]} />
        <TouchableOpacity style={styles.buttonSignup2} onPress={() => this.props.navigation.navigate('Signup')}>
          <Text style={styles.textA}> signup </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.buttonLogin2, { marginBottom: 60 }]} onPress={() => this.props.navigation.navigate('Login')}>
          <Text style={styles.textA}> login </Text>
        </TouchableOpacity>

      </ImageBackground>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ updateEmail, updatePassword, login, getUser, facebookLogin }, dispatch)
}

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Splash)
