import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Colors from '../constants/Colors'

class Header extends Component {
  render() {
      return (
        <View style={styles.header}>
          <Text style={styles.title}>header</Text>
        </View>
      )
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.primaryColor,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    color: 'white',
  }
})

export default Header
