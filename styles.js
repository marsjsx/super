import { StyleSheet, Dimensions } from 'react-native';
const { height, width } = Dimensions.get('window');

export default styles = StyleSheet.create({
  container: {
    flex: 1,
    
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  space: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: {
    alignItems: 'flex-start',
  },
  right: {
    alignItems: 'flex-end',
  },
  row: {
    flexDirection: 'row'
  },
  bold: {
    fontWeight: 'bold',
  },
  white: {
    color: '#fff',
  },
  gray: {
    color: '#adadad',
  },
  small: {
    fontSize: 10,
  },
  input: {
    width: width * .90,
    margin: 10,
    padding: 10,
    alignSelf: 'center',
    borderColor: '#d3d3d3',
    borderWidth: 1,
    borderRadius: 50,
    fontSize: 16,
  },
  facebookButton: {
    backgroundColor: '#3b5998',
    marginTop: 20,
    paddingVertical: 10,
    alignItems: 'center',
    borderColor: '#3b5998',
    borderWidth: 1,
    borderRadius: 5,
    width: 200
  },
  border: {
    width: '85%',
    margin: 10,
    padding: 15,
    fontSize: 16,
    borderColor: '#d3d3d3',
    borderBottomWidth: 1,
    textAlign: 'center'
  },
  postPhoto: {
    height: height,
    width: width,
  },
  roundImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: 10,
    backgroundColor: '#adadad'
  },
  squareLarge: {
    width: width * .33,
    height: 125,
    margin: 1,
    backgroundColor: '#d3d3d3'
  },
  cameraButton: {
    height: 100,
    width: 100,
    borderRadius: 50,
    alignSelf: 'center',
    backgroundColor: '#fff',
    marginBottom: 50
  },
  button: {
    marginTop: 20,
    paddingVertical: 10,
    alignItems: 'center',
    borderColor: '#d3d3d3',
    borderWidth: 1,
    borderRadius: 5,
    width: 200
  },
  buttonSmall: {
    margin: 10,
    marginBottom: 0,
    padding: 5,
    alignItems: 'center',
    borderColor: '#d3d3d3',
    borderWidth: 1,
    borderRadius: 5,
    width: 125
  },
  buttonLogin: {
    marginTop: 10,
    paddingTop: 11,
    paddingBottom: 11,
    width: 250,
    backgroundColor: 'rgb(121,114,187)',
    borderRadius: 20,
    borderWidth: 0,
    borderColor: '#fff'
  },
  buttonSignup: {
    marginTop: 10,
    paddingTop: 11,
    paddingBottom: 11,
    marginLeft: 10,
    marginRight: 10,
    width: 250,
    backgroundColor: 'rgb(255,255,255)',
    borderRadius: 20,
    borderWidth: 0,
    borderColor: '#fff'
  },
  buttonFacebook:{
    backgroundColor: '#3b5998',
    marginTop: 20,
    paddingVertical: 10,
    alignItems: 'center',
    borderColor: '#3b5998',
    borderWidth: 1,
    borderRadius: 20,
    width: 250
  },
  textA: {
    letterSpacing: 6,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '500',
  },
  textB: {
    letterSpacing: 6,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '500',
    textShadowOffset: {width: 1, height: 1, },
    textShadowRadius: 7,
    textShadowColor: '#000000',
  },
  textC: {
    letterSpacing: 4,
    color: 'rgb(255, 67, 35)',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
  textD: {
    letterSpacing: 1,
    color: 'rgb(255, 255, 255)',
    textAlign: 'left',
    fontWeight: '300',
    textShadowOffset: { width: 1, height: 1, },
    textShadowRadius: 7,
    textShadowColor: '#000000',
  },
  textInputA: {
    width: '85%',
    margin: 10,
    padding: 15,
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
    borderColor: '#d3d3d3',
    borderBottomWidth: 1,
    textAlign: 'center',
  },
  bottom: {
    width: width,
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 15
  },
  squareImage: {
    width: 40,
    height: 40,
    borderRadius: 0,
    marginTop: 0,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: '#adadad'
  },
});
