import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Dimensions } from 'react-native';
import VacationList from '../components/VacationList';
import VacationInfo from '../components/VacationInfo';
import VacationType from '../components/VacationType';
import Duty from '../components/Duty';

const { height } = Dimensions.get('window');
const token = "e36ea705904910cd1a9bbc76f1d62b0de16bbfdc"
const user = "ysung327"
export default class HomeScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
        token: token,
        user: user,
        screenHeight: height,
    }
  }

  onContentSizeChange = (contentWidth, contentHeight) => {
    this.setState({ screenHeight: contentHeight });
  };
  


  render() {
    const scrollEnabled = this.state.screenHeight > (height - 60);
    console.log(this.state.token)
    return (
      <View style={{ flex: 1, justifyContent: 'flex-start'}}>
        <ScrollView
          style={{ flex: 1 }}
          scrollEnabled={scrollEnabled}
          onContentSizeChange={this.onContentSizeChange}
          contentContainerStyle={{ flexGrow: 1}}
          showsVerticalScrollIndicator={false}>
          <View style={styles.duty}>
            <Duty token={this.state.token} user={this.state.user}/>
          </View>
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
  duty: {
    flex: 1,
  },
  vacationList: {
    flex: 1,
  },

  vacationInfo: {
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