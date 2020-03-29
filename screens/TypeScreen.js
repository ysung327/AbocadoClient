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
      isDetailEditVisible: false,
      isDetailAddVisible: false,
    }
  }

  componentDidMount() {
    this.fetchDataFromApi(this.state.type_of_detail)
    this.fetchInfoFromApi(this.state.type_of_detail)
    this.initialize()
  }

  fetchDataFromApi = (type_of_detail)  => {
    const url = "http://ysung327.pythonanywhere.com/vacations/type/";
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
        isDetailAddVisible: true
      })
    } else {
      this.setState({
        isDetailAddVisible: false,
      })
    }
  }

  setDetailEditVisible = () => {
    if(this.state.isDetailEditVisible == false) {
      this.setState({
        isDetailEditVisible: true
      })
    } else {
      this.setState({
        isDetailEditVisible: false,
      })
    }
  }

  editDetail = (id) => {
    const url = "http://ysung327.pythonanywhere.com/vacations/detail/" + id + "/";

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
      console.log(res.id)
      this.setState({
        id: res.id,
      })
    })
  }

  deleteDetail = (id)  => {
    const url = "http://ysung327.pythonanywhere.com/vacations/detail/" + id + "/";
    fetch( url, { 
      method: 'DELETE',
      headers: {
        'Authorization': 'Token ' + this.state.token,
      },
    })
    setTimeout(() => {
      this.fetchDataFromApi(this.state.type_of_detail)
      this.fetchInfoFromApi(this.state.type_of_detail)
    }, 300)
  }
  
  _onPress = () => {
    if(this.state.isDetailAddVisible == false && this.state.isDetailEditVisible == false) {
      this.setDetailAddVisible()
    }
    else if(this.state.isDetailAddVisible) {
      if(this.state.title != null) {
        this.addDetail()
        setTimeout(()=>{
          setTimeout(()=>{
            this.editDetail(this.state.id)
          }, 300)
          this.fetchDataFromApi(this.state.type_of_detail)
          this.fetchInfoFromApi(this.state.type_of_detail)
        }, 300)
        this.setDetailAddVisible()
      } else this.setDetailAddVisible()
    }
    else if(this.state.isDetailAddVisible != true && this.state.isDetailEditVisible == true) {
      if(this.state.title != null) {
        this.editDetail(this.state.id)
        setTimeout(() => {
          this.fetchDataFromApi(this.state.type_of_detail)
          this.fetchInfoFromApi(this.state.type_of_detail)
        }, 300)
        this.setDetailEditVisible()
      } else this.setDetailEditVisible()
    }
  }

  showDetail = () => {
    if(this.state.isDetailEditVisible == false && this.state.isDetailAddVisible == false) {
      return(
        <Card containerStyle={[{ height: 600, borderRadius: 10, zIndex: 1 }, styles.elevation ]}>
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
              onChangeText={title => this.setState({ title })}
              onBlur={()=>console.log(this.state.title)}
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

  showDetailEdit = (title, day) => {
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
              value={day}
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
      id: id
    })
    this.setDetailEditVisible()
    this.showDetailEdit(title, day)
  }

  _renderDetail = ({item}) => {
    let due_date = null
    if(item.due_date != null) {
      due_date = item.due_date.split('-', 3)
    }
    return (
      <TouchableOpacity style={{ width: '100%', marginBottom: 10 }} onPress={() => this.detailPressd(item.id, item.title, item.day)}>
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
          <View style={{ width: '50%', marginLeft: '7%', marginRight: '5%', justifyContent: 'center' }}>
              <Text style={{ fontSize: 16 }}>{item.title}</Text>
          </View>
          <View>
            <Icon name='md-trash' type='ionicon' size={20} onPress={() => this.deleteDetail(item.id)}/>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  _renderDday = () => {
    let dday = []
    dday.push(<Text style={{ fontSize: 24, color: 'white', fontWeight: 'bold' }}>D+{this.state.lefted}</Text>)
    return dday
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Header/>
        </View>
        <View style={{ position: 'absolute', top: 70, left: 0, right: 0, height: 80, zIndex: 1000 }}>
          <View style={{  
            flex: 1,
            flexDirection: "row",
            shadowColor: "#000000",
            shadowOpacity: 0.4,
            shadowRadius: 3,
            shadowOffset: {
              height: 6,
            }
          }}>
            <LinearGradient colors={[Colors.secondaryColor, Colors.primaryColor]} style={styles.gradient}>
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start', paddingLeft: 20 }}>
                <Text style={{ fontSize: 24, color: 'white', fontWeight: 'bold'}}>{ this.state.type }</Text>
                <Text style={{ fontSize: 17, color: 'white' }}>{ this.state.total }</Text>
              </View>
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end', paddingRight: 20 }}>
                { this._renderDday() }
              </View>
            </LinearGradient>
          </View>
        </View>

        <View style={{ marginTop: 160, height: 70, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 32 }}
          >{this.state.type}</Text>
        </View>
        { this.showDetail() }
        { this.showDetailAdd() }
        { this.showDetailEdit() }
        <View style={[{ position: 'absolute', bottom: 0, left: '42%', zIndex: 2 }, styles.elevation]}>
          <Icon name="md-add-circle" type="ionicon" size={75} color={Colors.primaryColor} onPress={()=>this._onPress()}/>
        </View>
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
    zIndex: 1200,
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
    flexDirection: 'row',
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
