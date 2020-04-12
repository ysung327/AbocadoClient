import React, { Component } from 'react';
import { View, ActivityIndicator, StatusBar } from 'react-native';
import { AsyncStorage } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from "react-redux";
import { login } from '../app/reducer'
import store from "../app/store";


function mapDispatchToProps(dispatch) {
  return {
    login: userInfo => dispatch(login(userInfo))
  };
}

class ConnectedAuthLoadingScreen extends Component {
  constructor(props) {
    super(props);
    this._retrieveData ();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _retrieveData  = async () => {
    try {
      const token = await AsyncStorage.getItem('token')
      const user = await AsyncStorage.getItem('user')
      const userInfo = {
        token: token,
        user: user,
      }
      if(token !== null) {
        this.props.login(userInfo)
        Actions.vacation()
        console.log('토큰 있음')
      }
      else { 
        Actions.auth()
        console.log('토큰 없음')
      }
    } catch(e) {
      // error reading value
    }
  }


  // Render any loading content that you like here
  render() {
    return (
      <View>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

const AuthLoadingScreen = connect(
  null,
  mapDispatchToProps
)(ConnectedAuthLoadingScreen);

export default AuthLoadingScreen