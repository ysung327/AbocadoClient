import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, BackHandler } from 'react-native';
import { Card, Button, Icon, Input } from 'react-native-elements'
import Colors from '../constants/Colors'
import { OutlinedTextField } from 'react-native-material-textfield';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '../components/Header'
import { CommonActions } from '@react-navigation/native';
import { connect } from "react-redux";
import { update } from '../app/reducer'
import store from "../app/store";

const HEADER_MAX_HEIGHT = 70

function mapDispatchToProps(dispatch) {
  return {
    update: shouldUpdate => dispatch(update(shouldUpdate))
  };
}

class ConnectedTypeScreen extends Component {
  constructor(props) {
    super(props);
    this.state  = {
      data: [],
      type_of_detail: this.props.navigation.getParam('type_of_detail', 'default'),
      token: this.props.navigation.getParam('token', 'default'),
      user: this.props.navigation.getParam('user', 'default'),
      type: null,
      total: null,
      left: null,
      lefted: this.props.navigation.getParam('lefted', 'default'),
      id: null,
      day: null,
      title: null,
      uploaded: false,
      isInfoVisible: true,
      isDetailVisible: true,
      isDetailEditVisible: false,
      isDetailAddVisible: false,
    }
  }

  componentDidMount() {
    this.fetchDataFromApi(this.state.type_of_detail)
    this.fetchInfoFromApi(this.state.type_of_detail)
    this.initialize()
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton)
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton)
  }

  handleBackButton = () => {
    if(this.state.isDetailEditVisible) {
      this.setState({
        isDetailEditVisible: false,
        isDetailVisible: true
      })
      return true
    } 
    else if(this.state.isDetailAddVisible) {
      this.setState({
        isDetailAddVisible: false,
        isDetailVisible: true
      })
      return true
    }
    this.props.navigation.dispatch(CommonActions.goBack());
    this.props.update(true)
  }

  fetchDataFromApi = (type_of_detail)  => {
    const url = "http://ysung327.pythonanywhere.com/vacations/type/"
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

  initialize = () => {
    if(this.state.type_of_detail === 'ANN') {
      this.setState({
        total: 26,
        type: '연가'
      })
    }
    else if(this.state.type_of_detail === 'CON') {
      this.setState({
        type: '위로'
      })
    } 
    else if(this.state.type_of_detail === 'PR') {
      this.setState({
        type: '포상'
      })
    }
    else if(this.state.type_of_detail === 'RE') {
      this.setState({
        type: '보상'
      })
    }
    else if(this.state.type_of_detail === 'PE') {
      this.setState({
        type: '청원'
      })
    }
  }

  setDetailAddVisible = () => {
    if(this.state.isDetailAddVisible == false) {
      this.setState({
        isDetailVisible: false,
        isDetailAddVisible: true
      })
    } else {
      this.setState({
        isDetailVisible: true,
        isDetailAddVisible: false,
      })
    }
  }

  setDetailEditVisible = () => {
    if(this.state.isDetailEditVisible == false) {
      this.setState({
        isDetailVisible: false,
        isDetailEditVisible: true
      })
    } else {
      this.setState({
        isDetailVisible: true,
        isDetailEditVisible: false,
      })
    }
  }

  editDetail = (id) => {
    const url = "http://ysung327.pythonanywhere.com/vacations/detail/" + id + "/";
    console.log(this.state.id)
    console.log(this.state.title, this.state.day)

    fetch(url, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + this.state.token,
      },
      body: JSON.stringify({
        day: this.state.day,
        title: this.state.title,
      })
    })
    .then(res => res.json())
    .then(res => {
      this.setState({
        day: null,
        title: null,
        due_date: "2020-10-14"
      })
      console.log(res)
    })
    setTimeout(() => {
      this.fetchDataFromApi(this.state.type_of_detail)
      this.fetchInfoFromApi(this.state.type_of_detail)
    }, 300)
  }

  addDetail = ()  => {
    const url = "http://ysung327.pythonanywhere.com/vacations/detail/add/";

    fetch(url, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + this.state.token,
      },
      body: JSON.stringify({
        type_of_detail: this.state.type_of_detail,
        user: this.state.user
      })
    })
    .then(res => res.json())
    .then(res => {
      this.setState({
        id: res.id,
      })
      console.log(res.id, this.state.id)
    })
  }

  deleteDetail = (id)  => {
    const url = "http://ysung327.pythonanywhere.com/vacations/detail/" + id + "/";
    fetch( url, { 
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + this.state.token,
      },
      body: JSON.stringify({
        type_of_detail: this.state.type_of_detail,
        user: this.state.user
      })
    })
    setTimeout(() => {
      this.fetchDataFromApi(this.state.type_of_detail)
      this.fetchInfoFromApi(this.state.type_of_detail)
    }, 300)
  }
  
  _onPress = () => {
    if(this.state.isDetailVisible) {
      this.setDetailAddVisible()
    }
    else if(this.state.isDetailAddVisible) {
      if(this.state.title != null && this.state.day != null) {
        this.addDetail()
        setTimeout(()=>{
          console.log(this.state.id)
          this.editDetail(this.state.id)
        }, 1000)
        setTimeout(()=>{
          this.fetchDataFromApi(this.state.type_of_detail)
          this.fetchInfoFromApi(this.state.type_of_detail)
        }, 1200)
        this.setDetailAddVisible()
      } 
      else this.setDetailAddVisible()
    }
    else if(this.state.isDetailEditVisible == true) {
      if(this.state.title != null && this.state.day != null) {
        this.editDetail(this.state.id)
        setTimeout(() => {
          this.fetchDataFromApi(this.state.type_of_detail)
          this.fetchInfoFromApi(this.state.type_of_detail)
        }, 300)
        this.setDetailEditVisible()
      } 
      else this.setDetailEditVisible()
    }
  }

  showDetail = () => {
    if(this.state.isDetailVisible) {
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
    } else return null
  }

  showDetailAdd = () => {
    if(this.state.isDetailAddVisible) {
      return (
        <Card containerStyle={[{ height: 600, borderRadius: 10, zIndex: 1 }, styles.elevation ]}>
          <View style={{ justifyContent: 'center', marginBottom: 10, paddingBottom: 10, borderBottomWidth: 2,borderBottomColor: Colors.lineColor }}>
            <Text style={{ fontSize: 24, textAlign: 'center' }}>휴가 추가</Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 18 }}>휴가 종류</Text>
            <OutlinedTextField
              label={'내용'}
              labelFontSize={10}
              containerStyle={{ paddingVertical: 0, marginTop: 10 }}
              inputContainerStyle={{ height: 50, width: '50%', paddingBottom: 3 }}
              tintColor={Colors.primaryColor}
              onChangeText={title => {
                this.setState({ title })
                console.log(this.state.title)  
              }}
            />
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 18, marginTop: 10 }}>휴가 일수</Text>
            <OutlinedTextField
              label={'일수'}
              labelFontSize={10}
              containerStyle={{ paddingVertical: 0, marginTop: 10 }}
              inputContainerStyle={{ height: 50, width: '50%', paddingBottom: 3 }}
              tintColor={Colors.primaryColor}
              keyboardType={'phone-pad'}
              onChangeText={day => this.setState({ day })}
              onBlur={()=>console.log(this.state.day)}
            />
          </View>
        </Card>
      )
    } else return null
  }

  showDetailEdit = () => {
    var title = this.state.title
    var day = this.state.day
    if(this.state.isDetailEditVisible) {
      return (
        <Card containerStyle={[{ height: 600, borderRadius: 10, zIndex: 1 }, styles.elevation ]}>
          <View style={{ justifyContent: 'center', marginBottom: 10, paddingBottom: 10, borderBottomWidth: 2,borderBottomColor: Colors.lineColor }}>
            <Text style={{ fontSize: 24, textAlign: 'center' }}>휴가 수정</Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 18 }}>휴가 종류</Text>
            <OutlinedTextField
              label={title}
              labelFontSize={10}
              containerStyle={{ paddingVertical: 0, marginTop: 10 }}
              inputContainerStyle={{ height: 50, width: '50%', paddingBottom: 3 }}
              tintColor={Colors.primaryColor}
              onChangeText={title => this.setState({ title })}
            />
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 18, marginTop: 10 }}>휴가 일수</Text>
            <OutlinedTextField
              label={day}
              labelFontSize={10}
              containerStyle={{ paddingVertical: 0, marginTop: 10 }}
              inputContainerStyle={{ height: 50, width: '50%', paddingBottom: 3 }}
              tintColor={Colors.primaryColor}
              keyboardType={'phone-pad'}
              onChangeText={day => this.setState({ day })}
            />
          </View>
        </Card>
      )
    } else return null
  }

  detailPressd = (id, title, day) => {
    this.setState({
      id: id,
      title: title,
      day: day 
    })
    this.setDetailEditVisible()
    this.showDetailEdit()
  }

  _renderDetail = ({item}) => {
    let due_date = null
    if(item.due_date != null) {
      due_date = item.due_date.split('-', 3)
    }
    return (
      <View style={{ flexDirection: 'row', marginBottom: 10 }}>
        <TouchableOpacity style={{ width: '75%' }} onPress={() => this.detailPressd(item.id, item.title, item.day)}>
          <View style={{ flexDirection: 'row', alignContent: 'flex-start', alignItems: 'center' }}>
            <View style={{ paddingLeft: '5%', paddingRight: '7%' }}>
                <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{item.day}</Text>
            </View>
            <View style={{ flexDirection: 'row', width: '15%', alignItems: 'center' }}>
              <Text style={{ fontSize: 12, fontWeight: 'bold' }}>{ due_date == null ? null : '~' }</Text>
              <View style={{ marginLeft: 5, flexDirection: 'column', justifyContent: 'center' }}>
                <Text style={{ fontSize: 12 }}>{ due_date == null ? null : due_date[0] }</Text>
                <Text style={{ fontSize: 14}}>{ due_date == null ? null : due_date[1] + '.' + due_date[2] }</Text>
              </View>
            </View>      
            <View style={{ width: '45%', marginLeft: '7%', marginRight: '5%', justifyContent: 'center' }}>
                <Text style={{ fontSize: 16 }}>{item.title}</Text>
            </View>
          </View>
        </TouchableOpacity>
        <View style={{ justifyContent: 'center', width: '25%' }}>
          <Icon name='md-trash' type='ionicon' size={20} color={Colors.primaryColor} onPress={() => this.deleteDetail(item.id)}/>
        </View>
      </View>

    )
  }

  _renderTotal = () => {
    if(this.state.isInfoVisible) {
      let dday = []
      dday.push(<Text style={{ fontSize: 17, color: 'white' }}>{ this.state.total }</Text>)
      return dday
    }
  }

  _renderInfo = () => {
    if(this.state.isInfoVisible) {
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
              <View style={{ flexDirection: 'row', marginTop: 10 }}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start', paddingLeft: 20 }}>
                  <Text style={{ fontSize: 24, color: 'white', fontWeight: 'bold'}}>{ this.state.type }</Text>
                  { this._renderTotal() }
                </View>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end', paddingRight: 20 }}>
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
        { this.showDetailAdd() }
        { this.showDetailEdit() }
        <View style={[{ position: 'absolute', bottom: 0, left: '45%', zIndex: 2 }, styles.elevation]}>
          <Icon name="md-add-circle" type="ionicon" size={50} color={Colors.secondaryColor} onPress={()=>this._onPress()}/>
        </View>
      </View>
    )
  }
}

const TypeScreen = connect(
  null,
  mapDispatchToProps
)(ConnectedTypeScreen);

export default TypeScreen;


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
