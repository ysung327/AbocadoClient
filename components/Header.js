import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Colors from '../constants/Colors'

class Header extends Component {
  render() {
      return (
        <View style={styles.header}>
        </View>
      )
  }
}

const styles = StyleSheet.create({
  header: {
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000000",
    shadowOpacity: 0.4,
    shadowRadius: 4.65,
    shadowOffset: {
      height: 0,
    },
    elevation: 4,
  },
})

export default Header
