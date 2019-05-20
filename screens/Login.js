import React from 'react'
import styles from '../styles'
import firebase from 'firebase'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Text, View, TextInput, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { updateEmail, updatePassword, login, getUser, facebookLogin } from '../actions/user'

class Login extends React.Component {

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
      <ImageBackground source={require('../temp/paintSplash.jpg')} style={[styles.container, styles.center]}>
        <Image style={{ width: 200, height: 200, marginTop: 5 }} source={require('../assets/logo-1.png')} />
        <TextInput
          style={styles.textInputA}
          value={this.props.user.email}
          onChangeText={input => this.props.updateEmail(input)}
          placeholder='Email'
        />
        <TextInput
          style={styles.border}
          value={this.props.user.password}
          onChangeText={input => this.props.updatePassword(input)}
          placeholder='Password'
          secureTextEntry={true}
        />
        <TouchableOpacity style={[styles.buttonLogin, styles.center]} onPress={() => this.props.login()}>
          <Text style={styles.textA}> login </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonFacebook} onPress={() => this.props.facebookLogin()}>
          <Text style={styles.textA}>facebook login</Text>
        </TouchableOpacity>
        <Text style={[styles.textB, { margin: 10 }]}>OR</Text>
        <TouchableOpacity onPress={() => this.props.navigation.navigate('Signup')}>
          <Text style={styles.textB}>Signup</Text>
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

export default connect(mapStateToProps, mapDispatchToProps)(Login)