import React, { Component } from 'react';
import { StyleSheet, View, Text} from 'react-native';
import { Card, Button } from 'react-native-elements'
import Colors from '../constants/Colors'

class VacationInfo extends Component {
  constructor(props) {
      super(props);
      this.state  = {
        loading: false,
        data: [],
      }
    }

  componentDidMount() {
    this.getVacationInfo();
  }

  getVacationInfo = ()  => {
    const url = "http://ysung327.pythonanywhere.com/vacations/info/";

    this.setState({ loading: true });

    fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + this.props.token,
      },
      body: JSON.stringify({
        user: this.props.user,
      })
    })
    .then(res => res.json())
    .then(res => {
          this.setState({
            data: res,
          })
          //console.log(this.state.data)
    })
    .catch((error) => {
          console.log(error);
    })
  }
  
  render() {
    return (
      <View style={{ flex:1 }}>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 20, }}>나의 휴가</Text>
        </View>
        <View style={styles.container}>
          <View style={styles.column1}>
            <Card containerStyle={styles.card1} wrapperStyle={{ flex:1, justifyContent: 'center', }}>
              <Text style={{ top: 0, position: 'absolute', fontSize: 12, color: Colors.accentColor2, }}>총 휴가</Text>
              <View style={{ alignItems: 'center', }}>
                <Text style={{ fontSize: 32, }}>{this.state.data.total}</Text>
              </View>          
            </Card>
          </View>
          <View style={styles.column2}>
            <Card containerStyle={styles.card2}>
              <View>
                <Text style={{ position: 'absolute', fontSize: 12, color: Colors.accentColor2, }}>나간 휴가</Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 20, }}>{this.state.data.gone}</Text>
              </View>
            </Card>
            <Card containerStyle={styles.card2}>
              <View>
                <Text style={{ position: 'absolute', fontSize: 12, color: Colors.accentColor2, }}>남은 휴가</Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 20, }}>{this.state.data.left}</Text>
              </View>
            </Card>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  card1: {
    borderWidth: 1,
    flex: 1,
    borderRadius: 10,
    paddingVertical: 3,
    elevation: 8,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
  },
  card2: {
    flex: 1,
    marginLeft: 0,
    paddingVertical: 3,
    borderRadius: 10,
    elevation: 8,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
  },
  column1: {
    flex: 1,
    flexDirection: 'column',
    paddingTop: 0,
  },
  column2: {
    flex: 2,
    flexDirection: 'column',
  },

})


export default VacationInfo
