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
const DUTY_MAX_HEIGHT = 200
const DUTY_MIN_HEIGHT = 75

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
    let duty = null;

    if(this.props.height>(DUTY_MAX_HEIGHT-DUTY_MIN_HEIGHT)/2) {
      duty =
        <View style={styles.sContainer}>
          <View style={styles.sHeader}>
            <Text style={styles.sText}>전역</Text>
            <Text style={styles.sDetail}>{this.state.end_date}</Text>
          </View>
          <View style={styles.sFooter}>
            <Text style={styles.sText}>D-{this.state.lefted}</Text>
            <Text style={styles.sDetail}>{this.state.hour}시간 {this.state.minute}분 {this.state.second}초 전</Text>
          </View>
        </View>
    } else {
      duty =
        <View>
          <View style={styles.header}>
            <Text style={styles.title}>전역</Text>
            <Text style={styles.end_date}>{this.state.end_date}</Text>
          </View>
          <View style={styles.progress}>
            <Text style={{position:'absolute', left: percentLeft, color: Colors.accentColor1, fontWeight: 'bold' }}>{percent}%</Text>
            <ProgressBar unfilledColor={Colors.accentColor2} color={Colors.accentColor1} borderWidth={0} width={300} height={6} progress={this.state.percent} borderRadius={10}/>
          </View>
          <View style={styles.footer}>
            <Text style={styles.dday}>D-{this.state.lefted}</Text>
            <Text style={styles.time}>{this.state.hour}시간 {this.state.minute}분 {this.state.second}초 전</Text>
          </View>
        </View>
    }

    return (
      <View style={styles.container}>
        <LinearGradient colors={[Colors.secondaryColor, Colors.primaryColor]} style={styles.gradient}>
          {duty}
        </LinearGradient>
      </View>

    )
  }
} 

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    elevation: 8,
  },
  container:{
    flex: 1,
    shadowColor: "#000000",
    shadowOpacity: 0.4,
    shadowRadius: 3,
    shadowOffset: {
      height: 6,
    },
  },
  header:{
    alignItems: 'center',
    marginTop: 10,
  },
  progress:{
    flex: 1,
    paddingTop: 20,
    alignItems: 'center',
    marginTop: 15,
  },
  footer:{
    alignItems: 'center',
    marginBottom: 20,
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

  sContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sHeader: {
    flex: 1,
    marginLeft: 20,
  },
  sFooter: {
    flex: 1,
    marginRight: 20,
  },
  sText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold'
  },
  sDetail: {
    color: 'white',
    fontSize: 10,
  }

})

export default Duty
