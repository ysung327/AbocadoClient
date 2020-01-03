import React, { Component } from 'react';
import { StyleSheet, View, Text, Button, ScrollView, Dimensions } from 'react-native';
import VacationList from './Vacation/components/VacationList';
import VacationInfo from './Vacation/components/VacationInfo';
import VacationType from './Vacation/components/VacationType';

const { height } = Dimensions.get('window');
export default class HomeScreen extends Component {
  state = {
    screenHeight: height,
  };

  onContentSizeChange = (contentWidth, contentHeight) => {
    this.setState({ screenHeight: contentHeight });
    //console.log(contentHeight)
    //console.log(height)
  };

  render() {
    const scrollEnabled = this.state.screenHeight > (height - 60);
    //console.log(scrollEnabled)
    return (
      <View style={{ flex: 1, justifyContent: 'flex-start', marginHorizontal: 5 }}>
        <ScrollView
          style={{ flex: 1 }}
          scrollEnabled={scrollEnabled}
          onContentSizeChange={this.onContentSizeChange}
          contentContainerStyle={{ flexGrow: 1}}
          showsVerticalScrollIndicator={false}>

          <View style={styles.vacationInfo}>
            <VacationInfo/>
          </View>
          <View style={styles.vacationList}>
            <View style={styles.listHeader}>
              <Button title="+"/>
            </View>
            <VacationList/>
          </View>
          <View style={styles.vacationType}>
            <VacationType/>
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

  listHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginRight: 30,
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