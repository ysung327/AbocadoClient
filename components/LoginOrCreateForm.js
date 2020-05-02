import React, { Component } from 'react';
import { Button, View, Text, TextInput, StyleSheet } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Colors from '../constants/Colors'
import { AsyncStorage } from 'react-native';
import { connect } from "react-redux";
import { login } from '../app/reducer'
import store from "../app/store";
import CalendarPicker from 'react-native-calendar-picker'

const CALENDAR_WEEK_DAYS = [ '일', '월', '화', '수', '목', '금', '토' ]
const CALENDAR_MONTHS = [ '1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월' ]

function mapDispatchToProps(dispatch) {
  return {
    login: userInfo => dispatch(login(userInfo))
  };
}

class ConnectedLoginOrCreateForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
        username: '',
        password: '',
        start_date: null,
        end_date: null,
        today: new Date(),
        isStartVisible: false,
        isEndVisible: false
    }
  }

  onUsernameChange(text) {
    this.setState({ username: text });
  }

  onPasswordChange(text) {
    this.setState({ password: text });
  }

  onStartDateChange = (selectedDate) => {
    var temp = selectedDate.toObject()
    var start_date = temp.years + '-' + (temp.months+1) + '-' + temp.date
    this.setState({
      start_date: start_date,
    })
    setTimeout(()=>{
      console.log(this.state.start_date)
      this.hideStartPicker()
    }, 500)
    
  }

  onEndDateChange = (selectedDate) => {
    var temp = selectedDate.toObject()
    var end_date = temp.years + '-' + (temp.months+1) + '-' + temp.date
    this.setState({
      end_date: end_date,
    })
    setTimeout(()=>{
      console.log(this.state.end_date)
      this.hideEndPicker()
    }, 500)
  }

  onPress1 = () => {
    if(!this.state.isEndVisible) {
      if(!this.state.isStartVisible) {
        this.showStartPicker()
      } else {
        this.hideStartPicker()
      }
    }
  }

  onPress2 = () => {
    if(!this.state.isStartVisible) {
      if(!this.state.isEndVisible) {
        this.showEndPicker()
      } else {
        this.hideEndPicker()
      }
    }
  }

  showStartPicker = () => {
    this.setState({
      isStartVisible: true,
    })
  }

  hideStartPicker = () => {
    this.setState({
      isStartVisible: false,
    })
  }

  showEndPicker = () => {
    this.setState({
      isEndVisible: true,
    })
  }
  
  hideEndPicker = () => {
    this.setState({
      isEndVisible: false,
    })
  }

  showCalendar = () => {
    if(this.state.isStartVisible == true && this.state.isEndVisible == false) {
      return(
        <CalendarPicker
          scaleFactor={410}
          allowRangeSelection={false}
          initialDate={this.state.today}
          onDateChange={this.onStartDateChange}
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
      )
    }
    else if(this.state.isStartVisible == false && this.state.isEndVisible == true) {
      return(
        <CalendarPicker
          scaleFactor={410}
          allowRangeSelection={false}
          initialDate={this.state.today}
          onDateChange={this.onEndDateChange}
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
      )
    }
    return null
  }
  
  renderCreateForm() {
    if (this.props.create) {
      return (
        <View style={{ flexDirection: 'column' }}>
          <View style={styles.fieldStyle}>
            <Button onPress={this.onPress1} title="입대일" />
            <Button onPress={this.onPress2} title="전역일" />
          </View>
          <View>
            { this.showCalendar() }
          </View>
        </View>
      );
    }
  }

  renderButton() {
    const buttonText = this.props.create ? '계정생성' : '로그인';

    return (
      <Button color={Colors.primaryColor} title={buttonText} onPress={this.handleRequest.bind(this)}/>
    );
  }


  renderCreateLink() {
    if (!this.props.create) {
      return (
        <Text style={{ color: Colors.accentColor2 }} onPress={() => Actions.register()}>
          회원가입
        </Text>
      );
    }
  }

  _storeData = async (token, user) => {
    try {
      await AsyncStorage.setItem('user', user);
      await AsyncStorage.setItem('token', token);
      
      console.log('saved')
      Actions.vacation()
    } catch (error) {
      // Error saving data
    }
  };

  handleRequest() {
    const payload = { username: this.state.username, password: this.state.password } 
    
    if (this.props.create) {
      payload.start_date = this.state.start_date;
      payload.end_date = this.state.end_date;
      fetch('http://ysung327.pythonanywhere.com/user/auth/register/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payload
        })
      })
      .then(res => res.json())
      .then(res => {
          const token = res.token
          const user = res.user_name;
          this._storeData(token, user)
          const userInfo = {
            token: token, 
            user: user
          }
          this.props.login(userInfo)
      })
      .catch((error) => {
            console.log(error);
      })
    }
    else if(!this.props.create) {
      fetch('http://ysung327.pythonanywhere.com/user/auth/login/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: this.state.username,
          password: this.state.password
        })
      })
      .then(res => res.json())
      .then(res => {
        console.log(res)
        const token = res.token
        const user = res.user
        this._storeData(token, user)
        const userInfo = {
          token: token,
          user: user
        }
        this.props.login(userInfo)
      })
      .catch((error) => {
        console.log(error);
      })
    }
  }


  render() {
      return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
          <View style={styles.formContainerStyle}>
              <View style={styles.fieldStyle}>
                  <TextInput
                  placeholder="아이디를 입력해주세요"
                  autoCorrect={false}
                  autoCapitalize="none"
                  onChangeText={this.onUsernameChange.bind(this)}
                  style={styles.textInputStyle}
                  />
              </View>
              <View style={styles.fieldStyle}>
                  <TextInput
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholder="비밀번호를 입력해주세요"
                  onChangeText={this.onPasswordChange.bind(this)}
                  style={styles.textInputStyle}
                  />
              </View>
              {this.renderCreateForm()}
          </View>
          <View style={styles.buttonContainerStyle}>
              {this.renderButton()}
              <View style={styles.accountCreateContainerStyle}>
                  {this.renderCreateLink()}
              </View>
          </View>
      </View>
      );
    }
  }


  const styles = StyleSheet.create({
  formContainerStyle: {
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
  },
  textInputStyle: {
      flex: 1,
      padding: 15
  },
  fieldStyle: {
      flexDirection: 'row',
      justifyContent: 'center'
  },
  buttonContainerStyle: {
      height: 100,
      justifyContent: 'center',
      padding: 25,
      borderWidth: 1,
  },
  accountCreateContainerStyle: {
      padding: 25,
      alignItems: 'center'
  }
  });

const LoginOrCreateForm = connect(
  null,
  mapDispatchToProps
)(ConnectedLoginOrCreateForm);

export default LoginOrCreateForm