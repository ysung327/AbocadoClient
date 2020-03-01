import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from "react-native"
import { Card, Button } from 'react-native-elements'
import { Actions } from 'react-native-router-flux';

class Duty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      end_date : "2020-10-14" ,
      lefted : 227,
      percent: 61.3,
      hour : 5448,
      minute : 31,
      second : 39,

    }
  }

  componentDidMount() {
    this.getDuty()
  }

  getDuty = ()  => {
    const url = "http://ysung327.pythonanywhere.com/user/duty/";

    this.setState({ loading: true });

    fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + this.props.token,
      },
      body: JSON.stringify({
        user: this.props.user,
      })
    })
    .then(res => res.json())
    .then(res => {
          this.setState({
            end_date: res.end_date,
            lefted: res.lefted,
            percent: res.percent,
          })
          console.log(this.state.end_date, this.state.lefted)
    })
    .catch((error) => {
          console.log(error);
    })
  }
    
  render() {
    return (
      <Card containerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>전역</Text>
          <Text style={styles.end_date}>{this.state.end_date}</Text>
        </View>
        <View style={styles.header}>
          <Text style={styles.dday}>D-{this.state.lefted}</Text>
          <Text style={styles.time}>{this.state.hour}시간 {this.state.minute}분 {this.state.second}초 전</Text>
        </View>
      </Card>
    )
  }
} 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 0,
    borderColor: 'white',
    flexDirection: 'column',
    alignItems: 'center',
  },
  header:{
    alignItems: 'center',
  },
  title:{
    fontSize: 28,
  },
  end_date:{
    fontSize: 14,
  },
  dday:{
    fontSize: 36,
  },
  time:{
    fontSize: 12,
  },
})

export default Duty
