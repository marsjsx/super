import React from 'react';
import { Text, View, TextInput, TouchableOpacity } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { updateEmail, updatePassword } from '../actions/user';
import styles from '../styles.js';

class Login extends React.Component {

login = () => {
  if (this.props.user.email){
    this.props.navigation.navigate('Home')
  }
}

  render() {
    return (
      <View style={styles.container}>
        <TextInput 
          style={styles.border}
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
        <TouchableOpacity style={styles.button} onPress={() => this.login()} >
          <Text> Login </Text>
        </TouchableOpacity>
        <Text>OR</Text>
        <TouchableOpacity onPress={() => this.props.navigation.navigate('Signup')} >
          <Text> Signup </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ updateEmail, updatePassword }, dispatch)
}

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
