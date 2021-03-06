import React, { Component } from 'react';
import { StyleSheet,  View, ScrollView, Dimensions, Animated, Text, Easing, BackHandler, ToastAndroid } from 'react-native';
import { Card, Button, Icon } from 'react-native-elements'
import { LinearGradient } from 'expo-linear-gradient';
import ProgressBar from 'react-native-progress/Bar';
import Colors from '../constants/Colors'
import VacationList from '../components/VacationList';
import VacationInfo from '../components/VacationInfo';
import VacationType from '../components/VacationType';
import Header from '../components/Header'
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import store from "../app/store";
import { update } from '../app/reducer'
import { AppLoading } from 'expo';
import * as Font from 'expo-font';

let customFonts = {
  'BlackHanSans': require('../fonts/BlackHanSans-Regular.ttf'),
  'MyriadPro': require('../fonts/Myriad-Pro_31655.ttf'),
  'NanumSquare': require('../fonts/NanumSquare_acB.ttf'),
};

const { height } = Dimensions.get('window');
const screenWidth = Dimensions.get('window').width;
const HEADER_MAX_HEIGHT = 70
const DUTY_MAX_HEIGHT = 270
const DUTY_MIN_HEIGHT = 145
const SCROLL_THERSHOLD = 13
const barPadding = (screenWidth - 300) / 2

const mapStateToProps = (state) => {
  return {
    userInfo : state.userInfo
  }
}

class ConnectedHomeScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
        screenHeight: height,
        scrollY: new Animated.Value(0),
        end_date : "" ,
        lefted : null,
        percent: null,
        hour : 5448,
        minute : 31,
        second : 39,
        newVacationId: null,
        fontsLoaded: false,
        exitApp: false
    }
  }


  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  update = () => {
    let currentState = store.getState()
    this.getDuty()
  }

  componentDidMount() {
    this._loadFontsAsync();
    this.getDuty()
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  componentWillUnmount() {
    this.exitApp = false
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }
  
  handleBackButton = () => {
    // 2000(2초) 안에 back 버튼을 한번 더 클릭 할 경우 앱 종료
    if (!this.state.exitApp) {
      ToastAndroid.show('한번 더 누르시면 종료됩니다.', ToastAndroid.SHORT);
      this.timeout = setTimeout(() => {
        this.setState({
        exitApp: true
      })}, 2000);
    } else {
      clearTimeout(this.timeout);
      BackHandler.exitApp()  // 앱 종료
    }
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
        'Authorization': 'Token ' + this.props.userInfo.token,
      },
      body: JSON.stringify({
        user: this.props.userInfo.user,
      })
    })
    .then(res => res.json())
    .then(res => {
      this.setState({
        end_date: res.end_date,
        lefted: res.lefted,
        percent: res.percent,
      })
    })
    .catch((error) => {
          console.log(error);
    })
  }

  _createVacation = () => {
    const url = "http://ysung327.pythonanywhere.com/vacations/create/"
    fetch(url, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + this.props.userInfo.token,
      },        
      body: JSON.stringify({
        user: this.props.userInfo.user
      })
    })
    .then(res => res.json())
    .then(res => {
      this.setState({
        newVacationId: res.id
      })
    })
    setTimeout(()=>{
      Actions.detail({onUpload: this.props.onUpload,
        id : this.state.newVacationId, token : this.props.userInfo.token, user : this.props.userInfo.user})
    }, 500)

  }

  render() {

    const dutyHeight = this.state.scrollY.interpolate({
      inputRange: [0, SCROLL_THERSHOLD],
      outputRange: [DUTY_MAX_HEIGHT, DUTY_MIN_HEIGHT],
      extrapolate: 'clamp',
      easing: Easing.ease,
    })
    const dutyOpacity = this.state.scrollY.interpolate({
      inputRange: [0, SCROLL_THERSHOLD],
      outputRange: [1, 0],
      extrapolate: 'clamp',
      easing: Easing.ease,
    })
    const titleLeft = this.state.scrollY.interpolate({
      inputRange: [0, SCROLL_THERSHOLD],
      outputRange: [screenWidth/2 - 50, 10],
      extrapolate: 'clamp',
      easing: Easing.ease,
    })
    const footerRight = this.state.scrollY.interpolate({
      inputRange: [0, SCROLL_THERSHOLD],
      outputRange: [screenWidth/2 - 75, 10],
      extrapolate: 'clamp',
      easing: Easing.ease,
    })
    const footerFontSize = this.state.scrollY.interpolate({
      inputRange: [0, SCROLL_THERSHOLD],
      outputRange: [36, 28],
      extrapolate: 'clamp',
      easing: Easing.ease,
    })
    const headerPadding = this.state.scrollY.interpolate({
      inputRange: [0, SCROLL_THERSHOLD],
      outputRange: [27, 10],
      extrapolate: 'clamp',
      easing: Easing.ease,
    })
    const footerPadding = this.state.scrollY.interpolate({
      inputRange: [0, SCROLL_THERSHOLD],
      outputRange: [26, 60],
      extrapolate: 'clamp',
      easing: Easing.ease,
    })
    const scrollMarginTop = this.state.scrollY.interpolate({
      inputRange: [0, SCROLL_THERSHOLD],
      outputRange: [DUTY_MAX_HEIGHT + 40, DUTY_MIN_HEIGHT + 50],
      extrapolate: 'clamp',
      easing: Easing.ease,
    })
    const percentLeft = barPadding + 300*this.state.percent - 20
    const percent = Number.parseFloat(this.state.percent*100).toFixed(2)
    if (this.state.fontsLoaded) {
      return (
        <View style={{ flex: 1, justifyContent: 'flex-start' }}>
          <Animated.View style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            height: dutyHeight,
          }}>
            <View style={styles.container}>
              <LinearGradient colors={[Colors.secondaryColor, Colors.primaryColor]} style={styles.gradient}>
                <View style={styles.header}>
                  <Header/>
                </View>
                <Animated.View style={{
                  marginTop: 10,
                  marginBottom: 10,
                  width: 100,
                  left: titleLeft,
                }}>
                  <Animated.View style={{  paddingLeft: headerPadding }}>
                    <Text style={{ color: 'white', fontSize: 28, fontFamily: 'BlackHanSans' }}>전역</Text>
                  </Animated.View>
                  <Text style={{ color: 'white', textAlign: 'center', fontSize: 14, fontFamily: 'BlackHanSans' }}>{this.state.end_date}</Text>
                </Animated.View>
                <Animated.View style={{
                  flex: 1,
                  paddingTop: 20,
                  alignItems: 'center',
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
                  marginTop: 10,
                  marginBottom: 10,
                }}>
                  <Animated.Text style={{ fontSize: footerFontSize, paddingLeft: footerPadding, fontWeight: 'bold', color: 'white' }}>D-{this.state.lefted}</Animated.Text>
                  <Text style={{ fontSize: 14, textAlign: 'center', color: 'white' }}>{this.state.hour}시간 {this.state.minute}분 {this.state.second}초 전</Text>
                </Animated.View>
              </LinearGradient>
            </View>
          </Animated.View>
          
          <ScrollView
            style={{ flex: 1, zIndex: 0 }}
            onScroll={Animated.event(
              [{nativeEvent: {contentOffset: {y: this.state.scrollY} } }]
            )}
            scrollEventThrottle={16}
            contentContainerStyle={{ flexGrow: 1}}
            showsVerticalScrollIndicator={false}
            bounces={false}>
            <Animated.View style={{
              marginTop: scrollMarginTop,
              height: 120,
              marginBottom: 20,
            }}>
              <View style={{ alignItems: 'center', marginBottom: 5 }}>
                <Text style={{ fontSize: 20, fontFamily: 'BlackHanSans' }}>나의 휴가</Text>
              </View>
              <VacationInfo token={this.props.userInfo.token} user={this.props.userInfo.user}/>
            </Animated.View>
            <View style={styles.vacationList}>
              <View style={{ alignItems: 'center', marginBottom: 5 }}>
                <Text style={{ fontSize: 20 }}>등록한 휴가</Text>
                <View style={{ position: 'absolute', right:25 }}>
                  <Icon name="md-add-circle" type='ionicon' size={30} color={Colors.secondaryColor} onPress={this._createVacation}/>
                </View> 
              </View>
              <VacationList token={this.props.userInfo.token} user={this.props.userInfo.user}/>
            </View>
            <View style={styles.vacationType}>
              <View style={{ alignItems: 'center', marginBottom: 10 }}>
                <Text style={{ fontSize: 20, }}>보유한 휴가</Text>
              </View>
              <VacationType token={this.props.userInfo.token} user={this.props.userInfo.user} lefted={this.state.lefted}/>
            </View>
            <Animated.View style={{ height: 200 }}></Animated.View>
          </ScrollView>
        </View>
      )
    }
    else {
      return <AppLoading/>;
    }
  }
}

const HomeScreen = connect(mapStateToProps)(ConnectedHomeScreen);
export default HomeScreen;


const styles = StyleSheet.create({
  header: {
    height: HEADER_MAX_HEIGHT,
  },

  vacationList: {
    flex: 1,
    marginTop: 20,
  },

  vacationType: {
    flex: 1,
    marginHorizontal: 10,
    height: 185,
    marginTop: 20,
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
    fontFamily: 'NanumSquare',
    flex: 1,
    shadowColor: "#000000",
    shadowOpacity: 0.4,
    shadowRadius: 3,
    shadowOffset: {
      height: 6,
    },
  },
})