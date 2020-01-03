import React, { Component } from 'react';
import { StyleSheet, View, Text} from 'react-native';
import { Card, Button } from 'react-native-elements'

export default class VacationInfo extends Component {
  constructor(props) {
      super(props);
      this.state  = {
        loading: false,
        data: [],
      }
    }

  componentDidMount() {
    this.fetchDataFromApi();
  }

  fetchDataFromApi = ()  => {
    const url = "http://testabocado.ml:8000/vacations/info";

    this.setState({ loading: true });

    fetch(url)
    .then(res => res.json())
    .then(res => {
          this.setState({
            data: res,
          });
          console.log(this.state.data)
    })
    .catch((error) => {
          console.log(error);
    });
  };
  
  render() {
    return (
      <View style={styles.container}>
        <Card containerStyle={styles.column1}>
            <Text style={[styles.title, styles.text]}>총 휴가</Text>
            <Text style={[styles.content, styles.text]}>{this.state.data.total} 일</Text>
        </Card>
        <View style={styles.column2}>
          <View style={styles.row1}>
            <Card containerStyle={styles.card1}>
              <View>
                <Text style={[styles.title, styles.text]}>나간 휴가</Text>
                <Text style={[styles.detail, styles.text]}>{this.state.data.gone} 일</Text>
              </View>
            </Card>
            <Card containerStyle={styles.card1}>
              <View>
                <Text style={[styles.title, styles.text]}>남은 휴가</Text>
                <Text style={[styles.detail, styles.text]}>{this.state.data.left} 일</Text>
              </View>
            </Card>
          </View>
          <Card containerStyle={[styles.card2, styles.row2]}>
              <View>
                <Text style={[styles.title, styles.text]}>나간 휴가</Text>
                <Text style={[styles.detail, styles.text]}>{this.state.data.gone} 일</Text>
              </View>
          </Card>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    marginHorizontal: 10,
  },
  card1: {
    marginHorizontal: 0,
  },
  card2: {
    marginHorizontal: 0,
    marginVertical: 7,
  },
  column1: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: 0,
  },
  column2: {
    flex: 3,
    flexDirection: 'column',
  },
  row1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  row2: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
  },
  title: {
    fontSize: 15,
  },
  content: {
    fontSize: 27,
  },
  detail: {
    fontSize: 20,
  },

})



