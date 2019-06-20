import React from 'react';
import styles from '../styles'
import { ImageBackground } from 'react-native';

class Pay extends React.Component {

  render() {
    return (
      <ImageBackground style={styles.postPhoto} source={require('../temp/dash.png')} />
    );
  }
}

export default (Pay)