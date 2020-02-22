import React, { Component } from 'react';
import { StyleSheet, View, Text, Button, ScrollView, Dimensions } from 'react-native';
import VacationList from './Vacation/components/VacationList';
import VacationInfo from './Vacation/components/VacationInfo';
import VacationType from './Vacation/components/VacationType';

const { height } = Dimensions.get('window');
const token = "36be266afee56c23c07676bd414d25f4a402fad6"
export default class HomeScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
        token: token,
        user: this.props.navigation.getParam('user', 'default'),
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
      <View style={{ flex: 1, justifyContent: 'flex-start', marginHorizontal: 5 }}>
        <ScrollView
          style={{ flex: 1 }}
          scrollEnabled={scrollEnabled}
          onContentSizeChange={this.onContentSizeChange}
          contentContainerStyle={{ flexGrow: 1}}
          showsVerticalScrollIndicator={false}>

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