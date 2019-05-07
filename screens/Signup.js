import React from 'react';
import { Text, View, TextInput, TouchableOpacity } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { updateEmail, updatePassword, updateUsername, updateBio } from '../actions/user';
import styles from '../styles.js';

class Signup extends React.Component {
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
        <TextInput
          style={styles.border}
          value={this.props.user.username}
          onChangeText={input => this.props.updateUsername(input)}
          placeholder='Username'
        />
        <TextInput
          style={styles.border}
          value={this.props.user.bio}
          onChangeText={input => this.props.updateBio(input)}
          placeholder='Bio'
        />
        <TouchableOpacity style={styles.button} onPress={() => console.log(this.props.user)} >
          <Text> Signup </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ updateEmail, updatePassword, updateUsername, updateBio }, dispatch)
}

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Signup)
