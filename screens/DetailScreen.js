import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Modal, Dimensions, ScrollView } from 'react-native';
import { Card, Button, Icon } from 'react-native-elements'
import CalendarPicker from 'react-native-calendar-picker'
import { TextInput } from 'react-native-paper';
import { TextField, FilledTextField, OutlinedTextField } from 'react-native-material-textfield';
import moment from 'moment'
import Colors from '../constants/Colors'
import { LinearGradient } from 'expo-linear-gradient';
import Header from '../components/Header'



const { height } = Dimensions.get('window')
const HEADER_MAX_HEIGHT = 70
const CALENDAR_WEEK_DAYS = [ '일', '월', '화', '수', '목', '금', '토' ]
const CALENDAR_MONTHS = [ '1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월' ]

export default class DetailScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pk: this.props.navigation.getParam('id', 'default'),
      token: this.props.navigation.getParam('token', 'default'),
      user: this.props.navigation.getParam('user', 'default'),
      loading: false,
      data: [],
      detail: [],
      detailSum: 0,
      modalData: [],
      conData: [],
      prData: [],
      peData: [],
      reData: [],
      isDetailAddVisible: false,
      isDatePickerVisible: false,
      screenHeight: height,
      itemChecked: [],
      annual: null,
      start_date: null,
      end_date: null,
      day: null,
      title: null,
    }
  }

  onContentSizeChange = (contentWidth, contentHeight) => {
    this.setState({
      screenHeight: contentHeight
    });
  }

  componentDidMount() {
    this.fetchDataFromApi(this.state.pk)
    this.fetchModalFromApi()
  }

  async fetchDataFromApi(pk) {
    let url = "http://ysung327.pythonanywhere.com/vacations/" + pk + "/"

    this.setState({
      loading: true
    })

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + this.state.token,
      },        
      body: JSON.stringify({
        user: this.state.user
      })
    })
    
    const responseJson = await response.json()
    const _detail = responseJson.detail
    let _detailSum = responseJson.annual
    for (let i of _detail) {
      _detailSum += i.day
    }

    this.setState({
      data: responseJson,
      detail: _detail,
      detailSum: _detailSum,
      annual: responseJson.annual,
      start_date: responseJson.start_date,
      end_date: responseJson.end_date,
      day: responseJson.day,
      title: responseJson.title,
      loading: false
    })
  }

  fetchModalFromApi = () => {
    const url = "http://ysung327.pythonanywhere.com/vacations/detail/";
    let modalData = []
    let _conData = []
    let _prData = []
    let _reData = []
    let _peData = []
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
      modalData = res
      for (let i in modalData) {
        if (modalData[i].type_of_detail === "CON") {
          _conData.push(modalData[i])
        } else if (modalData[i].type_of_detail === "PR") {
          _prData.push(modalData[i])
        } else if (modalData[i].type_of_detail === "RE") {
          _reData.push(modalData[i])
        } else if (modalData[i].type_of_detail === "PE") {
          _peData.push(modalData[i])
        }
      }
      this.setState({
        conData: _conData,
        reData: _reData,
        prData: _prData,
        peData: _peData,
        created: false
      })
    })
    .catch((error) => {
      console.log(error);
    })
  }

  sendDate = () => {
    console.log('test   ' + this.state.pk)
    const url = "http://ysung327.pythonanywhere.com/vacations/" + this.state.pk + '/'
    fetch(url, {
      method: 'PUT',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + this.state.token,
      },
      body: JSON.stringify({
          start_date : this.props.start_date,
          end_date: this.props.end_date,
          user: this.state.user,
      })
    })
    setTimeout(()=> {
      this.fetchDataFromApi(this.state.pk)
    }, 50)
  }

  sendDetail = () => {
    const newDetail = this.state.itemChecked
    this.setState({
      itemChecked: []
    })
    for (let i of newDetail) {
      //console.log(i)
      let url = "http://ysung327.pythonanywhere.com/vacations/detail/" + i + '/';
      fetch(url, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + this.state.token,
        },
        body: JSON.stringify({
          vacation: this.state.pk,
          is_used: true,
        })
      })
    }
    setTimeout(() => {
      this.fetchDataFromApi(this.state.pk)
      this.fetchModalFromApi()
    }, 300)
  }
  
  sendAnnual = () => {
    const url = "http://ysung327.pythonanywhere.com/vacations/" + this.state.pk + '/'

    fetch(url, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + this.state.token,
      },
      body: JSON.stringify({
        annual : this.state.annual,
        user : this.state.user,
      })
    })
    setTimeout(() => {
      this.fetchDataFromApi(this.state.pk)
      this.fetchModalFromApi()
    }, 300)
  }

  deleteVacation = () => {
    const url = "http://ysung327.pythonanywhere.com/vacations/" + this.state.pk + '/';
    fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Token ' + this.state.token,
      },
      body: JSON.stringify({
        user: this.state.user,
      })
    })
    this.goBack()
  }

  deleteDetail = (id) => {
    const url = "http://ysung327.pythonanywhere.com/vacations/detail/" + id + '/';
    fetch(url, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + this.state.token,
      },
      body: JSON.stringify({
        vacationID: this.state.pk,
        vacation: null,
        is_used: false,
      })
    })
    setTimeout(() => {
      this.fetchDataFromApi(this.state.pk)
      this.fetchModalFromApi()
    }, 300)
  }

  showDetail = () => {
    if(this.state.isDatePickerVisible == false && this.state.isDetailAddVisible == false) {
      return(
        <Card containerStyle={[{ height: '50%', borderRadius: 10, zIndex: 1 }, styles.elevation ]}>
          { this.renderAnn() }
          <FlatList
            data={this.state.detail}
            renderItem={this._renderDetail}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
          { this.renderEmptyList() }
        </Card>
      )
    }
    return null
  }

  showDetialSum = () => {
    if(this.state.detailSum != null) {
      return(
        <View style={{ justifyContent: 'center', marginVertical: 10, paddingBottom: 5, borderBottomWidth: 2, borderBottomColor: Colors.lineColor }}>
          <Text style={{ fontSize: 24, textAlign: 'center' }}>{ this.state.detailSum }</Text>
        </View>
      )
    } else {
        return(
          <View style={{ justifyContent: 'center', marginVertical: 10, paddingBottom: 5, borderBottomWidth: 2, borderBottomColor: Colors.lineColor }}>
            <Text style={{ fontSize: 24, textAlign: 'center' }}>0</Text>
          </View>
      )
    }
  }

  showDetailAdd = () => {
    if(this.state.isDetailAddVisible == true) {
      return(
        <Card containerStyle={[{ height: '62%', borderRadius: 10, paddingTop: 0 }, styles.elevation ]}>
          { this.showDetialSum() }
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ justifyContent: 'center' }}>
              <Card containerStyle={{ justifyContent: 'center', backgroundColor: Colors.lineColor, borderRadius: 10, paddingVertical: 5, marginHorizontal: 0, marginBottom: 10 }}>
                <Text style={styles.typeTitle}>연가</Text>
              </Card>
              { this._renderTextInput() }
            </View>
            <View style={{ justifyContent: 'center' }}>
              <Card containerStyle={{ justifyContent: 'center', backgroundColor: Colors.lineColor, borderRadius: 10, paddingVertical: 5, marginHorizontal: 0, marginBottom: 10 }}>
                <Text style={styles.typeTitle}>위로</Text>
              </Card>
              <FlatList
                data={this.state.conData}
                renderItem={this._renderUnusedDetail}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
              />
            </View>
            <View style={{ justifyContent: 'center' }}>
              <Card containerStyle={{ justifyContent: 'center', backgroundColor: Colors.lineColor, borderRadius: 10, paddingVertical: 5, marginHorizontal: 0, marginBottom: 10 }}>
                <Text style={styles.typeTitle}>포상</Text>
              </Card>
              <FlatList
                data={this.state.prData}
                renderItem={this._renderUnusedDetail}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
              />
            </View>
            <View style={{ justifyContent: 'center' }}>
              <Card containerStyle={{ justifyContent: 'center', backgroundColor: Colors.lineColor, borderRadius: 10, paddingVertical: 5, marginHorizontal: 0, marginBottom: 10 }}>
                <Text style={styles.typeTitle}>보상</Text>
              </Card>
              <FlatList
                data={this.state.reData}
                renderItem={this._renderUnusedDetail}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
              />
            </View>
            <View style={{ justifyContent: 'center' }}>
              <Card containerStyle={{ justifyContent: 'center', backgroundColor: Colors.lineColor, borderRadius: 10, paddingVertical: 5, marginHorizontal: 0, marginBottom: 10 }}>
                <Text style={styles.typeTitle}>청원</Text>
              </Card>
              <FlatList
                data={this.state.peData}
                renderItem={this._renderUnusedDetail}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
              />
            </View>
            <View style={{ height: 300 }}></View>
          </ScrollView>
        </Card>
      )
    }
    return null
  }

  showCalendar = () => {
    if(this.state.isDatePickerVisible == true) {
      return(
        <Card containerStyle={[{ height: 400, borderRadius: 10, paddingTop: 0 }, styles.elevation ]}>
          <CalendarPicker
            scaleFactor={410}
            allowRangeSelection={true}
            selectedStartDate={this.state.start_date}
            selectedEndDate={this.state.end_date}
            initialDate={(this.state.start_date!=null) ? this.state.start_date : moment().format()}
            onDateChange={this.onDateChange}
            weekdays={CALENDAR_WEEK_DAYS}
            months={CALENDAR_MONTHS}
            textStyle={{ fontSize: 20 }}
            previousTitleStyle={{ fontSize: 20, textAlign: 'right', color: Colors.primaryColor }}
            nextTitleStyle={{ fontSize: 20, textAlign: 'left', color: Colors.primaryColor }}
            previousTitle="<"
            nextTitle=">"
            selectedDayColor={Colors.accentColor2}
            selectedRangeStyle={{ backgroundColor: "#e5e5e5"}}
            dayLabelsWrapper={{ marginLeft: 15, borderBottomWidth: 0, borderTopWidth: 0 }}
          />
        </Card>
      )
    } return null
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

  setDatePickerVisible = () => {
    if(this.state.isDatePickerVisible == false) {
      this.setState({
        isDatePickerVisible: true,
        isDetailAddVisible: false
      })
    } else {
      this.setState({
        isDatePickerVisible: false,
      })
    }
  }

  goBack = () => {
    this.props.navigation.goBack()
    //this.props.navigation.state.params.onUpload()
  }

  onDateChange = (date, type) => {
    var temp = date.toObject()
    var end = temp.years + '-' + (temp.months+1) + '-' + temp.date
    var start = temp.years + '-' + (temp.months+1) + '-' + temp.date
    if (type === 'END_DATE') {
      end = temp.years + '-' + (temp.months+1) + '-' + temp.date
      this.props.end_date = end
      this.sendDate()
      setTimeout(() => {
        this.setDatePickerVisible()
      }, 500)
      
    } else {
      start = temp.years + '-' + (temp.months+1) + '-' + temp.date
      this.props.start_date = start
      this.props.end_date = null
      this.sendDate()
      setTimeout(()=>{
        this.setDatePickerVisible()
      }, 100)

    }
  }

  selectItem = (index, day) => {
    const itemChecked = this.state.itemChecked
    let i = itemChecked.indexOf(index)
    let temp = []
    if (i == -1) {
      temp = itemChecked.concat(index)
      let _detailSum = this.state.detailSum + day
      this.setState({
        itemChecked: temp,
        detailSum: _detailSum
      })
      //console.log(this.state.itemChecked)
    } 
    else {
      let _detailSum = this.state.detailSum - day
      this.setState({
        itemChecked: [...itemChecked.slice(0, i), ...itemChecked.slice(i + 1)],
        detailSum: _detailSum
      })
      //console.log(this.state.itemChecked)
    }
    this.setDetailAddVisible()
    setTimeout(()=>{
      this.setDetailAddVisible()
    }, 1)
  }

  changeBackground = (id) => {
    if (this.state.itemChecked.indexOf(id) != -1) {
      return (
        <View style={{ borderRadius: 100, width: 20, height: 20, backgroundColor: Colors.secondaryColor }}></View>
      )
    } else null
  }

  _renderDday = () => {
    let dday = []
    if(this.state.data.start_date!=null) {
      if(this.state.data.dDay<0) {
        let dDay = this.state.data.dDay * -1
        dday.push(<Text style={{ fontSize: 24, color: 'white' }}>D-{dDay}</Text>)
      }
      else dday.push(<Text style={{ fontSize: 24, color: 'white' }}>D+{this.state.data.dDay}</Text>)
      return dday
    } 
    else return null
  }

  _renderDetail = ({item}) => {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
        <View style={{ width: 50 }}>
            <Text style={{ fontSize: 18, textAlign: 'center' }}>{item.day}</Text>
        </View>
        <View style={{ flex: 3 }}>
            <Text style={{ marginLeft: 30, fontSize: 20 }}>{item.title}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Icon name='md-trash' type='ionicon' size={20} onPress={() => this.deleteDetail(item.id)}/>
        </View>
      </View>
    )
  }

  _renderUnusedDetail = ({item}) => {
    let due_date = null
    if(item.due_date != null) {
      due_date = item.due_date.split('-', 3)
    }
    return (
      <TouchableOpacity style={{ width: '100%', marginBottom: 7 }} onPress={()=>this.selectItem(item.id , item.day)}>
        <View style={{ flexDirection: 'row', alignContent: 'flex-start', alignItems: 'center' }}>
          <View style={{ width: '17%', alignItems: 'center' }}>
              <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{item.day}</Text>
          </View>
          <View style={{ width: '17%', flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 12, fontWeight: 'bold' }}>{ due_date == null ? null : '~' }</Text>
            <View style={{ flexDirection: 'column', justifyContent: 'center', paddingLeft: 2 }}>
              <Text style={{ fontSize: 12 }}>{ due_date == null ? null : due_date[0] }</Text>
              <Text style={{ fontSize: 14}}>{ due_date == null ? null : due_date[1] + '.' + due_date[2] }</Text>
            </View>
          </View>      
          <View style={{ width: '45%', paddingLeft: '5%' }}>
              <Text style={{ fontSize: 16 }}>{item.title}</Text>
          </View>
          <View style={{ width: '15%', alignItems: 'center' }}>
            {this.changeBackground(item.id)}
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  renderEmptyList = () => {
    if( this.state.annual == null && this.state.detail.length == 0) {
      return (
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 24, textAlign: 'center' }}>휴가 세부항목을 정해보세요.</Text>
        </View>
      )
    }
    return null
  }

  renderAnn = () => {
    if (this.state.annual != null && this.state.annual != 0) {
      return (
        <View style={{ flexDirection: 'row', marginBottom: 10 }}>
          <View style={{ width: 50  }}>
              <Text style={{ fontSize: 18, textAlign: 'center' }}>{this.state.annual}</Text>
          </View>      
          <View style={{ marginLeft: 30 }}>
              <Text style={{ fontSize: 20 }}>연가</Text>
          </View>
        </View>
      )
    }
    return null
  }

  _renderDay = () => {
    if (this.state.day != null) {
      return (
          <View>
            <Text style={{ fontSize: 32, textAlign: 'center' }}>{ this.state.data.day } Days</Text>
          </View>
      )
    }
    else return(
      <View>
        <Text style={{ fontSize: 20, textAlign: 'center', marginTop: 10 }}>휴가계획을 세워보세요.</Text>
      </View>
    )
  }

  _renderDate = () => {
    if(this.state.start_date == null) {
      return null
    }
    else if(this.state.start_date != null && this.state.end_date == null) {
      return(
        <Text style={{ fontSize: 12, color: 'white' }}>{this.state.start_date}</Text>
      )
    }
    else if(this.state.start_date != null && this.state.end_date != null) {
      return(
        <Text style={{ fontSize: 12, color: 'white' }}>{this.state.start_date} - {this.state.end_date}</Text>
      )
    }
  }

  _renderTextInput = () => {
    return (
      <OutlinedTextField
        containerStyle={{ alignItems: 'center' }}
        inputContainerStyle={{ height: 50, width: '50%' }}
        fontSize={18}
        tintColor={Colors.primaryColor}
        keyboardType={'phone-pad'}
        onChangeText={annual => this.setState({ annual })}
        onBlur={()=>this.sendAnnual()}
      />
    )
  }

  _onPress = () => {
    this.sendDetail()
    this.setDetailAddVisible()
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
              <View style={{ flexDirection: 'row', }}>
                <View style={{ flex: 1, alignItems: 'flex-start', paddingLeft: 20, marginTop: 10 }}>
                  <Text style={{ fontSize: 24, color: 'white' }}>{ this.state.title != null ? this.state.title : null }</Text>
                  { this._renderDate() }
                </View>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end', paddingRight: 20, marginTop: 15 }}>
                  { this._renderDday() }
                </View>
              </View>
            </LinearGradient>
          </View>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 15 }}>
          { this._renderDay() }
          <View style={{ position: 'absolute', right:30, top: 10 }}>
            <Icon name="md-trash" type='ionicon' size={30} color={Colors.primaryColor} onPress={this.deleteVacation}/>
          </View> 
        </View>
        <TouchableOpacity onPress={() => this.setDatePickerVisible()}>
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10, marginBottom: 10 }}>
            <View style={{ flexDirection: 'column', alignItems: 'center'}}>
              <Icon name="ios-calendar" type="ionicon" size={20} color={Colors.primaryColor}/>
              <Card containerStyle={[{ borderRadius: 10, height: 40, justifyContent: 'center', marginHorizontal: 5, paddingHorizontal: 20, marginTop: 5 }, styles.elevation ]}>
                  <Text style={{ fontSize: 18 }}>{(this.state.start_date!=null) ? this.state.start_date : '휴가출발일'}</Text>
              </Card>
            </View>
            <View style={{ flexDirection: 'column', justifyContent: 'center', paddingTop: 13 }}><Text>_______</Text></View>
            <View style={{ flexDirection: 'column', alignItems: 'center'}}>
              <Icon name="ios-calendar" type="ionicon" size={20} color={Colors.primaryColor}/>
              <Card containerStyle={[{ borderRadius: 10, height: 40, justifyContent: 'center', marginHorizontal: 5, paddingHorizontal: 20, marginTop: 5 }, styles.elevation ]}>
                  <Text style={{ fontSize: 18 }}>{(this.state.end_date!=null) ? this.state.end_date : '휴가복귀일'}</Text>
              </Card>
            </View>
          </View>
        </TouchableOpacity>
        
        { this.showCalendar() }
        { this.showDetail() }
        { this.showDetailAdd() }
        <View style={[{ position: 'absolute', bottom: 10, left: '45%', zIndex: 2 }, styles.elevation]}>
          <Icon name="md-add-circle" type="ionicon" size={50} color={Colors.primaryColor} onPress={()=>this._onPress()}/>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  header: {
    height: HEADER_MAX_HEIGHT,
    borderWidth: 1,
  },

  container:{
    flex: 1,
    zIndex: 3,
    backgroundColor: Colors.backgroundColor,
  },

  typeTitle: {
    fontSize: 16,
    textAlign: 'center',
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
