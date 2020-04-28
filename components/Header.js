import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, AsyncStorage } from 'react-native';
import { Icon } from 'react-native-elements'
import Colors from '../constants/Colors'
import { Actions } from 'react-native-router-flux';

class Header extends Component {

  onHome = () => {
    Actions.home()
  }

  onPerson = () => {
    Alert.alert(
      '개발중입니다!',
      '조금만 기다려주세요.',
      [
        {text: '확인', style: 'cancel'},
      ],
      { cancelable: false }
    )
  }

  logout = async () => {
    await AsyncStorage.removeItem('token')
    await AsyncStorage.removeItem('user')
    Actions.auth()
  }

  render() {
      return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <View style={{  flexDirection: 'row', justifyContent: 'space-between', marginTop: 15, marginHorizontal: '5%',paddingBottom: '3%', borderBottomWidth: 2, borderBottomColor: Colors.backgroundColor }}>
            <Icon name="md-home" type="ionicon" size={30} color={Colors.backgroundColor} onPress={()=>this.onHome()}/>
            <Icon name="md-add-circle" type="ionicon" size={30} color={Colors.backgroundColor} onPress={()=>this.onPerson()}/>
            <Icon name="md-person" type="ionicon" size={30} color={Colors.backgroundColor} onPress={()=>this.logout()}/>
          </View>
        </View>

      )
  }
}


export default Header
