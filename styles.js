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
  border2: {
    width: width,
    marginBottom: 0,
    padding: 15,
    fontSize: 16,
    borderColor: '#d3d3d3',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    textAlign: 'left'
  },
  border3: {
    width: '75%',
    marginBottom: 0,
    padding: 15,
    fontSize: 16,
    borderColor: '#d3d3d3',
    borderBottomWidth: 1,
    textAlign: 'left'
  },
  postPhoto: {
    height: height * .95,
    width: width,
  },
  postPhotoPreview: {
    height: height * .33,
    width: width * .33,
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
  buttonMessage: {
    
  },
  buttonLogin: {
    marginTop: 10,
    paddingTop: 11,
    paddingBottom: 11,
    width: 250,
    backgroundColor: 'rgb(237, 132, 197)',
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
  buttonCircle: {
    marginTop: -50,
    marginBottom: 0,
    marginLeft: 1,
    marginRight: 1,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgb(81, 137, 226)',
    borderColor: '#d3d3d3',
    borderWidth: 1,
    borderRadius: 50,
    width: 62.5,
    height: 62.5,
    zIndex: 100,
  },
  buttonSave: {
    paddingTop: 11,
    paddingBottom: 11,
    width: 125,
    backgroundColor: 'rgba(255,255,255,0)',
    borderRadius: 20,
    borderWidth: 0,
    borderColor: '#fff'
  },
  buttonLogout: {
    marginTop: -50,
    marginBottom: 0,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#d3d3d3',
    borderWidth: 1,
    borderRadius: 50,
    width: 62.5,
    height: 62.5,
    zIndex: 100,
  },
  buttonShare: {
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'rgba(255,255,255,0)',
    borderWidth: 0,
    width: 70,
    height: 20,
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
  textE: {
    letterSpacing: 1,
    color: 'rgb(255, 255, 255)',
    textAlign: 'left',
    fontWeight: '100',
    fontSize: 10,
    textShadowOffset: { width: 1, height: 1, },
    textShadowRadius: 7,
    textShadowColor: '#000000',
  },
  textF: {
    color: 'rgb(55, 55, 55)',
    textAlign: 'center',
    fontWeight: '200',
  },
  textG: {
    color: 'rgb(2, 2, 2)',
    textAlign: 'left',
    textAlignVertical: 'center',
    fontWeight: '400',
    fontSize: 16,
  },
  textH: {
    marginTop: '6%',
    marginLeft: '3%',
    letterSpacing: 2,
    color: 'rgb(255, 67, 35)',
    textAlign: 'left',
    fontWeight: '600',
    fontSize: 16,
  },
  textW: {
    color: 'rgb(255, 255, 255)',
    textAlign: 'center',
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
    width: 60,
    height: 60,
    borderRadius: 0,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: '#adadad'
  },
  logoHeader:{
    marginLeft: width/5,
  },
  profilePhoto: {
    height: height * .92,
    width: width,
  },
  profileEditPhoto: {
    height: height * .80,
    width: width,
  },
  profileLogo: {
    marginLeft: width/2.5,
    width: 50,
    height: 50,
  },
  followBar: {
    paddingHorizontal: '25%', 
    paddingVertical: 10,
    marginTop: 75, 
    marginBottom: 0, 
    backgroundColor: 'rgba(255,255,255,1)', 
    width: '100%',
  },
  profileInfo: {
    paddingHorizontal: 20, 
  },
  topLine: {
    borderTopWidth: 1,
    borderTopColor: 'rgb(255,255,255)',
    width: width,
  },
  dropDown: {
    width: width,
  },
  postShare:{
    flex: 1,
    marginTop: 20,
    height: '5%',
    width: width,
    borderBottomWidth: 0.5,
    borderColor: 'rgba(150,150,150,0.9)',
  },
  chatBlue:{
    backgroundColor: 'rgb(66, 176, 255)',
    borderColor: 'rgb(66, 176, 255)',
    borderRadius: 30,
  },
  chatWhite: {
    borderWidth: .5,
    borderColor: 'rgb(1, 1, 1)',
    borderRadius: 30,
  },
});
 