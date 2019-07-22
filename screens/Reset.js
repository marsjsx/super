import React from 'react';
import styles from '../styles'
import { ImageBackground, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Text, ScrollView, Image } from 'react-native';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { passwordResetEmail, updateEmail } from '../actions/user';
import { Ionicons } from '@expo/vector-icons';

class Reset extends React.Component {

  onPress = () => {
    this.props.passwordResetEmail();
    this.props.navigation.goBack();
  }

  render() {    
    return (
      <ImageBackground source={require('../temp/loginBG.png')} style={[styles.container, styles.center]}>
        <KeyboardAvoidingView style={{ flex: 1, width: '100%' }} behavior={"padding"} >
          <ScrollView style={[styles.tintGreen]} contentContainerStyle={styles.center}>
            
            <Image style={[styles.logo3]} source={require('../assets/logo-3.png')} />
            <View style={[styles.border, styles.center, styles.row, { marginTop: 70 }]}>
              <Ionicons style={{ color: 'rgb(255,255,255)' }} name={'ios-person'} size={30} />
              <TextInput
                style={styles.textInputA}
                value={this.props.user.email}
                onChangeText={input => this.props.updateEmail(input)}
                placeholder='email'
                placeholderTextColor='rgb(255,255,255)'
              /></View>
            <TouchableOpacity style={[styles.buttonReset, { marginTop: 60 }]} onPress={this.onPress}>
              <Text style={styles.textA}>send reset email</Text>
            </TouchableOpacity>
            
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ passwordResetEmail, updateEmail }, dispatch)
}

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Reset)

{/* <TextInput
              style={[styles.border4, styles.textB, { marginTop: 30 }]}
              onChangeText={(input) => this.setState({ input })}
              value={this.state.input}
              placeholder='email'
              placeholderTextColor='rgb(75,75,75)'
            /> */}