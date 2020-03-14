import React, { Component } from 'react';
import { 
  StyleSheet, 
  View, 
  ScrollView, 
  Dimensions,
  Animated,
  Text,
  Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ProgressBar from 'react-native-progress/Bar';
import Colors from '../constants/Colors'
import VacationList from '../components/VacationList';
import VacationInfo from '../components/VacationInfo';
import VacationType from '../components/VacationType';
import Header from '../components/Header'


const { height } = Dimensions.get('window');
const screenWidth = Dimensions.get('window').width;
const HEADER_MAX_HEIGHT = 70
const DUTY_MAX_HEIGHT = 200
const DUTY_MIN_HEIGHT = 75
const barPadding = (screenWidth - 300) / 2
const token = "e36ea705904910cd1a9bbc76f1d62b0de16bbfdc"
const user = "ysung327"

export default class HomeScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
        token: token,
        user: user,
        screenHeight: height,
        scrollY: new Animated.Value(0),
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

  onContentSizeChange = (contentWidth, contentHeight) => {
    this.setState({ screenHeight: contentHeight });
  };


  getDuty = ()  => {
    const url = "http://ysung327.pythonanywhere.com/user/duty/";

    this.setState({ loading: true });

    fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + this.state.token,
      },
      body: JSON.stringify({
        user: this.state.user,
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

    const dutyHeight = this.state.scrollY.interpolate({
      inputRange: [0, DUTY_MAX_HEIGHT-DUTY_MIN_HEIGHT],
      outputRange: [DUTY_MAX_HEIGHT, DUTY_MIN_HEIGHT],
      extrapolate: 'clamp',
      easing: Easing.ease,
    })
    const dutyOpacity = this.state.scrollY.interpolate({
      inputRange: [30, 100],
      outputRange: [1, 0],
      extrapolate: 'clamp',
      easing: Easing.step0,
    })
    const titleLeft = this.state.scrollY.interpolate({
      inputRange: [70, DUTY_MAX_HEIGHT-DUTY_MIN_HEIGHT],
      outputRange: [screenWidth/2 - 50, 10],
      extrapolate: 'clamp',
      easing: Easing.ease,
    })
    const footerRight = this.state.scrollY.interpolate({
      inputRange: [80, DUTY_MAX_HEIGHT-DUTY_MIN_HEIGHT],
      outputRange: [screenWidth/2 -75, 10],
      extrapolate: 'clamp',
      easing: Easing.ease,
    })
    const textColor = this.state.scrollY.interpolate({
      inputRange: [120, DUTY_MAX_HEIGHT-DUTY_MIN_HEIGHT],
      outputRange: ['black', 'white'],
      extrapolate: 'clamp',
      easing: Easing.step0,
    })
    const footerFontSize = this.state.scrollY.interpolate({
      inputRange: [70, DUTY_MAX_HEIGHT-DUTY_MIN_HEIGHT],
      outputRange: [36, 28],
      extrapolate: 'clamp',
      easing: Easing.ease,
    })
    const headerPadding = this.state.scrollY.interpolate({
      inputRange: [70, DUTY_MAX_HEIGHT-DUTY_MIN_HEIGHT],
      outputRange: [23, 10],
      extrapolate: 'clamp',
      easing: Easing.ease,
    })
    const footerPadding = this.state.scrollY.interpolate({
      inputRange: [80, DUTY_MAX_HEIGHT-DUTY_MIN_HEIGHT],
      outputRange: [25, 65],
      extrapolate: 'clamp',
      easing: Easing.ease,
    })
    const percentLeft = barPadding + 300*this.state.percent - 20
    const percent = Number.parseFloat(this.state.percent*100).toFixed(2)


    return (
      <View style={{ flex: 1, justifyContent: 'flex-start'}}>
        <View style={styles.header}>
          <Header/>
        </View>
        <Animated.View style={{
          position: 'absolute',
          top: 70,
          left: 0,
          right: 0,
          height: dutyHeight,
          zIndex: 1000,
        }}>
          <View style={styles.container}>
            <LinearGradient colors={[Colors.secondaryColor, Colors.primaryColor]} style={styles.gradient} start={[0, 0.4]}>
              <Animated.View style={{
                marginTop: 10,
                width: 100,
                position: 'absolute',
                left: titleLeft,
              }}>
                <Animated.Text style={{ color: textColor, paddingLeft: headerPadding, fontSize: 28, fontWeight: 'bold' }}>전역</Animated.Text>
                <Animated.Text style={{ color: textColor, textAlign: 'center', fontSize: 14,}}>{this.state.end_date}</Animated.Text>
              </Animated.View>
              <Animated.View style={{
                flex: 1,
                paddingTop: 20,
                alignItems: 'center',
                marginTop: 80,
                opacity: dutyOpacity,
              }}>
                <Text style={{ position:'absolute', left: percentLeft, color: Colors.accentColor1, fontWeight: 'bold' }}>{percent}%</Text>
                <ProgressBar unfilledColor={Colors.accentColor2} color={Colors.accentColor1} borderWidth={0} width={300} height={6} progress={this.state.percent} borderRadius={10}/>
              </Animated.View>
              <Animated.View style={{
                bottom: 0,
                width: 150,
                position: 'absolute',
                right: footerRight,
                marginBottom: 10,
              }}>
                <Animated.Text style={{ fontSize: footerFontSize, paddingLeft: footerPadding, fontWeight: 'bold', color: 'white' }}>D-{this.state.lefted}</Animated.Text>
                <Animated.Text style={{ fontSize: 14, textAlign: 'center', color: 'white' }}>{this.state.hour}시간 {this.state.minute}분 {this.state.second}초 전</Animated.Text>
              </Animated.View>
            </LinearGradient>
          </View>
        </Animated.View>
        <ScrollView
          style={{ flex: 1 }}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {y: this.state.scrollY} } }]
          )}
          scrollEventThrottle={16}
          onContentSizeChange={this.onContentSizeChange}
          contentContainerStyle={{ flexGrow: 1}}
          showsVerticalScrollIndicator={false}
          bounces={false}>
          <View style={styles.vacationInfo}>
            <VacationInfo token={this.state.token} user={this.state.user}/>
          </View>
          <View style={styles.vacationList}>
            <VacationList token={this.state.token} user={this.state.user}/>
          </View>
          <View style={styles.vacationType}>
            <VacationType token={this.state.token} user={this.state.user}/>
          </View>
        </ScrollView>
      </View>
    )
  }
}



const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_MAX_HEIGHT,
  },

  vacationList: {
    flex: 1,
  },

  vacationInfo: {
    marginTop: DUTY_MAX_HEIGHT + HEADER_MAX_HEIGHT,
    height: 180,
    marginBottom: 20,
    marginRight: 25,
    marginLeft: 15,
  },

  vacationType: {
    flex: 1,
    marginTop: 20,
    marginRight: 25,
    marginLeft: 15,
  },

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
})