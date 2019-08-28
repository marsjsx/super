import React from 'react';
import styles from '../styles'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { View, Text, SafeAreaView, TextInput, FlatList, Image, TouchableOpacity, ScrollView } from 'react-native';
import db from '../config/firebase';
import { getUser } from '../actions/user';
import { getPosts } from '../actions/post';
import { Ionicons, FontAwesome } from '@expo/vector-icons';

class Search extends React.Component {
  state = {
    search: '',
    query: []
  }
  
  componentDidMount() {
    this.props.getPosts()
  }

  searchUser = async () => {
    let search = []
    const query = await db.collection('users').where('username', '>=', this.state.search).get()
    query.forEach((response) => {
      search.push(response.data())
    })
    this.setState({ query: search })
  }

  goToUser = (user) => {
    this.props.getUser(user.uid)
    this.props.navigation.navigate('Profile')
  }

  render() {
    
    return (
      <ScrollView><SafeAreaView style={styles.container}>
        <View style={[styles.container, styles.row, styles.center,{ marginTop: 40 }]}>
          <TextInput
            style={[styles.inputSearch]}
            onChangeText={(search) => this.setState({ search })}
            value={this.state.search}
            returnKeyType='send'
            placeholder='Search'
            onSubmitEditing={this.searchUser} />
          <TouchableOpacity onPress={() => this.props.navigation.navigate('Filter')}>
          {/*<TouchableOpacity> */}
            <FontAwesome style={{ color: 'rgb(75,75,75)' }} name={'sliders'} size={45} />
          </TouchableOpacity>
          </View>
        
        <FlatList
          initialNumToRender='20'
          maxToRenderPerBatch='20'
          windowSize={20}
          data={this.state.query}
          keyExtractor={(item) => JSON.stringify(item.uid)}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => this.goToUser(item)} style={[styles.row, styles.space]}>
              <Image style={styles.roundImage} source={{ uri: item.photo }} />
              <View style={[styles.container, styles.left]}>
                <Text style={styles.bold}>{item.username}</Text>
                <Text style={styles.gray}>{item.bio}</Text>
              </View>
            </TouchableOpacity>
          )} />
        
        <View style={{marginTop: 20}}>
          <FlatList
            initialNumToRender= '12'
            maxToRenderPerBatch= '12'
            windowSize={12}
            style={{ paddingTop: 10 }}
            horizontal={false}
            numColumns={3}
            data={this.props.post.feed}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => 
              <TouchableOpacity onPress={() => this.goToUser(item)}><Image style={styles.squareLarge} source={{ uri: item.postPhoto }} /></TouchableOpacity>
            } />
        </View>
      </SafeAreaView></ScrollView>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ getUser, getPosts }, dispatch)
}

const mapStateToProps = (state) => {
  return {
    post: state.post,
    user: state.user
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Search)