import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Modal, Dimensions } from 'react-native';
import { Card, Button, Icon } from 'react-native-elements'

const { height } = Dimensions.get('window')

export default class VacationDetailView extends Component {
  constructor(props) {
      super(props);
      this.state  = {
        loading: false,
        data: [],
        modalData: [],
        conData: [],
        prData: [],
        peData: [],
        reData: [],
        modalVisible: false,
        pk : this.props.navigation.getParam('id', 'default'),
        screenHeight: height,
        itemChecked: []
      }
  }

  onContentSizeChange = (contentWidth, contentHeight) => {
    this.setState({ screenHeight: contentHeight });
  }

  componentDidMount() {
      this.fetchDataFromApi(this.state.pk)
      this.fetchModalFromApi()
  }
  
  async fetchDataFromApi(pk) {
    let url = "http://ysung327.pythonanywhere.com/vacations/" + pk + "/";

    this.setState({ loading: true });

    const response = await fetch(url);
    const responseJson = await response.json();
    this.setState({
      data: responseJson,
      loading : false
    });
  }

  fetchModalFromApi = ()  => {
    const url = "http://ysung327.pythonanywhere.com/vacations/detail/";
    let modalData = []
    let _conData =[]
    let _prData = []
    let _reData = []
    let _peData = []
    fetch(url)
    .then(res => res.json())
    .then(res => {
      modalData = res
      for(let i in modalData) {
        if(modalData[i].type_of_detail === "CON") {
          _conData.push(modalData[i])
        } else if(modalData[i].type_of_detail === "PR") {
          _prData.push(modalData[i])
        } else if(modalData[i].type_of_detail === "RE") {
          _reData.push(modalData[i])
        } else if(modalData[i].type_of_detail === "PE") {
          _peData.push(modalData[i])
        }
      }
      this.setState({
        conData: _conData,
        reData: _reData,
        prData: _prData,
        peData: _peData
      })
    })
    .catch((error) => {
      console.log(error);
    })
  }

  deleteVacation = ()  => {
    const url = "http://ysung327.pythonanywhere.com/vacations/" + this.state.pk + '/';
    fetch( url, { method: 'DELETE' })
    this.goBack()
  }

  deleteDetail = (id)  => {
    const url = "http://ysung327.pythonanywhere.com/vacations/detail/" + id + '/';
    fetch(url, {
      method: 'PUT',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          vacation: null,
          is_used: false,
      })
    })
    this.fetchDataFromApi(this.state.pk)
    this.fetchModalFromApi()
  }

  showAdd =() => {
    this.setModalVisible(true)
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  goBack = () => {
      this.props.navigation.goBack()
      this.props.navigation.state.params.onUpload()
  }

  sendDetail = () => {
    this.setModalVisible(false)
    const detail = this.state.itemChecked
    console.log(detail)
    for (let i of detail) {
      console.log(i)
      let url = "http://ysung327.pythonanywhere.com/vacations/detail/" + i + '/';
      fetch(url, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            vacation: this.state.pk,
            is_used: true,
        })
      })
    }
    this.setModalVisible(false)
    this.fetchDataFromApi(this.state.pk)
    this.fetchModalFromApi()
  }

  getdDay = () => {
      let dDay = []
      let dday = this.props.navigation.getParam('dday', 'default')
      if(dday < 0) {
        dday = dday * -1
        dDay.push(<Text style={styles.content}>D+{dday}</Text>)
      }
      else dDay.push(<Text style={styles.content}>D-{dday}</Text>)
      return dDay
  }

  selectItem = (index) => {
    const itemChecked = this.state.itemChecked;
    let i = itemChecked.indexOf(index)
    let temp = []
    console.log("id: " + index)
    console.log("i: " + i)
    if (i == -1) {
      temp = itemChecked.concat(index)
      this.setState({
        itemChecked: temp
      })
      console.log(this.state.itemChecked)
    }
    else {
      this.setState({
        itemChecked: [...itemChecked.slice(0,i), ...itemChecked.slice(i+1)]
      })
      console.log(this.state.itemChecked)
    }
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

  render() {
    return (
      <View style={styles.container}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setModalVisible(false)
          }
        }>
        <View style={styles.modal}>
          <View style={[styles.modalInside, {height: this.state.screenHeight*0.9}]}>
            <Text style={{fontSize: 20, textAlign: 'center', marginVertical: 10,}}>추가할 휴가를 터치해보세요!</Text>
            <View>
              <Text>위로</Text>
              <FlatList
              contentContainerStyle={styles.contentContainer}
              data={this.state.conData}
              renderItem={this._renderUnusedDetail}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
            />
            </View>
            <View>
              <Text>포상</Text>
              <FlatList
              contentContainerStyle={styles.contentContainer}
              data={this.state.prData}
              renderItem={this._renderUnusedDetail}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
            />
            </View>
            <View>
              <Text>보상</Text>
              <FlatList
              contentContainerStyle={styles.contentContainer}
              data={this.state.reData}
              renderItem={this._renderUnusedDetail}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
            />
            </View>
            <View>
              <Text>청원</Text>
              <FlatList
              contentContainerStyle={styles.contentContainer}
              data={this.state.peData}
              renderItem={this._renderUnusedDetail}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
            />
            </View>
            <Button
              title={'완료'}
              onPress={() => this.sendDetail()}
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
          <View style={styles.day}>
            <Text style={styles.content}>{this.state.data.day} 일</Text>
          </View>
          <View style={styles.dday}>
            { this.getdDay() }
          </View>
          <View style={styles.info}>
            <View style={styles.date}>
              <Text style={styles.text}>출발</Text>
              <Text style={styles.text}>{this.state.data.start_date}</Text>
            </View>
            <View style={styles.date}>
              <Text style={styles.text}>복귀</Text>
              <Text style={styles.text}>{this.state.data.end_date}</Text>
            </View>
          </View>
        </Card>
        <View style={styles.addIcon}>
          <Icon
            name='add'
            onPress={this.showAdd}
          />
        </View>
        <FlatList
          data={this.state.data.detail}
          renderItem={this._renderDetail}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
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

  card: {
    justifyContent: 'space-around',
    backgroundColor: 'white',
    borderWidth: 0.3,
    borderColor: 'gray',
  },

  deleteIcon: {
    alignItems: 'flex-end'
  },

  addIcon: {
    alignItems: 'flex-end',
    marginRight: 20,
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
})

