import React, { Component } from 'react';
import { StyleSheet, FlatList, View, Button } from 'react-native';
import VacationItem from './VacationItem'
import { Icon } from 'react-native-elements'
import { Actions } from 'react-native-router-flux';

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

  componentDidMount() {
    this.getVacationList();
  }

  componentDidUpdate() {
    if (this.state.uploaded == true) {
      this.getVacationList()
      this.setState({uploaded: false})
    }
  }

  onUpload = () => {
    this.setState({ uploaded: true })
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
      onUpload={this.onUpload}
      token={this.props.token}
      user={this.props.user}
    />)
  }

  _onPress = () => {
    const url = "http://ysung327.pythonanywhere.com/vacations/create/"
    fetch(url, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + this.props.token,
      },        
      body: JSON.stringify({
        user: this.props.user
      })
    })
    .then(res => res.json())
    .then(res => {
      this.setState({
        newVacationId: res.id
      })
      console.log(res)
    })
    setTimeout(() => {
      Actions.detail({onUpload: this.props.onUpload, 
      id : this.state.newVacationId, token : this.props.token, user : this.props.user})
    }, 300)
  }

  getListFooter = () => {
    return(
      <Icon
        name='add'
        onPress={this._onPress}
      />
    )
  }

  render() {
    return (
        <FlatList
          data={this.state.data}
          renderItem={this._renderItem}
          keyExtractor={(item, index) => item.id}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: 0, paddingRight: 0 }}
          ListFooterComponent={this.getListFooter}
        />
    );
  }
}

export default VacationList
