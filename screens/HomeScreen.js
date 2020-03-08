import React, { Component } from 'react';
import { 
  StyleSheet, 
  View, 
  ScrollView, 
  Dimensions,
  Animated,
} from 'react-native';
import VacationList from '../components/VacationList';
import VacationInfo from '../components/VacationInfo';
import VacationType from '../components/VacationType';
import Duty from '../components/Duty';
import Header from '../components/Header'


const { height } = Dimensions.get('window');
const HEADER_MAX_HEIGHT = 70
const DUTY_MAX_HEIGHT = 200
const DUTY_MIN_HEIGHT = 75
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
    }
  }

  onContentSizeChange = (contentWidth, contentHeight) => {
    this.setState({ screenHeight: contentHeight });
  };

  render() {

    const dutyHeight = this.state.scrollY.interpolate({
      inputRange: [0, DUTY_MAX_HEIGHT-DUTY_MIN_HEIGHT],
      outputRange: [DUTY_MAX_HEIGHT, DUTY_MIN_HEIGHT],
      extrapolate: 'clamp'
    })

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
          <Duty height={dutyHeight} token={this.state.token} user={this.state.user}/>
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
})