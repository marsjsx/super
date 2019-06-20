import React from 'react'
import styles from '../styles'
import firebase from 'firebase'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Text, View, TextInput, TouchableOpacity, Image, ImageBackground, Slider } from 'react-native';
import { updateEmail, updatePassword, login, getUser, facebookLogin } from '../actions/user';

class Filter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      miles: 25,
      ageMin: 25,
      ageMax: 25,
      values: [22, 35],
      imgStyle: styles.buttonFilter,
      imgStyle2: styles.buttonFilter,
      imgStyle3: styles.buttonFilter,
    };
  }

  filterSelect = () => {
    {
      this.state.imgStyle === styles.buttonFilter ?
      this.setState({
        imgStyle: styles.buttonSelected,
      })
      :
      this.setState({
        imgStyle: styles.buttonFilter,
      })
    }
  };
  filterSelect2 = () => {
    {
      this.state.imgStyle2 === styles.buttonFilter ?
        this.setState({
          imgStyle2: styles.buttonSelected,
        })
        :
        this.setState({
          imgStyle2: styles.buttonFilter,
        })
    }
  };
  filterSelect3 = () => {
    {
      this.state.imgStyle3 === styles.buttonFilter ?
        this.setState({
          imgStyle3: styles.buttonSelected,
        })
        :
        this.setState({
          imgStyle3: styles.buttonFilter,
        })
    }
  };
  render() {
    return (
      <ImageBackground source={require('../temp/filterBG.png')} style={[styles.container, { alignItems: 'center' }]}>
        <Text style={[styles.textA, { marginTop: 55 }]}>Filter</Text>
        <TouchableOpacity style={{ marginTop: 70 }}>
          <Text style={styles.textJ}>My Current Location</Text>
        </TouchableOpacity>
        <View style={{ width: '100%', marginTop: 35 }}>
          <Text style={[styles.textK, { textAlign: 'left', marginLeft: 30 }]}>Show Me</Text>
        </View>
        <TouchableOpacity style={this.state.imgStyle} onPress={this.filterSelect}>
          <Text style={styles.textA}>guys</Text></TouchableOpacity>
        <TouchableOpacity style={this.state.imgStyle2} onPress={this.filterSelect2}>
          <Text style={styles.textA}>girls</Text></TouchableOpacity>
        <TouchableOpacity style={this.state.imgStyle3} onPress={this.filterSelect3}>
          <Text style={styles.textA}>lgbtq</Text></TouchableOpacity>
        <View style={{ width: '100%', marginTop: 35 }}>
          <Text style={[styles.textK, { textAlign: 'left', marginLeft: 30 }]}>Search distance</Text>
        </View>
        <Slider
          style={{
            marginTop: 25,
            width: 200,
            transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }]
          }}
          step={1}
          minimumValue={1}
          maximumValue={50}
          value={this.state.miles}
          onValueChange={val => this.setState({ miles: val })}
          thumbTintColor={"rgb(61, 180, 226)"}
          maximumTrackTintColor={"#fff"}
          minimumTrackTintColor={"#fff"}
        />
        <Text style={[styles.textK, { marginTop: 10 }]}>{this.state.miles} Miles</Text>
        
        <TouchableOpacity style={[styles.buttonLogin2, { marginTop: 55 }]} onPress={() => this.props.navigation.goBack()}>
          <Text style={styles.textA}>search</Text></TouchableOpacity>
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

export default connect(mapStateToProps, mapDispatchToProps)(Filter)