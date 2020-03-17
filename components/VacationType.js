import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Card, Button } from 'react-native-elements'
import { Actions } from 'react-native-router-flux';
import Colors from '../constants/Colors'

class VacationType extends Component {
  constructor(props) {
    super(props);
    this.state  = {
      loading: false,
      ann: [],
      con: [],
      re: [],
      pe: [],
      pr: [],
    }
  }
  
  componentDidMount() {
    let arr = ["ANN", "CON", "RE", "PE", "PR"]
    for (i of arr) {
      this.getTypeInfo(arr)
  }

  getTypeInfo = (_type)  => {
    const url = "http://ysung327.pythonanywhere.com/vacations/type/info/";

    this.setState({ loading: true });

    fetch(url, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + this.props.token,
      },
      body: JSON.stringify({
        user: this.props.user,
        type_of_detail: _type
      })
    })
    .then(res => res.json())
    .then(res => {
        if (_type === "ANN") {
          this.setState({
            ann: res,
          })
          console.log(this.state.ann)
        } else if (_type === "CON") {
          this.setState({
            con: res,
          })
        } else if (_type === "PR") {
          this.setState({
            pr: res,
          })
        } else if (_type === "RE") {
          this.setState({
            re: res,
          })
        } else if (_type === "PE") {
          this.setState({
            pe: res,
          })
        }
    })
    .catch((error) => {
          console.log(error);
    })
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
                  <View>
                    <Text style={styles.text}>연가</Text>
                    <Text style={{ fontSize: 32, top: 45, left: 15 }}>26</Text>                  
                  </View>
                </TouchableOpacity>
              </Card>
            </View>
            <View style={styles.column2}>
              <View style={styles.row}>
                <Card containerStyle={styles.card}>
                  <TouchableOpacity 
                    onPress={()=>this._onPress('CON')}>
                    <Text style={styles.text}>위로</Text>
                    <Text style={{ fontSize: 32, top: 13, left: 15 }}>20</Text>
                  </TouchableOpacity>
                </Card>
                <Card containerStyle={styles.card}>
                  <TouchableOpacity 
                    onPress={()=>this._onPress('PR')}>
                    <Text style={styles.text}>포상</Text>
                    <Text style={{ fontSize: 32, top: 13, left: 15 }}>20</Text>
                  </TouchableOpacity>
                </Card>             
              </View>
              <View style={styles.row}>
                <Card containerStyle={styles.card}>
                  <TouchableOpacity 
                    onPress={()=>this._onPress('RE')}>
                    <Text style={styles.text}>보상</Text>
                    <Text style={{ fontSize: 32, top: 13, left: 15 }}>20</Text>
                  </TouchableOpacity>
                </Card>
                <Card containerStyle={styles.card}>
                  <TouchableOpacity 
                    onPress={()=>this._onPress('PE')}>
                    <Text style={styles.text}>청원</Text>
                    <Text style={{ fontSize: 32, top: 13, left: 15 }}>20</Text>
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
    top: 0,
    fontSize: 12, 
    color: Colors.accentColor2,
  }
})

export default VacationType