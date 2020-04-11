import React, { Component } from 'react';
import { StyleSheet, FlatList, View, Button } from 'react-native';
import VacationItem from './VacationItem'
import { Icon } from 'react-native-elements'
import { Actions } from 'react-native-router-flux';
import store from "../app/store";

class VacationList extends Component {
  constructor(props) {
      super(props);
      this.state  = {
        loading: false,
        data: [],
        newVacationId: null,
        uploaded: false,
      }
    }

  update = () => {
    console.log('vacationList!')
    this.getVacationList()
  }

  componentDidMount() {
    store.subscribe(this.update)
    this.getVacationList();
  }

  getVacationList = ()  => {
    const url = "http://ysung327.pythonanywhere.com/vacations/";

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

  _renderItem = ({item}) => {
    return (
    <VacationItem
      item={item}
      token={this.props.token}
      user={this.props.user}
    />)
  }

  render() {
    return (
        <FlatList
          data={this.state.data}
          renderItem={this._renderItem}
          keyExtractor={(item, index) => item.id}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: 0, paddingRight: 10 }}
        />
    );
  }
}

export default VacationList
