import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Modal, Dimensions, ScrollView } from 'react-native';
import { Card, Button, Icon } from 'react-native-elements'
import CalendarPicker from 'react-native-calendar-picker'
import NumericInput from 'react-native-numeric-input'
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
      modalData: [],
      conData: [],
      prData: [],
      peData: [],
      reData: [],
      isDetailAddVisible: false,
      isDatePickerVisible: false,
      isDayPickerVisible: false,
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
    console.log(this.state.user)
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

    this.setState({
      data: responseJson,
      detail: _detail,
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
      })
    })
    .catch((error) => {
      console.log(error);
    })
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

  showDetailAdd = () => {
    this.setDetailAddVisible(true)
  }
  
  hideDetailAdd = () => {
    this.setDetailAddVisible(false)
  }

  showDatePicker = () => {
    this.setDatePickerVisible(true)
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

  hideDatePicker = () => {
    this.setDatePickerVisible(false)
  }
  
  showDayPicker = () => {
    this.setDayPickerVisible(true)
  }

  hideDayPicker = () => {
    this.setDayPickerVisible(false)
  }

  setDetailAddVisible = (visible) => {
    this.setState({
      isDetailAddVisible: visible
    })
  }

  setDatePickerVisible = (visible) => {
    this.setState({
      isDatePickerVisible: visible
    })
  }
  
  setDayPickerVisible = (visible) => {
    this.setState({
      isDayPickerVisible: visible
    })
  }

  goBack = () => {
    this.props.navigation.goBack()
    this.props.navigation.state.params.onUpload()
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
    this.hideDetailAdd()
    setTimeout(() => {
      this.fetchDataFromApi(this.state.pk)
      this.fetchModalFromApi()
    }, 300)
  }

  selectItem = (index) => {
    const itemChecked = this.state.itemChecked
    let i = itemChecked.indexOf(index)
    let temp = []
    //console.log("id: " + index)
    //console.log("i: " + i)
    if (i == -1) {
      temp = itemChecked.concat(index)
      this.setState({
        itemChecked: temp
      })
      //console.log(this.state.itemChecked)
    } else {
        this.setState({
          itemChecked: [...itemChecked.slice(0, i), ...itemChecked.slice(i + 1)]
        })
      //console.log(this.state.itemChecked)
    }
  }

  getdDay = () => {
    let dday = []
    if(this.state.data.start_date!=null) {
      if(this.state.data.dDay<0) {
        let dDay = this.state.data.dDay * -1
        dday.push(<Text style={{ fontSize: 24, color: 'white' }}>D-{dDay}</Text>)
      }
      else dday.push(<Text style={{ fontSize: 24, color: 'white' }}>D+{this.state.data.dDay}</Text>)
    }
    else dday.push(<Text style={{ fontSize: 24, color: 'white' }}>휴가날짜를 정해주세요!</Text>)
    return dday
  }

  _renderDetail = ({item}) => {
    return (
      <View style={{ borderWidth: 1 }}>
        <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 20 }}>{item.day}</Text>
        </View>
        <View style={{ flex: 3 }}>
            <Text style={{ fontSize: 17 }}>{item.title}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Icon
            name='md-delete'
            onPress={() => this.deleteDetail(item.id)}
          />
        </View>
      </View>
    )
  }

  changeBackground = (id) => {
    if (this.state.itemChecked.indexOf(id) != -1) {
      return true
    } else false
  }

  _renderUnusedDetail = ({item}) => {
    return (
      <TouchableOpacity onPress={()=>this.selectItem(item.id)}>
          <Card containerStyle={[styles.innerContainer, this.changeBackground(item.id) ? {backgroundColor: 'gray'} : null]} wrapperStyle={styles.detailCard}>
              <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 20 }}>{item.day}</Text>
              </View>
              <View style={{ flex: 3 }}>
                  <Text style={{ fontSize: 17 }}>{item.title}</Text>
              </View>
          </Card>
      </TouchableOpacity>
    )
  }

  sendDate = () => {
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
    this.fetchDataFromApi(this.state.pk)
  }

  onDateChange = (date, type) => {
    var temp = date.toObject()
    var end = null
    var start = null
    if (type === 'END_DATE') {
      end = temp.years + '-' + (temp.months+1) + '-' + temp.date
      this.props.end_date = end
      this.sendDate()
      setTimeout(() => {
        this.setDatePickerVisible(false)
      }, 500)
      
    } else {
      start = temp.years + '-' + (temp.months+1) + '-' + temp.date
      this.props.start_date = start
      this.props.end_date = null
      this.sendDate()
    }
  }

  sendAnnual = (value) => {
    const url = "http://ysung327.pythonanywhere.com/vacations/" + this.state.pk + '/'
    this.setState({
      annual: value
    })
    //console.log(this.state.annual)
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
  }

  renderEmptyList = () => {
    if( this.state.annual == 0 && this.state.detail == null) {
      return (
        <View>
          <Text>상세내용을 저장해보세요!</Text>
        </View>
      )
    }
    return null
  }
  
  getListFooter = () => {
    return (
      <View>
        <Button
          title='추가'
          onPress={this.showDetailAdd}/>
      </View>
    )
  }

  renderAnn = () => {
    if (this.state.annual != null) {
      return (
        <View style={{ flexDirection: 'row' }}>
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

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Header/>
        </View>
        <View style={{
          position: 'absolute',
          top: 70,
          left: 0,
          right: 0,
          height: 80,
          zIndex: 1000,
        }}>
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
              <View style={{
                flex: 1,
                alignItems: 'flex-start',
                paddingLeft: 20,
              }}>
                {<Text style={{ fontSize: 24, color: 'white' }}>{ this.state.title }</Text>}
                <Text style={{ fontSize: 12, color: 'white' }}>{this.state.start_date} - {this.state.end_date}</Text>
              </View>
              <View style={{
                flex: 1,
                alignItems: 'flex-end',
                paddingRight: 20,
              }}>
                { this.getdDay() }
                <Text style={{ fontSize: 12, color: 'white' }}>{this.state.hour}시간 {this.state.minute}분 {this.state.second}초 전</Text>
              </View>
            </LinearGradient>
          </View>
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.isDetailAddVisible}
          onRequestClose={() => this.hideDetailAdd()}
        >
          <View style={styles.modal}>
            <View style={[styles.modalInside, {height: this.state.screenHeight*0.9}]}>
              <Text style={{fontSize: 20, textAlign: 'center', marginVertical: 10,}}>추가할 휴가를 터치해보세요!</Text>
              <ScrollView>
                <View style={styles.day}>
                  <NumericInput 
                    value={this.state.annual}
                    initValue={this.state.annual}
                    onChange={value => this.sendAnnual(value)}
                    step={1}
                    minValue={0}
                    valueType='integer'
                    rounded
                    type='up-down'
                    textColor='#B0228C' 
                    iconStyle={{ color: 'white' }}
                    upDownButtonsBackgroundColor='#E56B70'/>
                </View>
                <View>
                  <Text style={styles.typeTitle}>위로</Text>
                  <FlatList
                  contentContainerStyle={styles.contentContainer}
                  data={this.state.conData}
                  renderItem={this._renderUnusedDetail}
                  keyExtractor={(item) => item.id}
                  showsVerticalScrollIndicator={false}
                />
                </View>
                <View>
                  <Text style={styles.typeTitle}>포상</Text>
                  <FlatList
                  contentContainerStyle={styles.contentContainer}
                  data={this.state.prData}
                  renderItem={this._renderUnusedDetail}
                  keyExtractor={(item) => item.id}
                  showsVerticalScrollIndicator={false}
                />
                </View>
                <View>
                  <Text style={styles.typeTitle}>보상</Text>
                  <FlatList
                  contentContainerStyle={styles.contentContainer}
                  data={this.state.reData}
                  renderItem={this._renderUnusedDetail}
                  keyExtractor={(item) => item.id}
                  showsVerticalScrollIndicator={false}
                />
                </View>
                <View>
                  <Text style={styles.typeTitle}>청원</Text>
                    <FlatList
                    contentContainerStyle={styles.contentContainer}
                    data={this.state.peData}
                    renderItem={this._renderUnusedDetail}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                  />
                </View>
              </ScrollView>
              <Button
                title={'완료'}
                onPress={() => this.sendDetail()}
              />
            </View>
          </View>
        </Modal>

        <View style={{ marginTop: 160, flexDirection: 'row', justifyContent: 'center' }}>
          <View>
            <Text style={{ fontSize: 32, textAlign: 'center' }}>{(this.state.data.day!=null) ? this.state.data.day + ' Days' : '휴가를 정해보세요!'}</Text>
          </View>

          <View style={{ position: 'absolute', right:30, top: 10 }}>
            <Icon name="md-trash" type='ionicon' size={30} color={Colors.primaryColor} onPress={this.deleteVacation}/>
          </View> 

        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10, marginBottom: 10 }}>
          <TouchableOpacity onPress={()=>this.showDatePicker()}>
            <View style={{ flexDirection: 'column', alignItems: 'center'}}>
              <Icon name="ios-calendar" type="ionicon" size={20} color={Colors.primaryColor}/>
              <Card containerStyle={[{ borderRadius: 10, height: 40, justifyContent: 'center', marginHorizontal: 5, paddingHorizontal: 20, marginTop: 5 }, styles.elevation ]}>
                  <Text style={{ fontSize: 18 }}>{(this.state.start_date!=null) ? this.state.start_date : '휴가출발일'}</Text>
              </Card>
            </View>
          </TouchableOpacity>
          <View style={{ flexDirection: 'column', justifyContent: 'center', paddingTop: 13 }}><Text>_______</Text></View>
          <TouchableOpacity onPress={()=>this.showDatePicker()}>
            <View style={{ flexDirection: 'column', alignItems: 'center'}}>
              <Icon name="ios-calendar" type="ionicon" size={20} color={Colors.primaryColor}/>
              <Card containerStyle={[{ borderRadius: 10, height: 40, justifyContent: 'center', marginHorizontal: 5, paddingHorizontal: 20, marginTop: 5 }, styles.elevation ]}>
                  <Text style={{ fontSize: 18 }}>{(this.state.end_date!=null) ? this.state.end_date : '휴가복귀일'}</Text>
              </Card>
            </View>
          </TouchableOpacity>
        </View>
        { this.showCalendar() }
        { this.state.isDatePickerVisible == false &&
          <Card containerStyle={[{ height: 400, borderRadius: 10 }, styles.elevation ]}>
            { this.renderAnn() }
            <FlatList
              data={this.state.detail}
              renderItem={this._renderDetail}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
            />
            { this.renderEmptyList() }
          </Card>
        }
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
    backgroundColor: Colors.backgroundColor,
  },

  contentContainer: {
    borderWidth: 1,
    borderColor: 'green',
  },
  
  innerContainer: {
    margin: 0,
  },

  modal: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor : 'rgba(0,0,0,0.2)',
  },

  modalInside: {
    borderRadius: 10,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderWidth: 0.3,
    borderColor: 'gray',
    width: '90%',
    backgroundColor: 'white',
  },

  detailCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },

  day:{
    alignItems: 'center',
    paddingBottom: 10,
  },

  typeTitle: {
    fontSize: 15, 
    fontWeight: 'bold',
    textAlign: 'center'
  },

  gradient: {
    flex: 1,
    paddingTop: 10,
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
  }
})
