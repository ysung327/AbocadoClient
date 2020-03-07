import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from "react-native"
import { Card, Button } from 'react-native-elements'
import { Actions } from 'react-native-router-flux';
import Colors from '../constants/Colors'
import { LinearGradient } from 'expo-linear-gradient';
import ProgressBar from 'react-native-progress/Bar';
import { Dimensions } from 'react-native';


const screenWidth = Dimensions.get('window').width;
const barPadding = (screenWidth - 300) / 2

class Duty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      end_date : "" ,
      lefted : null,
      percent: null,
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
          console.log(this.state.end_date, this.state.percent)
    })
    .catch((error) => {
          console.log(error);
    })
  }
    
  render() {
    const percentLeft = barPadding + 300*this.state.percent - 20
    const percent = Number.parseFloat(this.state.percent*100).toFixed(2)
    
    return (
      <LinearGradient colors={[Colors.secondaryColor, Colors.primaryColor]} style={styles.gradient}>
        <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.title}>전역</Text>
              <Text style={styles.end_date}>{this.state.end_date}</Text>
            </View>
            <View style={styles.progress}>
              <Text style={{position:'absolute', left: percentLeft}}>{percent}%</Text>
              <ProgressBar unfilledColor={Colors.accentColor2} color={Colors.accentColor1} borderWidth={0} width={300} height={6} progress={this.state.percent} borderRadius={10}/>
            </View>
            
            <View style={styles.footer}>
              <Text style={styles.dday}>D-{this.state.lefted}</Text>
              <Text style={styles.time}>{this.state.hour}시간 {this.state.minute}분 {this.state.second}초 전</Text>
            </View>
        </View>
      </LinearGradient>
    )
  }
} 

const styles = StyleSheet.create({
  gradient: {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  container: {
    flex: 1,
    paddingBottom: 20,
    flexDirection: 'column',
  },
  header:{
    alignItems: 'center',
  },
  progress:{
    flex: 1,
    paddingTop: 20,
    alignItems: 'center',
    marginVertical: 10,
  },
  footer:{
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
    fontWeight: 'bold',
    color: 'white'
  },
  time:{
    fontSize: 12,
    color: 'white'
  },
})

export default Duty
