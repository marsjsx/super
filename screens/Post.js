import React from 'react';
import styles from '../styles'
import ENV from '../env';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { ImagePicker, Location, Permissions } from 'expo';
import { NavigationEvents } from 'react-navigation';
import { updateDescription, updateLocation, uploadPost, updatePhoto } from '../actions/post'
import { FlatList, Modal, SafeAreaView, Text, View, TextInput, Image, TouchableOpacity, ScrollView, Picker } from 'react-native';
const GOOGLE_API = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json'
import { uploadPhoto } from '../actions/index'
import { Dropdown } from 'react-native-material-dropdown';

class Post extends React.Component {
  state = {
    showModal: false,
    locations: [],
    language: "",
  }

  componentDidMount() {
    this.getLocations()
  }

  post = () => {
    this.props.uploadPost()
    this.props.navigation.navigate('Home')
  }

  onWillFocus = () => {
    if (!this.props.post.photo) {
      this.openLibrary()
    }
  }

  openLibrary = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL)
    if (status === 'granted') {
      const image = await ImagePicker.launchImageLibraryAsync()
      if (!image.cancelled) {
        const url = await this.props.uploadPhoto(image)
        this.props.updatePhoto(url)
      }
    }
  }

  setLocation = (location) => {
    const place = {
      name: location.name,
      coords: {
        lat: location.geometry.location.lat,
        lng: location.geometry.location.lng
      }
    }
    this.setState({ showModal: false })
    this.props.updateLocation(place)
  }

  getLocations = async () => {
    const permission = await Permissions.askAsync(Permissions.LOCATION)
    if (permission.status === 'granted') {
      const location = await Location.getCurrentPositionAsync()
      const url = `${GOOGLE_API}?location=${location.coords.latitude},${location.coords.longitude}&rankby=distance&key=${ENV.googleApiKey}`
      const response = await fetch(url)
      const data = await response.json()
      this.setState({ locations: data.results })
    }
  }

  render() {
    let data = [{
      value: 'Stephen Maynard',
    }, {
      value: 'Brian Helm',
    }, {
      value: 'Pat Hustad',
    }, {
      value: 'Clarissa Martinez',
    }];
    let dataLoc = [{
      value: 'Pacific City',
    }, {
      value: 'RC Cafe',
    }, {
      value: 'Pub House',
    }, {
      value: 'Left Coast Brewing',
    }];
    return (
      <ScrollView style={{ height: '100%' }}><View style={[styles.container, styles.center, {marginBottom: 60}]}>
        <NavigationEvents onWillFocus={this.onWillFocus} />
        <Modal animationType='slide' transparent={false} visible={this.state.showModal}>
          <SafeAreaView style={[styles.container, styles.center]}>
            <FlatList
              keyExtractor={(item) => item.id}
              data={this.state.locations}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.border} onPress={() => this.setLocation(item)}>
                  <Text style={styles.gray}>{item.name}</Text>
                  <Text style={styles.gray}>{item.vicinity}</Text>
                </TouchableOpacity>
              )} />
          </SafeAreaView>
        </Modal>
        <Image style={styles.postPhotoPreview} source={{ uri: this.props.post.photo }} />

          <TextInput
            multiline={true}
            style={[styles.border2,{textAlignVertical:'top', textAlign: 'left', marginBottom: 0, height:'20%'}]}
            value={this.props.post.description}
            onChangeText={text => this.props.updateDescription(text)}
            placeholder='Write a caption...'
          />
        
        {
          this.state.locations.length > 0 ?
            <TouchableOpacity style={styles.border} onPress={() => this.setState({ showModal: true })}>
              <Text style={styles.gray}>{this.props.post.location ? this.props.post.location.name : 'Add a Location'}</Text>
            </TouchableOpacity> : null
        }
        
        <Dropdown label='Tag People' data={data} containerStyle={styles.dropDown}/>
        <Dropdown label='Add Location' data={dataLoc} containerStyle={styles.dropDown} />
        <View style={[styles.postShare, styles.row, styles.space]}>
          <Text style={[styles.left,{ color: 'rgba(150,150,150,0.9)' }]}>Facebook</Text>
          <TouchableOpacity style={[styles.buttonShare, styles.right]}>
            <Text style={[{ color: 'rgba(244,66,66,0.9)' }]}>SHARE</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.postShare, styles.row, styles.space]}>
          <Text style={[styles.left, { color: 'rgba(150,150,150,0.9)' }]}>Twitter</Text>
          <TouchableOpacity style={[styles.buttonShare, styles.right]}>
            <Text style={[{ color: 'rgba(244,66,66,0.9)' }]}>SHARE</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.button} onPress={this.post}>
          <Text>Post</Text>
        </TouchableOpacity>
      </View></ScrollView>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ updateDescription, uploadPost, updateLocation, uploadPhoto, updatePhoto }, dispatch)
}

const mapStateToProps = (state) => {
  return {
    post: state.post,
    user: state.user
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Post)
