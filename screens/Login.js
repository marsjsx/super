import React from 'react'
import styles from '../styles'
import firebase from 'firebase'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Text, View, TextInput, TouchableOpacity, Image, ImageBackground, KeyboardAvoidingView, ScrollView } from 'react-native';
import { updateEmail, updatePassword, login, getUser, facebookLogin } from '../actions/user'
import { Ionicons } from '@expo/vector-icons';

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
      <ImageBackground source={require('../temp/loginBG.png')} style={[styles.container, styles.center]}>
        <KeyboardAvoidingView style={{ flex: 1, width: '100%' }} behavior={"padding"} >
          <ScrollView style={[{ width: '100%' }]} contentContainerStyle={styles.center}>
            <Image style={styles.logo3} source={require('../assets/logo-3.png')} />
            <View style={[styles.border, styles.center, styles.row, {marginTop:80}]}>
              <Ionicons style={{color: 'rgb(255,255,255)' }} name={'ios-person'} size={30} />
              <TextInput
                style={styles.textInputA}
                value={this.props.user.email}
                onChangeText={input => this.props.updateEmail(input)}
                placeholder='Email'
                /></View>
            <View style={[styles.border, styles.center, styles.row, {marginTop:30}]}>
              <Ionicons style={{ color: 'rgb(255,255,255)' }} name={'ios-key'} size={30} />
              <TextInput
                style={styles.textInputA}
                value={this.props.user.password}
                onChangeText={input => this.props.updatePassword(input)}
                placeholder='Password'
                secureTextEntry={true}
              /></View>
            <TouchableOpacity style={styles.buttonForgot} onPress={() => this.props.navigation.navigate('Signup')}>
              <Text style={styles.textA}>forgot password?</Text>              
            </TouchableOpacity>
            <TouchableOpacity style={[styles.buttonLogin, styles.center]} onPress={() => this.props.login()}>
              <Text style={styles.textA}> login </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonSignup} onPress={() => this.props.navigation.navigate('Signup')}>
              <Text style={styles.textA}>signup</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonFacebook} onPress={() => this.props.facebookLogin()}>
              <Text style={styles.textA}>facebook login</Text>
            </TouchableOpacity>
        </ScrollView></KeyboardAvoidingView>
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