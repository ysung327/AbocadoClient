import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from "react-native"
import { Card, Button } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions } from 'react-native-router-flux';
import Colors from '../constants/Colors'

class VacationItem extends Component {
  constructor(props) {
    super(props);
  }

  onPress = () => {
    Actions.detail({onUpload: this.props.onUpload, 
      id : this.props.item.id, token : this.props.token, user : this.props.user})
  }

  render() {
    let start_date = this.props.item.start_date.split('-', 3)
    let end_date = this.props.item.end_date.split('-', 3)
    console.log(start_date)
    let dday = []
    if(this.props.item.dDay<0) {
      let dDay = this.props.item.dDay * -1
      dday.push(
        <Text>
          <Text style={styles.content}>D-</Text>
          <Text style={styles.content}>{this.props.item.dDay}</Text>
        </Text>
        )
    }
    else dday.push(
      <View style={styles.dday}>
        <Text style={{ position: 'absolute', top: 3, left: 65, fontSize: 16 }}>D+</Text>
        <Text style={{ fontSize: 32 }}>{this.props.item.dDay}</Text>
      </View>
    )

    return (
      <Card containerStyle={styles.container}>
        <TouchableOpacity onPress={this.onPress}>
          <View>
            <Text style={{ position:'absolute', top: 10, fontSize: 24 , color: Colors.accentColor2}}>{this.props.item.day}</Text>
            <Text style={{ position:'absolute', top: 17, left: 20, fontSize: 16, color: Colors.accentColor2 }}>Days</Text>
          </View>
          {dday}
          <View style={styles.info}>
            <View style={styles.date}>
              <Text style={[styles.year, {color: Colors.secondaryColor}]}>{start_date[0]}</Text>
              <Text style={[styles.text, {color: Colors.secondaryColor}]}>{start_date[1]}.{start_date[2]}</Text>
            </View>
            <View>
              <Text style={{ marginTop: 10, color: Colors.accentColor1, fontWeight: 'bold' }}>______________</Text>
            </View>
            <View style={styles.date}>
              <Text style={[styles.year, {color: Colors.primaryColor}]}>{end_date[0]}</Text>
              <Text style={[styles.text, {color: Colors.primaryColor}]}>{end_date[1]}.{end_date[2]}</Text>
            </View>
          </View>
        </TouchableOpacity>

      </Card>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    height: 130, 
    borderRadius: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    width: 275,
    flexDirection: 'column',
    justifyContent: 'space-around',
    marginRight: 3,
    marginBottom: 20,
  },

  dday:{
    alignItems: 'center',
    marginTop: 40,
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
    fontWeight: 'bold',
  },

  year: {
    fontSize: 13,
    fontWeight: 'bold',
  },
})

export default VacationItem
