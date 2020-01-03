import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList } from 'react-native';
import { Card, Button } from 'react-native-elements'

export default class VacationDetailView extends Component {
  constructor(props) {
      super(props);
      this.state  = {
        loading: false,
        data: [],
      }
  }

  async fetchDataFromApi(pk) {
    let url = "http://testabocado.ml:8000/vacations/" + pk + "/";

    this.setState({ loading: true });

    const response = await fetch(url);
    const responseJson = await response.json();
    this.setState({
      data: responseJson,
      loading : false
    });
    console.log(this.state.data)
  }

  componentWillMount() {
      this.fetchDataFromApi(this.props.navigation.getParam('id', 'default'));
  }

  getdDay = () => {
      let dDay = []
      let dday = this.props.navigation.getParam('dday', 'default')
      if(dday < 0) {
        dday = dday * -1
        dDay.push(<Text style={styles.content}>D+{dday}</Text>)
      }
      else dDay.push(<Text style={styles.content}>D-{dday}</Text>)
      return dDay
  }

  _renderItem = ({item}) => {
    return (
      <Card style={{flex: 1, flexDirection: 'row'}}>
        <Text style={{flex: 1, fontSize: 20}}>{item.day}</Text>
        <Text style={{flex: 3, fontSize: 17}}>{item.title}</Text>
      </Card>
    )
  }

  render() {
      return (
        <View style={{ flex: 1 }}>
          <Card containerStyle={styles.card} wrapperStyle={{padding:0}}>
            <View style={styles.day}>
              <Text style={styles.content}>{this.state.data.day} 일</Text>
            </View>
            <View style={styles.dday}>
              { this.getdDay() }
            </View>
            <View style={styles.info}>
              <View style={styles.date}>
                <Text style={styles.text}>출발</Text>
                <Text style={styles.text}>{this.state.data.start_date}</Text>
              </View>
              <View style={styles.date}>
                <Text style={styles.text}>복귀</Text>
                <Text style={styles.text}>{this.state.data.end_date}</Text>
              </View>
            </View>
          </Card>
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <FlatList
              data={this.state.data.detail}
              renderItem={this._renderItem}
              keyExtractor={(item, index) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingLeft: 0, paddingRight: 0 }}
            />
          </View>
        </View>
      )
  }
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
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

