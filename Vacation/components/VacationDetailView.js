import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Modal, Dimensions } from 'react-native';
import { Card, Button, Icon } from 'react-native-elements'

const { height } = Dimensions.get('window')
var selected = []

export default class VacationDetailView extends Component {
  constructor(props) {
      super(props);
      this.state  = {
        loading: false,
        data: [],
        modalData: [],
        modalVisible: false,
        pk : this.props.navigation.getParam('id', 'default'),
        screenHeight: height,
        itemChecked: []
      }
  }

  onContentSizeChange = (contentWidth, contentHeight) => {
    this.setState({ screenHeight: contentHeight });
  }

  componentWillMount() {
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

    fetch(url)
    .then(res => res.json())
    .then(res => {
          this.setState({
            modalData: res,
          });
    })
    .catch((error) => {
          console.log(error);
    });
  }

  deleteData = ()  => {
    const url = "http://ysung327.pythonanywhere.com/vacations/" + this.state.pk + '/';
    fetch( url, { method: 'DELETE' })
    this.goBack()
  }

  addDetail =() => {
    this.setModalVisible(true)
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  goBack = () => {
      this.props.navigation.goBack()
      this.props.navigation.state.params.onUpload()
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

  selectItem = (item) => {
      item.is_used = !item.is_used
      if(item.is_used){
          selected.push(item.id)
      } 
      //this.setState({itemChecked: selected});
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
      </Card>
    )
  }

  _renderUnusedDetail = ({item}) => {
    const isSelected = item.is_used;
    const viewStyle = isSelected ? styles.selected : null
    return (
      <TouchableOpacity onPress={this.selectItem({item})}>
          <Card containerStyle={[styles.innerContainer, {viewStyle}]} wrapperStyle={styles.detailCard}>
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
                <FlatList
                    contentContainerStyle={styles.contentContainer}
                    data={this.state.modalData}
                    renderItem={this._renderUnusedDetail}
                    keyExtractor={(item, index) => item.id}
                    showsVerticalScrollIndicator={false}
                />
                <Button
                  title={'완료'}
                  onPress={()=>this.setModalVisible(false)}
                />
              </View>
            </View>

          </Modal>
          <Card containerStyle={styles.card}>
            <View style={styles.deleteIcon}>
              <Icon
                name='delete'
                onPress={this.deleteData}
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
              onPress={this.addDetail}
            />
          </View>
          <FlatList
            data={this.state.data.detail}
            renderItem={this._renderDetail}
            keyExtractor={(item, index) => item.id}
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

  selected: {
    backgroundColor: 'gray',
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

