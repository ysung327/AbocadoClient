import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Modal, Dimensions, ScrollView} from 'react-native';
import { Card, Button, Icon } from 'react-native-elements'
import CalendarPicker from 'react-native-calendar-picker'
import NumericInput from 'react-native-numeric-input'
import moment from 'moment'

const { height } = Dimensions.get('window')

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
        dday.push(<Text style={styles.content}>휴가까지 {dDay}일 남았습니다.</Text>)
      }
      else dday.push(<Text style={styles.content}>휴가가 {this.state.data.dDay}일 지났습니다.</Text>)
    }
    else dday.push(<Text style={styles.content}>휴가날짜를 정해주세요!</Text>)
    return dday
  }

  _renderDetail = ({item}) => {
    return (
      <Card wrapperStyle={styles.detailCard}>
          <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 20 }}>{item.day}</Text>
          </View>
          <View style={{ flex: 3 }}>
              <Text style={{ fontSize: 17 }}>{item.title}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Icon
              name='delete'
              onPress={() => this.deleteDetail(item.id)}
            />
          </View>
      </Card>
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
    if(typeof this.state.start_date != 'string' && this.state.start_date != null) {
      var obj1 = this.state.start_date.toObject()
      var obj2 = this.state.end_date.toObject()
      var start_date = null
      var end_date = null
      //console.log(obj1, obj2)

      start_date = obj1.years + '-' + (obj1.months+1) + '-' + obj1.date
      end_date = obj2.years + '-' + (obj2.months+1) + '-' + obj2.date
      //console.log(start_date, end_date)

      const url = "http://ysung327.pythonanywhere.com/vacations/" + this.state.pk + '/'
      fetch(url, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + this.state.token,
        },
        body: JSON.stringify({
            start_date : start_date,
            end_date: end_date,
            user: this.state.user,
        })
      })
    }
    this.hideDatePicker()
    setTimeout(() => {
      this.fetchDataFromApi(this.state.pk)
    }, 300)
  }

  onDateChange = (date, type) => {
    if (type === 'END_DATE') {
      this.setState({
        end_date: date,
      })
    } else {
      this.setState({
        start_date: date,
        end_date: null
      })
    }
    //console.log(this.state.start_date, this.state.end_date)
  }

  sendDay = (value) => {
    const url = "http://ysung327.pythonanywhere.com/vacations/" + this.state.pk + '/'
    this.setState({
      day: value
    })
    console.log(this.state.day)
    fetch(url, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + this.state.token,
      },
      body: JSON.stringify({
        day : this.state.day,
        user : this.state.user,
      })
    })
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

  getEmptyList = () => {
    return (
      <View>
        <Text>상세내용을 저장해보세요!</Text>
      </View>
    )
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

  getListHeader = () => {
    if (this.state.annual != null) {
      return (
        <Card wrapperStyle={styles.detailCard}>
          <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 20 }}>연가</Text>
          </View>
          <View style={{ flex: 3 }}>
              <Text style={{ fontSize: 17 }}>{this.state.annual}</Text>
          </View>
        </Card>
      )
    }
    return null
  }

  render() {
    return (
      <View style={styles.container}>
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


        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.isDatePickerVisible}
          onRequestClose={() => this.hideDatePicker()}
        >              
          <View style={styles.modal}>
            <View style={[styles.modalInside, {height: this.state.screenHeight*0.7}]}>
              <CalendarPicker
                allowRangeSelection={true}
                startFromMonday={true}
                selectedStartDate={this.state.start_date}
                selectedEndDate={this.state.end_date}
                initialDate={(this.state.start_date!=null) ? this.state.start_date : moment().format()}
                selectedRangeStyle={styles.selectedRangeStyle}
                onDateChange={this.onDateChange}
              />
              <Button 
                title={'완료'}
                onPress={() => this.sendDate()}
              />
            </View>
          </View>
        </Modal>

        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.isDayPickerVisible}
          onRequestClose={() => this.hideDayPicker()}
        >              
          <View style={styles.dayPicker}>
            <View style={[styles.dayPickerInside, {height: this.state.screenHeight*0.7}]}>
              <Text style={styles.text}>
                이번휴가는 얼마나 나가는지 정해보세요!
              </Text>
              <View style={{ alignContent: 'center' }}>
                <NumericInput 
                  value={this.state.day}
                  initValue={this.state.day}
                  onChange={value => this.sendDay(value)}
                  step={1}
                  minValue={0}
                  valueType='integer'
                  rounded
                  type='up-down'
                  textColor='#B0228C' 
                  iconStyle={{ color: 'white' }}
                  upDownButtonsBackgroundColor='#E56B70'/>
              </View>
              <Button 
                title={'완료'}
                onPress={() => {
                  this.hideDayPicker()
                  this.fetchDataFromApi(this.state.pk)
                }}
              />
            </View>
          </View>
        </Modal>


        <Card containerStyle={styles.card}>
          <View style={styles.deleteIcon}>
            <Icon
              name='delete'
              onPress={this.deleteVacation}
            />
          </View>
          <TouchableOpacity style={styles.day} onPress={this.showDayPicker}>
            <Text style={styles.text}>{(this.state.data.day!=null) ? this.state.data.day + '일' : '이번엔 몇 나갈까?'}</Text>
          </TouchableOpacity>
          <View style={styles.dday}>
            { this.getdDay() }
          </View>
          <TouchableOpacity style={styles.info} onPress={()=>this.showDatePicker()}>
            <View style={styles.date}>
              <Text style={styles.text}>출발</Text>
              <Text style={styles.text}>{(this.state.data.start_date!=null) ? this.state.data.start_date : '-'}</Text>
            </View>
            <View style={styles.date}>
              <Text style={styles.text}>복귀</Text>
              <Text style={styles.text}>{(this.state.data.end_date!=null) ? this.state.data.end_date : '-'}</Text>
            </View>
          </TouchableOpacity>
        </Card>
        <FlatList
          data={this.state.detail}
          renderItem={this._renderDetail}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={this.getListHeader}
          ListEmptyComponent={this.getEmptyList}
          ListFooterComponent={this.getListFooter}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    justifyContent: 'center',
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

  dayPicker: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor : 'rgba(0,0,0,0.2)',
  },

  dayPickerInside: {
    borderRadius: 10,
    borderWidth: 0.3,
    width: '80%',
    backgroundColor: 'white',
  },

  card: {
    justifyContent: 'space-around',
    backgroundColor: 'white',
    borderWidth: 0.3,
    borderColor: 'gray',
  },

  deleteIcon: {
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

  typeTitle: {
    fontSize: 15, 
    fontWeight: 'bold',
    textAlign: 'center'
  },

  selectedRangeStyle: {
    backgroundColor: 'gray'
  }
})
