import React from 'react';
import firebase from 'firebase';
import { Text, View, Button, Image } from 'react-native';
import { connect } from 'react-redux'
import styles from '../styles'

class Profile extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text> Profile</Text>
        <Image
          style={{ width: 50, height: 50 }}
          source={{ uri: this.props.user.photo }}
        />
        <Text>{this.props.user.email}</Text>
        <Text>{this.props.user.username}</Text>
        <Text>{this.props.user.bio}</Text>
        <Button title='Logout' onPress={() => firebase.auth().signOut()} />
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}

export default connect(mapStateToProps)(Profile)
