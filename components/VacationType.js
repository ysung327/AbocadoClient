import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Card, Button } from 'react-native-elements'
import { Actions } from 'react-native-router-flux';
import Colors from '../constants/Colors'

class VacationType extends Component {
  constructor(props) {
    super(props);
  }

  _onPress = (type) => {
    console.log(type)
    Actions.type_detail({type_of_detail: type,
      token : this.props.token, user : this.props.user})
  }

  render() {
      return (
        <View style={styles.container}> 
            <View style={styles.column1}>
              <Card containerStyle={styles.card}>
                <TouchableOpacity 
                    onPress={()=>this._onPress('ANN')}>
                  <Text style={styles.text}>연가</Text>
                </TouchableOpacity>
              </Card>
            </View>
            <View style={styles.column2}>
              <View style={styles.row}>
                <Card containerStyle={styles.card}>
                  <TouchableOpacity 
                    onPress={()=>this._onPress('CON')}>
                    <Text style={styles.text}>위로</Text>
                  </TouchableOpacity>
                </Card>
                <Card containerStyle={styles.card}>
                  <TouchableOpacity 
                    onPress={()=>this._onPress('PR')}>
                    <Text style={styles.text}>포상</Text>
                  </TouchableOpacity>
                </Card>             
              </View>
              <View style={styles.row}>
                <Card containerStyle={styles.card}>
                  <TouchableOpacity 
                    onPress={()=>this._onPress('RE')}>
                    <Text style={styles.text}>보상</Text>
                  </TouchableOpacity>
                </Card>
                <Card containerStyle={styles.card}>
                  <TouchableOpacity 
                    onPress={()=>this._onPress('PE')}>
                    <Text style={styles.text}>청원</Text>
                  </TouchableOpacity>
                </Card>             
              </View>
            </View>
        </View>
      )
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  column1: {
    flex: 1,
  },
  column2: {
    flex: 2,
    flexDirection: 'column',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  card: {
    flex: 1,
    borderRadius: 10,
    paddingTop: 5,
    margin: 5,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  text: {    
    position: 'absolute',
    fontSize: 12, 
    color: Colors.accentColor2,
  }
})

export default VacationType