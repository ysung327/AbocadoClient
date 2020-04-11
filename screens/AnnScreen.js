import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Modal, Dimensions } from 'react-native';
import { Card, Button, Icon, Input } from 'react-native-elements'
import Colors from '../constants/Colors'
import { OutlinedTextField } from 'react-native-material-textfield';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '../components/Header'

const HEADER_MAX_HEIGHT = 70

export default class TypeScreen extends Component {
  constructor(props) {
    super(props);
    this.state  = {
      data: [],
      type_of_detail: 'ANN',
      user: this.props.navigation.getParam('user', 'default'),
      token: this.props.navigation.getParam('token', 'default'),
      total: null,
      left: null,
      type: '연가',
      lefted: this.props.navigation.getParam('lefted', 'default'),
    }
  }

  componentDidMount() {
    this.fetchDataFromApi()
    this.fetchInfoFromApi(this.state.type_of_detail)
  }

  fetchDataFromApi = ()  => {
    const url = "http://ysung327.pythonanywhere.com/vacations/type/info/ann/";
    fetch(url, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + this.state.token,
      },
      body: JSON.stringify({
        user: this.state.user
      })
    })
    .then(res => res.json())
    .then(res => {
      this.setState({
        data: res,
      })
    })
    .catch((error) => {
    console.log(error)
    })
  }

  fetchInfoFromApi = (type_of_detail)  => {
    const url = "http://ysung327.pythonanywhere.com/vacations/type/info/";
    fetch(url, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + this.state.token,
      },
      body: JSON.stringify({
        type_of_detail: type_of_detail,
        user: this.state.user
      })
    })
    .then(res => res.json())
    .then(res => {
      this.setState({
        total: res.total,
        left: res.left
      })
    })
    .catch((error) => {
    console.log(error)
    })
  }

  showDetail = () => {
    return(
      <Card containerStyle={[{ height: '70%', borderRadius: 10, zIndex: 1 }, styles.elevation ]}>
        { this._renderInfo() }
        <FlatList
          data={this.state.data}
          renderItem={this._renderDetail}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      </Card>
    )
  }

  _renderDetail = ({item}) => {
    return (
      <View style={{ width: '100%', marginBottom: 10 }}>
        <View style={{ flexDirection: 'row', alignContent: 'flex-start', alignItems: 'center' }}>
          <View style={{ paddingLeft: '5%', paddingRight: '7%' }}>
              <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{item.annual}</Text>
          </View>
          <View style={{ width: '70%', alignItems: 'center' }}>
            <Text style={{ fontSize: 14 }}>{item.start_date} ~ {item.end_date}</Text>
          </View>
        </View>
      </View>
    )
  }

  _renderTotal = () => {
    let dday = []
    dday.push(<Text style={{ fontSize: 17, color: 'white' }}>{ this.state.total }</Text>)
    return dday
  }

  _renderInfo = () => {
    return(
      <View style={{ 
        justifyContent: 'space-between',
        flexDirection: 'row', 
        marginBottom: 20,
        paddingBottom: 10,
        borderBottomWidth: 2,
        borderBottomColor: Colors.lineColor
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 17, textAlign: 'center', paddingHorizontal: 5 }}>총 {this.state.type}</Text>
          <Text style={{ fontSize: 24, textAlign: 'center', paddingHorizontal: 5 }}>{ this.state.total }</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 17, textAlign: 'center', paddingHorizontal: 5 }}>사용 가능</Text>
          <Text style={{ fontSize: 24, textAlign: 'center', paddingHorizontal: 5 }}>{ this.state.left }</Text>
        </View>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ height: 150 }}>
          <View style={{  
            flex: 1,
            shadowColor: "#000000",
            shadowOpacity: 0.4,
            shadowRadius: 3,
            shadowOffset: {
              height: 6,
            }
          }}>
            <LinearGradient colors={[Colors.secondaryColor, Colors.primaryColor]} style={styles.gradient}>
              <View style={styles.header}>
                <Header/>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                <View style={{ flex: 1, alignItems: 'flex-start', paddingLeft: 20 }}>
                  <Text style={{ fontSize: 24, color: 'white', fontWeight: 'bold'}}>{ this.state.type }</Text>
                  { this._renderTotal() }
                </View>
                <View style={{ flex: 1, alignItems: 'flex-end', paddingRight: 20 }}>
                  <Text style={{ fontSize: 24, color: 'white', fontWeight: 'bold' }}>D-{this.state.lefted}</Text>
                </View>
              </View>
            </LinearGradient>
          </View>
        </View>

        <View style={{ marginTop: 20, height: 70, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 32 }}>{this.state.type}</Text>
        </View>
        { this.showDetail() }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  header: {
    height: HEADER_MAX_HEIGHT,
  },

  container:{
    flex: 1,
    zIndex: 0,
    backgroundColor: Colors.backgroundColor,
  },

  gradient: {
    flex: 1,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 8,
  },
  
  elevation: {
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22
  },
})
