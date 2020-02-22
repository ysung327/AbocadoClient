import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Modal, Dimensions } from 'react-native';
import { Card, Button, Icon, Input } from 'react-native-elements'

const { height } = Dimensions.get('window')

export default class VacationTypeDetail extends Component {
    constructor(props) {
        super(props);
        this.state  = {
            data: [],
            type_of_detail: this.props.navigation.getParam('type_of_detail', 'default'),
            token: this.props.navigation.getParam('token', 'default'),
            user: this.props.navigation.getParam('user', 'default'),
            id: null,
            day: null,
            title: null,
            dayTemp: null,
            titleTemp: null,
            uploaded: false,
            isAddVisible: false,
            isDetailVisible: false,
        }
    }

    componentDidMount() {
        this.fetchDataFromApi(this.state.type_of_detail)
    }

    fetchDataFromApi = (type_of_detail)  => {
        const url = "http://ysung327.pythonanywhere.com/vacations/type/";

        fetch(url, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + this.state.token,
            },
            body: JSON.stringify({
                type_of_detail: type_of_detail,
                user: this.props.user
            })
        })
        .then(res => res.json())
        .then(res => {
            this.setState({
                data: res,
            })
        })
        .catch((error) => {
        console.log(error)
        })
    }

    setAddVisible = (visible) => {
        this.setState({
            isAddVisible: visible
        })
    }

    showAdd = () => {
        this.setAddVisible(true)
    }
    
    hideAdd = () => {
        this.setAddVisible(false)
    }

    setDetailVisible = (visible) => {
        this.setState({
            isDetailVisible: visible
        })
    }

    showDetail = (id) => {
        var item = null
        for(let data of this.state.data) {
            //console.log('data: ' + data)
            if(data.id == id) item = data
        }
        console.log(item)
        this.setState({
            id: item.id,
            dayTemp: item.day,
            titleTemp: item.title,
        })
        setTimeout(() => {
            console.log(this.state.id, this.state.dayTemp, this.state.titleTemp)
            this.setDetailVisible(true)
        }, 300)
    }
    
    hideDetail = () => {
        this.setDetailVisible(false)
    }

    editDetail = (id) => {
        const url = "http://ysung327.pythonanywhere.com/vacations/detail/edit/";

        fetch(url, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + this.state.token,
            },
            body: JSON.stringify({
                day: this.state.dayTemp,
                title: this.state.titleTemp,
                user: this.props.user
            })
        })
    }

    goBackfromDetail = (id) => {
        this.editDetail(id)
        this.setState({
            dayTemp: null,
            titleTemp: null,
            id: null,
        })
        this.hideDetail()
        setTimeout(() => {
            this.fetchDataFromApi(this.state.type_of_detail)
        }, 300)
    }

    goBackfromAdd= (id) => {
        this.editDetail(id)
        this.setState({
            dayTemp: null,
            titleTemp: null,
            id: null,
        })
        this.hideAdd()
        setTimeout(() => {
            this.fetchDataFromApi(this.state.type_of_detail)
        }, 300)
    }

    btnPressed = () => {
        this.addDetail()
        this.showAdd()
    }

    addDetail = ()  => {
        const url = "http://ysung327.pythonanywhere.com/vacations/detail/add/";

        fetch(url, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + this.state.token,
            },
            body: JSON.stringify({
                type_of_detail: this.state.type_of_detail,
                user: this.props.user
            })
        })
        .then(res => res.json())
        .then(res => {
            console.log(res)
            this.setState({
                id: res.id,
            })
        })
    }

    deleteDetail = (id)  => {
        const url = "http://ysung327.pythonanywhere.com/vacations/detail/delete/";
        fetch( url, { 
            method: 'DELETE',
            headers: {
                'Authorization': 'Token ' + this.state.token,
            },
            body: JSON.stringify({
                user: this.props.user
            })
        })
        setTimeout(() => {
            this.fetchDataFromApi(this.state.type_of_detail)
        }, 300)
    }

    _renderItem = ({item}) => {
        return (
            <TouchableOpacity onPress={() => this.showDetail(item.id)}>
                <Card wrapperStyle={styles.itemContainer}>         
                    <View style={styles.itemDay}>
                        <Text style={styles.itemContent}>{item.day}</Text>
                    </View>
                    <View style={styles.itemTitle}>
                        <Text style={styles.itemText}>{item.title}</Text>
                    </View>
                    <View style={styles.deleteIcon}>
                        <Icon
                        name='delete'
                        onPress={() => this.deleteDetail(item.id)}
                        />
                    </View>
                </Card>
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.isDetailVisible}
                    onRequestClose={() => this.hideDetail()}
                >
                    <View style={styles.modal}>
                        <View style={[styles.modalInside, {height: this.state.screenHeight*0.9}]}>
                            <Input
                            keyboardType='number-pad'
                            onChangeText={(text) => {
                                this.setState({dayTemp: text})
                            }}
                            value={this.state.dayTemp}
                            leftIcon={
                                <Icon
                                type='material-community'
                                name='calendar-today'
                                size={24} 
                                color='black'
                                />
                            }
                            />
                            <Input
                            onChangeText={(text) => {
                                this.setState({titleTemp: text})
                            }}
                            value={this.state.titleTemp}
                            leftIcon={
                                <Icon
                                type='material-community'
                                name='details'
                                size={24}
                                color='black'
                                />
                            }
                            />
                            <Button title='완료' onPress={() => this.goBackfromDetail(this.state.id)}/>
                        </View>
                    </View>
                </Modal>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.isAddVisible}
                    onRequestClose={() => this.hideAdd()}>
                    <View style={styles.modal}>
                        <View style={[styles.modalInside, {height: this.state.screenHeight*0.9}]}>
                            <Input
                            keyboardType='number-pad'
                            placeholder='상세내용을 입력하세요'
                            onChangeText={(text) => this.setState({dayTemp: text})}
                            value={this.state.dayTemp}
                            leftIcon={
                                <Icon
                                type='material-community'
                                name='calendar-today'
                                size={24} 
                                color='black'
                                />
                            }
                            />
                            <Input
                            placeholder='상세내용을 입력하세요'
                            onChangeText={(text) => {this.setState({titleTemp: text})}}
                            value={this.state.titleTemp}
                            leftIcon={
                                <Icon
                                type='material-community'
                                name='details'
                                size={24}
                                color='black'
                                />
                            }
                            />
                            <Button title='완료' onPress={() => this.goBackfromAdd(this.state.id)}/>
                        </View>
                    </View>
                </Modal>
                <FlatList
                    data={this.state.data}
                    renderItem={this._renderItem}
                    keyExtractor={(item, index) => item.id}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingLeft: 0, paddingRight: 0 }}
                />
                <Button title="+" onPress={this.btnPressed}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },

    itemDay:{
        flex: 1,
        alignItems: 'center',
    },

    itemContent: {
        fontSize: 25,
    },

    itemTitle: {
        flex: 3,
        alignItems: 'center',
    },

    itemText: {
        fontSize: 17,
    },

    deleteIcon: {
        alignItems: 'flex-end'
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
})
