import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Card, Button } from 'react-native-elements'
import { Actions } from 'react-native-router-flux';

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
    justifyContent: 'center',
    margin: 0,
  },
  text: {
    fontSize: 25,
    textAlign: 'center',
  }
})

export default VacationType