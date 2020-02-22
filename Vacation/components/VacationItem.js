import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from "react-native"
import { Card, Button } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome';
import HomeScreen from '../../HomeScreen'
import { withNavigation } from 'react-navigation';

class VacationItem extends Component {
  constructor(props) {
    super(props);
  }

  onPress = () => {
    this.props.navigation.navigate('Detail', {onUpload: this.props.onUpload, 
      id : this.props.item.id, token : this.props.token, user : this.props.user})
  }

  render() {
    let dday = []
    if(this.props.item.dDay<0) {
      let dDay = this.props.item.dDay * -1
      dday.push(<Text style={styles.content}>휴가까지 {dDay}일 남았습니다.</Text>)
    }
    else dday.push(<Text style={styles.content}>휴가가 {this.props.item.dDay}일 지났습니다.</Text>)

    return (
        <TouchableOpacity onPress={this.onPress}>
          <Card containerStyle={styles.container} wrapperStyle={{padding:0}}>
            <View style={styles.day}>
              <Text style={styles.content}>{this.props.item.day} 일</Text>
            </View>
            <View style={styles.dday}>
              {dday}
            </View>
            <View style={styles.info}>
              <View style={styles.date}>
                <Text style={styles.text}>출발</Text>
                <Text style={styles.text}>{this.props.item.start_date}</Text>
              </View>
              <View style={styles.date}>
                <Text style={styles.text}>복귀</Text>
                <Text style={styles.text}>{this.props.item.end_date}</Text>
              </View>
            </View>
          </Card>
        </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
    width: 310,
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    borderWidth: 0.3,
    borderColor: 'gray',
    marginRight: 3,
  },

  day:{
    alignItems: 'center',
    paddingBottom: 10,
  },

  dday:{
    alignItems: 'center',
    paddingBottom: 10,
  },

  content: {
    fontSize: 25,
  },

  info: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  
  date: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: 15,
  },

  text: {
    fontSize: 17,
  },
})

export default withNavigation(VacationItem);
