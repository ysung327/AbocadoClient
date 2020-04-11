import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Card, Button } from 'react-native-elements'
import { Actions } from 'react-native-router-flux';
import Colors from '../constants/Colors'
import store from "../app/store";

class VacationType extends Component {
  constructor(props) {
    super(props);
    this.state  = {
      loading: false,
      ann: null,
      con: null,
      re: null,
      pe: null,
      pr: null,
    }
  }

  update = () => {
    console.log('vacationType!')
    let arr = ["CON", "RE", "PE", "PR"]
    for (let i of arr) {
      this.getTypeInfo(i)
    }
  }

  componentDidMount() {
    store.subscribe(this.update)
    let arr = ["CON", "RE", "PE", "PR"]
    for (let i of arr) {
      this.getTypeInfo(i)
    }
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
        if (_type === "CON") {
          this.setState({
            con: res.total,
          })
        } else if (_type === "PR") {
          this.setState({
            pr: res.total,
          })
        } else if (_type === "RE") {
          this.setState({
            re: res.total,
          })
        } else if (_type === "PE") {
          this.setState({
            pe: res.total,
          })
        }
    })
    .catch((error) => {
          console.log(error);
    })
  }

  _onPress = (type_of_detail) => {
    if(type_of_detail !== 'ANN') {
      Actions.type_detail({
        type_of_detail: type_of_detail,
        lefted: this.props.lefted,
        token : this.props.token,
        user : this.props.user
      })
    }
    else {
      Actions.type_ann({
        lefted: this.props.lefted,
        token: this.props.token,
        user: this.props.user
      })
    }
  }

  render() {
    return (
      <View style={styles.container}> 
          <View style={styles.column1}>
            <Card containerStyle={styles.card}>
              <TouchableOpacity
                  onPress={()=>this._onPress('ANN')}>                  
                  <Text style={styles.text}>연가</Text>
                  <View style={{ height: 130, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 32 }}>26</Text>
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
                  <View style={{ height: 70, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 32 }}>{this.state.con}</Text>
                  </View>
                </TouchableOpacity>
              </Card>
              <Card containerStyle={styles.card}>
                <TouchableOpacity 
                  onPress={()=>this._onPress('PR')}>
                  <Text style={styles.text}>포상</Text>
                  <View style={{ height: 70, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 32 }}>{this.state.pr}</Text>
                  </View>
                </TouchableOpacity>
              </Card>             
            </View>
            <View style={styles.row}>
              <Card containerStyle={styles.card}>
                <TouchableOpacity 
                  onPress={()=>this._onPress('RE')}>
                  <Text style={styles.text}>보상</Text>
                  <View style={{ height: 70, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 32 }}>{this.state.re}</Text>
                  </View>
                </TouchableOpacity>
              </Card>
              <Card containerStyle={styles.card}>
                <TouchableOpacity 
                  onPress={()=>this._onPress('PE')}>
                  <Text style={styles.text}>청원</Text>
                  <View style={{ height: 70, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 32 }}>{this.state.pe}</Text>
                  </View>
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