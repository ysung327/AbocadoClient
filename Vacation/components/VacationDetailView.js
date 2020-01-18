import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList } from 'react-native';
import { Card, Button, Icon } from 'react-native-elements'

export default class VacationDetailView extends Component {
  constructor(props) {
      super(props);
      this.state  = {
        loading: false,
        data: [],
        pk : this.props.navigation.getParam('id', 'default'),
      }
  }

  componentWillMount() {
      this.fetchDataFromApi(this.state.pk);
  }
  
  async fetchDataFromApi(pk) {
    let url = "http://ysung327.pythonanywhere.com/vacations/" + pk + "/";

    this.setState({ loading: true });

    const response = await fetch(url);
    const responseJson = await response.json();
    this.setState({
      data: responseJson,
      loading : false
    });
  }

  deleteData = ()  => {
    const url = "http://ysung327.pythonanywhere.com/vacations/" + this.state.pk + '/';
    fetch( url, { method: 'DELETE' })
    this.goBack()
  }

  addDetail =() => {
    this.props.navigation.navigate('addDetail', {pk : this.state.pk})
  }

  goBack = () => {
      this.props.navigation.goBack()
      this.props.navigation.state.params.onUpload()
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
      <Card wrapperStyle={styles.detailCard}>
          <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 20 }}>{item.day}</Text>
          </View>
          <View style={{ flex: 3 }}>
              <Text style={{ fontSize: 17 }}>{item.title}</Text>
          </View>
      </Card>
    )
  }

  render() {
      return (
        <View>
          <Card containerStyle={styles.card}>
            <View style={styles.deleteIcon}>
              <Icon
                name='delete'
                onPress={this.deleteData}
              />
            </View>
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
          <View style={styles.addIcon}>
            <Icon
              name='add_box'
              onPress={this.addDetail}
            />
          </View>
          <FlatList
            data={this.state.data.detail}
            renderItem={this._renderItem}
            keyExtractor={(item, index) => item.id}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )
  }
}

const styles = StyleSheet.create({
  card: {
    justifyContent: 'space-around',
    backgroundColor: 'white',
    borderWidth: 0.3,
    borderColor: 'gray',
  },

  deleteIcon: {
    alignItems: 'flex-end'
  },

  addIcon: {
    alignItems: 'flex-end'
  },

  detailCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
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

